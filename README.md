# Monetico.sk — Next.js Web

Ultra-moderný statický web pre Monetico agentúru, vygenerovaný z WordPress exportu.

## Stack

- **Next.js 14** — React framework (static export)
- **TypeScript** — type safety
- **Vercel** — hosting + CDN
- **Teable.ai** — CMS / správa článkov (voliteľné)

## Obsah

- **162 publikovaných článkov** z WordPress
- Zachované všetky pôvodné URL-ky (`/nazov-clanku/`)
- Kompletné SEO metadáta (meta title, meta desc, OG, canonical)
- Sitemap.xml automaticky generovaný
- robots.txt

---

## 1. Lokálny vývoj

```bash
# Nainštalovať závislosti
npm install

# Spustiť lokálne
npm run dev
# → http://localhost:3000

# Build (statický export)
npm run build
```

---

## 2. GitHub — prvý push

```bash
# Inicializovať repo (ak ešte nemáš)
git init
git add .
git commit -m "feat: initial Next.js site from WordPress export"

# Pridaj GitHub remote (vytvor repo na github.com/monetico)
git remote add origin https://github.com/TVOJ-USERNAME/monetico-web.git
git push -u origin main
```

---

## 3. Vercel — deploy

1. Choď na [vercel.com](https://vercel.com) → **New Project**
2. Importuj GitHub repo `monetico-web`
3. Framework: **Next.js** (detekuje automaticky)
4. Build command: `npm run build`
5. Output directory: `out`
6. Klikni **Deploy** ✅

### Custom doména (monetico.sk)

V Vercel → Settings → Domains:
- Pridaj `monetico.sk` a `www.monetico.sk`
- Skopíruj DNS záznamy do tvojho registrátora (napr. Wedos, Websupport)
- Vercel automaticky vygeneruje SSL certifikát

---

## 4. Teable.ai — CMS pre články

### Import článkov

1. Choď na [teable.ai](https://teable.ai) → nová base → nová tabuľka
2. Import → CSV → nahraj `public/teable-import.csv`
3. Teable automaticky vytvorí všetky stĺpce

### Štruktúra tabuľky (162 článkov)

| Stĺpec | Popis |
|--------|-------|
| Nadpis | Titulok článku |
| Slug | URL-slug (napr. `cold-email-kampane`) |
| URL | Plná URL adresa |
| Dátum publikácie | YYYY-MM-DD |
| Kategórie | Čiarkami oddelené kategórie |
| Meta title | SEO title |
| Meta description | SEO popis |
| Stav SEO | OK / Chýba meta desc |
| Obsah (text) | Čistý text článku |

### Prepojenie Teable → Vercel (voliteľné, pre live CMS)

Ak chceš editovať články v Teable a automaticky deploynúť:

1. V Teable: Settings → API → vygeneruj API kľúč
2. V `lib/posts.ts` prepni načítanie z JSON na Teable API:

```typescript
// Nahraď import postsData z JSON:
const response = await fetch(
  `https://app.teable.io/api/table/TABLE_ID/record`,
  { headers: { Authorization: `Bearer ${process.env.TEABLE_API_KEY}` } }
)
const data = await response.json()
```

3. V Vercel: Settings → Environment Variables:
   - `TEABLE_API_KEY` = tvoj API kľúč

4. V Teable: nastav Automation → pri zmene záznamu → trigger Vercel deploy webhook

---

## 5. Pridanie nového článku

### Varianta A — priamo do JSON (jednoduchšia)

Pridaj záznam do `lib/posts-data.json`:

```json
{
  "id": "163",
  "title": "Nový článok",
  "slug": "novy-clanok",
  "url": "/novy-clanok/",
  "date": "2025-11-01",
  "author": "Michal Mikula",
  "categories": ["Marketing tipy"],
  "tags": ["cold email", "B2B"],
  "content": "<p>Obsah článku...</p>",
  "excerpt": "",
  "meta_title": "Nový článok | Monetico",
  "meta_desc": "Popis pre Google max 155 znakov.",
  "meta_keywords": "",
  "og_title": "",
  "og_desc": "",
  "reading_time": 5
}
```

Potom: `git add . && git commit -m "add: novy-clanok" && git push`
→ Vercel automaticky deployne.

### Varianta B — cez Teable (pohodlnejšie)

Pridaj riadok v Teable, Vercel dostane webhook → automatický rebuild.

---

## SEO checklist

- ✅ Canonical URL pre každý článok
- ✅ Meta title + meta description
- ✅ OG tags (Facebook, LinkedIn)
- ✅ Sitemap.xml (`/sitemap.xml`)
- ✅ robots.txt (`/robots.txt`)
- ✅ Trailing slash konzistentnosť
- ✅ 301 redirect z `monetico.sk` → `www.monetico.sk`
- ⚠️  **94 článkov nemá meta description** — doplniť v Teable

---

## Štruktúra projektu

```
monetico-web/
├── components/
│   ├── Nav.tsx
│   ├── Footer.tsx
│   ├── PostCard.tsx
│   └── SEO.tsx
├── lib/
│   ├── posts.ts              ← data utilities
│   ├── posts-data.json       ← 162 článkov (z WP exportu)
│   └── renderContent.ts      ← WordPress HTML cleaner
├── pages/
│   ├── index.tsx             ← Home
│   ├── blog/index.tsx        ← Archív článkov
│   ├── [slug]/index.tsx      ← Každý článok
│   ├── kontakt/index.tsx     ← Kontakt
│   ├── 404.tsx
│   ├── sitemap.xml.tsx
│   └── robots.txt.tsx
├── public/
│   └── teable-import.csv     ← Import do Teable
├── styles/
│   └── globals.css
├── next.config.js
├── vercel.json
└── package.json
```
