import { getSql, ensureSchema } from './db'

export interface Message {
  id: number
  name: string
  email: string
  phone: string
  services: string[]
  message: string
  status: 'new' | 'read'
  created_at: string
}

function map(r: any): Message {
  return {
    ...r,
    services: Array.isArray(r.services) ? r.services : [],
    created_at: r.created_at ? new Date(r.created_at).toISOString() : '',
  }
}

export async function addMessage(m: {
  name?: string; email?: string; phone?: string; services?: string[]; message?: string; ip?: string
}): Promise<Message> {
  const sql = getSql()
  if (!sql) throw new Error('DB not configured')
  await ensureSchema()
  const rows = await sql`INSERT INTO messages (name, email, phone, services, message, ip)
    VALUES (${m.name || ''}, ${m.email || ''}, ${m.phone || ''}, ${sql.json((m.services || []) as any)},
            ${m.message || ''}, ${m.ip || ''})
    RETURNING *`
  return map(rows[0])
}

export async function listMessages(): Promise<Message[]> {
  const sql = getSql()
  if (!sql) return []
  await ensureSchema()
  const rows = await sql`SELECT * FROM messages ORDER BY created_at DESC`
  return rows.map(map)
}

export async function unreadMessages(): Promise<number> {
  const sql = getSql()
  if (!sql) return 0
  try {
    await ensureSchema()
    const r = await sql`SELECT count(*)::int AS c FROM messages WHERE status = 'new'`
    return r[0]?.c || 0
  } catch { return 0 }
}

export async function setMessageStatus(id: number, status: 'new' | 'read'): Promise<void> {
  const sql = getSql()
  if (!sql) return
  await sql`UPDATE messages SET status = ${status} WHERE id = ${id}`
}

export async function deleteMessage(id: number): Promise<void> {
  const sql = getSql()
  if (!sql) return
  await sql`DELETE FROM messages WHERE id = ${id}`
}
