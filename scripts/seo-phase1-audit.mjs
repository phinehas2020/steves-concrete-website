import fs from 'node:fs/promises'
import path from 'node:path'

const OUTPUT_CSV = path.join(process.cwd(), 'reports', 'audit_2026-05-12.csv')
const OUTPUT_GRAPH = path.join(process.cwd(), 'reports', 'link_graph.html')
const USER_AGENT =
  'Mozilla/5.0 (compatible; SLAConcreteSEOAudit/1.0; +https://www.concretewaco.com)'
const MAX_INTERNAL_DISCOVERY_PAGES = 8
const AUDIT_CONCURRENCY = 8
const FETCH_TIMEOUT_MS = 20000
const PSI_TIMEOUT_MS = 45000

const sites = [
  {
    key: 'target',
    label: 'Concrete Waco',
    origin: 'https://www.concretewaco.com',
    startUrls: ['https://www.concretewaco.com/', 'https://concretewaco.com/'],
    sitemapUrls: ['https://www.concretewaco.com/sitemap.xml'],
  },
  {
    key: 'reference',
    label: 'Concrete Contractor NYC',
    origin: 'https://concretecontractor.nyc',
    startUrls: ['https://concretecontractor.nyc/'],
    sitemapUrls: [
      'https://concretecontractor.nyc/sitemap.xml',
      'https://concretecontractor.nyc/sitemap_index.xml',
    ],
  },
]

function csvCell(value) {
  const normalized = value == null ? '' : String(value)
  return `"${normalized.replaceAll('"', '""')}"`
}

function stripTrailingSlash(url) {
  if (!url) return url
  const parsed = new URL(url)
  if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '')
  parsed.hash = ''
  return parsed.href
}

function normalizeUrl(href, baseUrl, origin) {
  try {
    const parsed = new URL(href, baseUrl)
    parsed.hash = ''
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    if (parsed.hostname.replace(/^www\./, '') !== new URL(origin).hostname.replace(/^www\./, '')) {
      return null
    }
    return stripTrailingSlash(parsed.href)
  } catch {
    return null
  }
}

function decodeHtml(value = '') {
  return String(value)
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
}

function textFromHtml(html = '') {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
      .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ').trim()
}

function wordCount(text = '') {
  const words = text.match(/[A-Za-z0-9][A-Za-z0-9'-]*/g)
  return words ? words.length : 0
}

function firstMatch(html, regex) {
  return decodeHtml(html.match(regex)?.[1]?.trim() || '')
}

function findMeta(html, attr, value) {
  const regex = new RegExp(
    `<meta\\b(?=[^>]*\\b${attr}=["']${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'])[^>]*\\bcontent=["']([^"']*)["'][^>]*>`,
    'i',
  )
  return firstMatch(html, regex)
}

function findAllMetaProperties(html) {
  const tags = {}
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0]
    const property = tag.match(/\bproperty=["']([^"']+)["']/i)?.[1]
    const content = tag.match(/\bcontent=["']([^"']*)["']/i)?.[1]
    if (property?.startsWith('og:')) tags[property] = decodeHtml(content || '')
  }
  return tags
}

function headings(html, tag) {
  const regex = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi')
  return [...html.matchAll(regex)]
    .map((match) => textFromHtml(match[1]))
    .filter(Boolean)
}

function parseImages(html, baseUrl) {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => {
    const tag = match[0]
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] || ''
    const alt = tag.match(/\balt=["']([^"']*)["']/i)?.[1] || ''
    let filename = ''
    try {
      filename = path.basename(new URL(src, baseUrl).pathname)
    } catch {
      filename = path.basename(src)
    }
    return {
      src,
      alt: decodeHtml(alt).trim(),
      filename,
      hasLocationHint: /\b(waco|nyc|new-york|manhattan|brooklyn|queens|bronx|staten|mclennan|woodway|hewitt|robinson|lorena|temple|killeen)\b/i.test(
        `${filename} ${alt}`,
      ),
    }
  })
}

