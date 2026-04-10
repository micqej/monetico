import type { GetServerSideProps } from 'next'
import { SITE_URL } from '../lib/site'

function RobotsTxt() {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const content = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

  res.setHeader('Content-Type', 'text/plain')
  res.write(content)
  res.end()

  return { props: {} }
}

export default RobotsTxt
