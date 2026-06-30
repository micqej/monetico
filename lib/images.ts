export interface ImageResult {
  url: string
  thumb: string
  credit: string
  source: 'pexels' | 'pixabay'
}

import { resolveSecret } from './siteSettings'

async function searchPexels(query: string, count: number): Promise<ImageResult[]> {
  const key = await resolveSecret('pexels')
  if (!key) return []
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      { headers: { Authorization: key } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data.photos || []).map((p: any) => ({
      url: p.src?.large2x || p.src?.large || p.src?.original,
      thumb: p.src?.medium || p.src?.small,
      credit: `Foto: ${p.photographer} / Pexels`,
      source: 'pexels' as const,
    }))
  } catch {
    return []
  }
}

async function searchPixabay(query: string, count: number): Promise<ImageResult[]> {
  const key = await resolveSecret('pixabay')
  if (!key) return []
  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=${Math.max(3, count)}&safesearch=true`
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data.hits || []).slice(0, count).map((h: any) => ({
      url: h.largeImageURL || h.webformatURL,
      thumb: h.webformatURL || h.previewURL,
      credit: `Foto: ${h.user} / Pixabay`,
      source: 'pixabay' as const,
    }))
  } catch {
    return []
  }
}

export async function searchImages(
  query: string,
  source: 'pexels' | 'pixabay' | 'both' = 'both',
  count = 8
): Promise<ImageResult[]> {
  const tasks: Promise<ImageResult[]>[] = []
  if (source === 'pexels' || source === 'both') tasks.push(searchPexels(query, count))
  if (source === 'pixabay' || source === 'both') tasks.push(searchPixabay(query, count))
  const results = (await Promise.all(tasks)).flat()
  // interleave so both sources show up
  return results.slice(0, count)
}

export async function firstImage(
  query: string,
  source: 'pexels' | 'pixabay' | 'both' = 'both'
): Promise<ImageResult | null> {
  const imgs = await searchImages(query, source, 3)
  return imgs[0] || null
}
