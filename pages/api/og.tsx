import { ImageResponse } from 'next/og'

export const config = { runtime: 'edge' }

/**
 * Dynamický náhľadový obrázok pri zdieľaní (1200×630 PNG).
 * SVG sociálne siete (Messenger, FB, iMessage, LinkedIn) neukazujú — preto raster.
 */
export default function handler(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') || 'Digitálna agentúra').slice(0, 90)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f4f1ea',
          padding: '70px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#6b21d9' }} />
          <div style={{ fontSize: '36px', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-1px' }}>Monetico</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '76px', fontWeight: 800, color: '#0a0a0a', lineHeight: 1.05, letterSpacing: '-2px' }}>{title}</div>
          <div style={{ fontSize: '34px', color: '#6b21d9', marginTop: '22px', fontWeight: 700 }}>
            Weby · SEO · Cold email · Reklama
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '28px', color: '#555' }}>monetico.sk</div>
          <div
            style={{
              display: 'flex',
              background: '#f5e642',
              border: '3px solid #0a0a0a',
              borderRadius: '40px',
              padding: '12px 30px',
              fontSize: '27px',
              fontWeight: 700,
              color: '#0a0a0a',
            }}
          >
            Rastieme online
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