function parseLinks(html, baseUrl, origin) {
  return [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => {
      const href = normalizeUrl(match[1], baseUrl, origin)
      if (!href) return null
      return {
        href,
        anchor: textFromHtml(match[2]).slice(0, 120),
      }
    })
    .filter(Boolean)
}

function collectSchemaTypes(html) {
  const types = new Set()
  const visit = (value) => {
    if (!value) return
    if (Array.isArray(value)) {
      value.forEach(visit)
      return
    }
    if (typeof value === 'object') {
      const type = value['@type']
      if (Array.isArray(type)) type.forEach((item) => types.add(String(item)))
      else if (type) types.add(String(type))
      Object.values(value).forEach(visit)
    }
  }

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = decodeHtml(match[1]).trim()
    if (!raw) continue
    try {
      visit(JSON.parse(raw))
    } catch {
      types.add('INVALID_JSON_LD')
    }
  }

  for (const match of html.matchAll(/\bitemtype=["']https?:\/\/schema\.org\/([^"']+)["']/gi)) {
    types.add(match[1])
  }

  return [...types].sort()
}

function trustSignals(text, html) {
  const checks = {
    reviews: /\breviews?\b|\bstar\b|\brating\b/i.test(text),
    license: /\blicen[cs](e|ed|ing)\b/i.test(text),
    insured: /\binsur(ed|ance)\b/i.test(text),
    owner: /\bowner\b|\bSteve\b|\bfounder\b/i.test(text),
    years: /\b(since|years?|25\+|2005|2025)\b/i.test(text),
    bbb: /\bBBB\b|Better Business Bureau/i.test(text),
    phone: /(\(\d{3}\)\s*\d{3}-\d{4}|\d{3}[-.\s]\d{3}[-.\s]\d{4})/.test(text),
    form: /<form\b/i.test(html) || /\bname\b.*\bphone\b.*\bemail\b/is.test(text),
  }
  return Object.entries(checks)
    .filter(([, present]) => present)
    .map(([key]) => key)
}

function ctaSignals(text, html) {
  const lower = text.toLowerCase()
  const signals = []
  if (lower.includes('free estimate') || lower.includes('estimate')) signals.push('estimate')
  if (lower.includes('contact')) signals.push('contact')
  if (lower.includes('call') || /tel:/i.test(html)) signals.push('phone')
  if (/<form\b/i.test(html)) signals.push('form')
  if (lower.includes('submit')) signals.push('submit')
  return [...new Set(signals)]
}

async function fetchText(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': USER_AGENT,
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })
    const text = await response.text()
    return {
      ok: response.ok,
      status: response.status,
      finalUrl: stripTrailingSlash(response.url || url),
      contentType: response.headers.get('content-type') || '',
      text,
      error: '',
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      finalUrl: url,
      contentType: '',
      text: '',
      error: `${error.name}: ${error.message}`,
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function discoverSitemapUrls(site) {
  const urls = new Set()
  const queue = [...site.sitemapUrls]
  const seen = new Set()

  while (queue.length > 0) {
    const sitemapUrl = queue.shift()
    if (!sitemapUrl || seen.has(sitemapUrl)) continue
    seen.add(sitemapUrl)
    const response = await fetchText(sitemapUrl)
    if (!response.ok) continue
    for (const loc of response.text.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)) {
      const normalized = normalizeUrl(decodeHtml(loc[1]), site.origin, site.origin)
      if (!normalized) continue
      if (/\.xml(\?|$)/i.test(normalized)) queue.push(normalized)
      else urls.add(normalized)
    }
  }

  return urls
}

