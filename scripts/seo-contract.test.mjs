import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import sitemapHandler from '../api/sitemap.xml.js'
import {
  isBlogPostListingEligible,
  mergePublishedBlogPosts,
} from '../api/_published-blog-posts.js'
import { fetchPublicJobs, mergePublicJobs } from '../api/_public-jobs.js'
import { getPublicBlogEditorialMeta } from '../src/data/blogEditorial.js'
import { createBlogBuildManifest } from '../src/data/blogBuildManifest.js'
import {
  blogIndexingResponseHeaders,
  resolveBlogRequestIndexing,
} from '../src/data/blogRequestIndexing.js'
import { clientProjects, getServicePreviewImage } from '../src/data/clientProjects.js'
import { guidePages } from '../src/data/guides.js'
import { locationPages } from '../src/data/locationPages.js'
import { seoServicePages } from '../src/data/seoServicePages.js'
import { servicePages } from '../src/data/servicePages.js'
import { sportsCourtAreaPages } from '../src/data/sportsCourtAreaPages.js'
import { repairedBlogPosts } from '../src/data/repairedBlogPosts.js'
import { staticBlogPosts } from '../src/data/staticBlogPosts.js'
import {
  REPAIRED_BLOG_SLUGS,
  getRouteIndexingState,
  isRoutePubliclyDiscoverable,
} from '../src/data/indexingControls.js'
import {
  REPAIRED_BLOG_MIGRATION_COLUMNS,
  renderRepairedBlogMigration,
} from './render-repaired-blog-migration.mjs'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const expectedBusinessDescription =
  'Concrete contractor serving Waco, McLennan County, and nearby Central Texas communities with driveways, patios, stamped concrete, slabs, repairs, and commercial concrete work.'
const REPAIRED_SPORTS_PATHS = [
  '/sports-court-coating/texas',
  '/sports-court-coating/dallas-tx',
  '/sports-court-coating/fort-worth-tx',
  '/sports-court-coating-waco-tx',
]
const REPAIRED_BLOG_PATHS = REPAIRED_BLOG_SLUGS.map((slug) => `/blog/${slug}`)
const REPAIRED_ROUTE_PATHS = [...REPAIRED_BLOG_PATHS, ...REPAIRED_SPORTS_PATHS]

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(projectRoot, relativePath), 'utf8'))
}

