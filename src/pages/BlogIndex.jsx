import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Header } from '../components/Header'
import { BlogFooter } from '../components/BlogFooter'
import { ContactModal } from '../components/ContactModal'
import {
  useSeo,
  SITE_URL,
  DEFAULT_IMAGE,
  buildBreadcrumbs,
  buildJsonLdGraph,
} from '../lib/seo'

export function BlogIndex() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [contactOpen, setContactOpen] = useState(false)

  const seo = useMemo(() => {
    const description =
      'Concrete tips, maintenance checklists, and design inspiration for Waco, Woodway, Hewitt, Temple, and Central Texas concrete projects.'

    const listItems = posts
      .filter((post) => post?.slug && post?.title)
      .map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/blog/${post.slug}`,
        name: post.title,
      }))

    const itemListJsonLd =
      listItems.length > 0
        ? {
            '@type': 'ItemList',
            name: 'Concrete Works LLC Blog',
            description,
            itemListElement: listItems,
          }
        : null

    const breadcrumbsJsonLd = buildBreadcrumbs([
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Blog', url: `${SITE_URL}/blog` },
    ])

    const jsonLd = buildJsonLdGraph(itemListJsonLd, breadcrumbsJsonLd)

    return {
      title: 'Concrete Contractor Waco TX | Concrete Tips & Project Ideas | Concrete Works LLC',
      description,
      canonical: `${SITE_URL}/blog`,
      url: `${SITE_URL}/blog`,
      image: DEFAULT_IMAGE,
      imageAlt: 'Concrete Works LLC blog updates and project ideas',
      type: 'website',
      jsonLd,
    }
  }, [posts])

  useSeo(seo)

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

  const [featured, ...rest] = posts

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header transparent={false} />
      <main className="flex-1 pt-20 sm:pt-24">
        <section className="bg-stone-50 border-b border-stone-200">
          <div className="container-main py-16 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-accent-600 font-semibold mb-4">
                  <Sparkles className="size-4" aria-hidden="true" />
                  Concrete Tips & Project Ideas
                </div>
                <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-4">
                  Expert Insights for Central Texas Concrete Projects
                </h1>
                <p className="text-lg text-stone-600 text-pretty">
                  Straightforward advice, design inspiration, and maintenance tips from the
                  crew behind 500+ concrete installs.
                </p>
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                <p className="text-sm text-stone-500 uppercase tracking-wide mb-2">Need a quote?</p>
                <h2 className="font-display font-semibold text-2xl text-stone-900 mb-3 text-balance">
                  Get a free estimate in 24 hours
                </h2>
                <p className="text-stone-600 text-pretty mb-5">
                  Tell us about your project and we’ll respond fast with next steps.
                </p>
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="inline-flex items-center gap-2 text-white bg-accent-500 hover:bg-accent-600 font-semibold px-4 py-3 rounded-lg transition-colors"
                >
                  Request Estimate
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-main">
            {loading && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 border border-stone-200">
                    <div className="h-48 bg-stone-100 rounded-lg mb-4" />
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
              <div className="space-y-10">
                <article className="grid gap-6 lg:grid-cols-[1.2fr_1fr] bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden lg:max-h-[440px]">
                  <div className="h-[280px] sm:h-[340px] md:h-[420px] lg:h-[440px] overflow-hidden">
                    {featured?.cover_image_url ? (
                      <img
                        src={featured.cover_image_url}
                        alt={featured?.title || 'Featured concrete project advice'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full bg-stone-200 flex items-center justify-center text-stone-500 text-sm">
                        Featured Article
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:p-8 lg:flex lg:flex-col lg:justify-center">
                    <p className="text-xs uppercase tracking-wide text-stone-500 mb-2">
                      {featured?.published_at
                        ? new Date(featured.published_at).toLocaleDateString()
                        : 'Draft'}
                    </p>
                    <h2 className="font-display font-semibold text-2xl md:text-3xl text-stone-900 mb-3 text-balance">
                      {featured?.title}
                    </h2>
                    <p className="text-stone-600 text-pretty mb-5">
                      {featured?.excerpt || 'Read the full article.'}
                    </p>
                    {featured && (
                      <a
                        href={`/blog/${featured.slug}`}
                        className="inline-flex items-center gap-2 text-accent-600 font-semibold hover:text-accent-700"
                      >
                        Read article
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </article>

                {rest.length > 0 && (
                  <div className="grid-auto-fit-lg">
                    {rest.map((post) => (
                      <article
                        key={post.id}
                        className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-stone-300 transition-colors"
                      >
                        {post.cover_image_url ? (
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-48 object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-48 bg-stone-100 flex items-center justify-center text-stone-400 text-sm">
                            Concrete Works LLC
                          </div>
                        )}
                        <div className="p-6">
                          <p className="text-xs uppercase tracking-wide text-stone-500 mb-2">
                            {post.published_at
                              ? new Date(post.published_at).toLocaleDateString()
                              : 'Draft'}
                          </p>
                          <h3 className="font-display font-semibold text-xl text-stone-900 mb-3 text-balance">
                            {post.title}
                          </h3>
                          <p className="text-stone-600 text-pretty mb-4">
                            {post.excerpt || 'Read the full article.'}
                          </p>
                          <a
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-2 text-accent-600 font-semibold hover:text-accent-700"
                          >
                            Read article
                            <ArrowRight className="size-4" aria-hidden="true" />
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <BlogFooter />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} source="blog" />
    </div>
  )
}
