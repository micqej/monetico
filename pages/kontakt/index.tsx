import { useState } from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { SparkIcon } from '../../components/Icons'
import { SITE_URL } from '../../lib/site'

const SERVICES = [
  'Cold Email Kampane',
  'SEO Optimalizácia',
  'Sociálne Médiá (Facebook/Instagram)',
  'Email Marketing',
  'Tvorba WordPress webu',
  'Tvorba Shoptet e-shopu',
  'Google Ads',
  'Facebook & Instagram Ads',
  'Nahadzovanie produktov',
  'Komplexný Growth',
]

export default function Kontakt() {
  const [selected, setSelected] = useState<string[]>([])
  const [sent, setSent] = useState(false)

  const toggle = (s: string) => {
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  return (
    <>
      <SEO
        title="Kontakt"
        description="Kontaktujte Monetico agentúru. Nezáväzná konzultácia zdarma. Cold email, SEO, sociálne médiá, tvorba webov na Slovensku."
        canonical={`${SITE_URL}/kontakt/`}
      />
      <Nav />
      <div className="contact-page">
        <div className="section-label">Spojte sa s nami</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(56px,8vw,120px)', letterSpacing: '-5px', lineHeight: '0.9' }}>KONTAKT</h1>
        <div className="contact-grid">
          <div>
            <p style={{ color: 'var(--muted)', marginBottom: '40px', fontSize: '15px', lineHeight: '1.75', maxWidth: '420px' }}>
              Napíšte nám a do 24 hodín sa ozveme. Prvá konzultácia je vždy zadarmo — bez záväzkov.
            </p>
            {sent ? (
              <div style={{ background: 'var(--acid)', padding: '32px', maxWidth: '500px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', color: 'var(--black)', letterSpacing: '-1px', marginBottom: '10px' }}>Správa odoslaná! ✓</h3>
                <p style={{ color: 'rgba(10,10,10,0.7)', fontSize: '14px' }}>Ozveme sa vám do 24 hodín.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={e => { e.preventDefault(); setSent(true) }}>
                <div className="form-group">
                  <label className="form-label">Meno a priezvisko *</label>
                  <input className="form-input" type="text" placeholder="Ján Novák" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" type="email" placeholder="jan@firma.sk" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefón</label>
                  <input className="form-input" type="tel" placeholder="+421 900 000 000" />
                </div>
                <div className="form-group">
                  <label className="form-label">O čo máte záujem? (môžete vybrať viac)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    {SERVICES.map(s => (
                      <label key={s} onClick={() => toggle(s)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '11px 14px', border: `1px solid ${selected.includes(s) ? 'var(--acid)' : 'rgba(255,255,255,0.08)'}`, background: selected.includes(s) ? 'rgba(212,245,60,0.07)' : 'transparent', transition: 'all 0.2s', fontSize: '14px', color: selected.includes(s) ? 'var(--white)' : 'var(--muted)' }}>
                        <span style={{ width: '18px', height: '18px', border: `2px solid ${selected.includes(s) ? 'var(--acid)' : 'rgba(255,255,255,0.2)'}`, background: selected.includes(s) ? 'var(--acid)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', color: 'var(--black)', fontWeight: 700, transition: 'all 0.2s' }}>
                          {selected.includes(s) ? '✓' : ''}
                        </span>
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Správa</label>
                  <textarea className="form-textarea" placeholder="Popíšte váš projekt alebo otázku..." />
                </div>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>Odoslať správu →</button>
              </form>
            )}
          </div>
          <div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', marginBottom: '40px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--acid)', marginBottom: '16px' }}>Kontakt</div>
              <a href="mailto:info@monetico.sk" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px', display: 'block', marginBottom: '10px', transition: 'color 0.2s', color: 'var(--white)' }}>info@monetico.sk</a>
              <a href="tel:+421908804366" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px', display: 'block', transition: 'color 0.2s', color: 'var(--white)' }}>+421 908 804 366</a>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', marginBottom: '40px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--acid)', marginBottom: '16px' }}>Fakturačné údaje</div>
              {[['Spoločnosť','Brandrise s.r.o.'],['Adresa','Sokolovská 178/10, 040 11 Košice'],['IČO','53196449'],['DIČ','2121313865'],['IČ DPH','SK2121313865'],['Platca DPH','Áno']].map(([k,v]) => (
                <div key={k} style={{ display: 'flex', gap: '16px', fontSize: '14px', lineHeight: '1.8' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px', color: 'var(--muted)', textTransform: 'uppercase', minWidth: '80px', paddingTop: '3px' }}>{k}</span>
                  <span style={{ color: 'var(--white)' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--acid)', marginBottom: '16px' }}>Naše služby</div>
              {['Cold Email','SEO','Sociálne Médiá','Email Marketing','WordPress','Shoptet','Google & FB Ads'].map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  <span style={{ color: 'var(--acid)', display: 'inline-flex' }}><SparkIcon size={14} /></span> {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
