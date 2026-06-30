import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '../../../lib/adminAuth'
import { generateArticle, aiReady } from '../../../lib/aiContent'
import { searchImages } from '../../../lib/images'
import { getSettings } from '../../../lib/settings'
import { linkPool } from '../../../lib/links'
import { quotaMessage } from '../../../lib/quota'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return
  if (req.method !== 'POST') return res.status(405).end()
  if (!(await aiReady())) return res.status(400).json({ error: 'OPENAI_API_KEY nie je nastavený' })
  const { topic, category } = req.body || {}
  if (!topic) return res.status(400).json({ error: 'Chýba téma' })
  try {
    const s = await getSettings()
    const cat = category || s.defaultCategory
    const links = s.autoInterlink && s.linkCount > 0 ? await linkPool(cat, undefined, 20) : []
    const article = await generateArticle({
      topic,
      category: cat,
      tone: s.tone,
      wordCount: s.wordCount,
      model: s.model,
      temperature: s.temperature,
      businessContext: s.businessContext,
      links,
      linkCount: s.autoInterlink ? s.linkCount : 0,
    })
    const images = await searchImages(article.image_query, s.imageSource, 12)
    return res.status(200).json({ article, images })
  } catch (e: any) {
    return res.status(500).json({ error: quotaMessage(e) || e.message || 'Chyba generovania' })
  }
}
