import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">MONE<span>.</span>TICO</Link>
      <ul className="nav-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/blog/">Blog</Link></li>
        <li><Link href="/#sluzby">Služby</Link></li>
        <li><Link href="/kontakt/" className="nav-cta">Kontakt →</Link></li>
      </ul>
    </nav>
  )
}
