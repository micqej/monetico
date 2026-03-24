import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

export default function Custom404() {
  return (
    <>
      <SEO title="404 — Stránka nenájdená" noindex />
      <Nav />
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '140px 48px 80px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(100px,20vw,220px)', lineHeight: '1', letterSpacing: '-8px', color: 'transparent', WebkitTextStroke: '1px rgba(244,240,232,0.1)', marginBottom: '20px' }}>
          404
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(32px,5vw,64px)', letterSpacing: '-2px', marginBottom: '16px' }}>
          Stránka nenájdená
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16px', marginBottom: '40px', maxWidth: '400px', lineHeight: '1.7' }}>
          Táto stránka neexistuje alebo bola presunutá. Skúste sa vrátiť na hlavnú stránku.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/" className="btn-primary">← Späť na hlavnú</Link>
          <Link href="/blog/" className="btn-ghost">Čítať blog</Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
