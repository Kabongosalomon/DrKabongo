'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useTranslations } from 'next-intl'
import ConfirmDialog from '@/components/ConfirmDialog'
import type { Comment, Page, Viewer } from '@/lib/comments'

type CommentsLib = typeof import('@/lib/comments')

/**
 * Builds without Firebase config (local dev, forks, preview deployments that
 * lack the env vars) simply have no comment section, rather than a broken one.
 */
const configured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
)

/**
 * Firebase Auth uid of the blog's author, whose comments get an "Author"
 * badge so readers can tell when the author has replied. Optional.
 */
const BLOG_AUTHOR_UID = process.env.NEXT_PUBLIC_BLOG_AUTHOR_UID || null

function errorCode(err: unknown): string {
  return typeof err === 'object' && err !== null && 'code' in err
    ? String((err as { code: unknown }).code)
    : ''
}

// When this browser last posted, kept across reloads so the cooldown message
// still shows after a refresh. Storage can be blocked, so it is only a hint.
const LAST_POST_KEY = 'blog-last-comment-at'

function readLastPostedAt(): number {
  try {
    return Number(localStorage.getItem(LAST_POST_KEY)) || 0
  } catch {
    return 0
  }
}

function rememberPostedAt(at: number) {
  try {
    localStorage.setItem(LAST_POST_KEY, String(at))
  } catch {}
}

function Avatar({ name, photo }: { name: string; photo: string }) {
  const [failed, setFailed] = useState(false)
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  if (!photo || failed) {
    return (
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft font-serif text-sm text-accent"
      >
        {initial}
      </span>
    )
  }
  return (
    // Plain <img>: Google profile photos are tiny, already sized, and served
    // from a CDN that rejects requests carrying a foreign Referer.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo}
      alt=""
      width={36}
      height={36}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-9 w-9 shrink-0 rounded-full border border-rule object-cover"
    />
  )
}

