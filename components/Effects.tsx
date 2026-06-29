import { useEffect } from 'react'

/**
 * Globálne efekty (pages router, client-side):
 *  - scroll progress bar hore
 *  - jemný parallax pozadia hero
 *  - reveal (fade-up) prvkov s triedou .reveal pri scrollovaní
 */
export default function Effects() {
  useEffect(() => {
    const bar = document.createElement('div')
    bar.className = 'progress-bar'
    document.body.appendChild(bar)

    const heroBg = document.querySelector<HTMLElement>('.hero-bg')
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const h = document.documentElement.scrollHeight - window.innerHeight
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%'
        if (heroBg) heroBg.style.transform = `translateY(${y * 0.16}px)`
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
      bar.remove()
    }
  }, [])

  return null
}
