import fs from 'node:fs/promises'
import path from 'node:path'

const projectRoot = process.cwd()
const distDir = path.join(projectRoot, 'dist')
const indexPath = path.join(distDir, 'index.html')

const SITE_URL = 'https://www.concretewaco.com'
const SITE_NAME = 'Concrete Works LLC'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`

const homeMeta = {
  title: 'Concrete Contractor Waco TX | Driveways, Patios & Stamped Concrete | Concrete Works LLC',
  description:
    'Concrete Works LLC is a Waco, Texas concrete contractor with 20+ years experience. We specialize in stamped concrete driveways, decorative patios, and commercial concrete. Free estimates: (254) 230-3102.',
  canonical: `${SITE_URL}/`,
  h1: 'Concrete Contractor Waco TX',
}

const servicePages = [
  {
    slug: 'concrete-driveways',
    title: 'Concrete Driveway Waco TX | Concrete Works LLC',
    description:
      'Concrete driveway installation and replacement in Waco, TX. Built for Central Texas soil with proper base prep, drainage, and clean finishing. Free estimates.',
    h1: 'Concrete Driveways in Waco, TX',
  },
  {
    slug: 'concrete-patios',
    title: 'Concrete Patio Waco TX | Concrete Works LLC',
    description:
      'Concrete patios in Waco, TX with decorative finishes and durable base prep. Designed for Central Texas heat and outdoor living. Free estimates.',
    h1: 'Concrete Patios in Waco, TX',
  },
  {
    slug: 'stamped-concrete',
    title: 'Stamped Concrete Waco TX | Concrete Works LLC',
    description:
      'Stamped concrete in Waco, TX for patios, driveways, and walkways. Durable decorative finishes with clear pricing and local expertise.',
    h1: 'Stamped Concrete in Waco, TX',
  },
  {
    slug: 'commercial-concrete',
    title: 'Commercial Concrete Contractor Waco TX | Concrete Works LLC',
    description:
      'Commercial concrete contractor in Waco, TX for parking lots, pads, curbs, and flatwork. Reliable scheduling and durable pours for Central Texas.',
    h1: 'Commercial Concrete in Waco, TX',
  },
  {
    slug: 'concrete-repair',
    title: 'Concrete Repair Waco TX | Concrete Works LLC',
    description:
      'Concrete repair in Waco, TX for cracking, settling, and surface damage. Practical repair options for driveways, patios, and slabs.',
    h1: 'Concrete Repair in Waco, TX',
  },
  {
    slug: 'concrete-foundations',
    title: 'Concrete Foundations Waco TX | Concrete Works LLC',
    description:
      'Concrete foundation contractor in Waco, TX for residential and commercial projects. Built for Central Texas soil and code requirements.',
    h1: 'Concrete Foundations in Waco, TX',
  },
  {
    slug: 'concrete-slabs',
    title: 'Concrete Slab Waco TX | Concrete Works LLC',
    description:
      'Concrete slabs for garages, shops, and equipment pads in Waco, TX. Proper base and reinforcement for Central Texas soil.',
    h1: 'Concrete Slabs in Waco, TX',
  },
  {
    slug: 'stained-concrete',
    title: 'Stained Concrete Waco TX | Concrete Works LLC',
    description:
      'Stained concrete patios and floors in Waco, TX. Acid and water-based stains for new and existing concrete.',
    h1: 'Stained Concrete in Waco, TX',
  },
  {
    slug: 'concrete-sealing',
    title: 'Concrete Sealing Waco TX | Concrete Works LLC',
    description:
      'Concrete sealing in Waco, TX. Protect driveways, patios, and stamped concrete from stains, UV, and moisture.',
    h1: 'Concrete Sealing in Waco, TX',
  },
  {
    slug: 'concrete-leveling',
    title: 'Concrete Leveling Waco TX | Concrete Works LLC',
    description:
      'Concrete leveling in Waco, TX. Mudjacking and poly foam to raise sunken driveways and sidewalks.',
    h1: 'Concrete Leveling in Waco, TX',
  },
]

const locationPages = [
  { city: 'Waco', slug: 'waco-tx-concrete-contractor' },
  { city: 'Temple', slug: 'temple-tx-concrete-contractor' },
  { city: 'Killeen', slug: 'killeen-tx-concrete-contractor' },
  { city: 'Hewitt', slug: 'hewitt-tx-concrete-contractor' },
  { city: 'Woodway', slug: 'woodway-tx-concrete-contractor' },
  { city: 'Robinson', slug: 'robinson-tx-concrete-contractor' },
  { city: 'Lorena', slug: 'lorena-tx-concrete-contractor' },
  { city: 'McGregor', slug: 'mcgregor-tx-concrete-contractor' },
]

const guidePages = [
  {
    slug: 'concrete-driveway-cost-waco-tx',
    title: 'Concrete Driveway Cost Waco TX | Concrete Works LLC',
    description:
      'Concrete driveway cost in Waco, TX. Typical per-square-foot ranges, what affects pricing, and how to plan your estimate. Updated February 2026.',
    h1: 'Concrete Driveway Cost in Waco, TX',
  },
  {
    slug: 'stamped-concrete-cost-waco-tx',
    title: 'Stamped Concrete Cost Waco TX | Concrete Works LLC',
    description:
      'Stamped concrete cost in Waco, TX. Pricing factors, pattern options, sealing guidance, and local considerations. Updated February 2026.',
    h1: 'Stamped Concrete Cost in Waco, TX',
  },
  {
    slug: 'concrete-patio-cost-waco-tx',
    title: 'Concrete Patio Cost Waco TX | Concrete Works LLC',
    description:
      'Concrete patio cost in Waco, TX. Pricing factors, finish options, and preparation tips for accurate estimates. Updated February 2026.',
    h1: 'Concrete Patio Cost in Waco, TX',
  },
]

const staticRoutes = [
  {
    path: '/blog',
    title: 'Concrete Tips & Project Ideas | Concrete Works LLC',
    description:
      'Concrete tips, project ideas, and local insights from Concrete Works LLC in Waco, TX.',
    h1: 'Concrete Tips & Project Ideas',
  },
  {
    path: '/jobs',
    title: 'Concrete Project Gallery | Concrete Works LLC',
    description:
      'View recent concrete driveways, patios, stamped finishes, and commercial projects across Waco and Central Texas.',
    h1: 'Concrete Project Gallery',
  },
  {
    path: '/guides',
    title: 'Concrete Pricing Guides in Waco, TX | Concrete Works LLC',
    description:
      'Local pricing guides for concrete driveways, patios, and stamped concrete in Waco, TX. Built from real project experience.',
    h1: 'Concrete Pricing Guides in Waco, TX',
  },
]

const routeMeta = [
  {
    path: '/',
    ...homeMeta,
  },
  ...servicePages.map((service) => ({
    path: `/services/${service.slug}`,
    title: service.title,
    description: service.description,
    canonical: `${SITE_URL}/services/${service.slug}`,
    h1: service.h1,
  })),
  ...locationPages.map((location) => ({
    path: `/${location.slug}`,
    title: `${location.city} TX Concrete Contractor | Concrete Works LLC`,
    description:
      `${location.city} concrete contractor for driveways, patios, stamped concrete, and commercial work. Free estimates from Concrete Works LLC.`,
    canonical: `${SITE_URL}/${location.slug}`,
    h1: `${location.city}, TX Concrete Contractor`,
  })),
  ...guidePages.map((guide) => ({
    path: `/guides/${guide.slug}`,
    title: guide.title,
    description: guide.description,
    canonical: `${SITE_URL}/guides/${guide.slug}`,
    h1: guide.h1,
  })),
  ...staticRoutes.map((route) => ({
    path: route.path,
    title: route.title,
    description: route.description,
    canonical: `${SITE_URL}${route.path}`,
    h1: route.h1,
  })),
]

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`
}

