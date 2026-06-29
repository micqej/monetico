import postgres from 'postgres'

/**
 * Lazy Postgres connection (works with any provider — Supabase, Neon, Hetzner…).
 * Returns null when no connection string is configured, so the whole
 * admin/autopilot stack degrades gracefully and the public site keeps running
 * on the static JSON posts.
 */
type Sql = ReturnType<typeof postgres>
let _sql: Sql | null | undefined

export function getSql(): Sql | null {
  if (_sql !== undefined) return _sql
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED
  _sql = url
    ? postgres(url, { prepare: false, ssl: 'require', idle_timeout: 20, max: 3 })
    : null
  return _sql
}

export function dbReady(): boolean {
  return !!getSql()
}

let schemaEnsured = false

export async function ensureSchema(): Promise<boolean> {
  const sql = getSql()
  if (!sql) return false
  if (schemaEnsured) return true

  await sql`CREATE TABLE IF NOT EXISTS articles (
    id            SERIAL PRIMARY KEY,
    slug          TEXT UNIQUE NOT NULL,
    title         TEXT NOT NULL,
    content       TEXT NOT NULL DEFAULT '',
    excerpt       TEXT NOT NULL DEFAULT '',
    meta_title    TEXT NOT NULL DEFAULT '',
    meta_desc     TEXT NOT NULL DEFAULT '',
    meta_keywords TEXT NOT NULL DEFAULT '',
    og_title      TEXT NOT NULL DEFAULT '',
    og_desc       TEXT NOT NULL DEFAULT '',
    category      TEXT NOT NULL DEFAULT 'Marketing',
    tags          JSONB NOT NULL DEFAULT '[]',
    image_url     TEXT NOT NULL DEFAULT '',
    image_credit  TEXT NOT NULL DEFAULT '',
    author        TEXT NOT NULL DEFAULT 'Monetico',
    status        TEXT NOT NULL DEFAULT 'draft',
    publish_at    TIMESTAMPTZ,
    reading_time  INTEGER NOT NULL DEFAULT 3,
    source        TEXT NOT NULL DEFAULT 'manual',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
  )`

  await sql`CREATE TABLE IF NOT EXISTS content_plan (
    id            SERIAL PRIMARY KEY,
    topic         TEXT NOT NULL,
    category      TEXT NOT NULL DEFAULT 'Marketing',
    status        TEXT NOT NULL DEFAULT 'pending',
    scheduled_for TIMESTAMPTZ,
    article_id    INTEGER,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
  )`

  await sql`CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value JSONB NOT NULL
  )`

  await sql`CREATE TABLE IF NOT EXISTS subscribers (
    id         SERIAL PRIMARY KEY,
    email      TEXT UNIQUE NOT NULL,
    source     TEXT NOT NULL DEFAULT 'web',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`

  schemaEnsured = true
  return true
}
