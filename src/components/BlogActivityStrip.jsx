import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'motion/react'
import { ArrowRight, CalendarClock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { buildSupabaseImageSrcSet, getSupabaseOptimizedImageUrl } from '../lib/utils'

function formatDate(value) {
  if (!value) return 'Draft'
  try {
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return 'Draft'
  }
}

function BlogCard({ post }) {
  const coverUrl = post.cover_image_url
  const optimizedCoverUrl = coverUrl
    ? getSupabaseOptimizedImageUrl(coverUrl, { width: 720, quality: 68, format: 'webp' })
    : null
  const coverSrcSet = coverUrl
    ? buildSupabaseImageSrcSet(coverUrl, [360, 540, 720, 960], { quality: 68, format: 'webp' })
    : undefined

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group rounded-xl border border-stone-200 bg-white hover:border-accent-500 transition-colors"
    >
      <div className="overflow-hidden rounded-t-xl h-48 max-h-48">
        {optimizedCoverUrl ? (
          <img
            src={optimizedCoverUrl}
            srcSet={coverSrcSet}
            sizes="(min-width: 768px) 33vw, 92vw"
            alt={post.title}
            className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            width="720"
            height="480"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-full bg-stone-100" />
        )}
      </div>
      <div className="p-4">
        <p className="text-xs inline-flex items-center gap-1.5 text-stone-500 uppercase tracking-wide mb-2">
          <CalendarClock className="size-3.5" aria-hidden="true" />
          {formatDate(post.published_at)}
        </p>
        <h3 className="font-display font-semibold text-stone-900 text-lg leading-snug mb-2 group-hover:text-accent-600">
          {post.title}
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed">
          {post.excerpt || 'Read the latest project update and maintenance insight.'}
        </p>
      </div>
    </Link>
  )
}

export function BlogActivityStrip() {
  const sectionRef = useRef(null)
  const isNearViewport = useInView(sectionRef, { once: true, margin: '280px 0px' })
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isNearViewport) return

    let isMounted = true
    setLoading(true)
    setError('')

    const fetchPosts = async () => {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, published_at, cover_image_url')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3)

      if (!isMounted) return

      if (fetchError) {
        setError('Blog activity is temporarily unavailable.')
        setPosts([])
        setLoading(false)
        return
      }

      setPosts(data || [])
      setLoading(false)
    }

    fetchPosts()

    return () => {
      isMounted = false
    }
  }, [isNearViewport])

  return (
    <section
      id="blog-updates"
      ref={sectionRef}
      className="section-padding bg-stone-100 border-t border-stone-200"
    >
      <div className="container-main">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 text-balance">
              Recent Blog Updates
            </h2>
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl">
              A quick look at what we’ve been posting about concrete installs, repairs, and project lessons.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600 hover:text-accent-700"
          >
            Go to Blog
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {loading && (
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="rounded-xl border border-stone-200 bg-white p-4">
                <div className="h-48 bg-stone-100 rounded mb-4" />
                <div className="h-4 bg-stone-100 rounded w-1/4 mb-2" />
                <div className="h-5 bg-stone-100 rounded w-5/6 mb-3" />
                <div className="h-4 bg-stone-100 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="rounded-lg border border-stone-200 bg-white px-4 py-6 text-sm text-stone-600">
            No posts yet. Visit the blog when updates are published.
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
