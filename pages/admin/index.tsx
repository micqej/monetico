import { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'

type Session = { authed: boolean; configured: boolean; db: boolean; ai: boolean; pexels: boolean; pixabay: boolean }
type Article = any
type ImageR = { url: string; thumb: string; credit: string; source: string }

const CATEGORIES = ['Marketing Tipy', 'Podnikanie', 'O eshopoch', 'Ako na to', 'Analýza', 'Email', 'SEO', 'WordPress', 'O weboch', 'Sociálne siete']
const TABS = ['Prehľad', 'Generovať', 'Články', 'Plán', 'Newsletter', 'Nastavenia'] as const
type Tab = typeof TABS[number]

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
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [tab, setTab] = useState<Tab>('Prehľad')

  const refresh = useCallback(async () => {
    const s = await api('/api/admin/session')
    setSess(s)
  }, [])
  useEffect(() => { refresh() }, [refresh])

  async function login(e: any) {
    e.preventDefault(); setErr('')
    try { await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ password: pw }) }); await refresh() }
    catch (e: any) { setErr(e.message) }
  }
  async function logout() { await api('/api/admin/logout', { method: 'POST' }); await refresh() }

  return (
    <>
      <Head><title>Admin — Monetico</title><meta name="robots" content="noindex, nofollow" /></Head>
      <style>{css}</style>
      <div className="aw">
        <header className="ah">
          <div className="alogo"><span className="adot" />MONETICO <em>admin</em></div>
          {sess?.authed && <button className="abtn ghost" onClick={logout}>Odhlásiť</button>}
        </header>

        {!sess ? <div className="acard">Načítavam…</div> : !sess.authed ? (
          <form className="acard login" onSubmit={login}>
            <h2>Prihlásenie</h2>
            {!sess.configured && <div className="awarn">⚠ Nastav <code>ADMIN_PASSWORD</code> vo Vercel env premenných.</div>}
            <input className="ain" type="password" placeholder="Heslo" value={pw} onChange={e => setPw(e.target.value)} />
            {err && <div className="aerr">{err}</div>}
            <button className="abtn" type="submit">Vstúpiť →</button>
          </form>
        ) : (
          <>
            <nav className="atabs">{TABS.map(t => (
              <button key={t} className={`atab${tab === t ? ' on' : ''}`} onClick={() => setTab(t)}>{t}</button>
            ))}</nav>
            {tab === 'Prehľad' && <Overview sess={sess} />}
            {tab === 'Generovať' && <Generate sess={sess} />}
            {tab === 'Články' && <Articles />}
            {tab === 'Plán' && <Plan sess={sess} />}
            {tab === 'Newsletter' && <Newsletter />}
            {tab === 'Nastavenia' && <Settings />}
          </>
        )}
      </div>
    </>
  )
}

function Status({ ok, label }: { ok: boolean; label: string }) {
  return <span className={`apill ${ok ? 'good' : 'bad'}`}>{ok ? '✓' : '✗'} {label}</span>
}

function Overview({ sess }: { sess: Session }) {
  const [run, setRun] = useState<any>(null)
  const [busy, setBusy] = useState(false)
  async function runNow() {
    setBusy(true); setRun(null)
    try { setRun(await api('/api/admin/run-autopilot', { method: 'POST' })) }
    catch (e: any) { setRun({ ok: false, reason: e.message }) }
    setBusy(false)
  }
  return (
    <div className="acard">
      <h2>Stav integrácií</h2>
      <div className="arow">
        <Status ok={sess.db} label="Databáza (Neon)" />
        <Status ok={sess.ai} label="OpenAI" />
        <Status ok={sess.pexels} label="Pexels" />
        <Status ok={sess.pixabay} label="Pixabay" />
      </div>
      <p className="amuted">Čo chýba, doplň vo Vercel → Settings → Environment Variables: <code>DATABASE_URL</code> (Neon integrácia), <code>OPENAI_API_KEY</code>, <code>PEXELS_API_KEY</code>, <code>PIXABAY_API_KEY</code>, <code>ADMIN_PASSWORD</code>, <code>CRON_SECRET</code>.</p>
      <hr className="ahr" />
      <h2>Autopilot</h2>
      <p className="amuted">Spustí jeden cyklus: vyberie tému z plánu (alebo navrhne novú), vygeneruje článok, pridá fotku a podľa nastavení publikuje.</p>
      <button className="abtn" onClick={runNow} disabled={busy}>{busy ? 'Pracujem…' : 'Spustiť autopilota teraz'}</button>
      {run && <pre className="apre">{JSON.stringify(run, null, 2)}</pre>}
    </div>
  )
}

