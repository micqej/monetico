import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogTitle?: string
  ogDesc?: string
  keywords?: string
  noindex?: boolean
}

const SITE_NAME = 'Monetico'
const SITE_URL = 'https://www.monetico.sk'
const DEFAULT_DESC = 'Digitálna agentúra pre rastúce firmy. Cold email, SEO, sociálne médiá, email marketing, tvorba webov a e-shopov na Slovensku.'

export default function SEO({
  title,
  description = DEFAULT_DESC,
  canonical,
  ogTitle,
  ogDesc,
  keywords,
  noindex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Digitálna agentúra`

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* OG */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDesc || description} />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDesc || description} />

      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}
