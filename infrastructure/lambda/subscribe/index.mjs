/**
 * AWS Lambda Function URL handler for `POST /api/subscribe`.
 *
 * Proxies newsletter sign-ups to Kit v4 (double opt-in) so `KIT_API_KEY` stays
 * server-side when the frontend is served statically from S3 + CloudFront.
 *
 * Responds `{ status }` with: pending | already | invalid | busy | error.
 */

const KIT_API = 'https://api.kit.com/v4'

function jsonReply(status, statusCode = 200) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
    body: JSON.stringify({ status }),
  }
}

export async function handler(event) {
  const method = (event?.requestContext?.http?.method || '').toUpperCase()
  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: { 'cache-control': 'no-store' }, body: '' }
  }
  if (method !== 'POST') {
    return jsonReply('error', 405)
  }

  const apiKey = process.env.KIT_API_KEY
  const formId = process.env.KIT_FORM_ID
  if (!apiKey || !formId) return jsonReply('error', 503)

  let body
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf8')
      : event.body || '{}'
    body = JSON.parse(raw)
  } catch {
    return jsonReply('invalid', 400)
  }

  // Honeypot: silently succeed so bots learn nothing.
  if (typeof body.website === 'string' && body.website !== '') {
    return jsonReply('pending', 200)
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return jsonReply('invalid', 400)
  }

  const kit = (path, payload) =>
    fetch(`${KIT_API}${path}`, {
      method: 'POST',
      headers: { 'X-Kit-Api-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

  try {
    const created = await kit('/subscribers', { email_address: email, state: 'inactive' })
    if (created.status === 422) return jsonReply('invalid', 400)
    if (created.status === 429) return jsonReply('busy', 429)
    if (!created.ok) {
      console.error('Kit create subscriber failed', created.status)
      return jsonReply('error', 502)
    }

    const { subscriber } = await created.json()
    if (subscriber?.state === 'active') return jsonReply('already', 200)

    const headers = event.headers || {}
    const referer = headers.referer || headers.Referer
    const added = await kit(`/forms/${formId}/subscribers`, {
      email_address: email,
      ...(referer ? { referrer: referer } : {}),
    })
    if (added.status === 429) return jsonReply('busy', 429)
    if (!added.ok) {
      console.error('Kit add to form failed', added.status)
      return jsonReply('error', 502)
    }

    return jsonReply('pending', 200)
  } catch (err) {
    console.error('Kit subscribe failed', err)
    return jsonReply('error', 502)
  }
}
