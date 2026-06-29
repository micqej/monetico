import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '../../../../lib/adminAuth'
import { listArticles, createArticle } from '../../../../lib/articles'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return
  try {
    if (req.method === 'GET') {
      const status = typeof req.query.status === 'string' ? req.query.status : undefined
      return res.status(200).json({ articles: await listArticles(status) })
    }
    if (req.method === 'POST') {
      const a = await createArticle(req.body || {})
      return res.status(200).json({ article: a })
    }
    return res.status(405).end()
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Chyba' })
  }
}
