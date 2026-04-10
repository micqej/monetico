export const SITE_NAME = 'Monetico'
export const SITE_URL = 'https://novinky.monetico.sk'
export const DEFAULT_DESCRIPTION =
  'Digitálna agentúra pre rastúce firmy. Cold email, SEO, sociálne médiá, email marketing, tvorba webov a e-shopov na Slovensku.'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  email: 'info@monetico.sk',
  telephone: '+421908804366',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Sokolovská 178/10',
    postalCode: '040 11',
    addressLocality: 'Košice',
    addressCountry: 'SK',
  },
}
