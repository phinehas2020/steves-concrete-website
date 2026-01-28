import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { marked } from 'marked'
import { supabase } from '../lib/supabase'
import { BlogHeader } from '../components/BlogHeader'
import { BlogFooter } from '../components/BlogFooter'
import { ContactModal } from '../components/ContactModal'
import { useSeo, SITE_URL, DEFAULT_IMAGE } from '../lib/seo'

export function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [contactOpen, setContactOpen] = useState(false)

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

  const seo = useMemo(() => {
    const notFound = Boolean(error)
    const fallback = {
      title: notFound
        ? 'Post Not Found | Concrete Works LLC'
        : 'Concrete Tips & Project Ideas | Concrete Works LLC',
      description: notFound
        ? 'This post could not be found.'
        : 'Concrete tips, maintenance checklists, and design inspiration for Waco and Central Texas concrete projects.',
      canonical: `${SITE_URL}/blog/${slug}`,
      url: `${SITE_URL}/blog/${slug}`,
      image: DEFAULT_IMAGE,
      imageAlt: 'Concrete Works LLC blog',
      type: 'article',
      robots: notFound ? 'noindex, nofollow' : 'index, follow',
    }

    if (!post) return fallback

    const publishedAt = post.published_at || null
    const updatedAt = post.updated_at || post.published_at || null
    const description = post.excerpt || fallback.description
    const image = post.cover_image_url || DEFAULT_IMAGE

    return {
      ...fallback,
      title: `${post.title} | Concrete Works LLC`,
      description,
      image,
      imageAlt: post.title,
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description,
        image: [image],
        datePublished: publishedAt,
        dateModified: updatedAt,
        author: {
          '@type': 'Organization',
          name: 'Concrete Works LLC',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Concrete Works LLC',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/blog/${post.slug}`,
        },
      },
    }
  }, [post, slug, error])

  useSeo(seo)

  const contentHtml = useMemo(() => {
    if (!post?.content) return ''
    return marked.parse(post.content)
  }, [post])

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <BlogHeader onRequestEstimate={() => setContactOpen(true)} />
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
                    alt={post.title}
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
                  <button
                    type="button"
                    onClick={() => setContactOpen(true)}
                    className="inline-flex items-center gap-2 text-accent-600 font-semibold hover:text-accent-700"
                  >
                    Need a quote? Request a free estimate
                  </button>
                </div>
              </article>
            )}
          </div>
        </section>
      </main>
      <BlogFooter />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} source="blog" />
    </div>
  )
}
