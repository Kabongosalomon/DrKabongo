'use client'

/**
 * Blog comments: Google sign-in through Firebase Auth, comments in Firestore.
 *
 * There is no server of ours in the loop — the browser talks to Firebase
 * directly and every rule that matters (who may post, as whom, how long, how
 * often, who may delete) is enforced by firestore.rules. The config below is
 * not secret: Firebase's web API key only identifies the project.
 *
 * Only ever loaded through a dynamic import from components/BlogComments.tsx,
 * so the Firebase SDK stays out of every page's initial bundle.
 *
 * Data model — comments are packed into *pages* so that showing a thread
 * costs one Firestore read however long it grows (the free plan allows
 * 50,000 reads a day; one document per comment would spend one per comment):
 *   posts/{slug}/pages/{n}  — { n, comments: { [id]: Comment fields } },
 *                             up to COMMENTS_PER_PAGE each; n = 0, 1, 2…
 *   commenters/{uid}        — { lastCommentAt }, the rate-limit marker
 *   admins/{uid}            — exists ⇒ may delete any comment
 */

import { getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth'
import {
  collection,
  connectFirestoreEmulator,
  deleteField,
  doc,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type Firestore,
  type SnapshotOptions,
} from 'firebase/firestore'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
}

/** Kept in sync with the size check in firestore.rules. */
export const MAX_COMMENT_LENGTH = 2000

/** Kept in sync with the cooldown in firestore.rules. */
export const COMMENT_COOLDOWN_SECONDS = 20

/**
 * Comments per page document. Kept in sync with firestore.rules. 100 worst-case
 * comments (2,000 multi-byte characters each) stay well under Firestore's
 * 1 MiB document limit.
 */
export const COMMENTS_PER_PAGE = 100

export interface Comment {
  id: string
  /** The page document holding it — needed to delete it. */
  page: number
  authorUid: string
  authorName: string
  authorPhoto: string
  body: string
  /** Null for a moment after posting, until the server timestamp lands. */
  createdAt: Date | null
}

export interface Viewer {
  uid: string
  name: string
  photo: string
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

function services(): { auth: Auth; db: Firestore } {
  if (!app) {
    app = getApps()[0] ?? initializeApp(config)
    auth = getAuth(app)
    db = getFirestore(app)
    // Local development against `firebase emulators:start` — see README.
    if (process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === '1') {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
      connectFirestoreEmulator(db, '127.0.0.1', 8080)
    }
  }
  return { auth: auth!, db: db! }
}

function toViewer(user: User): Viewer {
  // Exactly the `name` / `picture` ID-token claims the rules compare against,
  // with the same empty-string fallback.
  return { uid: user.uid, name: user.displayName ?? '', photo: user.photoURL ?? '' }
}

export function onViewerChange(callback: (viewer: Viewer | null) => void): () => void {
  return onAuthStateChanged(services().auth, (user) => callback(user ? toViewer(user) : null))
}

export async function signInWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider()
  // Always show Google's account chooser; otherwise Google silently reuses
  // whichever account last consented and a second account is unreachable.
  // `select_account`, not `consent`: the point is picking an account.
  provider.setCustomParameters({ prompt: 'select_account' })
  await signInWithPopup(services().auth, provider)
}

export async function signOutViewer(): Promise<void> {
  await signOut(services().auth)
}

const pagesOf = (slug: string) => collection(services().db, 'posts', slug, 'pages')
const pageRef = (slug: string, n: number) => doc(pagesOf(slug), String(n))

// `estimate` so a just-posted comment shows its local time instead of
// flickering with no date while the server timestamp is in flight.
const ESTIMATE: SnapshotOptions = { serverTimestamps: 'estimate' }

export interface Page {
  n: number
  /** Oldest first. */
  comments: Comment[]
}

function toPage(n: number, data: DocumentData | undefined): Page {
  const entries = Object.entries((data?.comments ?? {}) as Record<string, DocumentData>)
  return {
    n,
    comments: entries
      .map(([id, c]) => ({
        id,
        page: n,
        authorUid: c.authorUid,
        authorName: c.authorName,
        authorPhoto: c.authorPhoto,
        body: c.body,
        createdAt: c.createdAt?.toDate() ?? null,
      }))
      .sort((a, b) => (a.createdAt?.getTime() ?? Infinity) - (b.createdAt?.getTime() ?? Infinity)),
  }
}

/**
 * Live view of a post's newest page — one read on load, one per change.
 * Reports null while the post has no comments at all.
 */
export function subscribeToLatestPage(
  slug: string,
  onChange: (page: Page | null) => void,
  onError: (error: Error) => void,
): () => void {
  return onSnapshot(
    query(pagesOf(slug), orderBy('n', 'desc'), limit(1)),
    (snapshot) => {
      const latest = snapshot.docs[0]
      onChange(latest ? toPage(latest.data().n, latest.data(ESTIMATE)) : null)
    },
    onError,
  )
}

/** One older page, fetched once (older pages are full and rarely change). */
export async function loadPage(slug: string, n: number): Promise<Page> {
  return toPage(n, (await getDoc(pageRef(slug, n))).data())
}

/**
 * Appends to the newest page that has room, starting from `latest` (the page
 * on screen), or opens the next page when it is full. A transaction, so two
 * people posting at once both land; Firestore retries the loser.
 *
 * The commenter's rate-limit marker is written in the same transaction: the
 * rules only accept a comment whose transaction also moves `lastCommentAt` to
 * this exact request time, and only allow that once the cooldown has passed.
 */
export async function postComment(slug: string, latest: number, body: string): Promise<void> {
  const { auth, db } = services()
  const user = auth.currentUser
  if (!user) throw new Error('not-signed-in')
  const viewer = toViewer(user)
  const id = doc(pagesOf(slug)).id
  const comment = {
    authorUid: viewer.uid,
    authorName: viewer.name,
    authorPhoto: viewer.photo,
    body: body.trim(),
    createdAt: serverTimestamp(),
  }

  await runTransaction(db, async (tx) => {
    // All reads before any write: find the first page with room.
    let n = Math.max(latest, 0)
    let snap = await tx.get(pageRef(slug, n))
    while (snap.exists() && Object.keys(snap.data().comments ?? {}).length >= COMMENTS_PER_PAGE) {
      n += 1
      snap = await tx.get(pageRef(slug, n))
    }

    tx.set(doc(db, 'commenters', viewer.uid), { lastCommentAt: serverTimestamp() })
    if (snap.exists()) {
      tx.update(pageRef(slug, n), { [`comments.${id}`]: comment })
    } else {
      tx.set(pageRef(slug, n), { n, comments: { [id]: comment } })
    }
  })
}

export async function deleteComment(slug: string, comment: Comment): Promise<void> {
  await updateDoc(pageRef(slug, comment.page), { [`comments.${comment.id}`]: deleteField() })
}

/** Whether the signed-in viewer may moderate (an `admins/{uid}` doc exists). */
export async function isAdmin(uid: string): Promise<boolean> {
  try {
    return (await getDoc(doc(services().db, 'admins', uid))).exists()
  } catch {
    return false
  }
}
