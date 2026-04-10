import Link from 'next/link';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { ArrowUpRightIcon, ServiceIcon, type ServiceIconName } from '../../components/Icons';
import { SITE_URL } from '../../lib/site';

const services = [
  {
    slug: 'cold-email',
    title: 'Cold Email kampane',
    subtitle: 'B2B outreach na autopilote',
    description: 'Oslovíme správnych ľudí v správnom čase. Nastavíme kompletnú cold email infraštruktúru, napíšeme sekvencie a spravujeme kampane.',
    price: 'od 600 €',
    priceNote: 'mesačne',
    color: '#7c9cff',
    icon: 'mail' as ServiceIconName,
  },
  {
    slug: 'seo',
    title: 'SEO obsah & Link building',
    subtitle: 'Organická viditeľnosť, ktorá rastie',
    description: 'Komplexná SEO stratégia: analýza kľúčových slov, optimalizácia stránok, budovanie odkazov a pravidelný reporting.',
    price: 'od 400 €',
    priceNote: 'mesačne',
    color: '#53b8d9',
    icon: 'seo' as ServiceIconName,
  },
  {
    slug: 'texty-a-clanky',
    title: 'SEO texty & copywriting',
    subtitle: 'Obsah, ktorý predáva aj rankuje',
    description: 'Píšeme SEO články, texty na web, popisy produktov, kategórie pre e-shopy a pravidelný blog. Obsah optimalizovaný pre vyhľadávače aj zákazníkov.',
    price: 'od 30 €',
    priceNote: 'za text',
    color: '#63b98f',
    icon: 'copy' as ServiceIconName,
  },
  {
    slug: 'socialne-media',
    title: 'Sociálne médiá',
    subtitle: 'Komunita, ktorá kupuje',
    description: 'Správa Instagramu, Facebooku a LinkedInu. Tvorba obsahu, stories, reels, mesačný report a sledovanie trendov.',
    price: 'od 250 €',
    priceNote: 'mesačne',
    color: '#c78a62',
    icon: 'social' as ServiceIconName,
  },
  {
    slug: 'email-marketing',
    title: 'Email marketing',
    subtitle: 'Retenčný kanál s najvyšším ROI',
    description: 'Nastavíme a spravujeme email marketing: automatizácie, newslettery, segmentácia databázy a A/B testovanie.',
    price: 'od 300 €',
    priceNote: 'mesačne',
    color: '#b18ae0',
    icon: 'email' as ServiceIconName,
  },
  {
    slug: 'tvorba-webov',
    title: 'Tvorba webov & e-shopov',
    subtitle: 'Weby, ktoré konvertujú',
    description: 'Prezentačné weby, e-shopy na Shoptete aj WordPresse. Dizajn na mieru, rýchlosť, SEO a správa doménového ekosystému.',
    price: 'od 800 €',
    priceNote: 'jednorazovo',
    color: '#7dd3c8',
    icon: 'web' as ServiceIconName,
  },
];

export default function SluzbyPage() {
  return (
    <>
      <SEO
        title="Služby"
        description="Cold emailing, SEO, sociálne médiá, email marketing, tvorba webov a copywriting. Komplexný digitálny marketing pre vaše podnikanie."
        canonical={`${SITE_URL}/sluzby/`}
      />
      <Nav />
      <main style={{ background: 'transparent', minHeight: '100vh', paddingTop: 100 }}>
        {/* Hero */}
        <section style={{ padding: '80px 40px 0', maxWidth: 1440, margin: '0 auto' }}>
          <span style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 11,
            letterSpacing: '0.2em',
            color: 'var(--acid)',
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
        <section className="services-overview-shell">
          <div className="services-overview-grid">
            {services.map((s) => (
              <Link key={s.slug} href={`/sluzby/${s.slug}/`} style={{ textDecoration: 'none' }}>
                <div className="services-overview-card">
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
                    <span className="service-overview-icon" style={{ color: s.color }}>
                      <ServiceIcon name={s.icon} size={28} />
                    </span>
                    <span style={{ color: '#3d4348', display: 'inline-flex' }}>
                      <ArrowUpRightIcon size={18} />
                    </span>
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
                      fontSize: 30,
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
                      fontSize: 30,
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
