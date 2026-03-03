import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { marked } from 'marked'
import { supabase } from '../lib/supabase'
import { Header } from '../components/Header'
import { BlogFooter } from '../components/BlogFooter'
import { ContactModal } from '../components/ContactModal'
import {
  useSeo,
  SITE_URL,
  DEFAULT_IMAGE,
  ORGANIZATION_ID,
  buildBreadcrumbs,
  buildJsonLdGraph,
} from '../lib/seo'

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

    const blogPostingJsonLd = post
      ? {
          '@type': 'BlogPosting',
          headline: post.title,
          description,
          image: [image],
          datePublished: publishedAt,
          dateModified: updatedAt,
          author: {
            '@type': 'Organization',
            '@id': ORGANIZATION_ID,
            name: 'Concrete Works LLC',
          },
          publisher: {
            '@type': 'Organization',
            '@id': ORGANIZATION_ID,
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
        }
      : null

    const breadcrumbsJsonLd = buildBreadcrumbs([
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Blog', url: `${SITE_URL}/blog` },
      { name: post?.title || 'Post', url: `${SITE_URL}/blog/${slug}` },
    ])

    return {
      ...fallback,
      title: `${post.title} | Concrete Works LLC`,
      description,
      image,
      imageAlt: post.title,
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
      jsonLd: buildJsonLdGraph(blogPostingJsonLd, breadcrumbsJsonLd),
    }
  }, [post, slug, error])

  useSeo(seo)

  const contentHtml = useMemo(() => {
    if (!post?.content) return ''
    const parsedHtml = marked.parse(post.content)

    if (typeof DOMParser === 'undefined') {
      return parsedHtml
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(`<div>${parsedHtml}</div>`, 'text/html')
    const container = doc.body.firstElementChild

    if (!container) {
      return parsedHtml
    }

    const isImageOnlyParagraph = (node) =>
      node?.nodeType === 1 &&
      node.tagName === 'P' &&
      node.children.length === 1 &&
      node.firstElementChild.tagName === 'IMG'

    const childNodes = Array.from(container.childNodes)
    const normalizedNodes = []
    let index = 0

    while (index < childNodes.length) {
      const currentNode = childNodes[index]

      if (isImageOnlyParagraph(currentNode)) {
        const imageRows = []
        while (index < childNodes.length && isImageOnlyParagraph(childNodes[index])) {
          imageRows.push(childNodes[index])
          index += 1
        }

        if (imageRows.length > 1) {
          const grid = doc.createElement('div')
          grid.className = 'blog-content-image-grid'

          imageRows.forEach((imageParagraph) => {
            const image = imageParagraph.querySelector('img')
            if (image) {
              image.classList.add('blog-content-image')
              grid.appendChild(image)
            }
          })

          normalizedNodes.push(grid)
          continue
        }

        const image = imageRows[0].querySelector('img')
        if (image) {
          image.classList.add('blog-content-image')
        }
        normalizedNodes.push(imageRows[0])
        continue
      }

      if (currentNode.nodeType === 1) {
        const currentImages = currentNode.querySelectorAll('img')
        currentImages.forEach((image) => {
          image.classList.add('blog-content-image')
        })
      }

      normalizedNodes.push(currentNode)
      index += 1
    }

    container.innerHTML = ''
    normalizedNodes.forEach((node) => {
      container.appendChild(node)
    })

    return container.innerHTML
  }, [post])

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header transparent={false} />
      <main className="flex-1 pt-20 sm:pt-24">
        <section className="bg-stone-50 border-b border-stone-200">
          <div className="container-main py-10">
            <a href="/blog" className="text-sm text-accent-600 font-semibold hover:text-accent-700">
              ← Back to Blog
            </a>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-main">
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
                  <figure className="blog-post-hero mb-8">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      loading="eager"
                      className="blog-post-hero-image"
                    />
                  </figure>
                )}
                <div className="max-w-3xl mx-auto">
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
                </div>
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