function publicWordCount(value) {
  return (
    String(value || '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[[^\]]+\]\([^)]*\)/g, ' ')
      .match(/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g) || []
  ).length
}

function normalizePublicCopy(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

async function invokeSitemapHandler() {
  let body = ''
  const headers = new Map()
  const response = {
    statusCode: 200,
    setHeader(name, value) {
      headers.set(name.toLowerCase(), value)
    },
    status(code) {
      this.statusCode = code
      return this
    },
    send(value) {
      body = String(value)
      return this
    },
  }

  await sitemapHandler({ method: 'GET' }, response)
  return { body, headers, statusCode: response.statusCode }
}

test('the runtime API is the only deployable sitemap source', async () => {
  const vercel = await readJson('vercel.json')
  const sitemapRewrite = vercel.rewrites.filter((rule) => rule.source === '/sitemap.xml')

  assert.deepEqual(sitemapRewrite, [
    {
      source: '/sitemap.xml',
      destination: '/api/sitemap.xml',
    },
  ])

  await assert.rejects(
    fs.access(path.join(projectRoot, 'public', 'sitemap.xml')),
    (error) => error?.code === 'ENOENT',
  )
})

test('test modules stay outside the deployable API function directory', async () => {
  const apiEntries = await fs.readdir(path.join(projectRoot, 'api'))
  assert.deepEqual(
    apiEntries.filter((entry) => entry.endsWith('.test.js')),
    [],
  )
})

test('the runtime sitemap returns unique canonical URLs', async () => {
  const result = await invokeSitemapHandler()
  assert.equal(result.statusCode, 200)
  assert.equal(result.headers.get('content-type'), 'application/xml')

  const urls = [...result.body.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
  assert.ok(urls.length > 60)
  assert.equal(new Set(urls).size, urls.length)
  assert.ok(urls.includes('https://www.concretewaco.com/'))
  assert.ok(urls.includes('https://www.concretewaco.com/about'))
  assert.ok(urls.includes('https://www.concretewaco.com/jobs'))
  assert.ok(urls.includes('https://www.concretewaco.com/reviews'))
  clientProjects.forEach((project) => {
    assert.ok(urls.includes(`https://www.concretewaco.com/jobs/${project.slug}`))
  })
  assert.ok(!urls.includes('https://www.concretewaco.com/services/concrete-contractors'))
  assert.ok(!urls.includes('https://www.concretewaco.com/concrete-repair-waco-tx'))
  REPAIRED_ROUTE_PATHS.forEach((routePath) => {
    assert.ok(
      urls.includes(`https://www.concretewaco.com${routePath}`),
      `${routePath} must be restored to the runtime sitemap`,
    )
  })
})

test('the 23 repaired routes are indexable, discoverable, and self-canonical', () => {
  assert.equal(REPAIRED_BLOG_SLUGS.length, 19)
  assert.equal(REPAIRED_ROUTE_PATHS.length, 23)

  REPAIRED_BLOG_SLUGS.forEach((slug) => {
    const post = staticBlogPosts.find((candidate) => candidate.slug === slug)
    const routePath = `/blog/${slug}`
    assert.ok(post, slug)
    assert.equal(post.source_managed, true, slug)
    assert.equal(post.status, 'published', slug)
    assert.equal(post.seo_status, 'approved', slug)

    const state = getRouteIndexingState(routePath, post)
    assert.equal(state.indexable, true, routePath)
    assert.equal(state.includeInSitemap, true, routePath)
    assert.equal(state.robots, 'index, follow', routePath)
    assert.equal(state.canonicalPath, routePath, routePath)
    assert.equal(isRoutePubliclyDiscoverable(routePath, post), true, routePath)
  })

  REPAIRED_SPORTS_PATHS.forEach((routePath) => {
    const state = getRouteIndexingState(routePath)
    assert.equal(state.indexable, true, routePath)
    assert.equal(state.includeInSitemap, true, routePath)
    assert.equal(state.robots, 'index, follow', routePath)
    assert.equal(state.canonicalPath, routePath, routePath)
    assert.equal(isRoutePubliclyDiscoverable(routePath), true, routePath)
  })
})

test('repaired blog posts are useful source-managed articles, not hollow unblocks', () => {
  const repairedPosts = REPAIRED_BLOG_SLUGS.map((slug) => {
    const post = staticBlogPosts.find((candidate) => candidate.slug === slug)
    assert.ok(post, slug)
    return post
  })
  const retiredBoilerplate =
    /Archived Project Note Pending Source Review|This older project note remains available|not used as verified service proof|SLA Concrete Works handles[^.\n]{70,}(?:across|around) (?:Waco|Central Texas)|\b(?:request|get|schedule) (?:a )?free estimate\b/i

  assert.equal(new Set(repairedPosts.map((post) => post.title)).size, repairedPosts.length)
  assert.equal(
    new Set(repairedPosts.map((post) => normalizePublicCopy(post.content))).size,
    repairedPosts.length,
  )

  repairedPosts.forEach((post) => {
    const headings = String(post.content || '').match(/^#{2,3}\s+\S.+$/gm) || []
    const hasMedia =
      /^\/blog-images\/|^https:\/\//i.test(String(post.cover_image_url || '')) ||
      /!\[[^\]]+\]\([^)]+\)/.test(String(post.content || ''))
    const hasSourceRecord =
      String(post.source_summary || '').trim().length >= 60 &&
      !/no approved|pending|not used|source review/i.test(post.source_summary)

    assert.match(post.title, /[A-Za-z]{3}/, post.slug)
    assert.ok(post.title.length >= 12 && post.title.length <= 95, post.slug)
    assert.doesNotMatch(post.title, /archived|pending|for concrete or|texas texas/i, post.slug)
    assert.ok(publicWordCount(post.content) >= 180, `${post.slug} needs useful depth`)
    assert.ok(headings.length >= 2, `${post.slug} needs multiple scannable sections`)
    assert.ok(hasMedia || hasSourceRecord, `${post.slug} needs media or a public source record`)
    assert.doesNotMatch(post.content, retiredBoilerplate, post.slug)
    assert.doesNotMatch(post.excerpt, retiredBoilerplate, post.slug)
  })
})

test('sports planning routes have distinct indexable purposes and decision guides', () => {
  const waco = seoServicePages.find(
    (page) => page.slug === 'sports-court-coating-waco-tx',
  )
  assert.ok(waco)
  assert.ok(waco.scopeBoundary?.slaItems?.length >= 3)
  assert.ok(waco.scopeBoundary?.specialistItems?.length >= 3)
  assert.ok(waco.planningChecklist?.length >= 5)
  assert.ok(waco.officialResources?.length >= 2)

  const records = [
    ...sportsCourtAreaPages.map((page) => ({
      routePath: `/sports-court-coating/${page.slug}`,
      record: page,
      publicCopy: [
        page.heroSubtitle,
        page.intro,
        page.scopeIntro,
        page.decisionGuide?.intro,
        ...(page.decisionGuide?.items || []).flatMap((item) => [item.title, item.description]),
      ].join(' '),
    })),
    {
      routePath: '/sports-court-coating-waco-tx',
      record: waco,
      publicCopy: [
        waco.cardSummary,
        waco.introParagraph,
        waco.decisionGuide?.intro,
        ...(waco.decisionGuide?.items || []).flatMap((item) => [item.title, item.description]),
        ...(waco.sections || []).flatMap((section) => [
          section.heading,
          ...(section.paragraphs || []),
        ]),
      ].join(' '),
    },
  ]

  assert.equal(records.length, 4)
  assert.equal(new Set(records.map(({ record }) => record.pagePurpose)).size, 4)
  assert.equal(
    new Set(
      records.map(({ record }) =>
        normalizePublicCopy(
          (record.decisionGuide?.items || [])
            .flatMap((item) => [item.title, item.description])
            .join(' '),
        ),
      ),
    ).size,
    4,
  )

  records.forEach(({ routePath, record, publicCopy }) => {
    assert.equal(record.indexable, true, routePath)
    assert.equal(record.evidenceStatus, 'indexable_planning_resource', routePath)
    assert.match(record.pagePurpose, /^[a-z0-9]+(?:_[a-z0-9]+){2,}$/, routePath)
    assert.ok(record.decisionGuide?.title, routePath)
    assert.ok(record.decisionGuide?.intro, routePath)
    assert.ok(record.decisionGuide?.items?.length >= 3, routePath)
    assert.ok(publicWordCount(publicCopy) >= 140, `${routePath} needs decision-useful copy`)
  })
})

test('the repaired routes are covered by raw prerender generation', async (context) => {
  const prerenderSource = await fs.readFile(
    path.join(projectRoot, 'scripts/prerender-routes.mjs'),
    'utf8',
  )
  assert.match(prerenderSource, /\.\.\.publishedBlogPosts\.map\(\(post\) =>/)
  assert.match(prerenderSource, /\.\.\.sportsCourtAreaPageData\.map\(\(area\) =>/)

  try {
    await fs.access(path.join(projectRoot, 'dist', 'index.html'))
  } catch {
    context.skip('Run npm run build to verify generated raw HTML artifacts')
    return
  }

  for (const routePath of REPAIRED_ROUTE_PATHS) {
    const html = await fs.readFile(
      path.join(projectRoot, 'dist', routePath.replace(/^\//, ''), 'index.html'),
      'utf8',
    )
    const canonical = `https://www.concretewaco.com${routePath}`

    assert.match(html, /<meta[^>]+name=["']robots["'][^>]+content=["']index, follow["'][^>]*>/i, routePath)
    assert.ok(
      html.includes(`<link rel="canonical" href="${canonical}" />`),
      `${routePath} needs a self-canonical in raw HTML`,
    )
    assert.match(html, /data-prerender-content=["']true["']/, routePath)
    assert.doesNotMatch(html, /Archive under source review|kept out of Search/i, routePath)
  }

  const waco = seoServicePages.find(
    (page) => page.slug === 'sports-court-coating-waco-tx',
  )
  const sportsRecords = [
    ...sportsCourtAreaPages.map((record) => ({
      routePath: `/sports-court-coating/${record.slug}`,
      record,
    })),
    { routePath: '/sports-court-coating-waco-tx', record: waco },
  ]
  for (const { routePath, record } of sportsRecords) {
    const html = await fs.readFile(
      path.join(projectRoot, 'dist', routePath.replace(/^\//, ''), 'index.html'),
      'utf8',
    )
    assert.ok(html.includes(record.decisionGuide.title), routePath)
    assert.doesNotMatch(
      html,
      /planning and proof limits|Evidence required before this becomes a local proof page/i,
      routePath,
    )
    record.officialResources.forEach((resource) => {
      assert.ok(html.includes(resource.href), `${routePath} needs ${resource.label}`)
    })
  }
})

test('blog editorial state controls robots, listings, sitemap, and canonical targets', () => {
  const legacy = { slug: 'legacy-green-post' }
  const approved = { slug: 'approved-post', seo_status: 'approved' }
  const needsFacts = { slug: 'new-post', seo_status: 'needs_facts' }
  const duplicate = {
    slug: 'duplicate-post',
    seo_status: 'approved',
    canonical_slug: 'master-post',
  }

  assert.equal(isBlogPostListingEligible(legacy), true)
  assert.equal(isBlogPostListingEligible(approved), true)
  assert.equal(isBlogPostListingEligible(needsFacts), false)
  assert.equal(getRouteIndexingState('/blog/new-post/', needsFacts).robots, 'noindex, follow')

  const duplicateState = getRouteIndexingState('/blog/duplicate-post', duplicate)
  assert.equal(duplicateState.indexable, false)
  assert.equal(duplicateState.includeInSitemap, false)
  assert.equal(duplicateState.robots, 'noindex, follow')
  assert.equal(duplicateState.canonicalPath, '/blog/master-post')

  const [merged] = mergePublishedBlogPosts(
    [{ ...approved, title: 'Static title', status: 'published' }],
    [{ ...approved, seo_status: 'review', status: 'published' }],
  )
  assert.equal(merged.seo_status, 'review')
  assert.equal(isBlogPostListingEligible(merged), false)

  const [sourceManaged] = mergePublishedBlogPosts(
    [{ ...approved, title: 'Source title', status: 'published', source_managed: true }],
    [{ ...approved, title: 'Database overwrite', status: 'published' }],
  )
  assert.equal(sourceManaged.title, 'Source title')

  const repairedSource = staticBlogPosts.find(
    (post) => post.slug === 'project-update-2026-02-25',
  )
  const [repairedMerged] = mergePublishedBlogPosts(
    [repairedSource],
    [{
      ...repairedSource,
      title: 'Stale database archive title',
      seo_status: 'needs_facts',
      canonical_slug: 'unrelated-database-canonical',
      source_managed: false,
    }],
  )
  assert.equal(repairedMerged.title, repairedSource.title)
  assert.equal(repairedMerged.seo_status, 'approved')
  assert.equal(repairedMerged.canonical_slug ?? null, null)
  assert.equal(getRouteIndexingState(`/blog/${repairedMerged.slug}`, repairedMerged).indexable, true)
})

test('request-time headers trust approved source records and fail closed for stale dynamic posts', async () => {
  let repairedFetchCalled = false
  const repaired = await resolveBlogRequestIndexing('/blog/project-update-2026-02-25', {
    env: {},
    fetchImpl: async () => {
      repairedFetchCalled = true
      throw new Error('source-managed repaired posts should not fetch')
    },
  })
  assert.equal(repairedFetchCalled, false)
  assert.deepEqual(blogIndexingResponseHeaders(repaired), {
    'X-Robots-Tag': 'index, follow',
  })

  const approvedRecord = {
    slug: 'database-approved-post',
    status: 'published',
    seo_status: 'approved',
    canonical_slug: null,
    updated_at: '2026-08-07T18:00:00.000Z',
  }
  const approved = await resolveBlogRequestIndexing('/blog/database-approved-post', {
    env: {
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_ANON_KEY: 'anon-key',
    },
    manifest: createBlogBuildManifest([approvedRecord], '2026-08-07T18:01:00.000Z'),
    fetchImpl: async () => ({
      ok: true,
      json: async () => [approvedRecord],
    }),
  })
  assert.equal(approved.robots, 'index, follow')

  const approvedBeforeDeploy = await resolveBlogRequestIndexing(
    '/blog/database-approved-post',
    {
      env: {
        SUPABASE_URL: 'https://example.supabase.co',
        SUPABASE_ANON_KEY: 'anon-key',
      },
      manifest: createBlogBuildManifest([], '2026-08-07T17:59:00.000Z'),
      fetchImpl: async () => ({ ok: true, json: async () => [approvedRecord] }),
    },
  )
  assert.equal(approvedBeforeDeploy.robots, 'noindex, follow')
  assert.equal(approvedBeforeDeploy.reason, 'approved-revision-not-in-active-build')

  const missingOrDraft = await resolveBlogRequestIndexing('/blog/previously-approved-post', {
    env: {
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_ANON_KEY: 'anon-key',
    },
    fetchImpl: async () => ({ ok: true, json: async () => [] }),
  })
  assert.equal(missingOrDraft.robots, 'noindex, follow')

  const unavailable = await resolveBlogRequestIndexing('/blog/unknown-dynamic-post', {
    env: {},
    fetchImpl: async () => {
      throw new Error('offline')
    },
  })
  assert.equal(unavailable.robots, 'noindex, follow')

  let sourceFetchCalled = false
  const trustedStatic = await resolveBlogRequestIndexing(
    '/blog/melody-grove-waco-concrete-case-study',
    {
      env: {},
      fetchImpl: async () => {
        sourceFetchCalled = true
        throw new Error('source-managed posts should not fetch')
      },
    },
  )
  assert.equal(sourceFetchCalled, false)
  assert.equal(trustedStatic.robots, 'index, follow')

  let genericBadRequestCalls = 0
  const genericBadRequest = await resolveBlogRequestIndexing('/blog/bad-query-post', {
    env: {
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_ANON_KEY: 'anon-key',
    },
    manifest: createBlogBuildManifest([]),
    fetchImpl: async () => {
      genericBadRequestCalls += 1
      return {
        ok: false,
        status: 400,
        json: async () => ({ code: 'PGRST100', message: 'Malformed request' }),
      }
    },
  })
  assert.equal(genericBadRequestCalls, 1)
  assert.equal(genericBadRequest.robots, 'noindex, follow')

  const legacyRecord = {
    slug: 'legacy-database-post',
    status: 'published',
    updated_at: '2026-08-07T17:00:00.000Z',
    published_at: '2026-08-07T16:00:00.000Z',
    created_at: '2026-08-07T15:00:00.000Z',
  }
  let legacyCalls = 0
  const legacy = await resolveBlogRequestIndexing('/blog/legacy-database-post', {
    env: {
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_ANON_KEY: 'anon-key',
    },
    manifest: createBlogBuildManifest([legacyRecord]),
    fetchImpl: async () => {
      legacyCalls += 1
      if (legacyCalls === 1) {
        return {
          ok: false,
          status: 400,
          json: async () => ({
            code: 'PGRST204',
            message: "Could not find the 'seo_status' column of 'blog_posts'",
          }),
        }
      }
      return { ok: true, json: async () => [legacyRecord] }
    },
  })
  assert.equal(legacyCalls, 2)
  assert.equal(legacy.robots, 'index, follow')

  const timedOut = await resolveBlogRequestIndexing('/blog/hung-database-post', {
    env: {
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_ANON_KEY: 'anon-key',
    },
    manifest: createBlogBuildManifest([]),
    timeoutMs: 5,
    fetchImpl: async (_url, { signal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true })
      }),
  })
  assert.equal(timedOut.robots, 'noindex, follow')
})

test('public blog editorial metadata exposes the source summary but never internal notes', () => {
  const editorial = getPublicBlogEditorialMeta({
    author_name: 'Stephen Alexander',
    reviewed_by: 'Phinehas Adams',
    reviewed_at: '2026-08-07T12:00:00.000Z',
    source_summary: '  Reviewed from job photos and the concrete ticket.  ',
    source_notes: 'Internal owner-only note',
    project_series_id: 'burnet-shop-slab',
    series_phase: 'pour-day',
  })

  assert.equal(editorial.authorType, 'Person')
  assert.equal(editorial.authorName, 'Stephen Alexander')
  assert.equal(editorial.sourceSummary, 'Reviewed from job photos and the concrete ticket.')
  assert.equal('sourceNotes' in editorial, false)
  assert.doesNotMatch(JSON.stringify(editorial), /Internal owner-only note/)
})

test('project routes use clean filesystem URLs before the SPA fallback', async () => {
  const vercel = await readJson('vercel.json')
  const jobsFallback = vercel.rewrites.find((rule) => rule.source === '/jobs/:path*')

  assert.equal(vercel.cleanUrls, true)
  assert.deepEqual(jobsFallback, {
    source: '/jobs/:path*',
    destination: '/',
  })
  assert.equal(
    vercel.rewrites.some((rule) => rule.source.startsWith('/jobs/2026-client-')),
    false,
  )
})

test('the public job catalog keeps enriched static content and includes database jobs', () => {
  const staticProject = clientProjects[0]
  const merged = mergePublicJobs(
    [staticProject],
    [
      {
        ...staticProject,
        title: 'Database title that must not replace enriched copy',
        images: ['https://images.example.com/current.webp'],
      },
      {
        id: 'database-only',
        slug: 'database-only-project',
        title: 'Database-only project',
        date: '2025-01-15',
        date_formatted: 'January 2025',
        images: [],
      },
    ],
  )

  assert.equal(merged.length, 2)
  assert.equal(merged.find((job) => job.slug === staticProject.slug).title, staticProject.title)
  assert.deepEqual(
    merged.find((job) => job.slug === staticProject.slug).images,
    ['https://images.example.com/current.webp'],
  )
  assert.equal(
    merged.find((job) => job.slug === 'database-only-project').dateFormatted,
    'January 2025',
  )
})

test('yellow project galleries expose structured proof gaps without inventing facts', () => {
  assert.equal(clientProjects.length, 8)

  clientProjects.forEach((project) => {
    assert.match(project.proofStatus, /needs_source_packet|scope_limited/)
    assert.ok(project.proofNotice.length > 80, project.slug)
    assert.equal(project.proofRequirements.length, 6, project.slug)
    assert.equal(project.imageCaptions.length, project.images.length, project.slug)
    assert.ok(project.imageCaptions.every((caption) => caption.reviewed === false), project.slug)
    assert.equal(project.authenticity.stephenDecision, null, project.slug)
    assert.equal(project.authenticity.permissionRecord, null, project.slug)
  })
})

test('unproven specialty services have visible boundaries and no unrelated preview proof', () => {
  const boundarySlugs = [
    'foundation-repair-waco-tx',
    'concrete-demolition-waco-tx',
    'concrete-sawing-waco-tx',
    'retaining-walls-waco-tx',
    'hardscaping-waco-tx',
    'concrete-deck-contractors',
  ]
  const noPreviewSlugs = [
    'foundation-repair-waco-tx',
    'concrete-demolition-waco-tx',
    'concrete-sawing-waco-tx',
    'hardscaping-waco-tx',
    'concrete-deck-contractors',
    'concrete-resurfacing-waco-tx',
  ]

  boundarySlugs.forEach((slug) => {
    const page = seoServicePages.find((candidate) => candidate.slug === slug)
    assert.ok(page?.scopeBoundary, slug)
    assert.ok(page?.evidenceNote, slug)
  })
  noPreviewSlugs.forEach((slug) => assert.equal(getServicePreviewImage(slug), null, slug))
})

test('yellow locations, cost guides, and core services publish their evidence limits', () => {
  const pendingCities = ['Killeen', 'Woodway', 'Robinson', 'Lorena', 'McGregor']
  pendingCities.forEach((city) => {
    const page = locationPages.find((candidate) => candidate.city === city)
    assert.equal(page?.proofStatus, 'local-case-study-pending', city)
    assert.ok(page?.proofNotice, city)
  })

  guidePages
    .filter((guide) => guide.slug.includes('-cost-'))
    .forEach((guide) => {
      assert.deepEqual(guide.costRanges, [], guide.slug)
      assert.ok(guide.evidenceNotice, guide.slug)
      assert.ok(guide.notQuote, guide.slug)
      assert.ok(guide.lastReviewed, guide.slug)
    })

  const permitGuide = guidePages.find((guide) => guide.slug.includes('need-a-permit'))
  assert.ok(permitGuide.sources.length >= 2)

  ;['concrete-slabs', 'stained-concrete', 'concrete-sealing'].forEach((slug) => {
    const page = servicePages.find((candidate) => candidate.slug === slug)
    assert.ok(page?.evidenceNotice, slug)
    assert.ok(page?.proofRequirements.length >= 4, slug)
  })
})

test('anonymous blog reads cannot request internal authenticity fields', async () => {
  const migration = await fs.readFile(
    path.join(
      projectRoot,
      'supabase/migrations/20260807120000_add_blog_authenticity_controls.sql',
    ),
    'utf8',
  )
  const staticBlogSource = await fs.readFile(
    path.join(projectRoot, 'src/data/staticBlogPosts.js'),
    'utf8',
  )
  const publicGrant = migration.match(/grant select \(([\s\S]*?)\) on table public\.blog_posts to anon;/i)

  assert.match(migration, /revoke select on table public\.blog_posts from anon;/i)
  assert.match(
    migration,
    /create policy "Public can read published posts"[\s\S]*?to anon[\s\S]*?using \(status = 'published'\);/i,
  )
  assert.ok(publicGrant)
  assert.doesNotMatch(publicGrant[1], /source_notes|authenticity_data|author_email/i)
  assert.match(publicGrant[1], /source_summary/i)
  assert.doesNotMatch(
    staticBlogSource,
    /author_email|source_batch_key|source_notes|authenticity_data/i,
  )
})

test('fresh schema snapshots preserve editorial fields and private review data', async () => {
  const schemaSources = await Promise.all(
    ['supabase/schema.sql', 'supabase/hosted-schema-bootstrap.sql'].map(async (relativePath) => ({
      relativePath,
      source: await fs.readFile(path.join(projectRoot, relativePath), 'utf8'),
    })),
  )

  schemaSources.forEach(({ relativePath, source }) => {
    const publicGrant = source.match(
      /grant select \(([\s\S]*?)\) on table public\.blog_posts to anon;/i,
    )

    assert.match(source, /seo_status text not null default 'needs_facts'/i, relativePath)
    assert.match(source, /authenticity_data jsonb not null default '\{\}'::jsonb/i, relativePath)
    assert.match(source, /revoke select on table public\.blog_posts from anon;/i, relativePath)
    assert.match(
      source,
      /create policy "Public can read published posts"[\s\S]*?to anon[\s\S]*?using \(status = 'published'\);/i,
      relativePath,
    )
    assert.ok(publicGrant, relativePath)
    assert.doesNotMatch(
      publicGrant[1],
      /source_notes|authenticity_data|author_email/i,
      relativePath,
    )
  })
})

test('project migrations restore repaired posts while future unreviewed posts stay gated', async () => {
  const [source, restoreMigration] = await Promise.all([
    fs.readFile(path.join(projectRoot, 'scripts/migrate-supabase-project.mjs'), 'utf8'),
    fs.readFile(
      path.join(
        projectRoot,
        'supabase/migrations/20260807130000_restore_rehabilitated_blog_indexing.sql',
      ),
      'utf8',
    ),
  ])
  const copyCall = source.indexOf('await migratePublicTables()')
  const restoreCall = source.indexOf('await restorePostCopyEditorialState()')
  const authCall = source.indexOf('await migrateAuthUsers()')

  assert.ok(copyCall >= 0)
  assert.ok(restoreCall > copyCall)
  assert.ok(authCall > restoreCall)
  assert.match(source, /Evidence-Based Blog Photo Draft/)
  assert.match(source, /Do not target a word count\./)
  assert.match(source, /REPAIRED_BLOG_SLUGS/)
  assert.match(source, /repairedSourcePosts/)
  assert.match(source, /seo_status: 'approved'/)
  assert.match(source, /canonical_slug: null/)
  assert.match(restoreMigration, /insert into public\.blog_posts/)
  assert.match(restoreMigration, /on conflict \(slug\) do update/)
  assert.match(restoreMigration, /seo_status = excluded\.seo_status/)
  assert.match(restoreMigration, /canonical_slug = excluded\.canonical_slug/)
  REPAIRED_BLOG_SLUGS.forEach((slug) => {
    assert.ok(restoreMigration.includes(`'${slug}'`), slug)
  })
})

test('the forward SQL migration is an exact static snapshot of all 19 repaired source records', async () => {
  const migration = await fs.readFile(
    path.join(
      projectRoot,
      'supabase/migrations/20260807130000_restore_rehabilitated_blog_indexing.sql',
    ),
    'utf8',
  )
  const expectedColumns = [
    'slug',
    'title',
    'excerpt',
    'content',
    'cover_image_url',
    'created_at',
    'updated_at',
    'published_at',
    'status',
    'seo_status',
    'author_name',
    'reviewed_by',
    'reviewed_at',
    'source_summary',
    'canonical_slug',
    'project_series_id',
    'series_phase',
  ]

  assert.deepEqual(REPAIRED_BLOG_MIGRATION_COLUMNS, expectedColumns)
  assert.deepEqual(
    repairedBlogPosts.map((post) => post.slug),
    REPAIRED_BLOG_SLUGS,
  )
  assert.equal(repairedBlogPosts.length, 19)
  assert.equal((migration.match(/^  \($/gm) || []).length, 19)
  assert.equal(migration, renderRepairedBlogMigration())

  REPAIRED_BLOG_SLUGS.forEach((slug) => {
    const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    assert.equal(
      (migration.match(new RegExp(`^    '${escapedSlug}',$`, 'gm')) || []).length,
      1,
      slug,
    )
  })

  expectedColumns
    .filter((column) => column !== 'slug')
    .forEach((column) => {
      assert.match(migration, new RegExp(`^  ${column} = excluded\\.${column}[,;]$`, 'm'))
    })

  assert.match(migration, /SLA’s original record identifies the slab as approximately 9,600/)
  assert.match(migration, /The legacy record does not identify the job, location, use/)
  const apostropheFixture = repairedBlogPosts.map((post, index) =>
    index === 0 ? { ...post, title: "Owner's source record" } : post,
  )
  assert.match(renderRepairedBlogMigration(apostropheFixture), /Owner''s source record/)
  assert.doesNotMatch(migration, /\bexecute\s+|\bformat\s*\(|\bdo\s+\$\$/i)
})

test('production prerender cannot silently omit the public job catalog', async () => {
  await assert.rejects(
    fetchPublicJobs({ env: {}, logger: null, required: true }),
    /requires configured Supabase environment variables/,
  )
})

test('the raw homepage business identity matches prerender source language', async () => {
  const html = await fs.readFile(path.join(projectRoot, 'index.html'), 'utf8')
  const jsonLdMatch = html.match(
    /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/,
  )

  assert.ok(jsonLdMatch)
  const schema = JSON.parse(jsonLdMatch[1])
  assert.equal(schema.description, expectedBusinessDescription)
  assert.equal(schema.address.streetAddress, '1045 W Elm Mott Ln')
  assert.equal(schema.address.addressLocality, 'Elm Mott')
  assert.equal(schema.geo.latitude, 31.6637793)
  assert.equal(schema.geo.longitude, -97.1123512)
  assert.equal(schema.founder.name, 'Stephen Alexander')
  assert.ok(Array.isArray(schema.openingHoursSpecification))
  assert.ok(!('hasOfferCatalog' in schema))
  assert.doesNotMatch(html, /Concrete Leveling|Mudjacking|poly foam/i)
})

test('crawler-facing SEO sources omit unsupported cross-site trust claims', async () => {
  const source = (
    await Promise.all(
      ['scripts/prerender-routes.mjs', 'src/lib/seo.js', 'src/pages/BlogIndex.jsx'].map(
        (relativePath) => fs.readFile(path.join(projectRoot, relativePath), 'utf8'),
      ),
    )
  ).join('\n')

  assert.doesNotMatch(
    source,
    /5[- ]star|500\+|since 2005|(?:more than|over) 20 years|20\+ years|same-day response|24[- ]hour|aggregateRating/i,
  )
})

test('public planning copy omits unsupported price, warranty, and response promises', async () => {
  const source = (
    await Promise.all(
      [
        'src/data/faqs.js',
        'src/data/guides.js',
        'src/data/servicePages.js',
        'src/data/seoServicePages.js',
        'src/components/CostQuickAnswers.jsx',
        'src/components/Contact.jsx',
      ].map((relativePath) => fs.readFile(path.join(projectRoot, relativePath), 'utf8')),
    )
  ).join('\n')

  assert.doesNotMatch(source, /\$\s*\d/)
  assert.doesNotMatch(source, /covered for 2 years|two[- ]year structural warranty/i)
  assert.doesNotMatch(
    source,
    /you will usually have a ballpark the same day|often within a week or two|within \d+ hours?/i,
  )
})

test('known historical gallery variants keep their canonical redirect', async () => {
  const vercel = await readJson('vercel.json')
  const redirects = new Map(
    vercel.redirects.map((rule) => [rule.source, { destination: rule.destination, permanent: rule.permanent }]),
  )

  assert.deepEqual(redirects.get('/gallery'), {
    destination: 'https://www.concretewaco.com/jobs',
    permanent: true,
  })
  assert.deepEqual(redirects.get('/gallery/'), {
    destination: 'https://www.concretewaco.com/jobs',
    permanent: true,
  })
})
