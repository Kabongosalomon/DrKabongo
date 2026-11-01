// Security-rule tests for blog comments, run against the real Firestore
// emulator: `npm run test:rules`. Each case writes what lib/comments.ts writes
// (a page update or create plus the rate-limit marker, atomically), then
// varies one thing an attacker could change.

import { readFileSync } from 'node:fs'
import { after, before, beforeEach, describe, test } from 'node:test'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  deleteField,
  doc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'

const SLUG = 'hlf'
const PAGE_SIZE = 100

const google = (uid, name) => ({
  uid,
  token: {
    name,
    picture: `https://lh3.googleusercontent.com/a/${uid}`,
    firebase: { sign_in_provider: 'google.com' },
  },
})
const alice = google('alice', 'Alice Mbuyi')
const bob = google('bob', 'Bob Ilunga')
const admin = google('admin', 'Admin')

let env
let idCounter = 0
/** A fresh 20-character alphanumeric id, like Firestore's auto ids. */
const newId = () => `c${String(++idCounter).padStart(19, '0')}`

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-drkabongo',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  })
})

after(async () => {
  await env?.cleanup()
})

beforeEach(async () => {
  await env.clearFirestore()
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'admins', admin.uid), {})
  })
})

const dbFor = (user) => env.authenticatedContext(user.uid, user.token).firestore()
const pageRef = (db, n) => doc(db, 'posts', SLUG, 'pages', String(n))

function commentBy(user, overrides = {}) {
  return {
    authorUid: user.uid,
    authorName: user.token.name,
    authorPhoto: user.token.picture,
    body: 'Great post!',
    createdAt: serverTimestamp(),
    ...overrides,
  }
}

/** A stored comment (as it sits in the database after the fact). */
const storedBy = (user, body = 'seeded') => ({
  ...commentBy(user, { body }),
  createdAt: Timestamp.now(),
})

/** Seeds page `n` with `count` comments by `author` (plus any extras). */
async function seedPage(n, count, author = bob, extra = {}) {
  const comments = { ...extra }
  for (let i = 0; i < count; i++) comments[newId()] = storedBy(author)
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(pageRef(ctx.firestore(), n), { n, comments })
  })
  return comments
}

/** What postComment() sends when the page exists: marker + one added key. */
function append(user, n, { id = newId(), overrides = {}, marker = true, extra = {} } = {}) {
  const db = dbFor(user)
  const batch = writeBatch(db)
  if (marker) batch.set(doc(db, 'commenters', user.uid), { lastCommentAt: serverTimestamp() })
  batch.update(pageRef(db, n), { [`comments.${id}`]: commentBy(user, overrides), ...extra })
  return batch.commit()
}

/** What postComment() sends when opening a new page. */
function createPage(user, n, { id = newId(), overrides = {}, marker = true, data = {} } = {}) {
  const db = dbFor(user)
  const batch = writeBatch(db)
  if (marker) batch.set(doc(db, 'commenters', user.uid), { lastCommentAt: serverTimestamp() })
  batch.set(pageRef(db, n), { n, comments: { [id]: commentBy(user, overrides) }, ...data })
  return batch.commit()
}

async function backdateMarker(uid, secondsAgo) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'commenters', uid), {
      lastCommentAt: Timestamp.fromMillis(Date.now() - secondsAgo * 1000),
    })
  })
}

describe('reading', () => {
  test('anyone, signed out, can read comment pages', async () => {
    await seedPage(0, 3)
    const db = env.unauthenticatedContext().firestore()
    await assertSucceeds(getDocs(collection(db, 'posts', SLUG, 'pages')))
  })

  test('a user can read their own admin entry but not someone else’s', async () => {
    await assertSucceeds(getDoc(doc(dbFor(admin), 'admins', admin.uid)))
    await assertFails(getDoc(doc(dbFor(alice), 'admins', admin.uid)))
  })

  test('nobody can make themselves an admin', async () => {
    await assertFails(setDoc(doc(dbFor(alice), 'admins', alice.uid), {}))
  })
})

describe('posting', () => {
  test('the first comment on a post opens page 0', async () => {
    await assertSucceeds(createPage(alice, 0))
  })

  test('later comments append to the page', async () => {
    await seedPage(0, 5)
    await assertSucceeds(append(alice, 0))
  })

  test('signed-out visitors cannot post', async () => {
    const db = env.unauthenticatedContext().firestore()
    await assertFails(
      setDoc(pageRef(db, 0), { n: 0, comments: { [newId()]: commentBy(alice) } }),
    )
  })

  test('non-Google sign-ins (e.g. anonymous) cannot post', async () => {
    const anon = {
      uid: 'anon',
      token: { name: '', picture: '', firebase: { sign_in_provider: 'anonymous' } },
    }
    await assertFails(createPage(anon, 0))
  })

  test('cannot impersonate another user’s uid, name or photo', async () => {
    await seedPage(0, 1)
    await assertFails(append(alice, 0, { overrides: { authorUid: bob.uid } }))
    await assertFails(append(alice, 0, { overrides: { authorName: bob.token.name } }))
    await assertFails(append(alice, 0, { overrides: { authorPhoto: bob.token.picture } }))
  })

  test('cannot backdate a comment', async () => {
    await seedPage(0, 1)
    await assertFails(append(alice, 0, { overrides: { createdAt: Timestamp.fromMillis(0) } }))
  })

  test('rejects empty, whitespace-only and over-long bodies', async () => {
    await seedPage(0, 1)
    await assertFails(append(alice, 0, { overrides: { body: '' } }))
    await assertFails(append(alice, 0, { overrides: { body: '   \n ' } }))
    await assertFails(append(alice, 0, { overrides: { body: 'a'.repeat(2001) } }))
    await assertSucceeds(append(alice, 0, { overrides: { body: 'a'.repeat(2000) } }))
  })

  test('rejects extra fields on a comment or on the page', async () => {
    await seedPage(0, 1)
    await assertFails(append(alice, 0, { overrides: { pinned: true } }))
    await assertFails(append(alice, 0, { extra: { locked: true } }))
    await assertFails(createPage(alice, 0, { data: { locked: true } }))
  })

  test('rejects malformed comment ids', async () => {
    await seedPage(0, 1)
    await assertFails(append(alice, 0, { id: 'short' }))
  })

  test('a comment without the rate-limit marker is rejected', async () => {
    await seedPage(0, 1)
    await assertFails(append(alice, 0, { marker: false }))
    await env.clearFirestore()
    await assertFails(createPage(alice, 0, { marker: false }))
  })
})

