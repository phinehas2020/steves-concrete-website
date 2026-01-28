import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { BlogHeader } from '../components/BlogHeader'
import { BlogFooter } from '../components/BlogFooter'

export function BlogIndex() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchPosts = async () => {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image_url, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (!isMounted) return

      if (fetchError) {
        setError('Unable to load posts right now.')
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
  }, [])

  return (
    <div className="min-h-dvh flex flex-col bg-stone-50">
      <BlogHeader />
      <main className="flex-1">
        <section className="section-padding">
          <div className="container-main">
            <div className="max-w-2xl mb-10">
              <p className="text-sm uppercase tracking-wide text-accent-600 font-semibold mb-3">
                Concrete Tips & Project Ideas
              </p>
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-4">
                Expert Insights for Central Texas Concrete Projects
              </h1>
              <p className="text-lg text-stone-600 text-pretty">
                Straightforward advice, design inspiration, and maintenance tips from the
                crew behind 500+ concrete installs.
              </p>
            </div>

            {loading && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 border border-stone-200">
                    <div className="h-40 bg-stone-100 rounded-lg mb-4" />
                    <div className="h-4 bg-stone-100 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-stone-100 rounded w-full mb-2" />
                    <div className="h-4 bg-stone-100 rounded w-5/6" />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="bg-white border border-red-200 text-red-600 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {!loading && !error && posts.length === 0 && (
              <div className="bg-white border border-stone-200 text-stone-600 rounded-lg px-4 py-6">
                No posts yet. Check back soon.
              </div>
            )}

            {!loading && !error && posts.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-stone-300 transition-colors"
                  >
                    {post.cover_image_url && (
                      <img
                        src={post.cover_image_url}
                        alt=""
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="p-6">
                      <p className="text-xs uppercase tracking-wide text-stone-500 mb-2">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString()
                          : 'Draft'}
                      </p>
                      <h2 className="font-display font-semibold text-xl text-stone-900 mb-3 text-balance">
                        {post.title}
                      </h2>
                      <p className="text-stone-600 text-pretty mb-4">
                        {post.excerpt || 'Read the full article.'}
                      </p>
                      <a
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-accent-600 font-semibold hover:text-accent-700"
                      >
                        Read article
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <BlogFooter />
    </div>
  )
}
