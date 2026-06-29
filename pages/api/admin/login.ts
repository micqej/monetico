import type { NextApiRequest, NextApiResponse } from 'next'
import { checkPassword, setSession, adminConfigured } from '../../../lib/adminAuth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!adminConfigured()) return res.status(500).json({ error: 'ADMIN_PASSWORD nie je nastavený' })
  const { password } = req.body || {}
  if (!checkPassword(String(password || ''))) return res.status(401).json({ error: 'Nesprávne heslo' })
  setSession(res)
  return res.status(200).json({ ok: true })
}
