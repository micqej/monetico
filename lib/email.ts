import { Resend } from 'resend'
import { getSiteSettings } from './siteSettings'

/**
 * Pošle upozorňovací e-mail cez Resend. Vráti false (bez chyby) keď nie je
 * nastavený kľúč alebo cieľová adresa — notifikácia je voliteľná.
 */
export async function sendNotifyEmail(subject: string, html: string): Promise<boolean> {
  const s = await getSiteSettings()
  const key = (s.resendKey && s.resendKey.trim()) || process.env.RESEND_API_KEY || ''
  const to = (s.notifyEmail && s.notifyEmail.trim()) || ''
  const from = s.resendFrom || 'Monetico <onboarding@resend.dev>'
  if (!key || !to) return false
  try {
    const resend = new Resend(key)
    await resend.emails.send({ from, to, subject, html })
    return true
  } catch {
    return false
  }
}
