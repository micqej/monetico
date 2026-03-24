import Link from 'next/link'
import { Post, formatDate } from '../lib/posts'

interface Props {
  post: Post
  featured?: boolean
}

export default function PostCard({ post, featured }: Props) {
  const cat = post.categories[0] || 'Blog'

  if (featured) {
    return (
      <article className="post-card featured">
        <div>
          <div className="card-cat">{cat}</div>
          <Link href={post.url}>
            <h2 className="card-title">{post.title}</h2>
          </Link>
        </div>
        <div>
          {post.meta_desc && (
            <p className="card-excerpt">{post.meta_desc}</p>
          )}
          <div className="card-footer">
            <span className="card-date">{formatDate(post.date)}</span>
            <Link href={post.url} className="card-read">Čítať</Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="post-card">
      <div className="card-cat">{cat}</div>
      <Link href={post.url}>
        <h2 className="card-title">{post.title}</h2>
      </Link>
      {post.meta_desc && (
        <p className="card-excerpt">{post.meta_desc}</p>
      )}
      <div className="card-footer">
        <div>
          <span className="card-date">{formatDate(post.date)}</span>
          <div className="card-read-time" style={{marginTop: '4px'}}>{post.reading_time} min čítania</div>
        </div>
        <Link href={post.url} className="card-read">Čítať</Link>
      </div>
    </article>
  )
}
