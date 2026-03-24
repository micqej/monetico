import postsData from './posts-data.json'

export interface Post {
  id: string
  title: string
  slug: string
  url: string
  original_url: string
  date: string
  author: string
  categories: string[]
  tags: string[]
  content: string
  excerpt: string
  meta_title: string
  meta_desc: string
  meta_keywords: string
  og_title: string
  og_desc: string
  reading_time: number
}

const allPosts: Post[] = postsData as Post[]

export function getAllPosts(): Post[] {
  return allPosts
}

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find(p => p.slug === slug)
}

export function getAllSlugs(): string[] {
  return allPosts.map(p => p.slug)
}

export function getPostsByCategory(category: string): Post[] {
  return allPosts.filter(p => p.categories.includes(category))
}

export function getAllCategories(): { name: string; count: number }[] {
  const counts: Record<string, number> = {}
  for (const post of allPosts) {
    for (const cat of post.categories) {
      counts[cat] = (counts[cat] || 0) + 1
    }
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function getRecentPosts(n = 6): Post[] {
  return allPosts.slice(0, n)
}