async function discoverUrls(site) {
  const sitemapUrls = await discoverSitemapUrls(site)
  const discovered = new Set([...site.startUrls.map((url) => stripTrailingSlash(url)), ...sitemapUrls])
  const queue = [...site.startUrls.map((url) => stripTrailingSlash(url))]
  const crawled = new Set()

  while (queue.length > 0 && crawled.size < MAX_INTERNAL_DISCOVERY_PAGES) {
    const url = queue.shift()
    if (!url || crawled.has(url)) continue
    crawled.add(url)
    console.log(`Discovering internal links from ${url}`)
    const response = await fetchText(url)
    if (!response.ok || !response.contentType.includes('html')) continue
    for (const link of parseLinks(response.text, response.finalUrl, site.origin)) {
      if (discovered.has(link.href)) continue
      discovered.add(link.href)
      queue.push(link.href)
    }
  }

  return [...discovered].sort()
}

async function mapConcurrent(items, concurrency, worker) {
  const results = new Array(items.length)
  let nextIndex = 0
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex
      nextIndex += 1
      results[index] = await worker(items[index], index)
    }
  })
  await Promise.all(workers)
  return results
}

async function fetchPageSpeed(url) {
  const key = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_PAGESPEED_API_KEY
  const apiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
  apiUrl.searchParams.set('url', url)
  apiUrl.searchParams.set('strategy', 'mobile')
  apiUrl.searchParams.set('category', 'performance')
  if (key) apiUrl.searchParams.set('key', key)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), PSI_TIMEOUT_MS)
  try {
    const response = await fetch(apiUrl, { signal: controller.signal })
    const json = await response.json()
    if (!response.ok) {
      return {
        psiStatus: `error_${response.status}`,
        psiError: json?.error?.message || response.statusText,
      }
    }
    const audits = json.lighthouseResult?.audits || {}
    return {
      psiStatus: 'ok',
      psiError: '',
      performanceScore:
        json.lighthouseResult?.categories?.performance?.score == null
          ? ''
          : Math.round(json.lighthouseResult.categories.performance.score * 100),
      lcpMs: audits['largest-contentful-paint']?.numericValue
        ? Math.round(audits['largest-contentful-paint'].numericValue)
        : '',
      inpMs: audits['interaction-to-next-paint']?.numericValue
        ? Math.round(audits['interaction-to-next-paint'].numericValue)
        : '',
      cls: audits['cumulative-layout-shift']?.numericValue ?? '',
    }
  } catch (error) {
    return {
      psiStatus: 'error',
      psiError: `${error.name}: ${error.message}`,
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function auditUrl(site, url, psiDisabledReason) {
  const response = await fetchText(url)
  const html = response.text || ''
  const visibleText = textFromHtml(html)
  const images = parseImages(html, response.finalUrl || url)
  const links = parseLinks(html, response.finalUrl || url, site.origin)
  const ogTags = findAllMetaProperties(html)
  const schemaTypes = collectSchemaTypes(html)
  const trust = trustSignals(visibleText, html)
  const ctas = ctaSignals(visibleText, html)
  const canonical = firstMatch(html, /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/i)
  const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i)

  let psi = {
    psiStatus: psiDisabledReason ? 'not_run' : '',
    psiError: psiDisabledReason || '',
    performanceScore: '',
    lcpMs: '',
    inpMs: '',
    cls: '',
  }
  if (!psiDisabledReason && response.ok && response.contentType.includes('html')) {
    psi = { ...psi, ...(await fetchPageSpeed(response.finalUrl || url)) }
  }

  return {
    site_key: site.key,
    site_label: site.label,
    url,
    final_url: response.finalUrl,
    http_status: response.status,
    fetch_error: response.error,
    canonical,
    title,
    meta_description: findMeta(html, 'name', 'description'),
    og_title: ogTags['og:title'] || '',
    og_description: ogTags['og:description'] || '',
    og_image: ogTags['og:image'] || '',
    h1: headings(html, 'h1').join(' | '),
    h2: headings(html, 'h2').join(' | '),
    h3: headings(html, 'h3').join(' | '),
    visible_word_count_excluding_nav_footer: wordCount(visibleText),
    image_count: images.length,
    images_with_alt: images.filter((image) => image.alt).length,
    image_alt_presence_rate:
      images.length === 0 ? 'n/a' : `${Math.round((images.filter((image) => image.alt).length / images.length) * 100)}%`,
    image_filename_patterns: [...new Set(images.map((image) => image.filename).filter(Boolean))]
      .slice(0, 12)
      .join(' | '),
    image_location_hint_rate:
      images.length === 0 ? 'n/a' : `${Math.round((images.filter((image) => image.hasLocationHint).length / images.length) * 100)}%`,
    image_geotagging: 'not_measured_remote_exif',
    internal_links_out_count: links.length,
    internal_links_out: links.map((link) => `${link.anchor || '[empty]'} -> ${link.href}`).join(' | '),
    internal_links_in_count: 0,
    schema_types_present: schemaTypes.join(' | '),
    schema_validation_status: schemaTypes.includes('INVALID_JSON_LD')
      ? 'json_ld_parse_error'
      : schemaTypes.length
        ? 'json_ld_types_extracted'
        : 'none_detected',
    pagespeed_mobile_status: psi.psiStatus,
    pagespeed_mobile_error: psi.psiError,
    performance_score_mobile: psi.performanceScore,
    lcp_ms_mobile: psi.lcpMs,
    inp_ms_mobile: psi.inpMs,
    cls_mobile: psi.cls,
    trust_elements_present: trust.join(' | '),
    cta_signals: ctas.join(' | '),
    phone_prominent: trust.includes('phone') ? 'yes' : 'no',
    form_fields_detected: /<form\b/i.test(html) ? 'form_tag' : ctas.includes('form') ? 'textual_form_fields' : 'none',
    mobile_375_render: psi.psiStatus === 'ok' ? 'covered_by_pagespeed_mobile' : 'not_captured_pagespeed_unavailable',
    outbound_internal_links: links,
  }
}

function buildRowsWithInbound(rows) {
  const canonicalToRow = new Map(rows.map((row) => [stripTrailingSlash(row.final_url || row.url), row]))
  for (const row of rows) {
    for (const link of row.outbound_internal_links || []) {
      const target = canonicalToRow.get(stripTrailingSlash(link.href))
      if (target) target.internal_links_in_count += 1
    }
  }
  return rows
}

function graphHtml(rows) {
  const nodes = rows.map((row) => ({
    id: stripTrailingSlash(row.final_url || row.url),
    site: row.site_key,
    title: row.title || row.h1 || row.url,
    inCount: row.internal_links_in_count,
    outCount: row.internal_links_out_count,
    orphan: row.internal_links_in_count === 0 && !/\/$/.test(new URL(row.url).pathname),
  }))
  const nodeIds = new Set(nodes.map((node) => node.id))
  const links = rows.flatMap((row) =>
    (row.outbound_internal_links || [])
      .map((link) => ({
        source: stripTrailingSlash(row.final_url || row.url),
        target: stripTrailingSlash(link.href),
        label: link.anchor || '',
      }))
      .filter((link) => nodeIds.has(link.source) && nodeIds.has(link.target) && link.source !== link.target),
  )

  const mermaidLines = [
    'flowchart LR',
    ...nodes.map((node, index) => {
      const safeTitle = `${node.site}: ${node.title}`.replace(/["<>]/g, '').slice(0, 70)
      return `  n${index}["${safeTitle}"]`
    }),
  ]
  const nodeIndex = new Map(nodes.map((node, index) => [node.id, index]))
  for (const link of links) {
    mermaidLines.push(`  n${nodeIndex.get(link.source)} --> n${nodeIndex.get(link.target)}`)
  }

  const orphanRows = nodes
    .filter((node) => node.orphan)
    .map((node) => `<li><a href="${node.id}">${node.title}</a> (${node.site})</li>`)
    .join('\n')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Concrete SEO Link Graph - 2026-05-12</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 32px; color: #1c1917; background: #fafaf9; }
    h1, h2 { line-height: 1.1; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin: 24px 0; }
    .metric { background: white; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px; }
    pre { background: white; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px; overflow: auto; }
    li { margin: 6px 0; }
  </style>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true, securityLevel: 'loose', flowchart: { curve: 'basis' } });
  </script>
</head>
<body>
  <h1>Concrete SEO Link Graph</h1>
  <p>Generated from live crawls on 2026-05-12. Node labels are truncated page titles. Full URL-level details are in <code>audit_2026-05-12.csv</code>.</p>
  <section class="summary">
    ${sites
      .map((site) => {
        const siteNodes = nodes.filter((node) => node.site === site.key)
        const siteLinks = links.filter((link) => siteNodes.some((node) => node.id === link.source))
        const orphans = siteNodes.filter((node) => node.orphan).length
        return `<div class="metric"><strong>${site.label}</strong><br>${siteNodes.length} URLs<br>${siteLinks.length} internal edges<br>${orphans} possible orphan URLs</div>`
      })
      .join('\n')}
  </section>
  <h2>Possible Orphans</h2>
  <ul>${orphanRows || '<li>None detected within crawled URL set.</li>'}</ul>
  <h2>Mermaid Graph</h2>
  <pre class="mermaid">
${mermaidLines.join('\n')}
  </pre>
</body>
</html>`
}

async function detectPsiAvailability() {
  const key = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_PAGESPEED_API_KEY
  if (!key) return 'missing PAGESPEED_API_KEY or GOOGLE_PAGESPEED_API_KEY'
  const sample = await fetchPageSpeed('https://www.concretewaco.com/')
  if (sample.psiStatus !== 'ok') return sample.psiError || sample.psiStatus
  return ''
}

async function main() {
  await fs.mkdir(path.dirname(OUTPUT_CSV), { recursive: true })
  const psiDisabledReason = await detectPsiAvailability()
  const rows = []

  for (const site of sites) {
    const urls = await discoverUrls(site)
    console.log(`${site.label}: discovered ${urls.length} URLs`)
    const siteRows = await mapConcurrent(urls, AUDIT_CONCURRENCY, async (url, index) => {
      console.log(`Auditing ${site.label} ${index + 1}/${urls.length}: ${url}`)
      return auditUrl(site, url, psiDisabledReason)
    })
    rows.push(...siteRows)
  }

  buildRowsWithInbound(rows)

  const columns = [
    'site_key',
    'site_label',
    'url',
    'final_url',
    'http_status',
    'fetch_error',
    'canonical',
    'title',
    'meta_description',
    'og_title',
    'og_description',
    'og_image',
    'h1',
    'h2',
    'h3',
    'visible_word_count_excluding_nav_footer',
    'image_count',
    'images_with_alt',
    'image_alt_presence_rate',
    'image_filename_patterns',
    'image_location_hint_rate',
    'image_geotagging',
    'internal_links_out_count',
    'internal_links_out',
    'internal_links_in_count',
    'schema_types_present',
    'schema_validation_status',
    'pagespeed_mobile_status',
    'pagespeed_mobile_error',
    'performance_score_mobile',
    'lcp_ms_mobile',
    'inp_ms_mobile',
    'cls_mobile',
    'trust_elements_present',
    'cta_signals',
    'phone_prominent',
    'form_fields_detected',
    'mobile_375_render',
  ]

  const csv = [
    columns.map(csvCell).join(','),
    ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(',')),
  ].join('\n')

  await fs.writeFile(OUTPUT_CSV, `${csv}\n`, 'utf8')
  await fs.writeFile(OUTPUT_GRAPH, graphHtml(rows), 'utf8')

  console.log(`Wrote ${OUTPUT_CSV}`)
  console.log(`Wrote ${OUTPUT_GRAPH}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
