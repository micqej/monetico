import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'

export default function Kontakt() {
  return (
    <>
      <SEO
        title="Kontakt — Napíšte nám"
        description="Kontaktujte Monetico agentúru. Ponúkame nezáväznú konzultáciu zdarma. Cold email, SEO, sociálne médiá, tvorba webov."
        canonical="https://www.monetico.sk/kontakt/"
      />
      <Nav />

      <div className="contact-page">
        <div className="section-label">Spojte sa s nami</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(56px,8vw,120px)', letterSpacing: '-5px', lineHeight: '0.9' }}>
          KONTAKT
        </h1>

        <div className="contact-grid">
          {/* FORM */}
          <div>
            <p style={{ color: 'var(--muted)', marginBottom: '40px', fontSize: '15px', lineHeight: '1.75', maxWidth: '420px' }}>
              Napíšte nám a do 24 hodín sa ozveme. Prvá konzultácia je vždy zadarmo — bez záväzkov.
            </p>
            <form className="contact-form" onSubmit={e => e.preventDefault()}>
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
                <label className="form-label">Čo potrebujete? *</label>
                <textarea className="form-textarea" placeholder="Popíšte váš projekt alebo otázku..." required />
              </div>
              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                Odoslať správu →
              </button>
            </form>
          </div>

          {/* INFO */}
          <div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', marginBottom: '40px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--acid)', marginBottom: '20px' }}>
                Email
              </div>
              <a href="mailto:michal.mikula@monetico.sk" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.5px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--acid)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--white)')}>
                michal.mikula@monetico.sk
              </a>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', marginBottom: '40px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--acid)', marginBottom: '20px' }}>
                Spoločnosť
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' }}>
                Brandrise s.r.o.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '8px', lineHeight: '1.6' }}>
                Digitálna agentúra<br />
                Slovenská republika
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--acid)', marginBottom: '20px' }}>
                Čo ponúkame
              </div>
              {['Cold Email Kampane', 'SEO Optimalizácia', 'Sociálne Médiá', 'Email Marketing', 'WordPress Weby', 'Shoptet E-shopy'].map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  <span style={{ color: 'var(--acid)' }}>✦</span> {s}
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
