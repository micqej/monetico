import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '../../../lib/adminAuth'
import { generateArticle, aiReady } from '../../../lib/aiContent'
import { searchImages } from '../../../lib/images'
import { getSettings } from '../../../lib/settings'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return
  if (req.method !== 'POST') return res.status(405).end()
  if (!aiReady()) return res.status(400).json({ error: 'OPENAI_API_KEY nie je nastavený' })
  const { topic, category } = req.body || {}
  if (!topic) return res.status(400).json({ error: 'Chýba téma' })
  try {
    const s = await getSettings()
    const article = await generateArticle({
      topic,
      category: category || s.defaultCategory,
      tone: s.tone,
      wordCount: s.wordCount,
      model: s.model,
      temperature: s.temperature,
    })
    const images = await searchImages(article.image_query, s.imageSource, 12)
    return res.status(200).json({ article, images })
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Chyba generovania' })
  }
}
