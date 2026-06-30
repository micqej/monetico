import { useEffect, useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react'
import Head from 'next/head'
import { sentenceCaseSk } from '../../lib/text'

type Session = { authed: boolean; configured: boolean; db: boolean; ai: boolean; pexels: boolean; pixabay: boolean }
type ImageR = { url: string; thumb: string; credit: string; source: string }

const CATEGORIES = ['Marketing Tipy', 'Podnikanie', 'O eshopoch', 'Ako na to', 'Analýza', 'Email', 'SEO', 'WordPress', 'O weboch', 'Sociálne siete']
const TABS: { id: string; icon: string }[] = [
  { id: 'Prehľad', icon: 'overview' }, { id: 'Generovať', icon: 'generate' },
  { id: 'Články', icon: 'articles' }, { id: 'Plán', icon: 'plan' },
  { id: 'Komentáre', icon: 'comment' }, { id: 'Newsletter', icon: 'mail' },
  { id: 'Nastavenia', icon: 'settings' }, { id: 'Integrácie', icon: 'plug' },
]

/* ── SVG ikony (feather) ── */
function Ic({ n, s = 18 }: { n: string; s?: number }) {
  const c: Record<string, JSX.Element> = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
    generate: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    articles: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
    plan: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    mail: <><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    settings: <><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    check: <polyline points="20 6 9 17 4 12" />,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    warn: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
    play: <polygon points="5 3 19 12 5 21 5 3" />,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    comment: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
    plug: <><path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-10 0V8zM12 16v6" /></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    bold: <><path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z" /></>,
    h2: <><path d="M4 12h8M4 18V6M12 18V6" /><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></>,
    list: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>,
  }
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{c[n]}</svg>
}

async function api(url: string, opts?: RequestInit) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Chyba')
  return data
}

const emptyEditor = {
  id: 0, title: '', slug: '', category: 'Marketing Tipy', tags: '', content: '', excerpt: '',
  meta_title: '', meta_desc: '', meta_keywords: '', image_url: '', image_credit: '', status: 'draft',
}

export default function Admin() {
  const [sess, setSess] = useState<Session | null>(null)
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const [tab, setTabState] = useState('Prehľad')
  const setTab = useCallback((id: string) => {
    setTabState(id)
    if (typeof window !== 'undefined') window.location.hash = encodeURIComponent(id)
  }, [])

  // po refreshi ostaň na rovnakej záložke (z URL hashu)
  useEffect(() => {
    const h = decodeURIComponent((window.location.hash || '').replace(/^#/, ''))
    if (h && TABS.some(t => t.id === h)) setTabState(h)
  }, [])

  const refresh = useCallback(async () => setSess(await api('/api/admin/session')), [])
  useEffect(() => { refresh() }, [refresh])

  // počet čakajúcich komentárov pre odznak v menu
  const [pendingC, setPendingC] = useState(0)
  const loadPending = useCallback(() => {
    api('/api/admin/stats').then(d => setPendingC(d?.comments?.pending || 0)).catch(() => {})
  }, [])
  useEffect(() => { if (sess?.authed) loadPending() }, [sess?.authed, tab, loadPending])

  async function login(e: any) {
    e.preventDefault(); setErr('')
    try { await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ pin }) }); setPin(''); await refresh() }
    catch (e: any) { setErr(e.message) }
  }
  async function logout() { await api('/api/admin/logout', { method: 'POST' }); await refresh() }

  return (
    <>
      <Head><title>Admin — Monetico</title><meta name="robots" content="noindex, nofollow" /></Head>
      <style>{css}</style>

      {!sess ? <div className="aload">Načítavam…</div> : !sess.authed ? (
        <div className="alogin">
          <form className="acard lcard" onSubmit={login}>
            <div className="licon"><Ic n="lock" s={26} /></div>
            <h1>Monetico admin</h1>
            <p className="amut">Zadaj PIN</p>
            {!sess.configured && <div className="awarn"><Ic n="warn" s={15} /> Nastav <code>ADMIN_PIN</code> vo Vercel premenných.</div>}
            <input className="ain pin" inputMode="numeric" autoComplete="off" type="password" placeholder="••••" value={pin} onChange={e => setPin(e.target.value)} autoFocus />
            {err && <div className="aerr">{err}</div>}
            <button className="abtn full" type="submit">Vstúpiť</button>
          </form>
        </div>
      ) : (
        <div className="aw">
          <aside className="aside">
            <div className="alogo"><span className="adot" />Monetico</div>
            <nav className="anav">
              {TABS.map(t => (
                <button key={t.id} className={`anav-i${tab === t.id ? ' on' : ''}`} onClick={() => setTab(t.id)}>
                  <Ic n={t.icon} /> <span style={{ flex: 1 }}>{t.id}</span>
                  {t.id === 'Komentáre' && pendingC > 0 && <span className="anav-badge">{pendingC}</span>}
                </button>
              ))}
            </nav>
            <button className="anav-i out" onClick={logout}><Ic n="logout" /> Odhlásiť</button>
          </aside>
          <main className="amain">
            <h2 className="ahd">{tab}</h2>
            {tab === 'Prehľad' && <Overview sess={sess} />}
            {tab === 'Generovať' && <Generate sess={sess} />}
            {tab === 'Články' && <Articles />}
            {tab === 'Plán' && <Plan />}
            {tab === 'Komentáre' && <CommentsAdmin />}
            {tab === 'Newsletter' && <Newsletter />}
            {tab === 'Nastavenia' && <Settings />}
            {tab === 'Integrácie' && <Integrations />}
          </main>
        </div>
      )}
    </>
  )
}

