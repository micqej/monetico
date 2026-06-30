import { getAllPosts } from './posts'
import { getPublishedPosts } from './articles'

export interface LinkCandidate { title: string; slug: string }

/**
 * Kandidáti na interné prelinkovanie: existujúce DB články + pôvodné statické,
 * prednostne z rovnakej kategórie (relevantnejšie), inak doplnené ostatnými.
 */
export async function linkPool(category?: string, excludeSlug?: string, limit = 20): Promise<LinkCandidate[]> {
  let pool = getAllPosts().map(p => ({ title: p.title, slug: p.slug, cat: p.categories[0] || '' }))
  try {
    const db = await getPublishedPosts()
    pool = [...db.map(p => ({ title: p.title, slug: p.slug, cat: p.categories[0] || '' })), ...pool]
  } catch { /* DB off — staticke staci */ }
  // dedup podľa slugu + vynechaj aktuálny
  const seen = new Set<string>()
  pool = pool.filter(p => p.slug && p.slug !== excludeSlug && !seen.has(p.slug) && seen.add(p.slug))
  const same = category ? pool.filter(p => p.cat === category) : []
  const rest = pool.filter(p => !same.includes(p))
  return [...same, ...rest].slice(0, limit).map(({ title, slug }) => ({ title, slug }))
}

/** Vloží fotky priamo do tela článku — prvú hneď po úvodnom odseku, ďalšie nižšie. */
export function embedImages(html: string, imgs: { url: string; credit: string }[]): string {
  if (!imgs.length) return html
  const parts = html.split('</p>')
  if (parts.length < 2) return html
  // prvá fotka hneď za 1. odsekom (viditeľná), ďalšie rozložené nižšie
  const slots = [1, 3, 5]
  imgs.slice(0, slots.length).forEach((im, i) => {
    const at = slots[i]
    if (parts[at] !== undefined) {
      // join() vloží </p> pred tento segment, takže figure príde hneď za odsek
      parts[at] = `<figure class="wp-block-image"><img src="${im.url}" alt="" loading="lazy" />` +
        (im.credit ? `<figcaption>${im.credit}</figcaption>` : '') + '</figure>' + parts[at]
    }
  })
  return parts.join('</p>')
}
