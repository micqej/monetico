import type { NextApiRequest, NextApiResponse } from 'next'
import { addSubscriber } from '../../lib/subscribers'
import { dbReady } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, source } = req.body || {}
  if (!email) return res.status(400).json({ error: 'Chýba email' })
  // Gracefully accept even if DB is not configured yet (no crash on the public site).
  if (!dbReady()) return res.status(200).json({ ok: true, stored: false })
  try {
    await addSubscriber(String(email), source || 'web')
    return res.status(200).json({ ok: true, stored: true })
  } catch (e: any) {
    return res.status(400).json({ error: e.message || 'Neplatný email' })
  }
}
