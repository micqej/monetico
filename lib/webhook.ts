import { getSiteSettings } from './siteSettings'

export interface SubscriberPayload {
  event: 'newsletter.subscribed'
  email: string
  name: string
  source: string
  subscribedAt: string
  site: string
}

/**
 * Pošle subscriber payload na nastavený webhook (napr. CRM / Make / Zapier).
 * Fire-safe: zlyhanie webhooku nikdy nezhodí prihlásenie do newslettera.
 * Vracia { ok, status } pre testovacie/diagnostické účely.
 */
export async function fireSubscriberWebhook(
  payload: SubscriberPayload,
  override?: { url?: string; secret?: string }
): Promise<{ ok: boolean; status?: number; error?: string; skipped?: boolean }> {
  let url = override?.url
  let secret = override?.secret
  if (url === undefined || secret === undefined) {
    const s = await getSiteSettings()
    url = url ?? s.webhookUrl
    secret = secret ?? s.webhookSecret
  }
  if (!url) return { ok: false, skipped: true }

  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 5000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'X-Webhook-Secret': secret, Authorization: `Bearer ${secret}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    })
    return { ok: res.ok, status: res.status }
  } catch (e: any) {
    return { ok: false, error: e?.name === 'AbortError' ? 'timeout (5s)' : (e?.message || 'chyba') }
  } finally {
    clearTimeout(t)
  }
}

export function buildSubscriberPayload(email: string, source: string, subscribedAt: string, site: string, name = ''): SubscriberPayload {
  return { event: 'newsletter.subscribed', email, name, source, subscribedAt, site }
}
