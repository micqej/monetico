import webpush from 'web-push'
import { getSql, ensureSchema } from './db'

interface Vapid { publicKey: string; privateKey: string }

async function vapid(): Promise<Vapid | null> {
  const sql = getSql()
  if (!sql) return null
  try {
    const rows = await sql`SELECT value FROM settings WHERE key = 'push' LIMIT 1`
    const v: any = rows[0]?.value
    if (!v) return null
    const o = typeof v === 'string' ? JSON.parse(v) : v
    return o?.publicKey && o?.privateKey ? o : null
  } catch { return null }
}

export async function vapidPublicKey(): Promise<string> {
  return (await vapid())?.publicKey || ''
}

export async function saveSubscription(sub: { endpoint: string; keys: { p256dh: string; auth: string } }): Promise<void> {
  const sql = getSql()
  if (!sql || !sub?.endpoint) return
  await ensureSchema()
  await sql`INSERT INTO push_subscriptions (endpoint, p256dh, auth)
    VALUES (${sub.endpoint}, ${sub.keys.p256dh}, ${sub.keys.auth})
    ON CONFLICT (endpoint) DO UPDATE SET p256dh = ${sub.keys.p256dh}, auth = ${sub.keys.auth}`
}

export async function pushCount(): Promise<number> {
  const sql = getSql()
  if (!sql) return 0
  try { const r = await sql`SELECT count(*)::int AS c FROM push_subscriptions`; return r[0]?.c || 0 } catch { return 0 }
}

/** Pošle push notifikáciu na všetky uložené zariadenia (mŕtve odbery zmaže). */
export async function sendPush(payload: { title: string; body: string; url?: string }): Promise<{ sent: number; failed: number }> {
  const sql = getSql()
  if (!sql) return { sent: 0, failed: 0 }
  const v = await vapid()
  if (!v) return { sent: 0, failed: 0 }
  webpush.setVapidDetails('mailto:info@monetico.sk', v.publicKey, v.privateKey)
  const subs = await sql`SELECT endpoint, p256dh, auth FROM push_subscriptions`
  let sent = 0, failed = 0
  await Promise.all(subs.map(async (s: any) => {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(payload))
      sent++
    } catch (e: any) {
      failed++
      if (e?.statusCode === 404 || e?.statusCode === 410) {
        try { await sql`DELETE FROM push_subscriptions WHERE endpoint = ${s.endpoint}` } catch {}
      }
    }
  }))
  return { sent, failed }
}
