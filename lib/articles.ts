import { getSql, ensureSchema } from './db'
import type { Post } from './posts'

export interface Article {
  id: number
  slug: string
  title: string
  content: string
  excerpt: string
  meta_title: string
  meta_desc: string
  meta_keywords: string
  og_title: string
  og_desc: string
  category: string
  tags: string[]
  image_url: string
  image_credit: string
  author: string
  status: 'draft' | 'scheduled' | 'published'
  publish_at: string | null
  reading_time: number
  source: string
  created_at: string
  updated_at: string
}

const DIA: Record<string, string> = {
  á: 'a', ä: 'a', č: 'c', ď: 'd', é: 'e', í: 'i', ĺ: 'l', ľ: 'l', ň: 'n',
  ó: 'o', ô: 'o', ŕ: 'r', š: 's', ť: 't', ú: 'u', ý: 'y', ž: 'z',
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[áäčďéíĺľňóôŕšťúýž]/g, c => DIA[c] || c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}

export function readingTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  const sql = getSql()
  if (!sql) return base
  let slug = base || 'clanok'
  let n = 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rows = excludeId
      ? await sql`SELECT id FROM articles WHERE slug = ${slug} AND id <> ${excludeId} LIMIT 1`
      : await sql`SELECT id FROM articles WHERE slug = ${slug} LIMIT 1`
    if (rows.length === 0) return slug
    n += 1
    slug = `${base}-${n}`
  }
}

function rowToArticle(r: any): Article {
  return {
    ...r,
    tags: Array.isArray(r.tags) ? r.tags : [],
    publish_at: r.publish_at ? new Date(r.publish_at).toISOString() : null,
    created_at: r.created_at ? new Date(r.created_at).toISOString() : '',
    updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : '',
  }
}

export async function listArticles(status?: string): Promise<Article[]> {
  const sql = getSql()
  if (!sql) return []
  await ensureSchema()
  const rows = status
    ? await sql`SELECT * FROM articles WHERE status = ${status} ORDER BY COALESCE(publish_at, created_at) DESC`
    : await sql`SELECT * FROM articles ORDER BY COALESCE(publish_at, created_at) DESC`
  return rows.map(rowToArticle)
}

export async function getArticle(id: number): Promise<Article | null> {
  const sql = getSql()
  if (!sql) return null
  await ensureSchema()
  const rows = await sql`SELECT * FROM articles WHERE id = ${id} LIMIT 1`
  return rows[0] ? rowToArticle(rows[0]) : null
}

export async function createArticle(a: Partial<Article>): Promise<Article> {
  const sql = getSql()
  if (!sql) throw new Error('DB not configured')
  await ensureSchema()
  const base = slugify(a.slug || a.title || 'clanok')
  const slug = await uniqueSlug(base)
  const tags = a.tags || []
  const rows = await sql`INSERT INTO articles
    (slug, title, content, excerpt, meta_title, meta_desc, meta_keywords, og_title, og_desc,
     category, tags, image_url, image_credit, author, status, publish_at, reading_time, source)
    VALUES (${slug}, ${a.title || ''}, ${a.content || ''}, ${a.excerpt || ''},
     ${a.meta_title || a.title || ''}, ${a.meta_desc || ''}, ${a.meta_keywords || ''},
     ${a.og_title || a.title || ''}, ${a.og_desc || a.meta_desc || ''},
     ${a.category || 'Marketing'}, ${sql.json(tags as any)}, ${a.image_url || ''}, ${a.image_credit || ''},
     ${a.author || 'Monetico'}, ${a.status || 'draft'}, ${a.publish_at || null},
     ${a.reading_time || readingTime(a.content || '')}, ${a.source || 'manual'})
    RETURNING *`
  return rowToArticle(rows[0])
}

export async function updateArticle(id: number, a: Partial<Article>): Promise<Article | null> {
  const sql = getSql()
  if (!sql) throw new Error('DB not configured')
  await ensureSchema()
  const current = await getArticle(id)
  if (!current) return null
  const slug = a.slug && a.slug !== current.slug
    ? await uniqueSlug(slugify(a.slug), id)
    : current.slug
  const merged = { ...current, ...a, slug }
  const tags = merged.tags || []
  const rows = await sql`UPDATE articles SET
    slug = ${merged.slug}, title = ${merged.title}, content = ${merged.content},
    excerpt = ${merged.excerpt}, meta_title = ${merged.meta_title}, meta_desc = ${merged.meta_desc},
    meta_keywords = ${merged.meta_keywords}, og_title = ${merged.og_title}, og_desc = ${merged.og_desc},
    category = ${merged.category}, tags = ${sql.json(tags as any)}, image_url = ${merged.image_url},
    image_credit = ${merged.image_credit}, author = ${merged.author}, status = ${merged.status},
    publish_at = ${merged.publish_at}, reading_time = ${merged.reading_time}, updated_at = now()
    WHERE id = ${id} RETURNING *`
  return rows[0] ? rowToArticle(rows[0]) : null
}

export async function deleteArticle(id: number): Promise<void> {
  const sql = getSql()
  if (!sql) return
  await sql`DELETE FROM articles WHERE id = ${id}`
}

/** Move scheduled articles whose time has come to published. Returns count published. */
export async function publishDue(): Promise<number> {
  const sql = getSql()
  if (!sql) return 0
  await ensureSchema()
  const rows = await sql`UPDATE articles SET status = 'published', updated_at = now()
    WHERE status = 'scheduled' AND publish_at IS NOT NULL AND publish_at <= now() RETURNING id`
  return rows.length
}

function articleToPost(a: Article): Post {
  return {
    id: `db-${a.id}`,
    title: a.title,
    slug: a.slug,
    url: `/${a.slug}/`,
    original_url: '',
    date: (a.publish_at || a.created_at || '').slice(0, 10),
    author: a.author,
    categories: a.category ? [a.category] : [],
    tags: a.tags || [],
    content: a.content,
    excerpt: a.excerpt,
    meta_title: a.meta_title,
    meta_desc: a.meta_desc,
    meta_keywords: a.meta_keywords,
    og_title: a.og_title,
    og_desc: a.og_desc,
    reading_time: a.reading_time,
  }
}

/** Published DB articles mapped to the public Post shape (for the blog). */
export async function getPublishedPosts(): Promise<Post[]> {
  const sql = getSql()
  if (!sql) return []
  try {
    await ensureSchema()
    const rows = await sql`SELECT * FROM articles
      WHERE status = 'published' AND (publish_at IS NULL OR publish_at <= now())
      ORDER BY COALESCE(publish_at, created_at) DESC`
    return rows.map(rowToArticle).map(articleToPost)
  } catch {
    return []
  }
}
