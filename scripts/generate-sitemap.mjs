import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const SITE_URL = 'https://www.concretewaco.com'
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'sitemap.xml')

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/blog', changefreq: 'weekly', priority: '0.7' },
  { path: '/jobs', changefreq: 'weekly', priority: '0.7' },
  { path: '/guides', changefreq: 'monthly', priority: '0.7' },
  { path: '/reviews', changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.4' },
  { path: '/terms-and-conditions', changefreq: 'yearly', priority: '0.4' },
]

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

async function readSlugList(relativePath) {
  const fullPath = path.join(process.cwd(), relativePath)
  const content = await fs.readFile(fullPath, 'utf8')
  const matches = content.matchAll(/\bslug\s*:\s*['"]([^'"]+)['"]/g)
  const slugs = new Set()
  for (const match of matches) {
    const slug = match[1]?.trim()
    if (slug) {
      slugs.add(slug)
    }
  }
  return [...slugs].sort()
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function normalizeDate(dateValue) {
  if (!dateValue) return null
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString().split('T')[0]
}

function toEntry({ loc, lastmod, changefreq, priority }) {
  const parts = [`<loc>${escapeXml(loc)}</loc>`]
  if (lastmod) parts.push(`<lastmod>${lastmod}</lastmod>`)
  if (changefreq) parts.push(`<changefreq>${changefreq}</changefreq>`)
  if (priority) parts.push(`<priority>${priority}</priority>`)
  return `<url>${parts.join('')}</url>`
}

function addUrl(urls, loc, meta = {}) {
  const normalized = loc.startsWith('http') ? loc : `${SITE_URL}/${loc.replace(/^\//, '')}`
  const key = normalized.replace(/\/$/, '')
  if (urls.has(key)) return
  urls.set(key, {
    loc: normalized,
    lastmod: meta.lastmod,
    changefreq: meta.changefreq,
    priority: meta.priority,
  })
}

async function fetchSupabaseSlugs(client, table, slugField, dateFields = []) {
  const columns = [slugField, ...dateFields].filter(Boolean).join(', ')
  const { data } = await client.from(table).select(columns).order('updated_at', { ascending: false })
  if (!Array.isArray(data)) return []
  return data
    .filter((row) => row?.[slugField])
    .map((row) => ({
      slug: row[slugField],
      lastmod: normalizeDate(
        dateFields
          .map((field) => row[field])
          .find((value) => value) || row.updated_at || row.published_at || row.date,
      ),
    }))
}

async function main() {
  const routes = new Map()

  for (const route of STATIC_ROUTES) {
    addUrl(routes, route.path, route)
  }

  LOCATION_PAGES.forEach((slug) => {
    addUrl(routes, `/${slug}`, {
      changefreq: 'monthly',
      priority: '0.6',
    })
  })

  const [serviceSlugs, seoServiceSlugs, guideSlugs, sportsCourtSlugs] = await Promise.all([
    readSlugList('src/data/servicePages.js'),
    readSlugList('src/data/seoServicePages.js'),
    readSlugList('src/data/guides.js'),
    readSlugList('src/data/sportsCourtAreaPages.js'),
  ])

  serviceSlugs.forEach((slug) => {
    addUrl(routes, `/services/${slug}`, {
      changefreq: 'monthly',
      priority: '0.65',
    })
  })

  seoServiceSlugs.forEach((slug) => {
    addUrl(routes, `/${slug}`, {
      changefreq: 'monthly',
      priority: '0.72',
    })
  })

  guideSlugs.forEach((slug) => {
    addUrl(routes, `/guides/${slug}`, {
      changefreq: 'monthly',
      priority: '0.68',
    })
  })

  sportsCourtSlugs.forEach((slug) => {
    addUrl(routes, `/sports-court-coating/${slug}`, {
      changefreq: 'monthly',
      priority: '0.64',
    })
  })

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (supabaseUrl && serviceKey) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey)

      const [blogRows, jobRows] = await Promise.all([
        fetchSupabaseSlugs(supabase, 'blog_posts', 'slug', ['updated_at', 'published_at']),
        fetchSupabaseSlugs(supabase, 'jobs', 'slug', ['updated_at', 'date']),
      ])

      blogRows
        .filter((item) => item.slug)
        .forEach((post) => {
          addUrl(routes, `/blog/${post.slug}`, {
            lastmod: post.lastmod,
            changefreq: 'monthly',
            priority: '0.6',
          })
        })

      jobRows
        .filter((item) => item.slug)
        .forEach((job) => {
          addUrl(routes, `/jobs/${job.slug}`, {
            lastmod: job.lastmod,
            changefreq: 'monthly',
            priority: '0.6',
          })
        })
    } catch {
      // Supabase keys are optional at build time. Keep static URLs if fetch fails.
    }
  }

  const entries = Array.from(routes.values())
    .map((entry) => toEntry(entry))
    .sort()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    entries.join('') +
    `</urlset>`

  await fs.writeFile(OUTPUT_PATH, xml, 'utf8')
  console.log(`Generated sitemap with ${entries.length} URLs at ${OUTPUT_PATH}`)
}

main().catch((error) => {
  console.error('Failed to generate sitemap:', error)
  process.exitCode = 1
})
