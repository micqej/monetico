import { getSettings } from './settings'
import { nextPending, markPlan } from './plan'
import { createArticle, publishDue } from './articles'
import { generateArticle, suggestTopic, aiReady } from './aiContent'
import { searchImages } from './images'
import { linkPool, embedImages } from './links'
import { CATEGORIES } from './categories'
import { quotaMessage } from './quota'
import { dbReady } from './db'

export interface AutopilotResult {
  ok: boolean
  reason?: string
  skipped?: string
  created?: string
  published?: number
}

function pickCategory(s: { randomCategory: boolean; defaultCategory: string }): string {
  if (!s.randomCategory) return s.defaultCategory
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
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

  if (!(await aiReady())) return { ok: false, reason: 'OPENAI_API_KEY nie je nastavený', published }

  // Téma: najprv z plánu, inak ju navrhne AI (groundovaná na službách firmy).
  const planItem = await nextPending()
  let topic: string
  let category: string
  if (planItem) {
    topic = planItem.topic
    category = planItem.category || pickCategory(s)
  } else {
    category = pickCategory(s)
    try {
      topic = await suggestTopic(category, s.model, [], s.businessContext)
    } catch (e: any) {
      return { ok: false, reason: quotaMessage(e) || 'Nepodarilo sa navrhnúť tému: ' + e.message, published }
    }
    if (!topic) return { ok: false, reason: 'AI nevrátila tému', published }
  }

  try {
    const links = s.autoInterlink && s.linkCount > 0 ? await linkPool(category, undefined, 20) : []
    const art = await generateArticle({
      topic,
      category,
      tone: s.tone,
      wordCount: s.wordCount,
      model: s.model,
      temperature: s.temperature,
      businessContext: s.businessContext,
      links,
      linkCount: s.autoInterlink ? s.linkCount : 0,
    })

    // Fotky: prvá = hero (image_url), ďalšie sa vložia do tela.
    const imgCount = Math.max(1, Math.min(3, s.imageCount || 1))
    const imgs = await searchImages(art.image_query, s.imageSource, imgCount)
    const hero = imgs[0]
    const body = imgs.length > 1 ? embedImages(art.content, imgs.slice(1)) : art.content

    const created = await createArticle({
      title: art.title,
      content: body,
      excerpt: art.excerpt,
      meta_title: art.meta_title,
      meta_desc: art.meta_desc,
      meta_keywords: art.meta_keywords,
      og_title: art.og_title,
      og_desc: art.og_desc,
      category: art.category,
      tags: art.tags,
      image_url: hero?.url || '',
      image_credit: hero?.credit || '',
      status: s.autoPublish ? 'published' : 'draft',
      publish_at: new Date().toISOString(),
      source: 'ai',
    })
    if (planItem) await markPlan(planItem.id, 'done', created.id)
    return { ok: true, created: created.slug, published }
  } catch (e: any) {
    if (planItem) await markPlan(planItem.id, 'error')
    return { ok: false, reason: quotaMessage(e) || e.message || 'Chyba generovania', published }
  }
}