function Overview({ sess }: { sess: Session }) {
  const [run, setRun] = useState<any>(null)
  const [busy, setBusy] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const load = useCallback(() => { api('/api/admin/stats').then(setStats).catch(() => {}) }, [])
  useEffect(() => { load() }, [load])
  async function runNow() {
    setBusy(true); setRun(null)
    try { setRun(await api('/api/admin/run-autopilot', { method: 'POST' })); load() }
    catch (e: any) { setRun({ ok: false, reason: e.message }) }
    setBusy(false)
  }
  const fmtDate = (d: string) => { try { return new Date(d).toLocaleDateString('sk-SK') } catch { return '' } }
  const missing = [!sess.ai && 'OpenAI', !sess.pexels && 'Pexels', !sess.pixabay && 'Pixabay'].filter(Boolean)
  return (
    <>
      {missing.length > 0 && (
        <div className="awarn"><Ic n="warn" s={15} /> Chýbajú kľúče: {missing.join(', ')}. Doplň ich v <b>Integrácie</b>, inak generovanie/fotky nepôjdu.</div>
      )}
      <div className="stat-row" style={{ marginBottom: 16 }}>
        <div className="stat-box2"><b>{stats ? stats.articles.published : '—'}</b><span>publikovaných článkov</span></div>
        <div className="stat-box2"><b>{stats ? stats.articles.total : '—'}</b><span>článkov v admine</span></div>
        <div className="stat-box2"><b>{stats ? stats.planPending : '—'}</b><span>tém v pláne</span></div>
        <div className="stat-box2"><b>{stats ? stats.comments.pending : '—'}</b><span>komentárov čaká</span></div>
        <div className="stat-box2"><b>{stats ? stats.subscribers : '—'}</b><span>odberateľov</span></div>
      </div>
      <div className="acard">
        <h3>Posledné články</h3>
        {stats?.recentArticles?.length ? (
          <table className="atab2"><tbody>
            {stats.recentArticles.map((a: any, i: number) => (
              <tr key={i}><td><b>{a.title}</b></td><td><span className={`apill ${a.status === 'published' ? 'good' : 'bad'}`}>{a.status}</span></td><td className="amut sm ar">{fmtDate(a.date)}</td></tr>
            ))}
          </tbody></table>
        ) : <p className="amut sm">Zatiaľ žiadne články z admina. Vytvor témy v <b>Pláne</b> alebo článok v <b>Generovať</b>.</p>}
      </div>
      <div className="acard">
        <h3>Rýchle generovanie</h3>
        <p className="amut sm">Spustí jeden cyklus: vyberie tému (z plánu alebo ju navrhne), napíše článok s fotkou a prelinkovaním a podľa nastavení ho publikuje. Trvá pol minúty.</p>
        <button className="abtn" onClick={runNow} disabled={busy}><Ic n="play" s={15} /> {busy ? 'Pracujem… (~30 s)' : 'Vygenerovať článok teraz'}</button>
        {run && <p className="amut sm" style={{ marginTop: 10 }}>{run.ok ? (run.created ? `Hotovo — vytvorený článok „${run.created}". Nájdeš ho v Článkoch.` : (run.skipped ? `Preskočené: ${run.skipped}` : 'Hotovo.')) : `Chyba: ${run.reason || run.error}`}</p>}
      </div>
    </>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: any }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="amodal" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="amodal-card">
        <div className="amodal-top"><b>{title}</b><button className="icbtn" onClick={onClose} title="Zavrieť"><Ic n="x" s={18} /></button></div>
        <div className="amodal-body">{children}</div>
      </div>
    </div>
  )
}

/* ── Vizuálny (WYSIWYG) editor s prepnutím na HTML ── */
const RichEditor = forwardRef(function RichEditor({ value, onChange }: { value: string; onChange: (h: string) => void }, ref) {
  const elRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'visual' | 'html'>('visual')
  const sync = () => { if (elRef.current) onChange(elRef.current.innerHTML) }
  // nastav obsah pri vstupe do vizuálneho režimu (nie pri každom písmene → nepreskakuje kurzor)
  useEffect(() => {
    if (mode === 'visual' && elRef.current && elRef.current.innerHTML !== value) elRef.current.innerHTML = value || ''
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])
  useImperativeHandle(ref, () => ({
    insertImage(im: { url: string; credit: string }) {
      const fig = `<figure class="wp-block-image"><img src="${im.url}" alt="" /></figure><p><br></p>`
      if (mode === 'visual' && elRef.current) { elRef.current.focus(); document.execCommand('insertHTML', false, fig); sync() }
      else onChange((value || '') + fig)
    },
  }))
  const exec = (c: string, v?: string) => { elRef.current?.focus(); document.execCommand(c, false, v); sync() }
  const link = () => { const url = window.prompt('Adresa odkazu (URL):', 'https://'); if (url) exec('createLink', url) }
  return (
    <div>
      <div className="etb">
        <button type="button" onClick={() => exec('formatBlock', 'H2')}>Nadpis</button>
        <button type="button" onClick={() => exec('formatBlock', 'H3')}>Podnadpis</button>
        <button type="button" onClick={() => exec('formatBlock', 'P')}>Odsek</button>
        <button type="button" onClick={() => exec('bold')}><b>B</b></button>
        <button type="button" onClick={() => exec('italic')}><i>I</i></button>
        <button type="button" onClick={() => exec('insertUnorderedList')}>• Zoznam</button>
        <button type="button" onClick={link}>Odkaz</button>
        <button type="button" onClick={() => exec('unlink')}>Zrušiť odkaz</button>
        <button type="button" onClick={() => exec('removeFormat')}>Vyčistiť štýl</button>
        <button type="button" className={mode === 'html' ? 'on' : ''} onClick={() => { if (mode === 'visual') sync(); setMode(m => (m === 'visual' ? 'html' : 'visual')) }}>{mode === 'visual' ? 'HTML' : 'Vizuálne'}</button>
      </div>
      {mode === 'visual'
        ? <div ref={elRef} className="rich" contentEditable suppressContentEditableWarning onInput={sync} onBlur={sync} />
        : <textarea className="ain mono" rows={18} value={value} onChange={e => onChange(e.target.value)} />}
    </div>
  )
})

