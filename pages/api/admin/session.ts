import type { NextApiRequest, NextApiResponse } from 'next'
import { isAuthed, adminConfigured } from '../../../lib/adminAuth'
import { dbReady } from '../../../lib/db'
import { resolveSecret } from '../../../lib/siteSettings'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authed = isAuthed(req)
  const base = { authed, configured: adminConfigured(), db: dbReady() }
  if (!authed) return res.status(200).json({ ...base, ai: false, pexels: false, pixabay: false })
  const [ai, pexels, pixabay] = await Promise.all([resolveSecret('openai'), resolveSecret('pexels'), resolveSecret('pixabay')])
  return res.status(200).json({ ...base, ai: !!ai, pexels: !!pexels, pixabay: !!pixabay })
}
