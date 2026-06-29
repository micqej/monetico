import OpenAI from 'openai'

let _client: OpenAI | null = null
function client(): OpenAI {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY nie je nastavený')
  if (!_client) _client = new OpenAI({ apiKey: key })
  return _client
}

export function aiReady(): boolean {
  return !!process.env.OPENAI_API_KEY
}

export async function suggestTopic(category: string, model = 'gpt-4o-mini', avoid: string[] = []): Promise<string> {
  const res = await client().chat.completions.create({
    model,
    temperature: 0.9,
    messages: [
      { role: 'system', content: 'Si content stratég pre slovenskú digitálnu agentúru Monetico. Navrhuješ konkrétne, praktické a SEO-atraktívne témy blogov po slovensky.' },
      { role: 'user', content: `Navrhni JEDNU konkrétnu tému blogu do kategórie "${category}". Vráť len samotný názov témy, bez úvodzoviek a bez čísla.${avoid.length ? ' Vyhni sa týmto témam: ' + avoid.join('; ') : ''}` },
    ],
  })
  return (res.choices[0]?.message?.content || '').trim().replace(/^["'\d.\s-]+/, '').slice(0, 140)
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
}

export async function generateArticle(opts: GenerateOpts): Promise<GeneratedArticle> {
  const {
    topic,
    category = 'Marketing Tipy',
    tone = 'Praktický, priateľský a odborný, po slovensky.',
    wordCount = 800,
    model = 'gpt-4o-mini',
    temperature = 0.7,
  } = opts

  const system = [
    'Si skúsený SEO copywriter pre slovenskú digitálnu agentúru Monetico (cold email, SEO, sociálne siete, email marketing, tvorba webov).',
    'Píšeš výhradne po slovensky, s korektnou diakritikou.',
    'Tvoríš hodnotné, konkrétne a prakticky použiteľné články pre majiteľov firiem a e-shopov.',
    `Tón: ${tone}`,
    'Obsah vraciaš ako čisté HTML telo článku — používaj <h2>, <h3>, <p>, <ul><li>, <strong>. NEPOUŽÍVAJ <h1> ani <html>/<body>. Žiadny markdown.',
    'Vždy vráť validný JSON objekt podľa zadanej schémy.',
  ].join('\n')

  const user = [
    `Napíš SEO článok na tému: "${topic}".`,
    `Kategória: ${category}.`,
    `Cieľová dĺžka: približne ${wordCount} slov.`,
    'Štruktúra: úvod (1–2 odseky), 3–6 sekcií s <h2> nadpismi, kde sa hodí aj zoznam <ul>, a krátky záver s výzvou (CTA na konzultáciu).',
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

  const res = await client().chat.completions.create({
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
    title: j.title || topic,
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
