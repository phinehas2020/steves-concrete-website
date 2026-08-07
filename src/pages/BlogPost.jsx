import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Header } from '../components/Header'
import { BlogFooter } from '../components/BlogFooter'
import { ContactModal } from '../components/ContactModal'
import { renderBlogMarkdown } from '../lib/blogMarkdown'
import { staticBlogPosts } from '../data/staticBlogPosts'
import { getBlogSeoTitle } from '../data/blogSeoTitles'
import { getPublicBlogEditorialMeta } from '../data/blogEditorial'
import { getRouteIndexingState } from '../data/indexingControls'
import {
  useSeo,
  SITE_URL,
  DEFAULT_IMAGE,
  ORGANIZATION_ID,
  buildBreadcrumbs,
  buildJsonLdGraph,
} from '../lib/seo'

function formatEditorialDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchPost = async () => {
      const staticPost = staticBlogPosts.find((item) => item.slug === slug)
      // Source-authored case studies and audit archives are intentionally not
      // CMS-controlled. Releasing a repaired archive requires removing its
      // source quarantine in the same deployment that changes its crawler HTML.
      if (staticPost?.source_managed) {
        setPost(staticPost)
        setLoading(false)
        return
      }

      const selectPost = (fields) =>
        supabase
          .from('blog_posts')
          .select(fields)
          .eq('slug', slug)
          .eq('status', 'published')
          .single()
      let result = await selectPost(
        [
          'id',
          'title',
          'slug',
          'excerpt',
          'content',
          'cover_image_url',
          'published_at',
          'updated_at',
          'created_at',
          'status',
          'seo_status',
          'author_name',
          'reviewed_by',
          'reviewed_at',
          'source_summary',
          'canonical_slug',
          'project_series_id',
          'series_phase',
        ].join(', '),
      )

      if (result.error) {
        result = await selectPost(
          'id, title, slug, excerpt, content, cover_image_url, published_at, updated_at, created_at, status',
        )
      }

      if (!isMounted) return

      if (result.error || !result.data) {
        if (staticPost) {
          setPost(staticPost)
          setLoading(false)
          return
        }

        setError('Post not found.')
        setLoading(false)
        return
      }

      setPost(
        staticPost
          ? {
              ...staticPost,
              ...result.data,
              seo_status: result.data.seo_status || staticPost.seo_status,
              canonical_slug: result.data.canonical_slug || staticPost.canonical_slug,
            }
          : result.data,
      )
      setLoading(false)
    }

    fetchPost()

    return () => {
      isMounted = false
    }
  }, [slug])

  const seo = useMemo(() => {
    const notFound = Boolean(error)
    const indexing = getRouteIndexingState(`/blog/${slug}`, post || {})
    const canonicalUrl = `${SITE_URL}${indexing.canonicalPath}`
    const fallback = {
      title: notFound
        ? 'Post Not Found | SLA Concrete Works LLC'
        : 'Concrete Tips & Project Ideas | SLA Concrete Works LLC',
      description: notFound
        ? 'This post could not be found.'
        : 'Concrete tips, maintenance checklists, and design inspiration for Waco and Central Texas concrete projects.',
      canonical: canonicalUrl,
      url: canonicalUrl,
      image: DEFAULT_IMAGE,
      imageAlt: 'SLA Concrete Works LLC blog',
      type: 'article',
      robots: notFound ? 'noindex, nofollow' : indexing.robots,
      indexingRecord: post || undefined,
    }

    if (!post) return fallback

    const publishedAt = post.published_at || null
    const updatedAt = post.updated_at || post.published_at || null
    const description = post.excerpt || fallback.description
    const image = post.cover_image_url || DEFAULT_IMAGE
    const editorial = getPublicBlogEditorialMeta(post)
    const author =
      editorial.authorType === 'Person'
        ? {
            '@type': 'Person',
            name: editorial.authorName,
          }
        : {
            '@type': 'Organization',
            '@id': ORGANIZATION_ID,
            name: editorial.authorName,
          }

    const blogPostingJsonLd = post
      ? {
          '@type': 'BlogPosting',
          headline: post.title,
          description,
          image: [image],
          datePublished: publishedAt,
          dateModified: updatedAt,
          author,
          publisher: {
            '@type': 'Organization',
            '@id': ORGANIZATION_ID,
            name: 'SLA Concrete Works LLC',
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/logo.png`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl,
          },
        }
      : null

    const breadcrumbsJsonLd = buildBreadcrumbs([
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Blog', url: `${SITE_URL}/blog` },
      { name: post?.title || 'Post', url: canonicalUrl },
    ])

    return {
      ...fallback,
      title: getBlogSeoTitle(post),
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
    const parsedHtml = renderBlogMarkdown(post.content)

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

  const editorial = getPublicBlogEditorialMeta(post || {})
  const reviewedDate = formatEditorialDate(editorial.reviewedAt)
  const indexingState = getRouteIndexingState(`/blog/${slug}`, post || {})
  const isPendingArchive = Boolean(post && !indexingState.indexable)

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
                      : isPendingArchive
                        ? 'Archive · source review pending'
                        : 'Draft'}
                  </p>
                  <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-6">
                    {post.title}
                  </h1>
                  <div className="mb-6 border-y border-stone-200 py-4 text-sm text-stone-600 space-y-1">
                    <p>
                      By <span className="font-semibold text-stone-800">{editorial.authorName}</span>
                    </p>
                    {(editorial.reviewedBy || reviewedDate) && (
                      <p>
                        {editorial.reviewedBy && (
                          <>
                            Fact-checked by{' '}
                            <span className="font-semibold text-stone-800">
                              {editorial.reviewedBy}
                            </span>
                          </>
                        )}
                        {editorial.reviewedBy && reviewedDate ? ' · ' : ''}
                        {reviewedDate && `Last fact-check: ${reviewedDate}`}
                      </p>
                    )}
                    {(editorial.projectSeriesId || editorial.seriesPhase) && (
                      <p>
                        Project series: {editorial.projectSeriesId || 'Unassigned'}
                        {editorial.seriesPhase ? ` · Series phase: ${editorial.seriesPhase}` : ''}
                      </p>
                    )}
                  </div>
                  {isPendingArchive && (
                    <aside className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
                      <h2 className="font-display font-semibold text-lg text-stone-900 mb-2">
                        Archive under source review
                      </h2>
                      <p className="text-sm text-stone-700 text-pretty">
                        This older project note remains available to direct visitors, but its
                        job facts and photo captions have not passed the current approval
                        checklist. It is kept out of Search and is not used as verified service
                        proof until that review is complete.
                      </p>
                    </aside>
                  )}
                  {post.excerpt && (
                    <p className="text-lg text-stone-600 text-pretty mb-8">
                      {post.excerpt}
                    </p>
                  )}
                  {editorial.sourceSummary && (
                    <aside className="mb-8 rounded-xl border border-stone-200 bg-stone-50 p-5">
                      <h2 className="font-display font-semibold text-lg text-stone-900 mb-2">
                        Source note
                      </h2>
                      <p className="text-sm text-stone-600 text-pretty">
                        {editorial.sourceSummary}
                      </p>
                    </aside>
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
