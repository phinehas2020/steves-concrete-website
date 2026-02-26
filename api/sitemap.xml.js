/* eslint-env node */
import { createClient } from '@supabase/supabase-js'
import { sportsCourtAreaPages } from '../src/data/sportsCourtAreaPages.js'
import { servicePages } from '../src/data/servicePages.js'
import { seoServicePages } from '../src/data/seoServicePages.js'

const SITE_URL = 'https://www.concretewaco.com'
const LOCATION_PAGES = [
  'waco-tx-concrete-contractor',
  'temple-tx-concrete-contractor',
  'killeen-tx-concrete-contractor',
  'hewitt-tx-concrete-contractor',
  'woodway-tx-concrete-contractor',
  'robinson-tx-concrete-contractor',
  'lorena-tx-concrete-contractor',
  'mcgregor-tx-concrete-contractor',
]
const SERVICE_PAGES = [
  ...servicePages.map((service) => `services/${service.slug}`),
]
const SEO_SERVICE_PAGES = seoServicePages.map((service) => service.slug)
const REVIEW_PAGES = ['reviews']
const GUIDE_PAGES = [
  'guides/concrete-driveway-cost-waco-tx',
  'guides/stamped-concrete-cost-waco-tx',
  'guides/concrete-patio-cost-waco-tx',
]
const SPORTS_COURT_AREA_PAGES = sportsCourtAreaPages.map(
  (page) => `sports-court-coating/${page.slug}`,
)

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
    {
      loc: `${SITE_URL}/jobs`,
      changefreq: 'weekly',
      priority: '0.7',
    },
    {
      loc: `${SITE_URL}/privacy-policy`,
      changefreq: 'yearly',
      priority: '0.4',
    },
    {
      loc: `${SITE_URL}/terms-and-conditions`,
      changefreq: 'yearly',
      priority: '0.4',
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

  SEO_SERVICE_PAGES.forEach((slug) => {
    urls.push({
      loc: `${SITE_URL}/${slug}`,
      changefreq: 'monthly',
      priority: '0.72',
    })
  })

  REVIEW_PAGES.forEach((slug) => {
    urls.push({
      loc: `${SITE_URL}/${slug}`,
      changefreq: 'monthly',
      priority: '0.7',
    })
  })

  GUIDE_PAGES.forEach((slug) => {
    urls.push({
      loc: `${SITE_URL}/${slug}`,
      changefreq: 'monthly',
      priority: '0.68',
    })
  })

  SPORTS_COURT_AREA_PAGES.forEach((slug) => {
    urls.push({
      loc: `${SITE_URL}/${slug}`,
      changefreq: 'monthly',
      priority: '0.64',
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

      const { data: jobs } = await supabase
        .from('jobs')
        .select('slug, updated_at, date')
        .order('updated_at', { ascending: false })

      if (Array.isArray(jobs)) {
        jobs.forEach((job) => {
          if (!job?.slug) return
          const lastmod = formatDate(job.updated_at || job.date)
          urls.push({
            loc: `${SITE_URL}/jobs/${job.slug}`,
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
