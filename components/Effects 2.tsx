import { useEffect } from 'react'
import Router from 'next/router'

/**
 * Globálne efekty (pages router, client-side):
 *  - scroll progress bar hore
 *  - jemný parallax pozadia hero
 *  - reveal (fade-up) prvkov s triedou .reveal pri scrollovaní
 *
 * Dôležité: pri client-side navigácii (Link) sa _app neremountuje, preto
 * po každej zmene stránky znova oskenujeme nové .reveal prvky — inak by
 * ostali natrvalo skryté (opacity:0). Plus poistka: ak by observer zlyhal,
 * po krátkom čase prvky aj tak odkryjeme.
 */
export default function Effects() {
  useEffect(() => {
    const bar = document.createElement('div')
    bar.className = 'progress-bar'
    document.body.appendChild(bar)

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const h = document.documentElement.scrollHeight - window.innerHeight
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%'
        const heroBg = document.querySelector<HTMLElement>('.hero-bg')
        if (heroBg) heroBg.style.transform = `translateY(${y * 0.16}px)`
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    let safety: ReturnType<typeof setTimeout>
    const scan = () => {
      document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el))
      onScroll()
      // poistka: nech obsah nikdy neostane skrytý, ak by observer nezabral
      clearTimeout(safety)
      safety = setTimeout(() => {
        document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'))
      }, 2500)
    }

    scan()
    Router.events.on('routeChangeComplete', scan)

    return () => {
      window.removeEventListener('scroll', onScroll)
      Router.events.off('routeChangeComplete', scan)
      clearTimeout(safety)
      io.disconnect()
      bar.remove()
    }
  }, [])

  return null
}
