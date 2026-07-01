import { getSettings, AutopilotSettings } from './settings'
import { nextPending, markPlan, getPlan, PlanItem } from './plan'
import { createArticle, publishDue } from './articles'
import { generateArticle, suggestTopic, aiReady } from './aiContent'
import { searchImages } from './images'
import { linkPool, embedImages } from './links'
import { CATEGORIES } from './categories'
import { SERVICE_LINKS, WRITING_STYLES } from './text'
import { quotaMessage } from './quota'
import { dbReady } from './db'

export interface AutopilotResult {
  ok: boolean
  reason?: string
  skipped?: string
  created?: string
  createdCount?: number
  published?: number
}

function pickCategory(s: { randomCategory: boolean; defaultCategory: string }): string {
  if (!s.randomCategory) return s.defaultCategory
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
}

/** Vygeneruje a uloží jeden článok pre danú tému. Ak je `planItem`, použije jeho
 *  kategóriu / počet slov / kľúčové slová a označí položku plánu ako done/error. */
async function generateForTopic(topic: string, category: string, s: AutopilotSettings, planItem?: PlanItem | null): Promise<string> {
  try {
    const links = s.autoInterlink && s.linkCount > 0
      ? [...SERVICE_LINKS, ...(await linkPool(category, undefined, 10))]
      : []
    const style = s.randomStyle ? WRITING_STYLES[Math.floor(Math.random() * WRITING_STYLES.length)] : ''
    const art = await generateArticle({
      topic,
      category,
      tone: s.tone,
      wordCount: (planItem?.word_count && planItem.word_count > 0) ? planItem.word_count : s.wordCount,
      model: s.model,
      temperature: s.temperature,
      businessContext: s.businessContext,
      links,
      linkCount: s.autoInterlink ? s.linkCount : 0,
      maxTitleWords: s.titleMaxWords || 8,
      style,
      keywords: planItem?.keywords || '',
    })

    // Fotky idú PRIAMO do tela článku; prvá slúži aj ako OG/náhľad pri zdieľaní.
    const imgCount = Math.max(1, Math.min(3, s.imageCount || 1))
    let imgs = await searchImages(art.image_query, s.imageSource, imgCount)
    if (!imgs.length) imgs = await searchImages(category, s.imageSource, imgCount) // fallback keď query nič nenašiel
    const hero = imgs[0]
    const body = imgs.length ? embedImages(art.content, imgs) : art.content

    const created = await createArticle({
      title: art.title,
      content: body,
      excerpt: art.excerpt,
      meta_title: art.meta_title,
      meta_desc: art.meta_desc,
      meta_keywords: planItem?.keywords || art.meta_keywords,
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
    return created.slug
  } catch (e: any) {
    if (planItem) await markPlan(planItem.id, 'error')
    throw e
  }
}

/** Jeden cyklus (manuálne „Spustiť teraz"): 1 článok. */
export async function runAutopilot(force = false): Promise<AutopilotResult> {
  if (!dbReady()) return { ok: false, reason: 'DB nie je nastavená' }
  const published = await publishDue()
  const s = await getSettings()
  if (!s.autopilotEnabled && !force) return { ok: true, skipped: 'vypnuté', published }
  if (!(await aiReady())) return { ok: false, reason: 'OPENAI_API_KEY nie je nastavený', published }

  // Naplánovaná položka (scheduled<=now alebo bez dátumu) sa generuje BEZ ohľadu na dni publikovania.
  const planItem = await nextPending()
  let topic: string
  let category: string
  if (planItem) {
    topic = planItem.topic
    category = planItem.category || pickCategory(s)
  } else {
    // Bez fronty vymýšľa AI tému — len v zvolené dni (ak nie je vynútené).
    const today = new Date().getDay()
    if (!force && !s.publishDays.includes(today)) return { ok: true, skipped: 'dnes nie je deň publikovania', published }
    category = pickCategory(s)
    try {
      topic = await suggestTopic(category, s.model, [], s.businessContext)
    } catch (e: any) {
      return { ok: false, reason: quotaMessage(e) || 'Nepodarilo sa navrhnúť tému: ' + e.message, published }
    }
    if (!topic) return { ok: false, reason: 'AI nevrátila tému', published }
  }

  try {
    const slug = await generateForTopic(topic, category, s, planItem)
    return { ok: true, created: slug, createdCount: 1, published }
  } catch (e: any) {
    return { ok: false, reason: quotaMessage(e) || e.message || 'Chyba generovania', published }
  }
}

/** CRON: spracuje VŠETKY splatné položky plánu (max `cap`), bez ohľadu na dni
 *  publikovania. Ak fronta nič splatné nemá a je deň publikovania, vymyslí 1 tému. */
export async function runAutopilotBatch(cap = 5, force = false): Promise<AutopilotResult> {
  if (!dbReady()) return { ok: false, reason: 'DB nie je nastavená' }
  const published = await publishDue()
  const s = await getSettings()
  if (!s.autopilotEnabled && !force) return { ok: true, skipped: 'vypnuté', published }
  if (!(await aiReady())) return { ok: false, reason: 'OPENAI_API_KEY nie je nastavený', published }

  const slugs: string[] = []
  let lastErr = ''
  while (slugs.length < cap) {
    const item = await nextPending()
    if (!item) break
    try {
      slugs.push(await generateForTopic(item.topic, item.category || pickCategory(s), s, item))
    } catch (e: any) {
      lastErr = quotaMessage(e) || e.message || 'Chyba generovania'
      break // napr. minutý kredit — nemá zmysel pokračovať
    }
  }

  // Nič splatné vo fronte → v deň publikovania vymysli jednu tému.
  if (slugs.length === 0 && !lastErr) {
    const today = new Date().getDay()
    if (force || s.publishDays.includes(today)) {
      const category = pickCategory(s)
      try {
        const topic = await suggestTopic(category, s.model, [], s.businessContext)
        if (topic) slugs.push(await generateForTopic(topic, category, s, null))
      } catch (e: any) {
        lastErr = quotaMessage(e) || e.message || 'Chyba generovania'
      }
    }
  }

  if (lastErr && slugs.length === 0) return { ok: false, reason: lastErr, published }
  return { ok: true, created: slugs[0], createdCount: slugs.length, published }
}

/** Vygeneruje KONKRÉTNU položku plánu okamžite (tlačidlo „Generovať teraz"). */
export async function generatePlanItemNow(id: number): Promise<AutopilotResult> {
  if (!dbReady()) return { ok: false, reason: 'DB nie je nastavená' }
  if (!(await aiReady())) return { ok: false, reason: 'OPENAI_API_KEY nie je nastavený' }
  const s = await getSettings()
  const item = await getPlan(id)
  if (!item) return { ok: false, reason: 'Položka plánu neexistuje' }
  if (item.status === 'done') return { ok: false, reason: 'Táto téma už bola vygenerovaná' }
  try {
    const slug = await generateForTopic(item.topic, item.category || pickCategory(s), s, item)
    return { ok: true, created: slug, createdCount: 1 }
  } catch (e: any) {
    return { ok: false, reason: quotaMessage(e) || e.message || 'Chyba generovania' }
  }
}
