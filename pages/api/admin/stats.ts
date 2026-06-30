import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '../../../lib/adminAuth'
import { listArticles } from '../../../lib/articles'
import { commentCounts } from '../../../lib/comments'
import { listSubscribers } from '../../../lib/subscribers'
import { listPlan } from '../../../lib/plan'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return
  try {
    const [articles, comments, subs, plan] = await Promise.all([
      listArticles(), commentCounts(), listSubscribers(), listPlan(),
    ])
    return res.status(200).json({
      articles: {
        total: articles.length,
        published: articles.filter(a => a.status === 'published').length,
        draft: articles.filter(a => a.status === 'draft').length,
        scheduled: articles.filter(a => a.status === 'scheduled').length,
      },
      comments,
      subscribers: subs.length,
      planPending: plan.filter(p => p.status === 'pending').length,
      recentArticles: articles.slice(0, 5).map(a => ({ title: a.title, status: a.status, date: a.publish_at || a.created_at })),
    })
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Chyba' })
  }
}
