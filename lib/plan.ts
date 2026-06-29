import { getSql, ensureSchema } from './db'

export interface PlanItem {
  id: number
  topic: string
  category: string
  status: 'pending' | 'generated' | 'done' | 'error'
  scheduled_for: string | null
  article_id: number | null
  created_at: string
}

function map(r: any): PlanItem {
  return {
    ...r,
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

export async function addPlan(topic: string, category: string, scheduled_for?: string | null): Promise<PlanItem> {
  const sql = getSql()
  if (!sql) throw new Error('DB not configured')
  await ensureSchema()
  const rows = await sql`INSERT INTO content_plan (topic, category, scheduled_for)
    VALUES (${topic}, ${category}, ${scheduled_for || null}) RETURNING *`
  return map(rows[0])
}

export async function deletePlan(id: number): Promise<void> {
  const sql = getSql()
  if (!sql) return
  await sql`DELETE FROM content_plan WHERE id = ${id}`
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