export default function BlogComments({ slug, locale }: { slug: string; locale: string }) {
  const t = useTranslations('comments')

  const [lib, setLib] = useState<CommentsLib | null>(null)
  const [near, setNear] = useState(false)
  // Pages on screen by number; `latest` is -1 while the post has no comments.
  const [pages, setPages] = useState<Record<number, Page>>({})
  const [latest, setLatest] = useState<number | null>(null)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [viewer, setViewer] = useState<Viewer | null>(null)
  const [admin, setAdmin] = useState(false)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Comment | null>(null)
  const [deleting, setDeleting] = useState(false)
  const lastPostedAt = useRef(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Nothing is fetched until the reader gets close to the comments: most
  // visits never scroll that far, and those cost no Firestore reads at all.
  useEffect(() => {
    const section = sectionRef.current
    if (!configured || !section) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: '800px 0px' },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!near) return
    let cancelled = false
    let unsubscribe = () => {}

    import('@/lib/comments')
      .then((mod) => {
        if (cancelled) return
        setLib(mod)
        unsubscribe = mod.onViewerChange((next) => {
          setViewer(next)
          setAdmin(false)
          if (next) mod.isAdmin(next.uid).then((yes) => !cancelled && setAdmin(yes))
        })
      })
      .catch(() => !cancelled && setError(t('error_load')))

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [near, t])

  // The newest page, live. When it fills up and a new page opens, the old one
  // simply stays on screen with its last contents.
  useEffect(() => {
    if (!lib) return
    return lib.subscribeToLatestPage(
      slug,
      (page) => {
        setLatest(page ? page.n : -1)
        if (page) setPages((current) => ({ ...current, [page.n]: page }))
      },
      () => setError(t('error_load')),
    )
  }, [lib, slug, t])

  const loaded = Object.keys(pages)
    .map(Number)
    .sort((a, b) => a - b)
  const oldest = loaded[0] ?? 0
  const comments = latest === null ? null : loaded.flatMap((n) => pages[n].comments)
  const hasOlder = oldest > 0

  async function showOlder() {
    if (!lib || loadingOlder || !hasOlder) return
    setLoadingOlder(true)
    try {
      const page = await lib.loadPage(slug, oldest - 1)
      setPages((current) => ({ ...current, [page.n]: page }))
    } catch {
      setError(t('error_load'))
    } finally {
      setLoadingOlder(false)
    }
  }

  // A freshly opened page holds only a handful of comments; pull in the one
  // before it too (a single extra read) so the thread never looks near-empty.
  const latestCount = latest !== null && latest > 0 ? (pages[latest]?.comments.length ?? 0) : null
  useEffect(() => {
    if (latestCount !== null && latestCount < 20 && loaded.length === 1) void showOlder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestCount])

  if (!configured) return null

  const maxLength = lib?.MAX_COMMENT_LENGTH ?? 2000
  const remaining = maxLength - draft.length
  const canPost = Boolean(lib && viewer && draft.trim() && remaining >= 0 && !busy)

  async function signIn() {
    if (!lib) return
    setError(null)
    try {
      await lib.signInWithGoogle()
      // Straight back to what they were writing; one click left to post.
      textareaRef.current?.focus()
    } catch (err) {
      const code = errorCode(err)
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return
      setError(t(code === 'auth/popup-blocked' ? 'popup_blocked' : 'error_sign_in'))
    }
  }

  async function submit(event?: FormEvent) {
    event?.preventDefault()
    if (!lib || !canPost) return
    setBusy(true)
    setError(null)
    try {
      await lib.postComment(slug, latest ?? 0, draft)
      lastPostedAt.current = Date.now()
      rememberPostedAt(lastPostedAt.current)
      setDraft('')
    } catch (err) {
      // The rules answer a too-soon second comment with a bare
      // permission-denied; inside the cooldown that is almost certainly why.
      const tooSoon =
        errorCode(err) === 'permission-denied' &&
        Date.now() - Math.max(lastPostedAt.current, readLastPostedAt()) <
          lib.COMMENT_COOLDOWN_SECONDS * 1000
      setError(t(tooSoon ? 'too_fast' : 'error_post'))
    } finally {
      setBusy(false)
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) void submit()
  }

  async function confirmRemove() {
    const comment = pendingDelete
    if (!lib || !comment) return
    setError(null)
    setDeleting(true)
    try {
      await lib.deleteComment(slug, comment)
      // Older pages aren't live; drop it from what's on screen directly.
      setPages((current) => {
        const page = current[comment.page]
        if (!page) return current
        const rest = page.comments.filter((c) => c.id !== comment.id)
        return { ...current, [comment.page]: { ...page, comments: rest } }
      })
    } catch {
      setError(t('error_delete'))
    } finally {
      setDeleting(false)
      setPendingDelete(null)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="comments"
      aria-labelledby="comments-heading"
      className="mt-20 scroll-mt-24 border-t border-rule pt-10"
    >
      <h2 id="comments-heading" className="font-serif text-2xl font-medium text-ink">
        {t('title')}
        {comments && comments.length > 0 && (
          <span className="ml-2 text-base font-normal text-ink-3">
            ({comments.length}
            {hasOlder ? '+' : ''})
          </span>
        )}
      </h2>

      {comments === null ? (
        <p className="mt-6 text-sm text-ink-3">{t('loading')}</p>
      ) : comments.length === 0 ? (
        <p className="mt-6 text-sm text-ink-2">{t('empty')}</p>
      ) : (
        <>
          {hasOlder && (
            <button
              type="button"
              onClick={showOlder}
              disabled={loadingOlder}
              className="mt-6 text-sm text-ink-2 underline-offset-4 hover:text-accent hover:underline"
            >
              {t('show_older')}
            </button>
          )}
          <ol className="mt-6 space-y-6">
            {comments.map((comment) => {
              const name = comment.authorName || t('anonymous')
              const mayDelete = viewer && (viewer.uid === comment.authorUid || admin)
              return (
                <li key={comment.id} className="flex gap-3">
                  <Avatar name={name} photo={comment.authorPhoto} />
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
                      <span className="font-medium text-ink">{name}</span>
                      {comment.authorUid === BLOG_AUTHOR_UID && (
                        <span className="rounded-sm bg-accent-soft px-1.5 py-px text-[0.6875rem] font-medium text-accent">
                          {t('author_badge')}
                        </span>
                      )}
                      {comment.createdAt && (
                        <time
                          dateTime={comment.createdAt.toISOString()}
                          className="text-xs text-ink-3"
                        >
                          {comment.createdAt.toLocaleString(locale, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </time>
                      )}
                      {mayDelete && (
                        <button
                          type="button"
                          onClick={() => setPendingDelete(comment)}
                          className="text-xs text-ink-3 underline-offset-4 hover:text-accent hover:underline"
                        >
                          {t('delete')}
                        </button>
                      )}
                    </p>
                    {/* Plain text only — never rendered as HTML or Markdown. */}
                    <p className="mt-1 text-[0.9375rem] leading-relaxed whitespace-pre-wrap wrap-break-word text-ink-2">
                      {comment.body}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </>
      )}

      {/* The box is open to everyone: readers can start writing before they
          sign in, and the draft survives the Google popup untouched. */}
      <form onSubmit={submit} className="mt-10 rounded-lg border border-rule bg-surface p-4 sm:p-5">
        {viewer && (
          <div className="mb-4 flex min-w-0 items-center gap-3">
            <Avatar name={viewer.name || t('anonymous')} photo={viewer.photo} />
            <p className="min-w-0 truncate text-sm text-ink-2">
              {t('signed_in_as', { name: viewer.name || t('anonymous') })}
            </p>
            <button
              type="button"
              onClick={() => lib?.signOutViewer()}
              className="ml-auto shrink-0 text-xs text-ink-3 underline-offset-4 hover:text-accent hover:underline"
            >
              {t('sign_out')}
            </button>
          </div>
        )}
        <label htmlFor="comment-body" className="sr-only">
          {t('placeholder')}
        </label>
        <textarea
          id="comment-body"
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t('placeholder')}
          rows={3}
          maxLength={maxLength}
          className="block w-full resize-y rounded-md border border-rule bg-paper px-3 py-2 text-base text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="min-w-0 flex-1 basis-48 text-xs text-ink-3" aria-live="polite">
            {remaining < 200
              ? t('characters_left', { count: remaining })
              : viewer
                ? t('public_note')
                : t('sign_in_prompt')}
          </p>
          {viewer ? (
            <button
              type="submit"
              disabled={!canPost}
              className="inline-flex min-w-0 items-center rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? t('posting') : t('post')}
            </button>
          ) : (
            <button
              type="button"
              onClick={signIn}
              disabled={!lib}
              className="inline-flex min-w-0 items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 3.71 14.54 2.8 12 2.8 6.92 2.8 2.8 6.92 2.8 12s4.12 9.2 9.2 9.2c5.31 0 8.83-3.73 8.83-8.99 0-.6-.07-1.06-.15-1.51Z"
                />
              </svg>
              {t('sign_in')}
            </button>
          )}
        </div>
      </form>

      {error && (
        <p role="alert" className="mt-3 text-sm text-accent">
          {error}
        </p>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={t('confirm_delete')}
        description={t('delete_body')}
        confirmLabel={deleting ? t('deleting') : t('delete')}
        cancelLabel={t('cancel')}
        busy={deleting}
        onConfirm={confirmRemove}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  )
}
