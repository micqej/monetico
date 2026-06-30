import { getSql, ensureSchema } from './db'

export interface Comment {
  id: number
  slug: string
  author: string
  email: string
  body: string
  status: 'pending' | 'approved' | 'spam'
  ip: string
  created_at: string
}

function map(r: any): Comment {
  return { ...r, created_at: r.created_at ? new Date(r.created_at).toISOString() : '' }
}

/** Verejné: schválené komentáre k článku. */
export async function approvedComments(slug: string): Promise<Comment[]> {
  const sql = getSql()
  if (!sql) return []
  try {
    await ensureSchema()
    // NIKDY nevracaj email/ip do verejného API (únik osobných údajov)
    const rows = await sql`SELECT id, slug, author, body, status, created_at FROM comments WHERE slug = ${slug} AND status = 'approved' ORDER BY created_at ASC`
    return rows.map(r => ({ ...r, email: '', ip: '' }))
  } catch { return [] }
}

/** Admin: všetky (alebo podľa stavu). */
export async function listComments(status?: string): Promise<Comment[]> {
  const sql = getSql()
  if (!sql) return []
  await ensureSchema()
  const rows = status
    ? await sql`SELECT * FROM comments WHERE status = ${status} ORDER BY created_at DESC`
    : await sql`SELECT * FROM comments ORDER BY created_at DESC`
  return rows.map(map)
}

export async function addComment(c: { slug: string; author: string; email: string; body: string; ip: string; status: string }): Promise<Comment> {
  const sql = getSql()
  if (!sql) throw new Error('DB nie je nastavená')
  await ensureSchema()
  const rows = await sql`INSERT INTO comments (slug, author, email, body, ip, status)
    VALUES (${c.slug}, ${c.author}, ${c.email}, ${c.body}, ${c.ip}, ${c.status}) RETURNING *`
  return map(rows[0])
}

export async function updateComment(id: number, patch: { status?: string; body?: string }): Promise<void> {
  const sql = getSql()
  if (!sql) return
  if (patch.status !== undefined) await sql`UPDATE comments SET status = ${patch.status} WHERE id = ${id}`
  if (patch.body !== undefined) await sql`UPDATE comments SET body = ${patch.body} WHERE id = ${id}`
}

export async function deleteComment(id: number): Promise<void> {
  const sql = getSql()
  if (!sql) return
  await sql`DELETE FROM comments WHERE id = ${id}`
}

export async function commentCounts(): Promise<{ pending: number; approved: number; spam: number }> {
  const sql = getSql()
  if (!sql) return { pending: 0, approved: 0, spam: 0 }
  try {
    await ensureSchema()
    const rows = await sql`SELECT status, COUNT(*)::int AS n FROM comments GROUP BY status`
    const out: any = { pending: 0, approved: 0, spam: 0 }
    rows.forEach((r: any) => { out[r.status] = r.n })
    return out
  } catch { return { pending: 0, approved: 0, spam: 0 } }
}