function upsertTitle(html, title) {
  if (/<title[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  }
  return html.replace('</head>', `<title>${escapeHtml(title)}</title>\n</head>`)
}

function removeMetaTag(html, key) {
  const regexName = new RegExp(`<meta[^>]*name=["']${key}["'][^>]*>\\s*`, 'gi')
  const regexProperty = new RegExp(`<meta[^>]*property=["']${key}["'][^>]*>\\s*`, 'gi')
  return html.replace(regexName, '').replace(regexProperty, '')
}

function upsertMetaTag(html, key, value) {
  const content = escapeHtml(value)
  const selector = key.startsWith('og:') || key.startsWith('article:') ? 'property' : 'name'
  const regex = new RegExp(`<meta[^>]*${selector}=["']${key}["'][^>]*>`, 'i')
  const tag = `<meta ${selector}="${key}" content="${content}" />`
  if (regex.test(html)) return html.replace(regex, tag)
  return html.replace('</head>', `${tag}\n</head>`)
}

function upsertCanonical(html, canonical) {
  const href = escapeHtml(canonical)
  const regex = /<link[^>]*rel=["']canonical["'][^>]*>/i
  const tag = `<link rel="canonical" href="${href}" />`
  if (regex.test(html)) return html.replace(regex, tag)
  return html.replace('</head>', `${tag}\n</head>`)
}

function upsertJsonLd(html, canonical, title, description) {
  const json = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
      },
    ],
  }
  const tag = `<script type="application/ld+json">${JSON.stringify(json)}</script>`
  const regex = /<script type="application\/ld\+json" data-prerender="route">[\s\S]*?<\/script>/i
  if (regex.test(html)) return html.replace(regex, tag.replace('application/ld+json', 'application/ld+json" data-prerender="route'))
  return html.replace('</head>', `${tag.replace('application/ld+json', 'application/ld+json" data-prerender="route')}\n</head>`)
}

