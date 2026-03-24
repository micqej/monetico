import { GetServerSideProps } from 'next'

function Robots() { return null }
export default Robots

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/plain')
  res.write(`User-agent: *
Allow: /

Sitemap: https://www.monetico.sk/sitemap.xml`)
  res.end()
  return { props: {} }
}
