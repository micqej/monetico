import type { NextApiRequest, NextApiResponse } from 'next'
import { runAutopilotBatch } from '../../../lib/autopilot'

export const config = { maxDuration: 60 }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vercel Cron posiela hlavičku Authorization: Bearer <CRON_SECRET> ak je nastavený.
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Neautorizované' })
  }
  try {
    const result = await runAutopilotBatch(5, false)
    return res.status(200).json(result)
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e.message || 'Chyba' })
  }
}
