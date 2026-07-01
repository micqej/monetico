import { getSql, ensureSchema } from './db'

export interface PlanItem {
  id: number
  topic: string
  category: string
  status: 'pending' | 'generated' | 'done' | 'error'
  scheduled_for: string | null
  article_id: number | null
  keywords: string
  word_count: number | null
  created_at: string
}

function map(r: any): PlanItem {
  return {
    ...r,
    keywords: r.keywords || '',
    word_count: r.word_count ?? null,
    scheduled_for: r.scheduled_for ? new Date(r.scheduled_for).toISOString() : null,
    created_at: r.created_at ? new Date(r.created_at).toISOString() : '',
  }
}

export async function listPlan(): Promise<PlanItem[]> {
  const sql = getSql()
  if (!sql) return []
  await ensureSchema()
  const rows = await sql`SELECT * FROM content_plan ORDER BY status='done', COALESCE(scheduled_for, created_at)`
  return rows.map(map)
}

export interface PlanExtra { keywords?: string; word_count?: number | null }

export async function addPlan(topic: string, category: string, scheduled_for?: string | null, extra: PlanExtra = {}): Promise<PlanItem> {
  const sql = getSql()
  if (!sql) throw new Error('DB not configured')
  await ensureSchema()
  const rows = await sql`INSERT INTO content_plan (topic, category, scheduled_for, keywords, word_count)
    VALUES (${topic}, ${category}, ${scheduled_for || null}, ${extra.keywords || ''}, ${extra.word_count ?? null}) RETURNING *`
  return map(rows[0])
}

export async function updatePlan(id: number, patch: Partial<Pick<PlanItem, 'topic' | 'category' | 'scheduled_for' | 'keywords' | 'word_count'>>): Promise<PlanItem | null> {
  const sql = getSql()
  if (!sql) throw new Error('DB not configured')
  await ensureSchema()
  const cur: any = (await sql`SELECT * FROM content_plan WHERE id = ${id} LIMIT 1`)[0]
  if (!cur) return null
  const topic: string = patch.topic ?? cur.topic
  const category: string = patch.category ?? cur.category
  const scheduled: string | null = (patch.scheduled_for !== undefined ? patch.scheduled_for : cur.scheduled_for) || null
  const keywords: string = patch.keywords ?? cur.keywords ?? ''
  const word_count: number | null = (patch.word_count !== undefined ? patch.word_count : cur.word_count) ?? null
  const rows = await sql`UPDATE content_plan SET
    topic = ${topic}, category = ${category}, scheduled_for = ${scheduled},
    keywords = ${keywords}, word_count = ${word_count}
    WHERE id = ${id} RETURNING *`
  return rows[0] ? map(rows[0]) : null
}

export async function getPlan(id: number): Promise<PlanItem | null> {
  const sql = getSql()
  if (!sql) return null
  await ensureSchema()
  const rows = await sql`SELECT * FROM content_plan WHERE id = ${id} LIMIT 1`
  return rows[0] ? map(rows[0]) : null
}

export async function deletePlan(id: number): Promise<void> {
  const sql = getSql()
  if (!sql) return
  await sql`DELETE FROM content_plan WHERE id = ${id}`
}

/** Najneskorší naplánovaný dátum medzi ešte nespracovanými položkami (pre bezkolízne plánovanie). */
export async function lastPendingDate(): Promise<Date | null> {
  const sql = getSql()
  if (!sql) return null
  await ensureSchema()
  const rows = await sql`SELECT max(scheduled_for) AS d FROM content_plan WHERE status = 'pending' AND scheduled_for IS NOT NULL`
  return rows[0]?.d ? new Date(rows[0].d) : null
}

export async function nextPending(): Promise<PlanItem | null> {
  const sql = getSql()
  if (!sql) return null
  await ensureSchema()
  const rows = await sql`SELECT * FROM content_plan WHERE status = 'pending'
    AND (scheduled_for IS NULL OR scheduled_for <= now())
    ORDER BY scheduled_for NULLS LAST, created_at LIMIT 1`
  return rows[0] ? map(rows[0]) : null
}

export async function markPlan(id: number, status: PlanItem['status'], articleId?: number): Promise<void> {
  const sql = getSql()
  if (!sql) return
  await sql`UPDATE content_plan SET status = ${status}, article_id = ${articleId || null} WHERE id = ${id}`
}
