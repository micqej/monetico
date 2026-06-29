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
  imageSource: 'pexels' | 'pixabay' | 'both'
  autoInterlink: boolean
  newsletterSubject: string
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
  imageSource: 'both',
  autoInterlink: true,
  newsletterSubject: 'Tipy pre rast — Monetico',
}

const KEY = 'autopilot'

export async function getSettings(): Promise<AutopilotSettings> {
  const sql = getSql()
  if (!sql) return DEFAULT_SETTINGS
  try {
    await ensureSchema()
    const rows = await sql`SELECT value FROM settings WHERE key = ${KEY} LIMIT 1`
    if (!rows[0]) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...(rows[0].value as object) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function saveSettings(patch: Partial<AutopilotSettings>): Promise<AutopilotSettings> {
  const sql = getSql()
  if (!sql) throw new Error('DB not configured')
  await ensureSchema()
  const next = { ...(await getSettings()), ...patch }
  const value = JSON.stringify(next)
  await sql`INSERT INTO settings (key, value) VALUES (${KEY}, ${value}::jsonb)
    ON CONFLICT (key) DO UPDATE SET value = ${value}::jsonb`
  return next
}
