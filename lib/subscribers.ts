import { getSql, ensureSchema } from './db'

/** Vráti { created } — true len ak išlo o NOVÉHO odberateľa (nie duplicitný email). */
export async function addSubscriber(email: string, source = 'web'): Promise<{ created: boolean; email: string }> {
  const clean = email.trim().toLowerCase()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) throw new Error('invalid email')
  const sql = getSql()
  if (!sql) return { created: false, email: clean }
  await ensureSchema()
  const rows = await sql`INSERT INTO subscribers (email, source) VALUES (${clean}, ${source})
    ON CONFLICT (email) DO NOTHING RETURNING id`
  return { created: rows.length > 0, email: clean }
}

export async function listSubscribers(): Promise<{ id: number; email: string; source: string; created_at: string }[]> {
  const sql = getSql()
  if (!sql) return []
  await ensureSchema()
  const rows = await sql`SELECT id, email, source, created_at FROM subscribers ORDER BY created_at DESC`
  return rows.map(r => ({ ...r, created_at: new Date(r.created_at).toISOString() })) as any
}

export async function subscribersCsv(): Promise<string> {
  const subs = await listSubscribers()
  const head = 'email,source,created_at'
  const body = subs.map(s => `${s.email},${s.source},${s.created_at}`).join('\n')
  return `${head}\n${body}\n`
}
