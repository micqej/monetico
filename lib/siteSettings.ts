import { getSql, ensureSchema } from './db'

export interface SiteSettings {
  // tracking
  gaId: string            // GA4 measurement id, napr. G-XXXXXXX
  metaPixelId: string     // Meta (Facebook) Pixel id
  gtmId: string           // Google Tag Manager id, GTM-XXXX
  headHtml: string        // ľubovoľný HTML/script do <head> (napr. SiteBehaviour)
  // comments
  commentsEnabled: boolean
  commentsModeration: boolean   // true = komentáre čakajú na schválenie
  recaptchaSiteKey: string
  recaptchaSecret: string
  // API keys (spravované z adminu; fallback na Vercel env)
  openaiKey: string
  pexelsKey: string
  pixabayKey: string
  // Webhook na napojenie newslettera na CRM
  webhookUrl: string
  webhookSecret: string
}

const SITEBEHAVIOUR_DEFAULT = `<script type="text/javascript">
(function(){try{if(window.location&&window.location.search&&window.location.search.indexOf('capture-sitebehaviour-heatmap')!==-1){sessionStorage.setItem('capture-sitebehaviour-heatmap','_');}var sbSiteSecret='b19b20f7-221b-410e-8774-01811b4a3f6b';window.sitebehaviourTrackingSecret=sbSiteSecret;var s=document.createElement('script');s.defer=true;s.id='site-behaviour-script-v2';s.src='https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret='+sbSiteSecret;document.head.appendChild(s);}catch(e){console.error(e)}})();
</script>`

export const DEFAULT_SITE: SiteSettings = {
  gaId: '', metaPixelId: '', gtmId: '', headHtml: SITEBEHAVIOUR_DEFAULT,
  commentsEnabled: true, commentsModeration: true, recaptchaSiteKey: '', recaptchaSecret: '',
  openaiKey: '', pexelsKey: '', pixabayKey: '',
  webhookUrl: '', webhookSecret: '',
}

const KEY = 'site'

export async function getSiteSettings(): Promise<SiteSettings> {
  const sql = getSql()
  if (!sql) return DEFAULT_SITE
  try {
    await ensureSchema()
    const rows = await sql`SELECT value FROM settings WHERE key = ${KEY} LIMIT 1`
    if (!rows[0]) return DEFAULT_SITE
    const v: any = rows[0].value
    const obj = typeof v === 'string' ? JSON.parse(v) : v
    return { ...DEFAULT_SITE, ...obj }
  } catch {
    return DEFAULT_SITE
  }
}

export async function saveSiteSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const sql = getSql()
  if (!sql) throw new Error('DB nie je nastavená')
  await ensureSchema()
  const next = { ...(await getSiteSettings()), ...patch }
  await sql`INSERT INTO settings (key, value) VALUES (${KEY}, ${sql.json(next as any)})
    ON CONFLICT (key) DO UPDATE SET value = ${sql.json(next as any)}`
  return next
}

/** Public (browser-safe) subset — žiadne tajné kľúče. */
export async function publicSite() {
  const s = await getSiteSettings()
  return {
    gaId: s.gaId, metaPixelId: s.metaPixelId, gtmId: s.gtmId, headHtml: s.headHtml,
    commentsEnabled: s.commentsEnabled, recaptchaSiteKey: s.recaptchaSiteKey,
  }
}

/** Tajný kľúč: najprv z DB (admin), inak z Vercel env. */
export async function resolveSecret(name: 'openai' | 'pexels' | 'pixabay'): Promise<string> {
  const s = await getSiteSettings()
  const db = name === 'openai' ? s.openaiKey : name === 'pexels' ? s.pexelsKey : s.pixabayKey
  const env = name === 'openai' ? process.env.OPENAI_API_KEY : name === 'pexels' ? process.env.PEXELS_API_KEY : process.env.PIXABAY_API_KEY
  return (db && db.trim()) || env || ''
}
