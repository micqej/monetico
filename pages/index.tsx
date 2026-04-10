import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'
import SEO from '../components/SEO'
import { ArrowUpRightIcon, ServiceIcon, SparkIcon, type ServiceIconName } from '../components/Icons'
import { getAllPosts, getAllCategories, Post } from '../lib/posts'
import { SITE_URL } from '../lib/site'

interface Props {
  recentPosts: Post[]
  categories: { name: string; count: number }[]
}

export default function Home({ recentPosts, categories }: Props) {
  return (
    <>
      <SEO
        canonical={`${SITE_URL}/`}
        description="Digitálna agentúra pre rastúce slovenské firmy. Cold email kampane, SEO, sociálne médiá, email marketing a tvorba webov na WordPress a Shoptet."
      />
      <Nav />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-noise" />
        <div className="hero-tag">— Digitálna agentúra pre rastúce firmy</div>
        <h1 className="hero-headline">
          RAST<br />
          <span className="outline">ONLINE.</span><br />
          <span className="acid">TERAZ.</span>
        </h1>
        <div className="hero-bottom">
          <p className="hero-desc">
            Pomáhame slovenským firmám rásť cez cold email, SEO, sociálne médiá a profesionálne weby na mieru. Výsledky, nie sľuby.
          </p>
          <div className="hero-cta">
            <Link href="/kontakt/" className="btn-primary">Nezáväzná konzultácia</Link>
            <Link href="/blog/" className="btn-ghost">Čítať blog</Link>
          </div>
          <div className="scroll-hint">
            <span>Scroll</span>
            <div className="scroll-line" />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {['Cold Email', 'SEO Optimalizácia', 'Sociálne Médiá', 'Email Marketing', 'Tvorba Webov', 'Shoptet E-shopy', 'WordPress', 'Cold Email', 'SEO Optimalizácia', 'Sociálne Médiá', 'Email Marketing', 'Tvorba Webov', 'Shoptet E-shopy', 'WordPress'].map((item, i) => (
            <div key={i} className="marquee-item">
              <em><SparkIcon size={14} /></em> {item}
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="section" id="sluzby">
        <div className="section-label">Čo robíme</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(44px,6vw,90px)', letterSpacing: '-3px', lineHeight: '0.9', marginBottom: '72px' }}>NAŠE<br />SLUŽBY</h2>

        <div className="services-grid">
          {[
            { num: '01', icon: 'mail' as ServiceIconName, title: 'Cold Email Kampane', desc: 'Oslovíme tisíce potenciálnych zákazníkov s personalizovanými emailmi. Reálne dohodnuté stretnutia, nie otvárateľnosť.' },
            { num: '02', icon: 'seo' as ServiceIconName, title: 'SEO & Obsah', desc: 'Organická návštevnosť, ktorá predáva. Technické SEO, linkbuilding a obsah optimalizovaný pre slovenský trh.' },
            { num: '03', icon: 'social' as ServiceIconName, title: 'Sociálne Médiá', desc: 'Správa FB, Instagram, LinkedIn. Obsah, ktorý baví, buduje značku a konvertuje sledovateľov na zákazníkov.' },
            { num: '04', icon: 'email' as ServiceIconName, title: 'Email Marketing', desc: 'Automatizované sekvencie, newslettery a retenčné kampane. Priemer 42€ ROI na každé 1€ investície.' },
            { num: '05', icon: 'web' as ServiceIconName, title: 'Tvorba Webov', desc: 'WordPress weby a Shoptet e-shopy na mieru. Rýchle, moderné, konverzné. Od dizajnu po spustenie.' },
            { num: '06', icon: 'copy' as ServiceIconName, title: 'Komplexný Growth', desc: 'Pre firmy, ktoré chcú systematický rast. Kombinujeme všetky kanály do jednej stratégie šitej na mieru.' },
          ].map(s => (
            <div key={s.num} className="service-card">
              <div className="service-num">{s.num}</div>
              <span className="service-icon"><ServiceIcon name={s.icon} size={28} /></span>
              <div className="service-title">{s.title}</div>
              <p className="service-desc">{s.desc}</p>
              <span className="service-arrow"><ArrowUpRightIcon size={16} /></span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div className="stats-grid">
        {[
          { num: '120', suffix: '+', label: 'Projektov\ndokončených' },
          { num: '42', suffix: '×', label: 'ROI email\nmarketing' },
          { num: '8k', suffix: '', label: 'Cold emailov\nmesačne' },
          { num: '97', suffix: '%', label: 'Spokojnosť\nklientov' },
        ].map(s => (
          <div key={s.num} className="stat-box">
            <div className="stat-num">{s.num}<span>{s.suffix}</span></div>
            <div className="stat-label" style={{ whiteSpace: 'pre-line' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* PROCESS */}
      <section className="section">
        <div className="section-label">Ako pracujeme</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(44px,6vw,90px)', letterSpacing: '-3px', lineHeight: '0.9', marginBottom: '64px' }}>PROCES</h2>
        <div>
          {[
            { n: '01', title: 'Audit & Stratégia', tag: 'Týždeň 1–2' },
            { n: '02', title: 'Príprava & Produkcia', tag: 'Týždeň 2–4' },
            { n: '03', title: 'Spustenie Kampaní', tag: 'Mesiac 2' },
            { n: '04', title: 'Optimalizácia & Škálovanie', tag: 'Priebežne' },
          ].map(p => (
            <div key={p.n} className="process-item">
              <div className="process-step">{p.n}</div>
              <div className="process-title">{p.title}</div>
              <div className="process-tag">{p.tag}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT POSTS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-label">Z blogu</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(44px,5vw,72px)', letterSpacing: '-3px', lineHeight: '0.9', marginBottom: '64px' }}>NAJNOVŠIE<br />ČLÁNKY</h2>
        <div className="posts-grid">
          {recentPosts.slice(0, 1).map(p => <PostCard key={p.id} post={p} featured />)}
          {recentPosts.slice(1, 4).map(p => <PostCard key={p.id} post={p} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/blog/" className="btn-primary">Všetky články →</Link>
        </div>
      </section>

      {/* NEWSLETTER */}
      <div className="newsletter">
        <div>
          <div className="section-label">Newsletter</div>
          <h2 className="newsletter-title">Tipy pre rast<br />každý <span>týždeň.</span></h2>
        </div>
        <div>
          <p style={{ color: 'var(--muted)', marginBottom: '22px', lineHeight: '1.7' }}>Žiadny spam. Len overené stratégie z praxe, ktoré fungujú pre slovenské firmy.</p>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input className="newsletter-input" type="email" placeholder="váš@email.sk" required />
            <button type="submit" className="newsletter-submit">Prihlásiť sa →</button>
          </form>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-strip">
        <h2 className="cta-headline">Chcete rásť<br />online?</h2>
        <Link href="/kontakt/" className="cta-btn">Dohodnúť konzultáciu →</Link>
      </div>

      <Footer />
    </>
  )
}

export async function getStaticProps() {
  const allPosts = getAllPosts()
  const categories = getAllCategories()
  return {
    props: {
      recentPosts: allPosts.slice(0, 7),
      categories,
    },
  }
}
