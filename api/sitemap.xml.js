/* eslint-env node */
import { createClient } from '@supabase/supabase-js'

const SITE_URL = 'https://concreteworkswaco.com'
const LOCATION_PAGES = [
  'waco-tx-concrete-contractor',
  'temple-tx-concrete-contractor',
  'killeen-tx-concrete-contractor',
  'hewitt-tx-concrete-contractor',
]
const SERVICE_PAGES = [
  'services/concrete-driveways',
  'services/concrete-patios',
  'services/stamped-concrete',
  'services/commercial-concrete',
  'services/concrete-repair',
  'services/concrete-foundations',
]

function formatDate(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().split('T')[0]
}

function toUrlEntry({ loc, lastmod, changefreq, priority }) {
  const parts = [`<loc>${loc}</loc>`]
  if (lastmod) parts.push(`<lastmod>${lastmod}</lastmod>`)
  if (changefreq) parts.push(`<changefreq>${changefreq}</changefreq>`)
  if (priority) parts.push(`<priority>${priority}</priority>`)
  return `<url>${parts.join('')}</url>`
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed')
    return
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const urls = [
    {
      loc: `${SITE_URL}/`,
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      loc: `${SITE_URL}/blog`,
      changefreq: 'weekly',
      priority: '0.7',
    },
  ]

  LOCATION_PAGES.forEach((slug) => {
    urls.push({
      loc: `${SITE_URL}/${slug}`,
      changefreq: 'monthly',
      priority: '0.6',
    })
  })

  SERVICE_PAGES.forEach((slug) => {
    urls.push({
      loc: `${SITE_URL}/${slug}`,
      changefreq: 'monthly',
      priority: '0.65',
    })
  })

  if (supabaseUrl && supabaseServiceRoleKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
      const { data } = await supabase
        .from('blog_posts')
        .select('slug, published_at, updated_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (Array.isArray(data)) {
        data.forEach((post) => {
          if (!post?.slug) return
          const lastmod = formatDate(post.updated_at || post.published_at)
          urls.push({
            loc: `${SITE_URL}/blog/${post.slug}`,
            lastmod,
            changefreq: 'monthly',
            priority: '0.6',
          })
        })
      }
    } catch {
      // Fall back to base URLs only.
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.map((entry) => toUrlEntry(entry)).join('') +
    `</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400')
  res.status(200).send(xml)
}
