import type { NextApiRequest, NextApiResponse } from 'next'
import { clearSession } from '../../../lib/adminAuth'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  clearSession(res)
  return res.status(200).json({ ok: true })
}
