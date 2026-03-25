import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">MONETICO</Link>
      <ul className="nav-links">
        <li><Link href="/">Domov</Link></li>
        <li><Link href="/blog/">Články</Link></li>
        <li><Link href="/sluzby/">Služby</Link></li>
        <li><Link href="/kontakt/" className="nav-cta">Kontakt →</Link></li>
      </ul>
    </nav>
  )
}
