import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">MONE<span>.</span>TICO</div>
      <span className="footer-copy">© {new Date().getFullYear()} Brandrise s.r.o.</span>
      <ul className="footer-links">
        <li><Link href="/ochrana-osobnych-udajov/">GDPR</Link></li>
        <li><Link href="/obchodne-podmienky/">Podmienky</Link></li>
        <li><Link href="/blog/">Blog</Link></li>
        <li><Link href="/kontakt/">Kontakt</Link></li>
      </ul>
    </footer>
  )
}
