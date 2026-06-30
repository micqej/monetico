import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '../../../lib/adminAuth'
import { suggestTopics, aiReady } from '../../../lib/aiContent'
import { getSettings } from '../../../lib/settings'
import { listPlan, addPlan } from '../../../lib/plan'
import { listArticles } from '../../../lib/articles'
import { getAllPosts } from '../../../lib/posts'
import { quotaMessage } from '../../../lib/quota'

export const config = { maxDuration: 60 }

/** UTC offset (min) pre dané pásmo a čas — rieši aj letný/zimný čas. */
function tzOffsetMin(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
  const m: any = {}
  dtf.formatToParts(date).forEach(p => { m[p.type] = p.value })
  const asUTC = Date.UTC(+m.year, +m.month - 1, +m.day, +m.hour === 24 ? 0 : +m.hour, +m.minute, +m.second)
  return (asUTC - date.getTime()) / 60000
}

/** ISO timestamp pre `hour:00` slovenského času na deň `base`. */
function skLocalISO(base: Date, hour: number): string {
  const y = base.getUTCFullYear(), mo = base.getUTCMonth(), d = base.getUTCDate()
  const guess = new Date(Date.UTC(y, mo, d, hour, 0, 0))
  const off = tzOffsetMin(guess, 'Europe/Bratislava') // napr. 120 v lete
  return new Date(guess.getTime() - off * 60000).toISOString()
}

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
      maxWords: s.titleMaxWords || 8,
    })
    if (!topics.length) return res.status(502).json({ error: 'AI nevrátila žiadne témy, skús znova.' })

    // rozlož po dňoch (jedna téma / deň, od zajtra) o nastavenej hodine v ČASE SLOVENSKA
    const hour = s.publishHour ?? 9
    const created = []
    for (let i = 0; i < topics.length; i++) {
      let when: string | null = null
      if (schedule) {
        const base = new Date()
        base.setUTCDate(base.getUTCDate() + i + 1)
        when = skLocalISO(base, hour)
      }
      created.push(await addPlan(topics[i], category || s.defaultCategory, when))
    }
    return res.status(200).json({ added: created.length, plan: created })
  } catch (e: any) {
    return res.status(500).json({ error: quotaMessage(e) || e.message || 'Chyba' })
  }
}
