import Head from 'next/head'
import { useRouter } from 'next/router'
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, ORGANIZATION_SCHEMA, SITE_NAME, SITE_URL } from '../lib/site'

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogTitle?: string
  ogDesc?: string
  keywords?: string
  noindex?: boolean
  image?: string
  type?: 'website' | 'article'
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogTitle,
  ogDesc,
  keywords,
  noindex = false,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
}: SEOProps) {
  const router = useRouter()
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Digitálna agentúra`
  const path = router.asPath ? router.asPath.split('?')[0] : '/'
  const resolvedCanonical = canonical || `${SITE_URL}${path === '/' ? '/' : path}`
  const robots = noindex ? 'noindex, nofollow' : 'index, follow'
  const pageSchema =
    type === 'article'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: ogTitle || fullTitle,
          description,
          image,
          mainEntityOfPage: resolvedCanonical,
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/icon.svg`,
            },
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: ogTitle || fullTitle,
          description,
          url: resolvedCanonical,
        }

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="theme-color" content="#0a0a0a" />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical */}
      <link rel="canonical" href={resolvedCanonical} />

      {/* OG */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDesc || description} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:locale" content="sk_SK" />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={ogTitle || fullTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDesc || description} />
      <meta name="twitter:image" content={image} />

      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
    </Head>
  )
}