describe('appending cannot touch other comments', () => {
  test('cannot edit someone else’s comment while appending', async () => {
    const seeded = await seedPage(0, 2)
    const [victim] = Object.keys(seeded)
    await assertFails(append(alice, 0, { extra: { [`comments.${victim}.body`]: 'hacked' } }))
  })

  test('cannot remove someone else’s comment while appending', async () => {
    const seeded = await seedPage(0, 2)
    const [victim] = Object.keys(seeded)
    await assertFails(append(alice, 0, { extra: { [`comments.${victim}`]: deleteField() } }))
  })

  test('cannot add two comments at once', async () => {
    await seedPage(0, 1)
    await assertFails(append(alice, 0, { extra: { [`comments.${newId()}`]: commentBy(alice) } }))
  })

  test('cannot overwrite a page wholesale', async () => {
    await seedPage(0, 3)
    await backdateMarker(alice.uid, 60)
    await assertFails(createPage(alice, 0))
  })
})

describe('pages', () => {
  test('a full page refuses more comments', async () => {
    await seedPage(0, PAGE_SIZE)
    await assertFails(append(alice, 0))
  })

  test('the next page opens once the previous one is full', async () => {
    await seedPage(0, PAGE_SIZE)
    await assertSucceeds(createPage(alice, 1))
  })

  test('cannot open the next page while the previous one has room', async () => {
    await seedPage(0, PAGE_SIZE - 1)
    await assertFails(createPage(alice, 1))
  })

  test('cannot jump ahead to hide a thread behind an empty page', async () => {
    await seedPage(0, PAGE_SIZE)
    await assertFails(createPage(alice, 5))
  })

  test('the page number must match the document id', async () => {
    const db = dbFor(alice)
    const batch = writeBatch(db)
    batch.set(doc(db, 'commenters', alice.uid), { lastCommentAt: serverTimestamp() })
    batch.set(pageRef(db, 0), { n: 3, comments: { [newId()]: commentBy(alice) } })
    await assertFails(batch.commit())
  })

  test('the page number cannot be changed', async () => {
    const seeded = await seedPage(0, 1, alice)
    const [own] = Object.keys(seeded)
    await assertFails(
      updateDoc(pageRef(dbFor(alice), 0), { n: 7, [`comments.${own}`]: deleteField() }),
    )
  })
})

describe('rate limit', () => {
  test('a second comment inside the cooldown is rejected', async () => {
    await seedPage(0, 1)
    await backdateMarker(alice.uid, 5)
    await assertFails(append(alice, 0))
  })

  test('a comment after the cooldown is accepted', async () => {
    await seedPage(0, 1)
    await backdateMarker(alice.uid, 21)
    await assertSucceeds(append(alice, 0))
  })

  test('the marker cannot be set to an arbitrary time', async () => {
    await assertFails(
      setDoc(doc(dbFor(alice), 'commenters', alice.uid), {
        lastCommentAt: Timestamp.fromMillis(0),
      }),
    )
  })

  test('cannot touch someone else’s marker', async () => {
    await assertFails(
      setDoc(doc(dbFor(alice), 'commenters', bob.uid), { lastCommentAt: serverTimestamp() }),
    )
  })
})

describe('deleting', () => {
  test('authors can delete their own comment', async () => {
    const seeded = await seedPage(0, 1, alice)
    const [own] = Object.keys(seeded)
    await assertSucceeds(
      updateDoc(pageRef(dbFor(alice), 0), { [`comments.${own}`]: deleteField() }),
    )
  })

  test('users cannot delete someone else’s comment', async () => {
    const seeded = await seedPage(0, 1, alice)
    const [theirs] = Object.keys(seeded)
    await assertFails(updateDoc(pageRef(dbFor(bob), 0), { [`comments.${theirs}`]: deleteField() }))
  })

  test('admins can delete any comment', async () => {
    const seeded = await seedPage(0, 1, alice)
    const [any] = Object.keys(seeded)
    await assertSucceeds(
      updateDoc(pageRef(dbFor(admin), 0), { [`comments.${any}`]: deleteField() }),
    )
  })

  test('cannot delete two comments at once, even one’s own', async () => {
    const seeded = await seedPage(0, 2, alice)
    const [a, b] = Object.keys(seeded)
    await assertFails(
      updateDoc(pageRef(dbFor(alice), 0), {
        [`comments.${a}`]: deleteField(),
        [`comments.${b}`]: deleteField(),
      }),
    )
  })

  test('nobody can delete a whole page', async () => {
    await seedPage(0, 1, alice)
    const { deleteDoc } = await import('firebase/firestore')
    await assertFails(deleteDoc(pageRef(dbFor(admin), 0)))
  })
})
