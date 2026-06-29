import { useEffect } from 'react'
import Router from 'next/router'

/**
 * Globálne efekty (pages router, client-side):
 *  - scroll progress bar hore
 *  - jemný parallax pozadia hero
 *  - reveal (fade-up) prvkov s triedou .reveal pri scrollovaní
 *
 * Reveal musí fungovať aj pri DYNAMICKEJ zmene obsahu (filtre/stránkovanie na
 * blogu, client-side navigácia), inak nové .reveal karty ostanú skryté
 * (opacity:0) a vyzerá to ako keby filtre nefungovali. Preto sledujeme DOM
 * cez MutationObserver + re-scan pri zmene routy + poistka.
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
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el))
      onScroll()
    }

    observeAll()

    // nové prvky (filtre, stránkovanie, async render)
    const mo = new MutationObserver(() => observeAll())
    mo.observe(document.body, { childList: true, subtree: true })

    // client-side navigácia
    Router.events.on('routeChangeComplete', observeAll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      Router.events.off('routeChangeComplete', observeAll)
      mo.disconnect()
      io.disconnect()
      bar.remove()
    }
  }, [])

  return null
}
