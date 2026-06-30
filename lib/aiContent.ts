import OpenAI from 'openai'
import { resolveSecret } from './siteSettings'
import { sentenceCaseSk } from './text'

const CURRENT_YEAR = new Date().getFullYear()

async function client(): Promise<OpenAI> {
  const key = await resolveSecret('openai')
  if (!key) throw new Error('OPENAI_API_KEY nie je nastavený')
  return new OpenAI({ apiKey: key })
}

export async function aiReady(): Promise<boolean> {
  return !!(await resolveSecret('openai'))
}

const STRATEG_SYSTEM =
  'Si content stratég pre slovenskú digitálnu agentúru. Navrhuješ konkrétne, praktické a SEO-atraktívne ' +
  'názvy blogov po slovensky, ktoré priamo súvisia so službami firmy a pomáhajú jej získavať klientov.'

export async function suggestTopic(category: string, model = 'gpt-4o-mini', avoid: string[] = [], businessContext = '', maxWords = 8): Promise<string> {
  const list = await suggestTopics(1, { category, model, avoid, businessContext, maxWords })
  return list[0] || ''
}

/** Navrhne `count` konkrétnych názvov článkov groundovaných na službách firmy. */
export async function suggestTopics(
  count: number,
  opts: { category?: string; model?: string; avoid?: string[]; businessContext?: string; maxWords?: number } = {}
): Promise<string[]> {
  const { category, model = 'gpt-4o-mini', avoid = [], businessContext = '', maxWords = 8 } = opts
  const res = await (await client()).chat.completions.create({
    model,
    temperature: 0.9,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: STRATEG_SYSTEM },
      {
        role: 'user',
        content: [
          businessContext ? `O firme: ${businessContext}` : '',
          `Navrhni ${count} konkrétnych, navzájom rozdielnych názvov blogových článkov` +
            (category ? ` do kategórie "${category}"` : ' naprieč relevantnými témami') + '.',
          'Témy musia priamo súvisieť so službami firmy a riešiť reálne problémy jej cieľovej skupiny.',
          'Miešaj how-to návody, trendy, časté chyby, porovnania a praktické checklisty.',
          `DÔLEŽITÉ — názvy píš v BEŽNOM SLOVENSKOM PRAVOPISE: veľké písmeno len na začiatku a vo vlastných menách. NIE každé slovo veľkým (to je anglický štýl a je zlé).`,
          `Maximálne ${maxWords} slov na názov. Buď konkrétny a úderný.`,
          `Aktuálny rok je ${CURRENT_YEAR}. Ak v názve spomenieš rok, použi ${CURRENT_YEAR} — NIKDY starší rok.`,
          avoid.length ? 'Vyhni sa týmto už existujúcim názvom: ' + avoid.slice(0, 60).join('; ') : '',
          'Vráť JSON: { "topics": ["názov 1", "názov 2", ...] }. Len názvy, bez čísel a úvodzoviek v texte.',
        ].filter(Boolean).join('\n'),
      },
    ],
  })
  try {
    const j = JSON.parse(res.choices[0]?.message?.content || '{}')
    const arr: string[] = Array.isArray(j.topics) ? j.topics : []
    return arr.map(t => sentenceCaseSk(String(t).trim().replace(/^["'\d.\s-]+/, '').slice(0, 140))).filter(Boolean).slice(0, count)
  } catch {
    return []
  }
}

export interface GeneratedArticle {
  title: string
  content: string // HTML body (h2/h3/p/ul/strong) — bez <h1>
  excerpt: string
  meta_title: string
  meta_desc: string
  meta_keywords: string
  og_title: string
  og_desc: string
  tags: string[]
  image_query: string
  category: string
}

export interface GenerateOpts {
  topic: string
  category?: string
  tone?: string
  wordCount?: number
  model?: string
  temperature?: number
  businessContext?: string
  /** kandidáti na interné prelinkovanie (služby + existujúce články) */
  links?: { title: string; slug: string }[]
  linkCount?: number
  maxTitleWords?: number
  style?: string
}

export async function generateArticle(opts: GenerateOpts): Promise<GeneratedArticle> {
  const {
    topic,
    category = 'Marketing Tipy',
    tone = 'Praktický, priateľský a odborný, po slovensky.',
    wordCount = 800,
    model = 'gpt-4o-mini',
    temperature = 0.7,
    businessContext = '',
    links = [],
    linkCount = 0,
    maxTitleWords = 8,
    style = '',
  } = opts

  const linkPool = links.slice(0, 24)
  const wantLinks = Math.min(linkCount, linkPool.length)

  const system = [
    'Si skúsený SEO copywriter pre slovenskú digitálnu agentúru Monetico (cold email, SEO, sociálne siete, email marketing, tvorba webov).',
    businessContext ? `O firme (drž sa toho): ${businessContext}` : '',
    'Píšeš výhradne po slovensky, s korektnou diakritikou.',
    'Tvoríš hodnotné, konkrétne a prakticky použiteľné články pre majiteľov firiem a e-shopov.',
    `Tón: ${tone}`,
    style ? `Štýl tohto článku: ${style}` : '',
    `Aktuálny rok je ${CURRENT_YEAR}. Ak spomenieš rok, použi ${CURRENT_YEAR} — NIKDY starší.`,
    'Obsah vraciaš ako čisté HTML telo článku — používaj <h2>, <h3>, <p>, <ul><li>, <strong>. NEPOUŽÍVAJ <h1> ani <html>/<body>. Žiadny markdown.',
    'Vždy vráť validný JSON objekt podľa zadanej schémy.',
  ].filter(Boolean).join('\n')

  const user = [
    `Napíš SEO článok na tému: "${topic}".`,
    `Kategória: ${category}.`,
    `Cieľová dĺžka: približne ${wordCount} slov.`,
    'Štruktúra: úvod (1–2 odseky), 3–6 sekcií s <h2> nadpismi, kde sa hodí aj zoznam <ul>, a krátky záver s jemnou výzvou na akciu.',
    `Názov (title) píš v bežnom slovenskom pravopise (veľké len prvé slovo + vlastné mená, NIE každé slovo), max ${maxTitleWords} slov.`,
    wantLinks > 0
      ? `Do textu prirodzene vlož ${wantLinks} interné odkazy <a href="/SLUG/">výstižný text</a> — PREDNOSTNE na našu relevantnú SLUŽBU podľa toho, čo v článku spomínaš (napr. sociálne siete → /sluzby/socialne-media/, cold email → /sluzby/cold-email/, email marketing → /sluzby/email-marketing/, web/e-shop → /sluzby/tvorba-webov/, SEO → /sluzby/seo/). Najviac JEDEN odkaz smeruj na /kontakt/. Odkazuj len tam, kde to vo vete naozaj dáva zmysel. Na výber máš:\n` +
        linkPool.map(l => `- /${l.slug}/ — ${l.title}`).join('\n')
      : '',
    'Vráť JSON s kľúčmi:',
    '{',
    '  "title": "pútavý titulok",',
    '  "content_html": "HTML telo článku",',
    '  "excerpt": "1–2 vety zhrnutie (max 200 znakov)",',
    '  "meta_title": "SEO title do 60 znakov",',
    '  "meta_desc": "SEO meta description do 155 znakov",',
    '  "meta_keywords": "5–8 kľúčových slov oddelených čiarkou",',
    '  "og_title": "OG title",',
    '  "og_desc": "OG description",',
    '  "tags": ["tag1","tag2","tag3"],',
    '  "image_query": "2–3 anglické slová na vyhľadanie fotky (napr. \\"email marketing laptop\\")"',
    '}',
  ].join('\n')

  const res = await (await client()).chat.completions.create({
    model,
    temperature,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  })

  const raw = res.choices[0]?.message?.content || '{}'
  const j = JSON.parse(raw)
  return {
    title: sentenceCaseSk(j.title || topic),
    content: j.content_html || j.content || '',
    excerpt: j.excerpt || '',
    meta_title: j.meta_title || j.title || topic,
    meta_desc: j.meta_desc || j.excerpt || '',
    meta_keywords: j.meta_keywords || '',
    og_title: j.og_title || j.meta_title || j.title || topic,
    og_desc: j.og_desc || j.meta_desc || j.excerpt || '',
    tags: Array.isArray(j.tags) ? j.tags.slice(0, 8) : [],
    image_query: j.image_query || topic,
    category,
  }
}
