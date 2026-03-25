import { useState } from 'react';
import { clients, categoryLabels, ServiceCategory } from '../lib/clients-data';

export default function ClientsSection() {
  const [activeFilter, setActiveFilter] = useState<ServiceCategory | 'all'>('all');

  const filtered = activeFilter === 'all'
    ? clients
    : clients.filter(c => c.categories.includes(activeFilter as ServiceCategory));

  const categories: Array<ServiceCategory | 'all'> = [
    'all', 'web', 'eshop', 'seo', 'texty', 'social', 'cold-email', 'email-marketing'
  ];

  const getLogo = (website: string) => {
    const domain = website.replace('https://', '').replace('http://', '').split('/')[0];
    return `https://logo.clearbit.com/${domain}`;
  };

  return (
    <section style={{ background: '#0a0a0a', padding: '120px 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <span style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 11,
            letterSpacing: '0.2em',
            color: '#d4f53c',
            textTransform: 'uppercase',
          }}>
            — Naši klienti
          </span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(48px, 7vw, 96px)',
            color: '#fff',
            margin: '16px 0 0',
            lineHeight: 0.9,
          }}>
            80+ spokojných<br />
            <span style={{ WebkitTextStroke: '1px #fff', color: 'transparent' }}>projektov</span>
          </h2>
        </div>

        {/* Filter tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 48,
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '8px 18px',
                border: `1px solid ${activeFilter === cat ? '#d4f53c' : '#333'}`,
                background: activeFilter === cat ? '#d4f53c' : 'transparent',
                color: activeFilter === cat ? '#000' : '#666',
                cursor: 'none',
                transition: 'all 0.2s',
              }}
            >
              {cat === 'all' ? 'Všetko' : categoryLabels[cat as ServiceCategory]}
              {cat !== 'all' && (
                <span style={{ marginLeft: 6, opacity: 0.6 }}>
                  ({clients.filter(c => c.categories.includes(cat as ServiceCategory)).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Clients grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 2,
        }}>
          {filtered.map((client) => (
            <a
              key={client.name}
              href={client.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '32px 24px',
                background: '#111',
                textDecoration: 'none',
                transition: 'background 0.2s, transform 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#1a1a1a';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = '#111';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {/* Category dot */}
              <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                display: 'flex',
                gap: 4,
              }}>
                {client.categories.map(cat => (
                  <span key={cat} style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: cat === 'web' ? '#d4f53c'
                      : cat === 'eshop' ? '#ff6b35'
                      : cat === 'cold-email' ? '#6366f1'
                      : cat === 'seo' ? '#06b6d4'
                      : cat === 'social' ? '#f59e0b'
                      : cat === 'texty' ? '#10b981'
                      : '#a855f7',
                  }} />
                ))}
              </div>

              {/* Logo */}
              <LogoImage name={client.name} logoUrl={getLogo(client.website)} />

              {/* Name */}
              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#555',
                textAlign: 'center',
                lineHeight: 1.4,
              }}>
                {client.name}
              </span>

              {/* Arrow */}
              <span style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                color: '#333',
                fontSize: 14,
              }}>↗</span>
            </a>
          ))}
        </div>

        {/* Legend */}
        <div style={{
          marginTop: 32,
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          borderTop: '1px solid #1a1a1a',
          paddingTop: 24,
        }}>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: key === 'web' ? '#d4f53c'
                  : key === 'eshop' ? '#ff6b35'
                  : key === 'cold-email' ? '#6366f1'
                  : key === 'seo' ? '#06b6d4'
                  : key === 'social' ? '#f59e0b'
                  : key === 'texty' ? '#10b981'
                  : '#a855f7',
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 10,
                color: '#555',
                letterSpacing: '0.1em',
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoImage({ name, logoUrl }: { name: string; logoUrl: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div style={{
        width: 80,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 13,
          color: '#fff',
          textAlign: 'center',
          lineHeight: 1.2,
        }}>
          {name.slice(0, 12)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={name}
      onError={() => setFailed(true)}
      style={{
        width: 80,
        height: 40,
        objectFit: 'contain',
        filter: 'brightness(0) invert(1)',
        opacity: 0.7,
      }}
    />
  );
}
