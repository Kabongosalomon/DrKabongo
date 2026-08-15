export const CONTACT_EMAIL = 'kabongosalomon@gmail.com'
export const BOOKING_URL = 'https://appt.link/meeting-with-salomon-kabongo'

export function emailEnquiryHref(subject: string, body: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
