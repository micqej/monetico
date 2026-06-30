import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '../../../lib/adminAuth'
import { fireSubscriberWebhook, buildSubscriberPayload } from '../../../lib/webhook'
import { listSubscribers } from '../../../lib/subscribers'
import { SITE_URL } from '../../../lib/site'

export const config = { maxDuration: 60 }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return
  if (req.method !== 'POST') return res.status(405).end()
  const { action, url, secret } = req.body || {}
  try {
    if (action === 'test') {
      const r = await fireSubscriberWebhook(
        buildSubscriberPayload('test@example.com', 'test', new Date().toISOString(), SITE_URL, 'Testovací kontakt'),
        { url, secret }
      )
      if (r.skipped) return res.status(400).json({ error: 'Najprv zadaj URL webhooku.' })
      return res.status(200).json(r)
    }
    if (action === 'resend') {
      // pošli všetkých existujúcich odberateľov (napr. prvotná synchronizácia do CRM)
      const subs = await listSubscribers()
      let ok = 0, fail = 0
      for (const s of subs) {
        const r = await fireSubscriberWebhook(buildSubscriberPayload(s.email, s.source, s.created_at, SITE_URL))
        if (r.skipped) return res.status(400).json({ error: 'Najprv ulož URL webhooku v nastaveniach.' })
        if (r.ok) ok++; else fail++
      }
      return res.status(200).json({ total: subs.length, ok, fail })
    }
    return res.status(400).json({ error: 'Neznáma akcia' })
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Chyba' })
  }
}
