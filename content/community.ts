/**
 * Community spaces. Both URLs were read out of the QR images in `images/`, and
 * the QR files under `public/images/` decode back to exactly these strings —
 * if you change a URL here, regenerate the matching QR.
 *
 * The Discord invite is permanent (`expires_at: null`), so it is safe to pin.
 */

export interface CommunitySpace {
  /** Message key suffix: `contact.community_<key>_name` / `_desc` / `_cta`. */
  key: 'whatsapp' | 'discord'
  href: string
  qr: string
}

export const COMMUNITY: CommunitySpace[] = [
  {
    key: 'whatsapp',
    href: 'https://whatsapp.com/channel/0029VbDR33v6hENldqLbRe24',
    qr: '/images/whatsapp-qr.png',
  },
  {
    key: 'discord',
    href: 'https://discord.gg/PUbkyrUcaa',
    qr: '/images/discord-qr.png',
  },
]

export const DARAKILI_URL = 'https://darakili.com'
