/**
 * Newsletter sign-up, proxied to Kit (free plan: up to 10,000 subscribers,
 * API included) so the API key stays on the server.
 *
 * Double opt-in: the subscriber is created `inactive` and added to the
 * KIT_FORM_ID form, whose "incentive email" asks them to confirm. Kit only
 * sends them posts once they click it, so a mistyped or someone else's
 * address never ends up on the list. Keep that form's double opt-in on.
 *
 * Responds `{ status }` with one of: pending | already | invalid | busy | error
 * — components/Subscribe.tsx maps each to a translated message.
 */

const KIT_API = 'https://api.kit.com/v4'

type Status = 'pending' | 'already' | 'invalid' | 'busy' | 'error'

function reply(status: Status, httpStatus = 200) {
  return Response.json({ status }, { status: httpStatus })
}

export async function POST(request: Request) {
  const apiKey = process.env.KIT_API_KEY
  const formId = process.env.KIT_FORM_ID
  if (!apiKey || !formId) return reply('error', 503)

  let body: { email?: unknown; website?: unknown }
  try {
    body = await request.json()
  } catch {
    return reply('invalid', 400)
  }

  // Honeypot: a field hidden from people that naive bots fill in. Answer as
  // if it worked so the bot learns nothing.
  if (typeof body.website === 'string' && body.website !== '') return reply('pending')

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return reply('invalid', 400)
  }

  const kit = (path: string, payload: object) =>
    fetch(`${KIT_API}${path}`, {
      method: 'POST',
      headers: { 'X-Kit-Api-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

  try {
    // Upsert: 201 for a new address, 200 (state unchanged) for a known one.
    const created = await kit('/subscribers', { email_address: email, state: 'inactive' })
    if (created.status === 422) return reply('invalid', 400)
    if (created.status === 429) return reply('busy', 429)
    if (!created.ok) {
      console.error('Kit create subscriber failed', created.status)
      return reply('error', 502)
    }
    const { subscriber } = (await created.json()) as { subscriber?: { state?: string } }
    if (subscriber?.state === 'active') return reply('already')

    const added = await kit(`/forms/${formId}/subscribers`, {
      email_address: email,
      referrer: request.headers.get('referer') ?? undefined,
    })
    if (added.status === 429) return reply('busy', 429)
    if (!added.ok) {
      console.error('Kit add to form failed', added.status)
      return reply('error', 502)
    }
    return reply('pending')
  } catch (err) {
    console.error('Kit subscribe failed', err)
    return reply('error', 502)
  }
}
