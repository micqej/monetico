import { useEffect, useState } from 'react'

interface C { id: number; author: string; body: string; created_at: string }

export default function Comments({ slug }: { slug: string }) {
  const [list, setList] = useState<C[]>([])
  const [site, setSite] = useState<any>(null)
  const [form, setForm] = useState({ author: '', email: '', body: '', website: '' })
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch(`/api/public/comments/${slug}`).then(r => r.json()).then(d => setList(d.comments || [])).catch(() => {})
    fetch('/api/public/site').then(r => r.json()).then(setSite).catch(() => {})
  }, [slug])

  useEffect(() => {
    if (site?.recaptchaSiteKey && !document.getElementById('recaptcha-v3')) {
      const s = document.createElement('script'); s.id = 'recaptcha-v3'
      s.src = 'https://www.google.com/recaptcha/api.js?render=' + site.recaptchaSiteKey
      document.head.appendChild(s)
    }
  }, [site])

  if (site && !site.commentsEnabled) return null

  async function submit(e: any) {
    e.preventDefault(); setBusy(true); setMsg('')
    let token = ''
    try {
      const g = (window as any).grecaptcha
      if (site?.recaptchaSiteKey && g) token = await g.execute(site.recaptchaSiteKey, { action: 'comment' })
    } catch {}
    try {
      const r = await fetch(`/api/public/comments/${slug}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken: token }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Chyba')
      if (d.status === 'approved') {
        setList(l => [...l, { id: Date.now(), author: form.author || 'Anonym', body: form.body, created_at: new Date().toISOString() }])
        setMsg('Komentár pridaný. Ďakujeme!')
      } else {
        setMsg('Ďakujeme! Komentár čaká na schválenie.')
      }
      setForm({ author: '', email: '', body: '', website: '' })
    } catch (e: any) { setMsg(e.message) }
    setBusy(false)
  }

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const fmt = (d: string) => { try { return new Date(d).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' }) } catch { return '' } }

  return (
    <section className="comments">
      <h2 className="comments-h">Komentáre {list.length > 0 && <span>({list.length})</span>}</h2>
      <div className="comment-list">
        {list.map(c => (
          <div key={c.id} className="comment">
            <div className="comment-meta"><b>{c.author}</b><span>{fmt(c.created_at)}</span></div>
            <p>{c.body}</p>
          </div>
        ))}
        {list.length === 0 && <p className="comments-empty">Zatiaľ žiadne komentáre. Buďte prvý.</p>}
      </div>
      <form className="comment-form" onSubmit={submit}>
        <h3>Pridať komentár</h3>
        <div className="cf-row">
          <input className="form-input" placeholder="Meno" value={form.author} onChange={e => set('author', e.target.value)} required />
          <input className="form-input" type="email" placeholder="E-mail (nezverejní sa)" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <textarea className="form-textarea" placeholder="Váš komentár…" value={form.body} onChange={e => set('body', e.target.value)} required />
        <input className="cf-hp" tabIndex={-1} autoComplete="off" value={form.website} onChange={e => set('website', e.target.value)} aria-hidden="true" />
        <div className="cf-bottom">
          <button className="btn-primary" type="submit" disabled={busy}>{busy ? 'Odosielam…' : 'Odoslať komentár'}</button>
          {msg && <span className="cf-msg">{msg}</span>}
        </div>
      </form>
    </section>
  )
}
