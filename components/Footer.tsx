import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ flexDirection: 'column', gap: '24px', padding: '48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '20px', flexWrap: 'wrap' }}>
        <div className="footer-logo">MONETICO</div>
        <span className="footer-copy">© {new Date().getFullYear()} Brandrise s.r.o. — IČO: 53196449</span>
        <ul className="footer-links">
          <li><Link href="/ochrana-osobnych-udajov/">Ochrana osobných údajov</Link></li>
          <li><Link href="/obchodne-podmienky/">Obchodné podmienky</Link></li>
          <li><Link href="/blog/">Blog</Link></li>
          <li><Link href="/kontakt/">Kontakt</Link></li>
        </ul>
      </div>
      <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
        Brandrise s.r.o. · Sokolovská 178/10, 040 11 Košice · DIČ: 2121313865 · IČ DPH: SK2121313865 · Platca DPH
      </div>
    </footer>
  )
}
