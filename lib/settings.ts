import { getSql, ensureSchema } from './db'

export interface AutopilotSettings {
  autopilotEnabled: boolean
  autoPublish: boolean
  postsPerWeek: number
  publishDays: number[] // 0=Sun .. 6=Sat
  publishHour: number
  model: string
  temperature: number
  tone: string
  wordCount: number
  defaultCategory: string
  randomCategory: boolean      // náhodne vyberať kategóriu pre každý článok
  imageSource: 'pexels' | 'pixabay' | 'both'
  imageCount: number           // koľko fotiek na článok (1–3)
  autoInterlink: boolean
  linkCount: number            // koľko interných odkazov vložiť (0–3)
  newsletterSubject: string
  businessContext: string      // čím sa firma reálne zaoberá — grounduje témy aj texty
}

export const DEFAULT_SETTINGS: AutopilotSettings = {
  autopilotEnabled: false,
  autoPublish: true,
  postsPerWeek: 2,
  publishDays: [1, 4],
  publishHour: 9,
  model: 'gpt-4o-mini',
  temperature: 0.7,
  tone: 'Praktický, priateľský a odborný. Bez omáčky — konkrétne, použiteľné tipy pre slovenské firmy. Píš po slovensky.',
  wordCount: 800,
  defaultCategory: 'Marketing Tipy',
  randomCategory: true,
  imageSource: 'both',
  imageCount: 1,
  autoInterlink: true,
  linkCount: 2,
  newsletterSubject: 'Tipy pre rast — Monetico',
  businessContext:
    'Monetico je slovenská digitálna agentúra. Služby: tvorba webov a e-shopov, SEO, ' +
    'cold emailing, email marketing, správa sociálnych sietí, online reklama (Google/Meta) ' +
    'a automatizácia marketingu. Cieľová skupina: majitelia malých a stredných firiem a e-shopov na Slovensku.',
}

const KEY = 'autopilot'

export async function getSettings(): Promise<AutopilotSettings> {
  const sql = getSql()
  if (!sql) return DEFAULT_SETTINGS
  try {
    await ensureSchema()
    const rows = await sql`SELECT value FROM settings WHERE key = ${KEY} LIMIT 1`
    if (!rows[0]) return DEFAULT_SETTINGS
    const v: any = rows[0].value
    const obj = typeof v === 'string' ? JSON.parse(v) : v
    return { ...DEFAULT_SETTINGS, ...obj }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function saveSettings(patch: Partial<AutopilotSettings>): Promise<AutopilotSettings> {
  const sql = getSql()
  if (!sql) throw new Error('DB not configured')
  await ensureSchema()
  const next = { ...(await getSettings()), ...patch }
  await sql`INSERT INTO settings (key, value) VALUES (${KEY}, ${sql.json(next as any)})
    ON CONFLICT (key) DO UPDATE SET value = ${sql.json(next as any)}`
  return next
}
