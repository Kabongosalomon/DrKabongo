export const CONTACT_EMAIL = 'kabongosalomon@gmail.com'

export function emailEnquiryHref(subject: string, body: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
