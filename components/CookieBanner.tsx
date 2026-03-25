import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: 'var(--grey)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '20px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      flexWrap: 'wrap',
    }}>
      <p style={{ fontSize: '13px', color: 'rgba(244,240,232,0.7)', maxWidth: '700px', lineHeight: '1.6', margin: 0 }}>
        Táto webová stránka používa cookies na zlepšenie používateľského zážitku a analýzu návštevnosti.
        Používaním stránky súhlasíte s našimi{' '}
        <Link href="/ochrana-osobnych-udajov/" style={{ color: 'var(--acid)', textDecoration: 'underline' }}>
          zásadami ochrany osobných údajov
        </Link>.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
        <button onClick={decline} style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.15)',
          color: 'var(--muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          padding: '10px 20px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          Odmietnuť
        </button>
        <button onClick={accept} style={{
          background: 'var(--acid)',
          border: 'none',
          color: 'var(--black)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '13px',
          padding: '10px 24px',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}>
          Prijať cookies
        </button>
      </div>
    </div>
  )
}
