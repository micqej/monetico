import type { GetServerSideProps } from 'next'
import { getAllPosts } from '../lib/posts'
import { SITE_URL } from '../lib/site'

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/sluzby/', priority: '0.9', changefreq: 'weekly' },
  { path: '/blog/', priority: '0.9', changefreq: 'daily' },
  { path: '/kontakt/', priority: '0.8', changefreq: 'monthly' },
  { path: '/ochrana-osobnych-udajov/', priority: '0.4', changefreq: 'yearly' },
  { path: '/obchodne-podmienky/', priority: '0.4', changefreq: 'yearly' },
  { path: '/gdpr/', priority: '0.3', changefreq: 'yearly' },
]

const serviceSlugs = [
  'cold-email',
  'seo',
  'texty-a-clanky',
  'socialne-media',
  'email-marketing',
  'tvorba-webov',
]

function SitemapXml() {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = getAllPosts()

  const urls = [
    ...staticPages.map(
      ({ path, priority, changefreq }) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    ),
    ...serviceSlugs.map(
      (slug) => `
  <url>
    <loc>${SITE_URL}/sluzby/${slug}/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
    ...posts.map(
      (post) => `
  <url>
    <loc>${SITE_URL}/${post.slug}/</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    ),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.write(xml)
  res.end()

  return { props: {} }
}

export default SitemapXml
