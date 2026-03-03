/* eslint-env node */
import { sportsCourtAreaPages } from '../src/data/sportsCourtAreaPages.js'
import {
  SERVICE_CANONICAL_PATH_BY_SLUG,
  servicePages,
} from '../src/data/servicePages.js'
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
const NON_CANONICAL_SERVICE_SLUGS = new Set(Object.keys(SERVICE_CANONICAL_PATH_BY_SLUG))
const SERVICE_PAGES = [
  ...servicePages
    .filter((service) => !NON_CANONICAL_SERVICE_SLUGS.has(service.slug))
    .map((service) => `services/${service.slug}`),
]
const SEO_SERVICE_PAGES = seoServicePages
  .filter((service) => !service.redirectTo)
  .map((service) => service.slug)
const REVIEW_PAGES = ['reviews']
const GUIDE_PAGES = [
  'guides/concrete-driveway-cost-waco-tx',
  'guides/stamped-concrete-cost-waco-tx',
  'guides/concrete-patio-cost-waco-tx',
]
const SPORTS_COURT_AREA_PAGES = sportsCourtAreaPages.map(
  (page) => `sports-court-coating/${page.slug}`,
)

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
      loc: `${SITE_URL}/guides`,
      changefreq: 'monthly',
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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.map((entry) => toUrlEntry(entry)).join('') +
    `</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400')
  res.status(200).send(xml)
}
