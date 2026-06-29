import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '../../../lib/adminAuth'
import { runAutopilot } from '../../../lib/autopilot'

export const config = { maxDuration: 60 }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return
  if (req.method !== 'POST') return res.status(405).end()
  try {
    return res.status(200).json(await runAutopilot(true))
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e.message || 'Chyba' })
  }
}