function upsertVisibleH1(html, h1Text) {
  const marker = 'data-prerender-route-h1'
  const snippet = `<h1 ${marker} style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">${escapeHtml(h1Text)}</h1>`
  const regex = new RegExp(`<h1[^>]*${marker}[^>]*>[\\s\\S]*?<\\/h1>`, 'i')
  if (regex.test(html)) return html.replace(regex, snippet)
  return html.replace('<div id="root"></div>', `<div id="root"></div>\n${snippet}`)
}

function applyMeta(html, meta) {
  const canonical = ensureTrailingSlash(meta.canonical || `${SITE_URL}${meta.path === '/' ? '/' : meta.path}`)
  let updated = html
  updated = upsertTitle(updated, meta.title)
  updated = upsertMetaTag(updated, 'description', meta.description)
  updated = upsertMetaTag(updated, 'robots', 'index, follow')
  updated = upsertCanonical(updated, canonical)
  updated = upsertMetaTag(updated, 'og:title', meta.title)
  updated = upsertMetaTag(updated, 'og:description', meta.description)
  updated = upsertMetaTag(updated, 'og:type', 'website')
  updated = upsertMetaTag(updated, 'og:site_name', SITE_NAME)
  updated = upsertMetaTag(updated, 'og:locale', 'en_US')
  updated = upsertMetaTag(updated, 'og:url', canonical)
  updated = upsertMetaTag(updated, 'og:image', DEFAULT_IMAGE)
  updated = upsertMetaTag(updated, 'og:image:alt', `${SITE_NAME} in Waco, Texas`)
  updated = upsertMetaTag(updated, 'twitter:card', 'summary_large_image')
  updated = upsertMetaTag(updated, 'twitter:title', meta.title)
  updated = upsertMetaTag(updated, 'twitter:description', meta.description)
  updated = upsertMetaTag(updated, 'twitter:image', DEFAULT_IMAGE)
  updated = upsertJsonLd(updated, canonical, meta.title, meta.description)
  updated = upsertVisibleH1(updated, meta.h1 || meta.title)
  if (meta.robots && meta.robots !== 'index, follow') {
    updated = upsertMetaTag(updated, 'robots', meta.robots)
  }
  return updated
}

async function ensureRouteFile(routePath, htmlTemplate, meta) {
  const relativePath = routePath === '/' ? 'index.html' : `${routePath.replace(/^\//, '')}/index.html`
  const filePath = path.join(distDir, relativePath)
  const parentDir = path.dirname(filePath)
  await fs.mkdir(parentDir, { recursive: true })
  const html = applyMeta(htmlTemplate, meta)
  await fs.writeFile(filePath, html, 'utf8')
}

async function main() {
  const htmlTemplate = await fs.readFile(indexPath, 'utf8')

  for (const route of routeMeta) {
    await ensureRouteFile(route.path, htmlTemplate, route)
  }

  const notFoundPath = path.join(distDir, '404.html')
  let notFoundHtml = applyMeta(htmlTemplate, {
    path: '/404',
    title: 'Page Not Found | Concrete Works LLC',
    description: 'The page you requested could not be found on Concrete Works LLC.',
    canonical: `${SITE_URL}/404`,
    h1: 'Page Not Found',
    robots: 'noindex, nofollow',
  })
  notFoundHtml = removeMetaTag(notFoundHtml, 'article:published_time')
  notFoundHtml = removeMetaTag(notFoundHtml, 'article:modified_time')
  await fs.writeFile(notFoundPath, notFoundHtml, 'utf8')
}

main().catch((error) => {
  console.error('prerender-routes failed:', error)
  process.exitCode = 1
})