function Editor({ initial, images, onSaved }: { initial: any; images: ImageR[]; onSaved: () => void }) {
  const [a, setA] = useState<any>(initial)
  const [imgs, setImgs] = useState<ImageR[]>(images)
  const [q, setQ] = useState('')
  const [msg, setMsg] = useState('')
  const set = (k: string, v: any) => setA((p: any) => ({ ...p, [k]: v }))

  async function searchImg() {
    if (!q) return
    try { const d = await api(`/api/admin/images?q=${encodeURIComponent(q)}&source=both`); setImgs(d.images) } catch {}
  }
  async function save(status: string) {
    setMsg('')
    const payload = { ...a, status, tags: String(a.tags).split(',').map((t: string) => t.trim()).filter(Boolean) }
    try {
      if (a.id) await api(`/api/admin/articles/${a.id}`, { method: 'PUT', body: JSON.stringify(payload) })
      else await api('/api/admin/articles', { method: 'POST', body: JSON.stringify(payload) })
      setMsg('Uložené ✓'); onSaved()
    } catch (e: any) { setMsg(e.message) }
  }

  return (
    <div className="acard">
      <h2>{a.id ? 'Upraviť článok' : 'Nový článok'}</h2>
      <label className="alab">Titulok</label>
      <input className="ain" value={a.title} onChange={e => set('title', e.target.value)} />
      <div className="agrid2">
        <div><label className="alab">Kategória</label>
          <select className="ain" value={a.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select></div>
        <div><label className="alab">Tagy (čiarka)</label>
          <input className="ain" value={a.tags} onChange={e => set('tags', e.target.value)} /></div>
      </div>
      <label className="alab">Perex / excerpt</label>
      <textarea className="ain" rows={2} value={a.excerpt} onChange={e => set('excerpt', e.target.value)} />
      <label className="alab">Obsah (HTML)</label>
      <textarea className="ain mono" rows={14} value={a.content} onChange={e => set('content', e.target.value)} />
      <div className="agrid2">
        <div><label className="alab">Meta title</label><input className="ain" value={a.meta_title} onChange={e => set('meta_title', e.target.value)} /></div>
        <div><label className="alab">Meta keywords</label><input className="ain" value={a.meta_keywords} onChange={e => set('meta_keywords', e.target.value)} /></div>
      </div>
      <label className="alab">Meta description</label>
      <textarea className="ain" rows={2} value={a.meta_desc} onChange={e => set('meta_desc', e.target.value)} />

      <label className="alab">Obrázok</label>
      {a.image_url && <img className="aimgsel" src={a.image_url} alt="" />}
      <div className="arow">
        <input className="ain" placeholder="Hľadať fotku (napr. email marketing)" value={q} onChange={e => setQ(e.target.value)} />
        <button className="abtn ghost" type="button" onClick={searchImg}>Hľadať</button>
      </div>
      <div className="aimgs">
        {imgs.map((im, i) => (
          <button key={i} type="button" className={`athumb${a.image_url === im.url ? ' on' : ''}`} title={im.credit}
            onClick={() => { set('image_url', im.url); set('image_credit', im.credit) }}>
            <img src={im.thumb} alt="" /><span>{im.source}</span>
          </button>
        ))}
      </div>

      <div className="arow" style={{ marginTop: 16 }}>
        <button className="abtn ghost" onClick={() => save('draft')}>Uložiť koncept</button>
        <button className="abtn" onClick={() => save('published')}>Publikovať →</button>
        {msg && <span className="amuted">{msg}</span>}
      </div>
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
      setEditor({
        ...emptyEditor, title: d.article.title, category: d.article.category,
        tags: (d.article.tags || []).join(', '), content: d.article.content, excerpt: d.article.excerpt,
        meta_title: d.article.meta_title, meta_desc: d.article.meta_desc, meta_keywords: d.article.meta_keywords,
        image_url: d.images?.[0]?.url || '', image_credit: d.images?.[0]?.credit || '',
      })
    } catch (e: any) { setErr(e.message) }
    setBusy(false)
  }

  return (
    <>
      <div className="acard">
        <h2>Generovať článok cez AI</h2>
        {!sess.ai && <div className="awarn">⚠ Najprv nastav <code>OPENAI_API_KEY</code>.</div>}
        <label className="alab">Téma / kľúčové slovo</label>
        <input className="ain" placeholder="napr. Ako začať s cold emailingom v roku 2026" value={topic} onChange={e => setTopic(e.target.value)} />
        <label className="alab">Kategória</label>
        <select className="ain" value={cat} onChange={e => setCat(e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
        {err && <div className="aerr">{err}</div>}
        <button className="abtn" onClick={gen} disabled={busy || !topic}>{busy ? 'Generujem…' : 'Vygenerovať ✨'}</button>
      </div>
      {editor && <Editor initial={editor} images={images} onSaved={() => {}} />}
    </>
  )
}

function Articles() {
  const [list, setList] = useState<Article[]>([])
  const [edit, setEdit] = useState<any>(null)
  const load = useCallback(async () => { const d = await api('/api/admin/articles'); setList(d.articles) }, [])
  useEffect(() => { load() }, [load])
  async function del(id: number) { if (!confirm('Zmazať článok?')) return; await api(`/api/admin/articles/${id}`, { method: 'DELETE' }); load() }
  function openEdit(a: Article) {
    setEdit({ id: a.id, title: a.title, slug: a.slug, category: a.category, tags: (a.tags || []).join(', '),
      content: a.content, excerpt: a.excerpt, meta_title: a.meta_title, meta_desc: a.meta_desc,
      meta_keywords: a.meta_keywords, image_url: a.image_url, image_credit: a.image_credit, status: a.status })
  }
  return (
    <>
      <div className="acard">
        <h2>Články ({list.length})</h2>
        <table className="atab2"><tbody>
          {list.map(a => (
            <tr key={a.id}>
              <td><b>{a.title}</b><br /><span className="amuted">{a.category} · {a.source}</span></td>
              <td><span className={`apill ${a.status === 'published' ? 'good' : 'bad'}`}>{a.status}</span></td>
              <td style={{ textAlign: 'right' }}>
                <button className="abtn ghost sm" onClick={() => openEdit(a)}>Upraviť</button>
                <button className="abtn ghost sm" onClick={() => del(a.id)}>Zmazať</button>
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td className="amuted">Zatiaľ žiadne články z admina (162 pôvodných je v statických dátach).</td></tr>}
        </tbody></table>
      </div>
      {edit && <Editor initial={edit} images={[]} onSaved={() => { setEdit(null); load() }} />}
    </>
  )
}

function Plan({ sess }: { sess: Session }) {
  const [list, setList] = useState<any[]>([])
  const [topic, setTopic] = useState('')
  const [cat, setCat] = useState('Marketing Tipy')
  const [when, setWhen] = useState('')
  const load = useCallback(async () => { const d = await api('/api/admin/plan'); setList(d.plan) }, [])
  useEffect(() => { load() }, [load])
  async function add() {
    if (!topic) return
    await api('/api/admin/plan', { method: 'POST', body: JSON.stringify({ topic, category: cat, scheduled_for: when || null }) })
    setTopic(''); setWhen(''); load()
  }
  async function del(id: number) { await api(`/api/admin/plan/${id}`, { method: 'DELETE' }); load() }
  return (
    <div className="acard">
      <h2>Plán obsahu</h2>
      <p className="amuted">Témy, ktoré autopilot postupne spracuje. Môžeš naplánovať mesiace dopredu (dátum je voliteľný).</p>
      <div className="agrid3">
        <input className="ain" placeholder="Téma" value={topic} onChange={e => setTopic(e.target.value)} />
        <select className="ain" value={cat} onChange={e => setCat(e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
        <input className="ain" type="datetime-local" value={when} onChange={e => setWhen(e.target.value)} />
      </div>
      <button className="abtn" onClick={add} disabled={!topic}>Pridať do plánu</button>
      <table className="atab2" style={{ marginTop: 16 }}><tbody>
        {list.map(p => (
          <tr key={p.id}>
            <td><b>{p.topic}</b><br /><span className="amuted">{p.category}{p.scheduled_for ? ' · ' + new Date(p.scheduled_for).toLocaleString('sk-SK') : ''}</span></td>
            <td><span className={`apill ${p.status === 'done' ? 'good' : 'bad'}`}>{p.status}</span></td>
            <td style={{ textAlign: 'right' }}><button className="abtn ghost sm" onClick={() => del(p.id)}>Zmazať</button></td>
          </tr>
        ))}
        {list.length === 0 && <tr><td className="amuted">Plán je prázdny — autopilot si tému navrhne sám.</td></tr>}
      </tbody></table>
    </div>
  )
}

function Newsletter() {
  const [list, setList] = useState<any[]>([])
  useEffect(() => { api('/api/admin/subscribers').then(d => setList(d.subscribers)).catch(() => {}) }, [])
  return (
    <div className="acard">
      <h2>Newsletter — odbery ({list.length})</h2>
      <a className="abtn ghost" href="/api/admin/subscribers?format=csv">Export CSV</a>
      <table className="atab2" style={{ marginTop: 16 }}><tbody>
        {list.map(s => <tr key={s.id}><td>{s.email}</td><td className="amuted">{s.source}</td><td className="amuted" style={{ textAlign: 'right' }}>{new Date(s.created_at).toLocaleDateString('sk-SK')}</td></tr>)}
        {list.length === 0 && <tr><td className="amuted">Zatiaľ žiadne emaily.</td></tr>}
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
  async function save() { setMsg(''); try { const d = await api('/api/admin/settings', { method: 'POST', body: JSON.stringify(s) }); setS(d.settings); setMsg('Uložené ✓') } catch (e: any) { setMsg(e.message) } }
  return (
    <div className="acard">
      <h2>Nastavenia autopilota</h2>
      <label className="achk"><input type="checkbox" checked={s.autopilotEnabled} onChange={e => set('autopilotEnabled', e.target.checked)} /> Autopilot zapnutý</label>
      <label className="achk"><input type="checkbox" checked={s.autoPublish} onChange={e => set('autoPublish', e.target.checked)} /> Automaticky publikovať (vyp = ukladať ako koncept)</label>
      <label className="achk"><input type="checkbox" checked={s.autoInterlink} onChange={e => set('autoInterlink', e.target.checked)} /> Automatické prelinkovanie</label>
      <div className="agrid3">
        <div><label className="alab">Článkov / týždeň</label><input className="ain" type="number" value={s.postsPerWeek} onChange={e => set('postsPerWeek', +e.target.value)} /></div>
        <div><label className="alab">Hodina publikovania</label><input className="ain" type="number" min={0} max={23} value={s.publishHour} onChange={e => set('publishHour', +e.target.value)} /></div>
        <div><label className="alab">Predvolená kategória</label><select className="ain" value={s.defaultCategory} onChange={e => set('defaultCategory', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
      </div>
      <label className="alab">Dni publikovania</label>
      <div className="arow">{days.map(([lab, d]) => (
        <label key={d} className={`aday${s.publishDays.includes(d) ? ' on' : ''}`}>
          <input type="checkbox" checked={s.publishDays.includes(d)} onChange={e => set('publishDays', e.target.checked ? [...s.publishDays, d] : s.publishDays.filter((x: number) => x !== d))} />{lab}
        </label>
      ))}</div>
      <div className="agrid3">
        <div><label className="alab">AI model</label><select className="ain" value={s.model} onChange={e => set('model', e.target.value)}><option value="gpt-4o-mini">gpt-4o-mini (lacný)</option><option value="gpt-4o">gpt-4o (kvalitnejší)</option></select></div>
        <div><label className="alab">Kreativita (0–1)</label><input className="ain" type="number" step="0.1" min={0} max={1} value={s.temperature} onChange={e => set('temperature', +e.target.value)} /></div>
        <div><label className="alab">Dĺžka (slov)</label><input className="ain" type="number" value={s.wordCount} onChange={e => set('wordCount', +e.target.value)} /></div>
      </div>
      <label className="alab">Zdroj fotiek</label>
      <select className="ain" value={s.imageSource} onChange={e => set('imageSource', e.target.value)}><option value="both">Pexels + Pixabay</option><option value="pexels">Pexels</option><option value="pixabay">Pixabay</option></select>
      <label className="alab">Tón a štýl písania</label>
      <textarea className="ain" rows={3} value={s.tone} onChange={e => set('tone', e.target.value)} />
      <label className="alab">Predmet newslettera</label>
      <input className="ain" value={s.newsletterSubject} onChange={e => set('newsletterSubject', e.target.value)} />
      <div className="arow" style={{ marginTop: 16 }}><button className="abtn" onClick={save}>Uložiť nastavenia</button>{msg && <span className="amuted">{msg}</span>}</div>
    </div>
  )
}

const css = `
.aw{max-width:1000px;margin:0 auto;padding:24px 18px 80px;font-family:'Inter',-apple-system,sans-serif;color:#0e0e0c}
.ah{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.alogo{font-weight:900;font-size:20px;display:flex;align-items:center;gap:9px;letter-spacing:-.5px}.alogo em{color:#6b21d9;font-style:normal}
.adot{width:12px;height:12px;border-radius:50%;background:#6b21d9}
.acard{background:#fff;border:2px solid #0e0e0c;border-radius:16px;box-shadow:4px 4px 0 #0e0e0c;padding:24px;margin-bottom:18px}
.acard h2{font-size:20px;font-weight:800;letter-spacing:-.4px;margin-bottom:14px}
.login{max-width:380px;margin:60px auto}
.atabs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px}
.atab{font-family:inherit;font-weight:700;font-size:13px;padding:9px 15px;border:2px solid #0e0e0c;border-radius:50px;background:#fff;cursor:pointer;box-shadow:2px 2px 0 #0e0e0c}
.atab.on{background:#f5e642}
.abtn{font-family:inherit;font-weight:800;font-size:13px;padding:11px 20px;border:2px solid #0e0e0c;border-radius:50px;background:#f5e642;color:#0e0e0c;cursor:pointer;box-shadow:3px 3px 0 #0e0e0c}
.abtn:hover{transform:translate(-1px,-1px)}.abtn:disabled{opacity:.5;cursor:default}
.abtn.ghost{background:#fff}.abtn.sm{padding:7px 13px;font-size:12px;box-shadow:2px 2px 0 #0e0e0c;margin-left:6px}
.ain{width:100%;font-family:inherit;font-size:14px;padding:11px 14px;border:2px solid #0e0e0c;border-radius:12px;margin-bottom:12px;outline:none;background:#fff}
.ain.mono{font-family:'Space Mono',monospace;font-size:12.5px}
.alab{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b6b68;margin-bottom:6px}
.amuted{color:#6b6b68;font-size:13px}
.aerr{color:#c0392b;font-size:13px;margin-bottom:10px;font-weight:600}
.awarn{background:#fff3cd;border:2px solid #0e0e0c;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:12px}
.arow{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.agrid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.agrid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
@media(max-width:640px){.agrid2,.agrid3{grid-template-columns:1fr}}
.apill{font-size:11px;font-weight:700;padding:4px 11px;border-radius:50px;border:2px solid #0e0e0c;text-transform:uppercase}
.apill.good{background:#d1fae5}.apill.bad{background:#ffe0e0}
.ahr{border:none;border-top:1px solid #e4e3de;margin:20px 0}
.apre{background:#0e0e0c;color:#c4f000;padding:14px;border-radius:10px;font-size:12px;overflow:auto;margin-top:12px}
.atab2{width:100%;border-collapse:collapse}
.atab2 td{border-bottom:1px solid #e4e3de;padding:11px 8px;vertical-align:top;font-size:14px}
.aimgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin-top:10px}
.athumb{position:relative;border:2px solid #0e0e0c;border-radius:10px;overflow:hidden;cursor:pointer;padding:0;background:none;aspect-ratio:4/3}
.athumb.on{outline:3px solid #6b21d9;outline-offset:1px}
.athumb img{width:100%;height:100%;object-fit:cover;display:block}
.athumb span{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.6);color:#fff;font-size:9px;text-align:center;padding:2px}
.aimgsel{width:100%;max-height:220px;object-fit:cover;border:2px solid #0e0e0c;border-radius:12px;margin-bottom:10px}
.achk{display:flex;align-items:center;gap:9px;font-size:14px;font-weight:600;margin-bottom:10px;cursor:pointer}
.aday{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:700;padding:7px 12px;border:2px solid #0e0e0c;border-radius:50px;cursor:pointer}
.aday.on{background:#f5e642}.aday input{display:none}
`
