import { getSettings } from './settings'
import { nextPending, markPlan } from './plan'
import { createArticle, publishDue } from './articles'
import { generateArticle, suggestTopic, aiReady } from './aiContent'
import { firstImage } from './images'
import { dbReady } from './db'

export interface AutopilotResult {
  ok: boolean
  reason?: string
  skipped?: string
  created?: string
  published?: number
}

export async function runAutopilot(force = false): Promise<AutopilotResult> {
  if (!dbReady()) return { ok: false, reason: 'DB nie je nastavená' }

  // Vždy zverejni naplánované články, ktorým prišiel čas.
  const published = await publishDue()

  const s = await getSettings()
  if (!s.autopilotEnabled && !force) return { ok: true, skipped: 'vypnuté', published }

  // Publikuj len v zvolené dni (pri ručnom spustení ignoruj).
  const today = new Date().getDay()
  if (!force && !s.publishDays.includes(today)) return { ok: true, skipped: 'dnes nie je deň publikovania', published }

  if (!aiReady()) return { ok: false, reason: 'OPENAI_API_KEY nie je nastavený', published }

  const planItem = await nextPending()
  let topic: string
  let category: string
  if (planItem) {
    topic = planItem.topic
    category = planItem.category
  } else {
    try {
      topic = await suggestTopic(s.defaultCategory, s.model)
    } catch (e: any) {
      return { ok: false, reason: 'Nepodarilo sa navrhnúť tému: ' + e.message, published }
    }
    category = s.defaultCategory
  }

  try {
    const art = await generateArticle({
      topic,
      category,
      tone: s.tone,
      wordCount: s.wordCount,
      model: s.model,
      temperature: s.temperature,
    })
    const img = await firstImage(art.image_query, s.imageSource)
    const created = await createArticle({
      title: art.title,
      content: art.content,
      excerpt: art.excerpt,
      meta_title: art.meta_title,
      meta_desc: art.meta_desc,
      meta_keywords: art.meta_keywords,
      og_title: art.og_title,
      og_desc: art.og_desc,
      category: art.category,
      tags: art.tags,
      image_url: img?.url || '',
      image_credit: img?.credit || '',
      status: s.autoPublish ? 'published' : 'draft',
      publish_at: new Date().toISOString(),
      source: 'ai',
    })
    if (planItem) await markPlan(planItem.id, 'done', created.id)
    return { ok: true, created: created.slug, published }
  } catch (e: any) {
    if (planItem) await markPlan(planItem.id, 'error')
    return { ok: false, reason: e.message || 'Chyba generovania', published }
  }
}
