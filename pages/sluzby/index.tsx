import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'

const services = [
  { slug: 'cold-email', icon: '✉', title: 'Cold Email Kampane', short: 'Oslovíme tisíce B2B firiem priamo do inboxu rozhodovateľov.', from: '100 € / mes.', tag: 'B2B Outreach' },
  { slug: 'seo', icon: '◎', title: 'SEO & Linkbuilding', short: 'Organická návštevnosť bez platených reklám. Dlhodobo a spoľahlivo.', from: '200 € / mes.', tag: 'Organický rast' },
  { slug: 'socialne-media', icon: '◈', title: 'Sociálne Médiá', short: 'Správa FB, Instagram, LinkedIn. Obsah, komunita a rast značky.', from: '200 € / mes.', tag: 'Brand Building' },
  { slug: 'email-marketing', icon: '⊛', title: 'Email Marketing', short: 'Automatizované kampane a newslettery pre e-shopy a weby.', from: '70 € / mes.', tag: 'Retencia' },
  { slug: 'tvorba-webov', icon: '⬡', title: 'Tvorba Webov & E-shopov', short: 'WordPress a Shoptet riešenia šité na mieru. Od dizajnu po spustenie.', from: 'Individuálne', tag: 'Web & E-commerce' },
  { slug: 'reklama', icon: '◬', title: 'Google & Facebook Ads', short: 'Platené kampane s jasným ROI. Search, Display, Shopping, Meta.', from: '150 € / mes.', tag: 'PPC Reklama' },
]

export default function Sluzby() {
  return (
    <>
      <SEO
        title="Služby"
        description="Cold email, SEO, sociálne médiá, email marketing, tvorba webov a PPC reklamy. Digitálne služby pre rastúce slovenské firmy."
        canonical="https://www.monetico.sk/sluzby/"
      />
      <Nav />

      <section style={{ padding: '140px 48px 80px' }}>
        <div className="section-label">Čo robíme</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(60px,9vw,130px)', letterSpacing: '-5px', lineHeight: '0.88', marginBottom: '80px' }}>
          NAŠE<br /><span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(244,240,232,0.2)' }}>SLUŽBY</span>
        </h1>

        <div className="services-grid">
          {services.map((s, i) => (
            <Link href={`/sluzby/${s.slug}/`} key={s.slug} style={{ textDecoration: 'none' }}>
              <div className="service-card" style={{ cursor: 'pointer', height: '100%' }}>
                <div className="service-num">0{i + 1}</div>
                <span className="service-icon">{s.icon}</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--acid)', marginBottom: '10px' }}>{s.tag}</div>
                <div className="service-title">{s.title}</div>
                <p className="service-desc">{s.short}</p>
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--acid)' }}>{s.from}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px' }}>DETAIL →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="cta-strip">
        <h2 className="cta-headline">Nie ste si istí?<br />Poradíme.</h2>
        <Link href="/kontakt/" className="cta-btn">Nezáväzná konzultácia →</Link>
      </div>

      <Footer />
    </>
  )
}
