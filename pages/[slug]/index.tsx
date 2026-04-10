import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import PostCard from '../../components/PostCard'
import SEO from '../../components/SEO'
import { getAllPosts, getPostBySlug, getAllSlugs, formatDate, Post } from '../../lib/posts'
import { renderWordPressContent, extractHeadings } from '../../lib/renderContent'
import { SITE_URL } from '../../lib/site'

interface Props {
  post: Post
  related: Post[]
  headings: { id: string; text: string; level: number }[]
  cleanContent: string
}

export default function PostPage({ post, related, headings, cleanContent }: Props) {
  const canonical = `${SITE_URL}/${post.slug}/`
  const cat = post.categories[0] || 'Blog'

  return (
    <>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_desc}
        canonical={canonical}
        ogTitle={post.og_title || post.meta_title || post.title}
        ogDesc={post.og_desc || post.meta_desc}
        keywords={post.meta_keywords}
        type="article"
      />
      <Nav />

      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">·</span>
        <Link href="/blog/">Blog</Link>
        {post.categories[0] && (
          <>
            <span className="sep">·</span>
            <Link href={`/blog/`}>{post.categories[0]}</Link>
          </>
        )}
        <span className="sep">·</span>
        <span className="current">{post.title.slice(0, 40)}{post.title.length > 40 ? '…' : ''}</span>
      </div>

      {/* ARTICLE HERO */}
      <div className="article-hero">
        <span className="article-cat-badge">{cat}</span>
        <h1 className="article-title">{post.title}</h1>
        <div className="article-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="meta-dot">M</div>
            <div className="meta-info">
              <strong>{post.author || 'Michal Mikula'}</strong>
              Monetico Agentúra
            </div>
          </div>
          <div className="meta-info">
            <strong>{formatDate(post.date)}</strong>
            {post.reading_time} min čítania
          </div>
          {post.tags.length > 0 && (
            <div className="meta-info">
              <strong>{post.tags.slice(0, 3).join(', ')}</strong>
              Tagy
            </div>
          )}
        </div>
      </div>

      {/* ARTICLE BODY + SIDEBAR */}
      <div className="article-layout">
        {/* CONTENT */}
        <article
          className="article-body"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />

        {/* SIDEBAR */}
        <aside className="sidebar">
          {headings.length > 0 && (
            <div className="sidebar-block">
              <div className="sidebar-label">Obsah článku</div>
              <ul className="sidebar-toc">
                {headings.map(h => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} style={{ paddingLeft: h.level > 2 ? '12px' : '0' }}>
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="sidebar-cta-box">
            <h3>Pomôžeme aj vám?</h3>
            <p>Nezáväzná konzultácia zadarmo. Pozrieme sa na váš biznis a navrhneme stratégiu.</p>
            <Link href="/kontakt/">Dohodnúť konzultáciu →</Link>
          </div>

          {post.categories.length > 0 && (
            <div className="sidebar-block" style={{ marginTop: '16px' }}>
              <div className="sidebar-label">Kategórie</div>
              <ul className="sidebar-cats">
                {post.categories.map(cat => (
                  <li key={cat}>
                    <Link href="/blog/">{cat}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {post.tags.length > 0 && (
            <div className="sidebar-block" style={{ marginTop: '16px' }}>
              <div className="sidebar-label">Tagy</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '1px',
                    padding: '5px 12px',
                    border: '1px solid var(--border)',
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* RELATED POSTS */}
      {related.length > 0 && (
        <div className="related-section">
          <div className="section-label">Ďalšie články</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(32px,4vw,56px)', letterSpacing: '-2px', lineHeight: '1', marginBottom: '48px' }}>
            MOHLO BY VÁS<br />ZAUJÍMAŤ
          </h2>
          <div className="related-grid">
            {related.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="cta-strip">
        <h2 className="cta-headline">Chcete rásť<br />online?</h2>
        <Link href="/kontakt/" className="cta-btn">Dohodnúť konzultáciu →</Link>
      </div>

      <Footer />
    </>
  )
}

export async function getStaticPaths() {
  const slugs = getAllSlugs()
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) return { notFound: true }

  const allPosts = getAllPosts()

  // Related: same category, different post, max 3
  const related = allPosts
    .filter(p => p.slug !== post.slug && p.categories.some(c => post.categories.includes(c)))
    .slice(0, 3)

  const cleanContent = renderWordPressContent(post.content)
  const headings = extractHeadings(cleanContent)

  return {
    props: {
      post,
      related,
      headings,
      cleanContent,
    },
  }
}