function Editor({ initial, images, onSaved }: { initial: any; images: ImageR[]; onSaved: () => void }) {
  const [a, setA] = useState<any>(initial)
  const [imgs, setImgs] = useState<ImageR[]>(images)
  const [q, setQ] = useState('')
  const [msg, setMsg] = useState('')
  const set = (k: string, v: any) => setA((p: any) => ({ ...p, [k]: v }))
  const richRef = useRef<any>(null)
  async function searchImg() { if (!q) return; try { const d = await api(`/api/admin/images?q=${encodeURIComponent(q)}&source=both`); setImgs(d.images) } catch {} }
  async function save(status: string) {
    setMsg('')
    const payload = { ...a, status, tags: String(a.tags).split(',').map((t: string) => t.trim()).filter(Boolean) }
    try {
      if (a.id) await api(`/api/admin/articles/${a.id}`, { method: 'PUT', body: JSON.stringify(payload) })
      else await api('/api/admin/articles', { method: 'POST', body: JSON.stringify(payload) })
      setMsg('Uložené'); onSaved()
    } catch (e: any) { setMsg(e.message) }
  }
  return (
    <div className="acard">
      <h3>{a.id ? 'Upraviť článok' : 'Nový článok'}</h3>
      <label className="alab">Titulok</label>
      <input className="ain" value={a.title} onChange={e => set('title', e.target.value)} />
      <div className="agrid2">
        <div><label className="alab">Kategória</label><select className="ain" value={a.category} onChange={e => set('category', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
        <div><label className="alab">Tagy (čiarka)</label><input className="ain" value={a.tags} onChange={e => set('tags', e.target.value)} /></div>
      </div>
      <label className="alab">Perex</label>
      <textarea className="ain" rows={2} value={a.excerpt} onChange={e => set('excerpt', e.target.value)} />
      <label className="alab">Obsah — píš normálne, formátuj tlačidlami (alebo prepni na HTML)</label>
      <RichEditor ref={richRef} value={a.content} onChange={v => set('content', v)} />
      <div className="agrid2">
        <div><label className="alab">Meta title</label><input className="ain" value={a.meta_title} onChange={e => set('meta_title', e.target.value)} /></div>
        <div><label className="alab">Meta keywords</label><input className="ain" value={a.meta_keywords} onChange={e => set('meta_keywords', e.target.value)} /></div>
      </div>
      <label className="alab">Meta description</label>
      <textarea className="ain" rows={2} value={a.meta_desc} onChange={e => set('meta_desc', e.target.value)} />
      <label className="alab">Fotky — klikni a vloží sa priamo do článku (prvá = náhľad pri zdieľaní)</label>
      <div className="arow">
        <input className="ain" style={{ marginBottom: 0 }} placeholder="Hľadať fotku…" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); searchImg() } }} />
        <button className="abtn ghost" type="button" onClick={searchImg}><Ic n="search" s={15} /> Hľadať</button>
      </div>
      <div className="aimgs">
        {imgs.map((im, i) => (
          <button key={i} type="button" className="athumb" title={'Vložiť do článku — ' + im.credit} onClick={() => { richRef.current?.insertImage(im); if (!a.image_url) { set('image_url', im.url); set('image_credit', im.credit) } }}>
            <img src={im.thumb} alt="" /><span>{im.source}</span>
          </button>
        ))}
        {imgs.length === 0 && <p className="amut sm" style={{ gridColumn: '1/-1' }}>Vyhľadaj fotku vyššie (treba mať vyplnené Pexels/Pixabay kľúče v Integráciách).</p>}
      </div>
      <div className="arow mt"><button className="abtn ghost" onClick={() => save('draft')}>Uložiť koncept</button><button className="abtn" onClick={() => save('published')}>Publikovať</button>{msg && <span className="amut sm">{msg}</span>}</div>
    </div>
  )
}

