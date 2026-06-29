import type { NextApiRequest, NextApiResponse } from 'next'
import { isAuthed, adminConfigured } from '../../../lib/adminAuth'
import { dbReady } from '../../../lib/db'
import { aiReady } from '../../../lib/aiContent'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    authed: isAuthed(req),
    configured: adminConfigured(),
    db: dbReady(),
    ai: aiReady(),
    pexels: !!process.env.PEXELS_API_KEY,
    pixabay: !!process.env.PIXABAY_API_KEY,
  })
}
