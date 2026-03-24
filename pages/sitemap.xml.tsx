import { GetServerSideProps } from 'next'
import { getAllPosts } from '../lib/posts'

const SITE_URL = 'https://www.monetico.sk'

function generateSitemap(posts: { slug: string; date: string }[]) {
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/blog/', priority: '0.9', changefreq: 'daily' },
    { url: '/kontakt/', priority: '0.7', changefreq: 'monthly' },
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(p => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
${posts.map(p => `  <url>
    <loc>${SITE_URL}/${p.slug}/</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`
}

function Sitemap() { return null }
export default Sitemap

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = getAllPosts().map(p => ({ slug: p.slug, date: p.date }))
  const sitemap = generateSitemap(posts)

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(sitemap)
  res.end()

  return { props: {} }
}