function Generate({ sess }: { sess: Session }) {
  const [topic, setTopic] = useState('')
  const [cat, setCat] = useState('Marketing Tipy')
  const [busy, setBusy] = useState(false)
  const [editor, setEditor] = useState<any>(null)
  const [images, setImages] = useState<ImageR[]>([])
  const [err, setErr] = useState('')
  async function gen() {
    setBusy(true); setErr(''); setEditor(null)
    try {
      const d = await api('/api/admin/generate', { method: 'POST', body: JSON.stringify({ topic, category: cat }) })
      setImages(d.images || [])
      setEditor({ ...emptyEditor, title: d.article.title, category: d.article.category, tags: (d.article.tags || []).join(', '), content: d.article.content, excerpt: d.article.excerpt, meta_title: d.article.meta_title, meta_desc: d.article.meta_desc, meta_keywords: d.article.meta_keywords, image_url: d.images?.[0]?.url || '', image_credit: d.images?.[0]?.credit || '' })
    } catch (e: any) { setErr(e.message) }
    setBusy(false)
  }
  return (
    <>
      <div className="acard">
        <h3>Generovať článok cez AI</h3>
        {!sess.ai && <div className="awarn"><Ic n="warn" s={15} /> Najprv nastav <code>OPENAI_API_KEY</code>.</div>}
        <label className="alab">Téma / kľúčové slovo</label>
        <input className="ain" placeholder="napr. Ako začať s cold emailingom v roku 2026" value={topic} onChange={e => setTopic(e.target.value)} />
        <label className="alab">Kategória</label>
        <select className="ain" value={cat} onChange={e => setCat(e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
        {err && <div className="aerr">{err}</div>}
        <button className="abtn" onClick={gen} disabled={busy || !topic}><Ic n="generate" s={15} /> {busy ? 'Generujem…' : 'Vygenerovať'}</button>
      </div>
      {editor && <Modal title="Nový článok" onClose={() => setEditor(null)}><Editor initial={editor} images={images} onSaved={() => setEditor(null)} /></Modal>}
    </>
  )
}

function Articles() {
  const [list, setList] = useState<any[]>([])
  const [edit, setEdit] = useState<any>(null)
  const [statics, setStatics] = useState<{ posts: any[]; total: number }>({ posts: [], total: 0 })
  const [sq, setSq] = useState('')
  const [busySlug, setBusySlug] = useState('')
  const [err, setErr] = useState('')
  const load = useCallback(async () => {
    try { setErr(''); setList((await api('/api/admin/articles')).articles || []) }
    catch (e: any) { setErr('Nepodarilo sa načítať články (' + (e.message || 'chyba') + '). Skús to znova.') }
  }, [])
  const loadStatic = useCallback(async (q: string) => {
    try { const d = await api('/api/admin/static-posts' + (q ? `?q=${encodeURIComponent(q)}` : '')); setStatics({ posts: d.posts || [], total: d.total || 0 }) } catch {}
  }, [])
  useEffect(() => { load(); loadStatic('') }, [load, loadStatic])
  const reload = () => { load(); loadStatic(sq) }
  async function del(id: number) { if (!confirm('Zmazať článok?')) return; await api(`/api/admin/articles/${id}`, { method: 'DELETE' }); reload() }
  function openEdit(a: any) { setEdit({ id: a.id, title: a.title, slug: a.slug, category: a.category, tags: (a.tags || []).join(', '), content: a.content, excerpt: a.excerpt, meta_title: a.meta_title, meta_desc: a.meta_desc, meta_keywords: a.meta_keywords, image_url: a.image_url, image_credit: a.image_credit, status: a.status }) }
  async function editStatic(slug: string) {
    setBusySlug(slug)
    try {
      const { post: p } = await api(`/api/admin/static-posts?slug=${encodeURIComponent(slug)}`)
      setEdit({ id: 0, title: p.title, slug: p.slug, category: p.categories?.[0] || 'Marketing Tipy', tags: (p.tags || []).join(', '), content: p.content, excerpt: p.excerpt, meta_title: p.meta_title || p.title, meta_desc: p.meta_desc, meta_keywords: p.meta_keywords, image_url: '', image_credit: '', status: 'published' })
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {}
    setBusySlug('')
  }
  return (
    <>
      <div className="acard">
        <h3>Články z admina ({list.length}) <button className="abtn ghost" style={{ float: 'right', padding: '5px 12px' }} onClick={reload}>Obnoviť</button></h3>
        {err && <div className="aerr">{err}</div>}
        <table className="atab2"><tbody>
          {list.map(a => (
            <tr key={a.id}>
              <td><b>{a.title}</b><br /><span className="amut sm">{a.category} · {a.source}</span></td>
              <td><span className={`apill ${a.status === 'published' ? 'good' : 'bad'}`}>{a.status}</span></td>
              <td className="ar"><button className="icbtn" title="Upraviť" onClick={() => openEdit(a)}><Ic n="edit" s={16} /></button><button className="icbtn" title="Zmazať" onClick={() => del(a.id)}><Ic n="trash" s={16} /></button></td>
            </tr>
          ))}
          {list.length === 0 && <tr><td className="amut sm">Zatiaľ žiadne — uprav niektorý z pôvodných nižšie alebo vytvor nový.</td></tr>}
        </tbody></table>
      </div>

      <div className="acard">
        <h3>Pôvodné články ({statics.total})</h3>
        <p className="amut sm">Pôvodný obsah z webu. Klikni <b>Upraviť</b> — článok sa otvorí v editore a po uložení ho budeš mať plne pod kontrolou (prepíše pôvodný na webe).</p>
        <form className="arow" onSubmit={e => { e.preventDefault(); loadStatic(sq) }}>
          <input className="ain" style={{ marginBottom: 0 }} placeholder="Hľadať v pôvodných článkoch…" value={sq} onChange={e => setSq(e.target.value)} />
          <button className="abtn ghost" type="submit"><Ic n="search" s={15} /> Hľadať</button>
        </form>
        <table className="atab2 mt"><tbody>
          {statics.posts.map(p => (
            <tr key={p.slug}>
              <td><b>{p.title}</b><br /><span className="amut sm">{p.category}{p.date ? ' · ' + p.date.slice(0, 10) : ''}</span></td>
              <td className="ar"><button className="abtn ghost" disabled={busySlug === p.slug} onClick={() => editStatic(p.slug)}><Ic n="edit" s={15} /> {busySlug === p.slug ? 'Otváram…' : 'Upraviť'}</button></td>
            </tr>
          ))}
          {statics.posts.length === 0 && <tr><td className="amut sm">Nič nenájdené.</td></tr>}
        </tbody></table>
        {statics.total > statics.posts.length && <p className="amut sm" style={{ marginTop: 10 }}>Zobrazených {statics.posts.length} z {statics.total} — použi hľadanie na zúženie.</p>}
      </div>

      {edit && <Modal title={edit.id ? 'Upraviť článok' : 'Nový článok'} onClose={() => setEdit(null)}><Editor initial={edit} images={[]} onSaved={() => { setEdit(null); reload() }} /></Modal>}
    </>
  )
}

function Plan() {
  const [list, setList] = useState<any[]>([])
  const [topic, setTopic] = useState('')
  const [cat, setCat] = useState('Marketing Tipy')
  const [when, setWhen] = useState('')
  const load = useCallback(async () => setList((await api('/api/admin/plan')).plan), [])
  useEffect(() => { load() }, [load])
  const [count, setCount] = useState(14)
  const [scat, setScat] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  async function add() { if (!topic) return; await api('/api/admin/plan', { method: 'POST', body: JSON.stringify({ topic, category: cat, scheduled_for: when || null }) }); setTopic(''); setWhen(''); load() }
  async function del(id: number) { await api(`/api/admin/plan/${id}`, { method: 'DELETE' }); load() }
  async function suggest() {
    setBusy(true); setMsg('')
    try {
      const d = await api('/api/admin/suggest-topics', { method: 'POST', body: JSON.stringify({ count, category: scat || undefined, schedule: true }) })
      setMsg(`Pridaných ${d.added} tém do plánu.`); load()
    } catch (e: any) { setMsg(e.message) }
    setBusy(false)
  }
  return (
    <>
      <div className="acard">
        <h3>1 · Navrhnúť témy automaticky</h3>
        <p className="amut sm">AI navrhne názvy článkov podľa toho, čím sa firma zaoberá (Nastavenia → Čím sa zaoberáte), rozloží ich po dňoch a autopilot z nich potom postupne píše texty.</p>
        <div className="agrid3">
          <div><label className="alab">Koľko tém</label><input className="ain" type="number" min={1} max={50} value={count} onChange={e => setCount(+e.target.value)} /></div>
          <div><label className="alab">Kategória (voliteľné)</label><select className="ain" value={scat} onChange={e => setScat(e.target.value)}><option value="">Mix / náhodne</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}><button className="abtn full" onClick={suggest} disabled={busy}><Ic n="generate" s={15} /> {busy ? 'Generujem…' : 'Navrhnúť témy'}</button></div>
        </div>
        {msg && <p className="amut sm" style={{ marginTop: 8 }}>{msg}</p>}
      </div>
    <div className="acard">
      <h3>2 · Plán obsahu ({list.length})</h3>
      <p className="amut sm">Témy čakajúce na spracovanie. Môžeš pridať aj vlastnú. Dátum je voliteľný — autopilot ich spracúva postupne.</p>
      <div className="agrid3">
        <input className="ain" placeholder="Vlastná téma" value={topic} onChange={e => setTopic(e.target.value)} />
        <select className="ain" value={cat} onChange={e => setCat(e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
        <input className="ain" type="datetime-local" value={when} onChange={e => setWhen(e.target.value)} />
      </div>
      <button className="abtn" onClick={add} disabled={!topic}><Ic n="plus" s={15} /> Pridať</button>
      <table className="atab2 mt"><tbody>
        {list.map(p => (
          <tr key={p.id}>
            <td><b>{sentenceCaseSk(p.topic)}</b><br /><span className="amut sm">{p.category}{p.scheduled_for ? ' · ' + new Date(p.scheduled_for).toLocaleString('sk-SK') : ''}</span></td>
            <td><span className={`apill ${p.status === 'done' ? 'good' : 'bad'}`}>{p.status}</span></td>
            <td className="ar"><button className="icbtn" onClick={() => del(p.id)}><Ic n="trash" s={16} /></button></td>
          </tr>
        ))}
        {list.length === 0 && <tr><td className="amut sm">Plán je prázdny — navrhni témy vyššie, alebo si autopilot tému navrhne sám.</td></tr>}
      </tbody></table>
    </div>
    </>
  )
}

function Newsletter() {
  const [list, setList] = useState<any[]>([])
  useEffect(() => { api('/api/admin/subscribers').then(d => setList(d.subscribers)).catch(() => {}) }, [])
  return (
    <div className="acard">
      <h3>Newsletter — odbery ({list.length})</h3>
      <a className="abtn ghost" href="/api/admin/subscribers?format=csv"><Ic n="mail" s={15} /> Export CSV</a>
      <table className="atab2 mt"><tbody>
        {list.map(s => <tr key={s.id}><td>{s.email}</td><td className="amut sm">{s.source}</td><td className="amut sm ar">{new Date(s.created_at).toLocaleDateString('sk-SK')}</td></tr>)}
        {list.length === 0 && <tr><td className="amut sm">Zatiaľ žiadne emaily.</td></tr>}
      </tbody></table>
    </div>
  )
}

function Settings() {
  const [s, setS] = useState<any>(null)
  const [msg, setMsg] = useState('')
  useEffect(() => { api('/api/admin/settings').then(d => setS(d.settings)).catch(() => {}) }, [])
  if (!s) return <div className="acard">Načítavam…</div>
  const set = (k: string, v: any) => setS((p: any) => ({ ...p, [k]: v }))
  const days = [['Po', 1], ['Ut', 2], ['St', 3], ['Št', 4], ['Pi', 5], ['So', 6], ['Ne', 0]] as const
  async function save() { setMsg(''); try { const d = await api('/api/admin/settings', { method: 'POST', body: JSON.stringify(s) }); setS(d.settings); setMsg('Uložené') } catch (e: any) { setMsg(e.message) } }
  return (
    <div className="acard">
      <h3>Nastavenia autopilota</h3>
      <label className="achk"><input type="checkbox" checked={s.autopilotEnabled} onChange={e => set('autopilotEnabled', e.target.checked)} /> Autopilot zapnutý</label>
      <label className="achk"><input type="checkbox" checked={s.autoPublish} onChange={e => set('autoPublish', e.target.checked)} /> Automaticky publikovať (vyp = koncept)</label>
      <label className="achk"><input type="checkbox" checked={s.randomCategory} onChange={e => set('randomCategory', e.target.checked)} /> Náhodne vyberať kategóriu (mix tém)</label>
      <label className="achk"><input type="checkbox" checked={s.randomStyle} onChange={e => set('randomStyle', e.target.checked)} /> Náhodný štýl písania pre každý článok (návod / príbeh / dáta / mýty…)</label>
      <label className="alab">Čím sa firma zaoberá — z toho AI tvorí témy aj texty</label>
      <textarea className="ain" rows={4} value={s.businessContext || ''} onChange={e => set('businessContext', e.target.value)} placeholder="Napr. služby, ktoré ponúkate, cieľová skupina, čím sa odlišujete…" />
      <div className="agrid3">
        <div><label className="alab">Článkov / týždeň</label><input className="ain" type="number" value={s.postsPerWeek} onChange={e => set('postsPerWeek', +e.target.value)} /></div>
        <div><label className="alab">Hodina publikovania</label><input className="ain" type="number" min={0} max={23} value={s.publishHour} onChange={e => set('publishHour', +e.target.value)} /></div>
        <div><label className="alab">Predvolená kategória {s.randomCategory ? '(náhodné je zapnuté)' : ''}</label><select className="ain" value={s.defaultCategory} onChange={e => set('defaultCategory', e.target.value)} disabled={s.randomCategory}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
      </div>
      <label className="alab">Dni publikovania</label>
      <div className="arow wrap">{days.map(([lab, d]) => (
        <button key={d} type="button" className={`aday${s.publishDays.includes(d) ? ' on' : ''}`} onClick={() => set('publishDays', s.publishDays.includes(d) ? s.publishDays.filter((x: number) => x !== d) : [...s.publishDays, d])}>{lab}</button>
      ))}</div>
      <div className="agrid3">
        <div><label className="alab">AI model</label><select className="ain" value={s.model} onChange={e => set('model', e.target.value)}><option value="gpt-4o-mini">gpt-4o-mini (lacný)</option><option value="gpt-4o">gpt-4o (kvalitnejší)</option></select></div>
        <div><label className="alab">Dĺžka článku (slov)</label><input className="ain" type="number" value={s.wordCount} onChange={e => set('wordCount', +e.target.value)} /></div>
        <div><label className="alab">Max. slov v názve</label><input className="ain" type="number" min={3} max={16} value={s.titleMaxWords} onChange={e => set('titleMaxWords', +e.target.value)} /></div>
      </div>
      <div className="agrid3">
        <div><label className="alab">Zdroj fotiek</label><select className="ain" value={s.imageSource} onChange={e => set('imageSource', e.target.value)}><option value="both">Pexels + Pixabay</option><option value="pexels">Pexels</option><option value="pixabay">Pixabay</option></select></div>
        <div><label className="alab">Fotiek na článok</label><select className="ain" value={s.imageCount} onChange={e => set('imageCount', +e.target.value)}><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option></select></div>
        <div><label className="alab">Interných odkazov {s.autoInterlink ? '' : '(prelinkovanie je vyp.)'}</label><select className="ain" value={s.linkCount} onChange={e => set('linkCount', +e.target.value)} disabled={!s.autoInterlink}><option value={0}>0</option><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option></select></div>
      </div>
      <label className="alab">Tón a štýl písania</label>
      <textarea className="ain" rows={3} value={s.tone} onChange={e => set('tone', e.target.value)} />
      <label className="alab">Predmet newslettera</label>
      <input className="ain" value={s.newsletterSubject} onChange={e => set('newsletterSubject', e.target.value)} />
      <div className="arow mt"><button className="abtn" onClick={save}>Uložiť nastavenia</button>{msg && <span className="amut sm">{msg}</span>}</div>
    </div>
  )
}

function CommentsAdmin() {
  const [list, setList] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [edit, setEdit] = useState<any>(null)
  const load = useCallback(async () => setList((await api('/api/admin/comments' + (filter ? `?status=${filter}` : ''))).comments), [filter])
  useEffect(() => { load() }, [load])
  async function act(id: number, patch: any) { await api(`/api/admin/comments/${id}`, { method: 'PUT', body: JSON.stringify(patch) }); load() }
  async function del(id: number) { if (!confirm('Zmazať komentár?')) return; await api(`/api/admin/comments/${id}`, { method: 'DELETE' }); load() }
  async function saveEdit() { await api(`/api/admin/comments/${edit.id}`, { method: 'PUT', body: JSON.stringify({ body: edit.body }) }); setEdit(null); load() }
  return (
    <div className="acard">
      <h3>Komentáre ({list.length})</h3>
      <div className="arow wrap" style={{ marginBottom: 14 }}>
        {[['', 'všetky'], ['pending', 'čakajúce'], ['approved', 'schválené'], ['spam', 'spam']].map(([v, l]) => (
          <button key={v} className={`aday${filter === v ? ' on' : ''}`} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>
      <table className="atab2"><tbody>
        {list.map(c => (
          <tr key={c.id}>
            <td>
              <b>{c.author}</b> <span className="amut sm">{new Date(c.created_at).toLocaleDateString('sk-SK')} · {c.slug}</span>
              {edit?.id === c.id
                ? <textarea className="ain" rows={3} style={{ marginTop: 6 }} value={edit.body} onChange={e => setEdit({ ...edit, body: e.target.value })} />
                : <div style={{ marginTop: 4, fontSize: 14 }}>{c.body}</div>}
            </td>
            <td><span className={`apill ${c.status === 'approved' ? 'good' : 'bad'}`}>{c.status}</span></td>
            <td className="ar" style={{ whiteSpace: 'nowrap' }}>
              {edit?.id === c.id
                ? <><button className="icbtn" title="Uložiť" onClick={saveEdit}><Ic n="check" s={16} /></button><button className="icbtn" title="Zrušiť" onClick={() => setEdit(null)}><Ic n="x" s={16} /></button></>
                : <>{c.status !== 'approved' && <button className="icbtn" title="Schváliť" onClick={() => act(c.id, { status: 'approved' })}><Ic n="check" s={16} /></button>}
                  <button className="icbtn" title="Upraviť" onClick={() => setEdit({ id: c.id, body: c.body })}><Ic n="edit" s={16} /></button>
                  <button className="icbtn" title="Zmazať" onClick={() => del(c.id)}><Ic n="trash" s={16} /></button></>}
            </td>
          </tr>
        ))}
        {list.length === 0 && <tr><td className="amut sm">Žiadne komentáre.</td></tr>}
      </tbody></table>
    </div>
  )
}

function Integrations() {
  const [s, setS] = useState<any>(null)
  const [msg, setMsg] = useState('')
  const [hook, setHook] = useState('')
  const [hookBusy, setHookBusy] = useState(false)
  useEffect(() => { api('/api/admin/site').then(d => setS(d.site)).catch(() => {}) }, [])
  if (!s) return <div className="acard">Načítavam…</div>
  const set = (k: string, v: any) => setS((p: any) => ({ ...p, [k]: v }))
  async function save() { setMsg(''); try { const d = await api('/api/admin/site', { method: 'POST', body: JSON.stringify(s) }); setS(d.site); setMsg('Uložené ✓'.replace('✓', '')) } catch (e: any) { setMsg(e.message) } }
  async function testHook() {
    setHook(''); setHookBusy(true)
    try { const r = await api('/api/admin/webhook', { method: 'POST', body: JSON.stringify({ action: 'test', url: s.webhookUrl, secret: s.webhookSecret }) }); setHook(r.ok ? `OK — cieľ odpovedal ${r.status}.` : `Webhook vrátil chybu${r.status ? ' ' + r.status : ''}${r.error ? ': ' + r.error : ''}.`) }
    catch (e: any) { setHook(e.message) }
    setHookBusy(false)
  }
  async function resendHook() {
    if (!confirm('Poslať všetkých existujúcich odberateľov do CRM cez webhook?')) return
    setHook(''); setHookBusy(true)
    try { const r = await api('/api/admin/webhook', { method: 'POST', body: JSON.stringify({ action: 'resend' }) }); setHook(`Odoslaných ${r.ok}/${r.total} (chyby: ${r.fail}).`) }
    catch (e: any) { setHook(e.message) }
    setHookBusy(false)
  }
  return (
    <>
      <div className="acard">
        <h3>Meranie &amp; tracking</h3>
        <p className="amut sm">Vlož kódy zo svojich účtov — aplikujú sa na celý web hneď po uložení.</p>
        <div className="agrid3">
          <div><label className="alab">Google Analytics (G-…)</label><input className="ain" value={s.gaId} onChange={e => set('gaId', e.target.value)} placeholder="G-XXXXXXX" /></div>
          <div><label className="alab">Meta Pixel ID</label><input className="ain" value={s.metaPixelId} onChange={e => set('metaPixelId', e.target.value)} placeholder="1234567890" /></div>
          <div><label className="alab">Google Tag Manager</label><input className="ain" value={s.gtmId} onChange={e => set('gtmId', e.target.value)} placeholder="GTM-XXXX" /></div>
        </div>
        <label className="alab">Vlastné skripty do &lt;head&gt; (SiteBehaviour, heatmapy…)</label>
        <textarea className="ain mono" rows={6} value={s.headHtml} onChange={e => set('headHtml', e.target.value)} />
      </div>
      <div className="acard">
        <h3>Komentáre — ochrana proti spamu</h3>
        <label className="achk"><input type="checkbox" checked={s.commentsEnabled} onChange={e => set('commentsEnabled', e.target.checked)} /> Komentáre zapnuté</label>
        <label className="achk"><input type="checkbox" checked={s.commentsModeration} onChange={e => set('commentsModeration', e.target.checked)} /> Schvaľovať pred zverejnením (odporúčané)</label>
        <div className="agrid2">
          <div><label className="alab">reCAPTCHA v3 — Site Key</label><input className="ain" value={s.recaptchaSiteKey} onChange={e => set('recaptchaSiteKey', e.target.value)} /></div>
          <div><label className="alab">reCAPTCHA v3 — Secret</label><input className="ain" type="password" value={s.recaptchaSecret} onChange={e => set('recaptchaSecret', e.target.value)} /></div>
        </div>
      </div>
      <div className="acard">
        <h3>API kľúče (autopilot)</h3>
        <p className="amut sm">Tu zadané kľúče majú prednosť pred Vercel premennými. <code>DATABASE_URL</code> musí ostať vo Verceli.</p>
        <div className="agrid3">
          <div><label className="alab">OpenAI API key</label><input className="ain" type="password" value={s.openaiKey} onChange={e => set('openaiKey', e.target.value)} placeholder="sk-…" /></div>
          <div><label className="alab">Pexels API key</label><input className="ain" type="password" value={s.pexelsKey} onChange={e => set('pexelsKey', e.target.value)} /></div>
          <div><label className="alab">Pixabay API key</label><input className="ain" type="password" value={s.pixabayKey} onChange={e => set('pixabayKey', e.target.value)} /></div>
        </div>
      </div>
      <div className="acard">
        <h3>Napojenie na CRM (webhook)</h3>
        <p className="amut sm">Pri každom novom odbere newslettera pošleme POST s kontaktom na túto adresu (tvoje CRM, alebo Make/Zapier). Najprv ulož, potom otestuj.</p>
        <label className="alab">URL webhooku</label>
        <input className="ain" value={s.webhookUrl} onChange={e => set('webhookUrl', e.target.value)} placeholder="https://…/webhook/newsletter" />
        <label className="alab">Tajný kľúč (voliteľné — posiela sa ako hlavička X-Webhook-Secret aj Bearer)</label>
        <input className="ain" type="password" value={s.webhookSecret} onChange={e => set('webhookSecret', e.target.value)} />
        <p className="amut sm">Payload (JSON): <code>{'{ event, email, name, source, subscribedAt, site }'}</code></p>
        <div className="arow wrap">
          <button className="abtn ghost" type="button" onClick={testHook} disabled={hookBusy}>{hookBusy ? 'Pracujem…' : 'Otestovať webhook'}</button>
          <button className="abtn ghost" type="button" onClick={resendHook} disabled={hookBusy}>Poslať všetkých existujúcich</button>
          {hook && <span className="amut sm">{hook}</span>}
        </div>
      </div>
      <div className="arow"><button className="abtn" onClick={save}>Uložiť všetko</button>{msg && <span className="amut sm">{msg}</span>}</div>
    </>
  )
}

const css = `
:root{--bg:#f6f7f9;--card:#fff;--bd:#e6e8ec;--ink:#111827;--mut:#6b7280;--acc:#4f46e5;--acc-sft:#eef2ff;--good:#059669;--good-sft:#ecfdf5;--bad:#9ca3af;--bad-sft:#f3f4f6}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);font-family:'Inter',-apple-system,sans-serif;color:var(--ink)}
.aload,.alogin{min-height:100vh;display:flex;align-items:center;justify-content:center;color:var(--mut)}
.lcard{width:360px;text-align:center}
.licon{width:52px;height:52px;border-radius:14px;background:var(--acc-sft);color:var(--acc);display:flex;align-items:center;justify-content:center;margin:0 auto 14px}
.lcard h1{font-size:20px;font-weight:700;margin:0 0 2px}
.pin{text-align:center;letter-spacing:8px;font-size:22px}
.aw{display:flex;min-height:100vh}
.aside{width:230px;flex-shrink:0;background:var(--card);border-right:1px solid var(--bd);padding:22px 16px;display:flex;flex-direction:column;gap:4px;position:sticky;top:0;height:100vh}
.alogo{font-weight:800;font-size:18px;letter-spacing:-.3px;display:flex;align-items:center;gap:9px;padding:0 10px 18px}
.adot{width:11px;height:11px;border-radius:50%;background:var(--acc)}
.anav{display:flex;flex-direction:column;gap:3px;flex:1}
.anav-i{display:flex;align-items:center;gap:11px;font-family:inherit;font-size:14px;font-weight:500;color:var(--mut);background:none;border:0;padding:10px 12px;border-radius:9px;cursor:pointer;text-align:left;width:100%}
.anav-i:hover{background:var(--bg);color:var(--ink)}
.anav-i.on{background:var(--acc-sft);color:var(--acc);font-weight:600}
.anav-badge{background:#dc2626;color:#fff;font-size:11px;font-weight:700;min-width:18px;height:18px;border-radius:50px;display:inline-flex;align-items:center;justify-content:center;padding:0 5px}
.anav-i.out{color:var(--mut);margin-top:8px}
.amain{flex:1;padding:26px 30px;max-width:960px}
.ahd{font-size:22px;font-weight:700;margin:0 0 18px;letter-spacing:-.4px}
.acard{background:var(--card);border:1px solid var(--bd);border-radius:13px;padding:22px;margin-bottom:16px;box-shadow:0 1px 2px rgba(16,24,40,.04)}
.acard h3{font-size:15px;font-weight:700;margin:0 0 14px}
.amut{color:var(--mut)}.amut.sm{font-size:13px}.sm{font-size:13px}
.alab{display:block;font-size:12px;font-weight:600;color:var(--mut);margin-bottom:6px}
.ain{width:100%;font-family:inherit;font-size:14px;padding:10px 12px;border:1px solid var(--bd);border-radius:9px;margin-bottom:13px;outline:none;background:#fff;color:var(--ink)}
.ain:focus{border-color:var(--acc);box-shadow:0 0 0 3px var(--acc-sft)}
.ain.mono{font-family:'Space Mono',monospace;font-size:12.5px;line-height:1.5}
.abtn{display:inline-flex;align-items:center;gap:7px;font-family:inherit;font-weight:600;font-size:13.5px;padding:9px 16px;border:1px solid var(--acc);border-radius:9px;background:var(--acc);color:#fff;cursor:pointer}
.abtn:hover{background:#4338ca}.abtn:disabled{opacity:.5;cursor:default}
.abtn.ghost{background:#fff;color:var(--ink);border-color:var(--bd)}.abtn.ghost:hover{background:var(--bg)}
.abtn.full{width:100%;justify-content:center;padding:11px}
.icbtn{background:none;border:1px solid var(--bd);border-radius:8px;padding:7px;color:var(--mut);cursor:pointer;margin-left:6px}
.icbtn:hover{color:var(--acc);border-color:var(--acc)}
.arow{display:flex;gap:10px;align-items:center}.arow.wrap{flex-wrap:wrap}.arow.mt,.mt{margin-top:14px}
.agrid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.agrid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
@media(max-width:760px){.aside{width:64px;padding:18px 8px}.anav-i span,.alogo{font-size:0}.anav-i{justify-content:center;gap:0}.agrid2,.agrid3{grid-template-columns:1fr}}
.apill{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:4px 10px;border-radius:50px}
.apill.good{background:var(--good-sft);color:var(--good)}.apill.bad{background:var(--bad-sft);color:var(--bad)}
.awarn{display:flex;align-items:center;gap:8px;background:#fffbeb;border:1px solid #fde68a;color:#92400e;border-radius:9px;padding:10px 13px;font-size:13px;margin-bottom:13px}
.aerr{color:#dc2626;font-size:13px;margin-bottom:11px;font-weight:500}
.apre{background:#0f172a;color:#a3e635;padding:13px;border-radius:9px;font-size:12px;overflow:auto;margin-top:12px;font-family:'Space Mono',monospace}
.atab2{width:100%;border-collapse:collapse}.atab2.mt{margin-top:6px}
.atab2 td{border-bottom:1px solid var(--bd);padding:11px 6px;vertical-align:middle;font-size:14px}
.atab2 tr:last-child td{border-bottom:0}.ar{text-align:right}
.aimgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:8px;margin-top:10px}
.athumb{position:relative;border:1px solid var(--bd);border-radius:9px;overflow:hidden;cursor:pointer;padding:0;background:none;aspect-ratio:4/3}
.athumb.on{outline:2px solid var(--acc);outline-offset:1px}
.athumb img{width:100%;height:100%;object-fit:cover;display:block}
.athumb span{position:absolute;bottom:0;left:0;right:0;background:rgba(15,23,42,.65);color:#fff;font-size:9px;text-align:center;padding:2px}
.aimgsel{width:100%;max-height:220px;object-fit:cover;border:1px solid var(--bd);border-radius:10px;margin-bottom:11px}
.achk{display:flex;align-items:center;gap:9px;font-size:14px;margin-bottom:11px;cursor:pointer}
.aday{font-family:inherit;font-size:13px;font-weight:600;padding:7px 13px;border:1px solid var(--bd);border-radius:8px;background:#fff;color:var(--mut);cursor:pointer}
.aday.on{background:var(--acc-sft);color:var(--acc);border-color:var(--acc)}
.stat-row{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
@media(max-width:760px){.stat-row{grid-template-columns:repeat(2,1fr)}}
.stat-box2{background:var(--bg);border:1px solid var(--bd);border-radius:10px;padding:16px}
.stat-box2 b{display:block;font-size:26px;font-weight:800;letter-spacing:-1px;color:var(--ink);line-height:1}
.stat-box2 span{font-size:12px;color:var(--mut)}
.etb{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.etb button{font-family:inherit;font-size:12px;font-weight:600;padding:6px 10px;border:1px solid var(--bd);border-radius:7px;background:#fff;color:var(--ink);cursor:pointer}
.etb button:hover{background:var(--bg);border-color:var(--acc);color:var(--acc)}
.eprev{border:1px solid var(--bd);border-radius:9px;padding:16px 18px;background:#fff;max-height:360px;overflow:auto;font-size:14px;line-height:1.6}
.eprev h2{font-size:19px;font-weight:700;margin:16px 0 8px}.eprev h3{font-size:16px;font-weight:700;margin:14px 0 6px}
.eprev p{margin:0 0 10px}.eprev a{color:var(--acc);text-decoration:underline}.eprev ul{margin:0 0 10px 20px}
.eprev img{max-width:100%;border-radius:8px;margin:10px 0}
.rich{border:1px solid var(--bd);border-radius:9px;padding:16px 18px;background:#fff;min-height:380px;font-size:14px;line-height:1.6;outline:none;overflow:auto;color:var(--ink)}
.rich:focus{border-color:var(--acc);box-shadow:0 0 0 3px var(--acc-sft)}
.rich:empty:before{content:'Začni písať článok…';color:#9ca3af}
.rich h2{font-size:19px;font-weight:700;margin:16px 0 8px}.rich h3{font-size:16px;font-weight:700;margin:14px 0 6px}
.rich p{margin:0 0 10px}.rich a{color:var(--acc);text-decoration:underline}.rich ul,.rich ol{margin:0 0 10px 20px}
.rich figure{margin:12px 0}.rich img{max-width:100%;border-radius:8px;display:block}
.ed-split{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start}
.ed-split .ain.mono{margin-bottom:0;min-height:360px}
.ed-split .eprev{max-height:none;min-height:360px}
@media(max-width:760px){.ed-split{grid-template-columns:1fr}}
.amodal{position:fixed;inset:0;z-index:1000;display:flex;align-items:flex-start;justify-content:center;background:rgba(15,23,42,.55);backdrop-filter:blur(2px);overflow:auto;padding:24px}
.amodal-card{background:var(--bg);width:min(1040px,100%);border-radius:14px;margin:12px 0 40px;box-shadow:0 24px 70px rgba(0,0,0,.35)}
.amodal-top{position:sticky;top:0;background:var(--card);border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-radius:14px 14px 0 0;z-index:3}
.amodal-top b{font-size:15px;font-weight:700}
.amodal-body{padding:18px 20px}
.amodal-body .acard{margin-bottom:0;border:0;box-shadow:none;padding:0;background:none}
`
