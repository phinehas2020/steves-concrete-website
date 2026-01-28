import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { marked } from 'marked'
import { supabase } from '../lib/supabase'
import { BlogHeader } from '../components/BlogHeader'
import { BlogFooter } from '../components/BlogFooter'

export function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchPost = async () => {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (!isMounted) return

      if (fetchError || !data) {
        setError('Post not found.')
        setLoading(false)
        return
      }

      setPost(data)
      setLoading(false)
    }

    fetchPost()

    return () => {
      isMounted = false
    }
  }, [slug])

  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} | Concrete Works LLC`
    }
  }, [post])

  const contentHtml = useMemo(() => {
    if (!post?.content) return ''
    return marked.parse(post.content)
  }, [post])

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <BlogHeader />
      <main className="flex-1">
        <section className="bg-stone-50 border-b border-stone-200">
          <div className="container-main py-10">
            <a href="/blog" className="text-sm text-accent-600 font-semibold hover:text-accent-700">
              ← Back to Blog
            </a>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-main max-w-3xl">
            {loading && (
              <div className="space-y-4">
                <div className="h-10 bg-stone-100 rounded w-3/4" />
                <div className="h-4 bg-stone-100 rounded w-1/3" />
                <div className="h-64 bg-stone-100 rounded" />
                <div className="h-4 bg-stone-100 rounded" />
                <div className="h-4 bg-stone-100 rounded w-5/6" />
              </div>
            )}

            {error && (
              <div className="bg-stone-50 border border-stone-200 text-stone-600 rounded-lg px-4 py-6">
                {error}
              </div>
            )}

            {!loading && post && (
              <article>
                {post.cover_image_url && (
                  <img
                    src={post.cover_image_url}
                    alt=""
                    className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-8"
                  />
                )}
                <p className="text-xs uppercase tracking-wide text-stone-500 mb-3">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : 'Draft'}
                </p>
                <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-6">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="text-lg text-stone-600 text-pretty mb-8">
                    {post.excerpt}
                  </p>
                )}
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
                <div className="mt-10 border-t border-stone-200 pt-6">
                  <a
                    href="/#contact"
                    className="inline-flex items-center gap-2 text-accent-600 font-semibold hover:text-accent-700"
                  >
                    Need a quote? Request a free estimate
                  </a>
                </div>
              </article>
            )}
          </div>
        </section>
      </main>
      <BlogFooter />
    </div>
  )
}
