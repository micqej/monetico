import { useEffect } from 'react'

/**
 * Načíta tracking konfiguráciu z /api/public/site (spravovanú v admine) a vloží
 * GA4, Meta Pixel, GTM a ľubovoľné vlastné <script> (napr. SiteBehaviour).
 * Skripty sa vkladajú raz; ID zabraňuje duplicite.
 */
export default function TrackingScripts() {
  useEffect(() => {
    let cancelled = false
    fetch('/api/public/site')
      .then(r => r.json())
      .then((cfg: any) => {
        if (cancelled || !cfg) return
        const head = document.head
        const inline = (id: string, code: string) => {
          if (document.getElementById(id)) return
          const s = document.createElement('script'); s.id = id; s.text = code; head.appendChild(s)
        }
        const src = (id: string, url: string) => {
          if (document.getElementById(id)) return
          const s = document.createElement('script'); s.id = id; s.src = url; s.async = true; head.appendChild(s)
        }

        if (cfg.gtmId) {
          inline('gtm-init', `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${cfg.gtmId}');`)
        }
        if (cfg.gaId) {
          src('ga4-src', 'https://www.googletagmanager.com/gtag/js?id=' + cfg.gaId)
          inline('ga4-init', `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${cfg.gaId}');`)
        }
        if (cfg.metaPixelId) {
          inline('meta-pixel', `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${cfg.metaPixelId}');fbq('track','PageView');`)
        }
        if (cfg.headHtml) {
          const tmp = document.createElement('div')
          tmp.innerHTML = cfg.headHtml
          tmp.querySelectorAll('script').forEach((old, i) => {
            const id = 'custom-head-' + i
            if (document.getElementById(id)) return
            const s = document.createElement('script'); s.id = id
            Array.from(old.attributes).forEach(a => { if (a.name !== 'id') s.setAttribute(a.name, a.value) })
            s.text = old.textContent || ''
            head.appendChild(s)
          })
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])
  return null
}
