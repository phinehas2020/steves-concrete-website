import { useEffect } from 'react'

const SITE_URL = 'https://www.concretewaco.com'
const SITE_NAME = 'Concrete Works LLC'
const LOCALE = 'en_US'
const ORGANIZATION_ID = `${SITE_URL}/#organization`
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`

const DEFAULT_SEO = {
  title: 'Concrete Contractor Waco TX | Licensed & Insured | 20+ Years | Free Estimate (254) 230-3102',
  description:
    'Concrete Works LLC has completed 500+ projects in Waco, Temple, and McLennan County since 2005. Driveways, patios, stamped and commercial concrete built for black clay soil. Free estimate: (254) 230-3102.',
  canonical: SITE_URL + '/',
  image: DEFAULT_IMAGE,
  imageAlt: "Concrete Works LLC - Waco's Trusted Concrete Contractor",
  type: 'website',
  robots: 'index, follow',
  twitterCard: 'summary_large_image',
  url: SITE_URL + '/',
  siteName: SITE_NAME,
  locale: LOCALE,
}

function normalizeCanonical(url) {
  const value = String(url || '').trim()
  if (!value) return `${SITE_URL}/`
  if (value === SITE_URL || value === `${SITE_URL}/`) return `${SITE_URL}/`
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function toAbsoluteUrl(url) {
  const value = String(url || '').trim()
  if (!value) return `${SITE_URL}/`
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  if (value.startsWith('/')) return `${SITE_URL}${value}`
  return `${SITE_URL}/${value}`
}

function buildBreadcrumbs(items = []) {
  if (!Array.isArray(items) || items.length === 0) return null
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

function buildFaqPage(faqItems = []) {
  if (!Array.isArray(faqItems) || faqItems.length === 0) return null
  return {
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

function buildJsonLdGraph(...nodes) {
  const graph = nodes.flat().filter(Boolean)
  if (graph.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

function upsertMeta({ name, property, content }) {
  const selector = name
    ? `meta[name="${name}"]`
    : `meta[property="${property}"]`
  let tag = document.head.querySelector(selector)
  if (!content) {
    if (tag) tag.remove()
    return
  }
  if (!tag) {
    tag = document.createElement('meta')
    if (name) tag.setAttribute('name', name)
    if (property) tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let tag = document.head.querySelector(`link[rel="${rel}"]`)
  if (!href) {
    if (tag) tag.remove()
    return
  }
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

function upsertJsonLd(id, json) {
  const existing = document.head.querySelector(`script[data-seo-jsonld="${id}"]`)
  if (!json) {
    if (existing) existing.remove()
    return
  }
  const script = existing || document.createElement('script')
  script.type = 'application/ld+json'
  script.setAttribute('data-seo-jsonld', id)
  script.text = JSON.stringify(json)
  if (!existing) document.head.appendChild(script)
}

export function setSeo(overrides = {}) {
  const meta = { ...DEFAULT_SEO, ...overrides }
  const canonical = normalizeCanonical(toAbsoluteUrl(meta.canonical))
  const resolvedUrl = normalizeCanonical(toAbsoluteUrl(overrides.url || canonical))

  document.title = meta.title

  upsertMeta({ name: 'description', content: meta.description })
  upsertMeta({ name: 'robots', content: meta.robots })

  upsertMeta({ property: 'og:title', content: meta.title })
  upsertMeta({ property: 'og:description', content: meta.description })
  upsertMeta({ property: 'og:type', content: meta.type })
  upsertMeta({ property: 'og:site_name', content: meta.siteName })
  upsertMeta({ property: 'og:locale', content: meta.locale })
  upsertMeta({ property: 'og:url', content: resolvedUrl })
  upsertMeta({ property: 'og:image', content: meta.image })
  upsertMeta({ property: 'og:image:alt', content: meta.imageAlt })

  upsertMeta({ name: 'twitter:card', content: meta.twitterCard })
  upsertMeta({ name: 'twitter:title', content: meta.title })
  upsertMeta({ name: 'twitter:description', content: meta.description })
  upsertMeta({ name: 'twitter:image', content: meta.image })
  upsertMeta({ name: 'twitter:image:alt', content: meta.imageAlt })

  upsertMeta({ property: 'article:published_time', content: meta.publishedTime })
  upsertMeta({ property: 'article:modified_time', content: meta.modifiedTime })

  upsertLink('canonical', canonical)

  upsertJsonLd('page', meta.jsonLd)
}

export function useSeo(overrides) {
  useEffect(() => {
    setSeo(overrides)
  }, [overrides])
}

export {
  DEFAULT_SEO,
  SITE_URL,
  SITE_NAME,
  LOCALE,
  ORGANIZATION_ID,
  DEFAULT_IMAGE,
  buildBreadcrumbs,
  buildFaqPage,
  buildJsonLdGraph,
}
