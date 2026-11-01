// Emails newsletter subscribers about new blog posts, through Kit's free API.
//
// Run by .github/workflows/notify-subscribers.yml with the .mdx files a push
// *added* (edits never re-send). For each post it:
//   1. skips it if the front matter says `notify: false`,
//   2. skips it if a broadcast for that slug already exists (safe to re-run),
//   3. waits until the post is live on the site, so the link never 404s,
//   4. schedules a Kit broadcast to all subscribers SEND_DELAY_MINUTES out —
//      a window to cancel it in Kit (Broadcasts → Scheduled) if needed.
//
// Usage: node scripts/notify-subscribers.mjs [--dry-run] content/blog/<slug>.mdx ...
// Env:   KIT_API_KEY (not needed for --dry-run)

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const SITE_URL = 'https://drkabongo.com'
// Sender. Must be a confirmed sending address in Kit (Settings → Email) or Kit
// rejects the broadcast. drkabongo.com has no mailbox: ImprovMX's free plan
// forwards mail for this address to the owner's inbox, so replies still arrive.
const SENDER_EMAIL = 'newsletter@drkabongo.com'
const KIT_API = 'https://api.kit.com/v4'
const SEND_DELAY_MINUTES = 15
const LIVE_TIMEOUT_MINUTES = 20

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const files = args.filter((a) => a !== '--dry-run')
const apiKey = process.env.KIT_API_KEY

if (!dryRun && !apiKey) {
  console.log('KIT_API_KEY is not set — newsletter not configured, nothing to send.')
  process.exit(0)
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

async function kit(method, pathname, body) {
  const res = await fetch(`${KIT_API}${pathname}`, {
    method,
    headers: { 'X-Kit-Api-Key': apiKey, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`Kit ${method} ${pathname} → ${res.status} ${await res.text()}`)
  return res.json()
}

/** The broadcast's internal description doubles as a per-post marker. */
const markerFor = (slug) => `blog:${slug}`

async function alreadySent(slug) {
  let after = null
  do {
    const query = new URLSearchParams({ per_page: '100', ...(after ? { after } : {}) })
    const page = await kit('GET', `/broadcasts?${query}`)
    if (page.broadcasts.some((b) => b.description === markerFor(slug))) return true
    after = page.pagination?.has_next_page ? page.pagination.end_cursor : null
  } while (after)
  return false
}

async function waitUntilLive(url) {
  const deadline = Date.now() + LIVE_TIMEOUT_MINUTES * 60_000
  while (Date.now() < deadline) {
    const res = await fetch(url, { method: 'HEAD' }).catch(() => null)
    if (res?.ok) return
    console.log(`  waiting for ${url} to go live…`)
    await new Promise((resolve) => setTimeout(resolve, 20_000))
  }
  throw new Error(`${url} was not live after ${LIVE_TIMEOUT_MINUTES} minutes`)
}

function broadcastFor(slug, data) {
  const url = `${SITE_URL}/blog/${slug}`
  // Kit's classic template wraps this body and adds the unsubscribe footer.
  const content = [
    `<p>I just published a new post:</p>`,
    `<h2><a href="${url}">${escapeHtml(data.title)}</a></h2>`,
    data.excerpt ? `<p>${escapeHtml(data.excerpt)}</p>` : '',
    `<p><a href="${url}"><strong>Read the post →</strong></a></p>`,
    `<p>Comments are open at the end of the post, or just reply to this email — it comes straight to me.</p>`,
    `<p>— Salomon</p>`,
  ].join('\n')

  return {
    email_address: SENDER_EMAIL,
    subject: data.title,
    preview_text: data.excerpt ?? '',
    content,
    description: markerFor(slug),
    public: false,
    send_at: new Date(Date.now() + SEND_DELAY_MINUTES * 60_000).toISOString(),
  }
}

let failed = false
for (const file of files) {
  const slug = path.basename(file, '.mdx')
  try {
    const { data } = matter(fs.readFileSync(file, 'utf8'))
    console.log(`• ${slug}`)
    if (data.notify === false) {
      console.log('  front matter says notify: false — skipped')
      continue
    }
    const broadcast = broadcastFor(slug, data)
    if (dryRun) {
      console.log(JSON.stringify(broadcast, null, 2))
      continue
    }
    if (await alreadySent(slug)) {
      console.log('  a broadcast for this post already exists — skipped')
      continue
    }
    await waitUntilLive(`${SITE_URL}/blog/${slug}`)
    const { broadcast: created } = await kit('POST', '/broadcasts', broadcast)
    console.log(`  scheduled broadcast ${created.id} for ${broadcast.send_at}`)
  } catch (err) {
    failed = true
    console.error(`  failed: ${err.message}`)
  }
}
process.exit(failed ? 1 : 0)
