import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '../../../lib/adminAuth'
import { suggestTopics, aiReady } from '../../../lib/aiContent'
import { getSettings } from '../../../lib/settings'
import { listPlan, addPlan } from '../../../lib/plan'
import { listArticles } from '../../../lib/articles'
import { getAllPosts } from '../../../lib/posts'
import { quotaMessage } from '../../../lib/quota'

export const config = { maxDuration: 60 }

/**
 * Predgeneruje N návrhov názvov článkov (groundovaných na službách firmy),
 * vloží ich do Plánu ako `pending` a voliteľne ich rozloží po dňoch.
 * Autopilot potom z plánu postupne generuje samotné texty.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return
  if (req.method !== 'POST') return res.status(405).end()
  if (!(await aiReady())) return res.status(400).json({ error: 'OPENAI_API_KEY nie je nastavený' })

  const count = Math.max(1, Math.min(50, Number(req.body?.count) || 10))
  const category: string | undefined = req.body?.category || undefined
  const schedule: boolean = req.body?.schedule !== false // default: rozlož po dňoch

  try {
    const s = await getSettings()
    // čo už máme — aby AI neopakovala
    const plan = await listPlan().catch(() => [])
    const arts = await listArticles().catch(() => [])
    const avoid = [
      ...plan.map(p => p.topic),
      ...arts.map(a => a.title),
      ...getAllPosts().slice(0, 40).map(p => p.title),
    ]

    const topics = await suggestTopics(count, {
      category,
      model: s.model,
      avoid,
      businessContext: s.businessContext,
    })
    if (!topics.length) return res.status(502).json({ error: 'AI nevrátila žiadne témy, skús znova.' })

    // rozlož po dňoch (jedna téma / deň, od zajtra, o nastavenej hodine)
    const hour = s.publishHour ?? 9
    const created = []
    for (let i = 0; i < topics.length; i++) {
      let when: string | null = null
      if (schedule) {
        const d = new Date()
        d.setDate(d.getDate() + i + 1)
        d.setHours(hour, 0, 0, 0)
        when = d.toISOString()
      }
      created.push(await addPlan(topics[i], category || s.defaultCategory, when))
    }
    return res.status(200).json({ added: created.length, plan: created })
  } catch (e: any) {
    return res.status(500).json({ error: quotaMessage(e) || e.message || 'Chyba' })
  }
}
