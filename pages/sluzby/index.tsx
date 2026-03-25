import Head from 'next/head';
import Link from 'next/link';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

const services = [
  {
    slug: 'cold-email',
    title: 'Cold Email kampane',
    subtitle: 'B2B outreach na autopilote',
    description: 'Oslovíme správnych ľudí v správnom čase. Nastavíme kompletnú cold email infraštruktúru, napíšeme sekvencie a spravujeme kampane.',
    price: 'od 600 €',
    priceNote: 'mesačne',
    color: '#6366f1',
    icon: '✉️',
  },
  {
    slug: 'seo',
    title: 'SEO obsah & Link building',
    subtitle: 'Organická viditeľnosť, ktorá rastie',
    description: 'Komplexná SEO stratégia: analýza kľúčových slov, optimalizácia stránok, budovanie odkazov a pravidelný reporting.',
    price: 'od 400 €',
    priceNote: 'mesačne',
    color: '#06b6d4',
    icon: '📈',
  },
  {
    slug: 'texty-a-clanky',
    title: 'SEO texty & copywriting',
    subtitle: 'Obsah, ktorý predáva aj rankuje',
    description: 'Píšeme SEO články, texty na web, popisy produktov, kategórie pre e-shopy a pravidelný blog. Obsah optimalizovaný pre vyhľadávače aj zákazníkov.',
    price: 'od 30 €',
    priceNote: 'za text',
    color: '#10b981',
    icon: '✍️',
  },
  {
    slug: 'socialne-media',
    title: 'Sociálne médiá',
    subtitle: 'Komunita, ktorá kupuje',
    description: 'Správa Instagramu, Facebooku a LinkedInu. Tvorba obsahu, stories, reels, mesačný report a sledovanie trendov.',
    price: 'od 250 €',
    priceNote: 'mesačne',
    color: '#f59e0b',
    icon: '📱',
  },
  {
    slug: 'email-marketing',
    title: 'Email marketing',
    subtitle: 'Retenčný kanál s najvyšším ROI',
    description: 'Nastavíme a spravujeme email marketing: automatizácie, newslettery, segmentácia databázy a A/B testovanie.',
    price: 'od 300 €',
    priceNote: 'mesačne',
    color: '#a855f7',
    icon: '📧',
  },
  {
    slug: 'tvorba-webov',
    title: 'Tvorba webov & e-shopov',
    subtitle: 'Weby, ktoré konvertujú',
    description: 'Prezentačné weby, e-shopy na Shoptete aj WordPresse. Dizajn na mieru, rýchlosť, SEO a správa doménového ekosystému.',
    price: 'od 800 €',
    priceNote: 'jednorazovo',
    color: '#d4f53c',
    icon: '🌐',
  },
];

export default function SluzbyPage() {
  return (
    <>
      <Head>
        <title>Služby — Monetico digitálna agentúra</title>
        <meta name="description" content="Cold emailing, SEO, sociálne médiá, email marketing, tvorba webov a copywriting. Komplexný digitálny marketing pre vaše podnikanie." />
      </Head>
      <Nav />
      <main style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: 100 }}>
        {/* Hero */}
        <section style={{ padding: '80px 40px 0', maxWidth: 1400, margin: '0 auto' }}>
          <span style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 11,
            letterSpacing: '0.2em',
            color: '#d4f53c',
            textTransform: 'uppercase',
          }}>
            — Čo robíme
          </span>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(48px, 8vw, 120px)',
            color: '#fff',
            margin: '16px 0 24px',
            lineHeight: 0.9,
          }}>
            Naše<br />
            <span style={{ WebkitTextStroke: '2px #fff', color: 'transparent' }}>služby</span>
          </h1>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 18,
            color: '#666',
            maxWidth: 600,
            lineHeight: 1.6,
          }}>
            Od cold emailu až po kompletné weby. Jeden partner pre celý váš digitálny rast.
          </p>
        </section>

        {/* Services grid */}
        <section style={{ padding: '80px 40px 120px', maxWidth: 1400, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: 2,
          }}>
            {services.map((s) => (
              <Link key={s.slug} href={`/sluzby/${s.slug}/`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: '#111',
                    padding: '48px 40px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'background 0.2s',
                    height: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#161616'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#111'; }}
                >
                  {/* Color accent */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: s.color,
                  }} />

                  {/* Icon + arrow */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 32 }}>{s.icon}</span>
                    <span style={{ color: '#333', fontSize: 20 }}>↗</span>
                  </div>

                  <div>
                    <span style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: 10,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: s.color,
                    }}>
                      {s.subtitle}
                    </span>
                    <h3 style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 800,
                      fontSize: 28,
                      color: '#fff',
                      margin: '8px 0 0',
                      lineHeight: 1.1,
                    }}>
                      {s.title}
                    </h3>
                  </div>

                  <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 15,
                    color: '#666',
                    lineHeight: 1.7,
                    flex: 1,
                  }}>
                    {s.description}
                  </p>

                  <div style={{
                    borderTop: '1px solid #1a1a1a',
                    paddingTop: 20,
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 8,
                  }}>
                    <span style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 800,
                      fontSize: 28,
                      color: '#fff',
                    }}>
                      {s.price}
                    </span>
                    <span style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: 11,
                      color: '#444',
                    }}>
                      {s.priceNote}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
