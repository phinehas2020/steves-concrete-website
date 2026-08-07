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
import { staticBlogPosts } from '../src/data/staticBlogPosts.js'
import {
  AUTHENTICITY_NOINDEX_CONTROLS,
  FORMULAIC_BLOG_SLUGS,
  getRouteIndexingState,
} from '../src/data/indexingControls.js'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const expectedBusinessDescription =
  'Concrete contractor serving Waco, McLennan County, and nearby Central Texas communities with driveways, patios, stamped concrete, slabs, repairs, and commercial concrete work.'

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(projectRoot, relativePath), 'utf8'))
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
  AUTHENTICITY_NOINDEX_CONTROLS.forEach((control) => {
    assert.ok(!urls.includes(`https://www.concretewaco.com${control.path}`))
  })
})

test('authenticity controls keep red routes public but out of Search', () => {
  assert.equal(AUTHENTICITY_NOINDEX_CONTROLS.length, 23)
  assert.equal(FORMULAIC_BLOG_SLUGS.length, 19)

  AUTHENTICITY_NOINDEX_CONTROLS.forEach((control) => {
    const state = getRouteIndexingState(control.path, { seo_status: 'approved' })
    assert.equal(state.indexable, false, control.path)
    assert.equal(state.includeInSitemap, false, control.path)
    assert.equal(state.robots, 'noindex, follow', control.path)
    assert.equal(state.canonicalPath, control.path, control.path)
  })

  assert.equal(
    getRouteIndexingState('/jobs/2026-client-decorative-court-surfacing').indexable,
    true,
  )

  FORMULAIC_BLOG_SLUGS.forEach((slug) => {
    const archive = staticBlogPosts.find((post) => post.slug === slug)
    assert.ok(archive, slug)
    assert.equal(archive.status, 'published', slug)
    assert.equal(archive.seo_status, 'needs_facts', slug)
    assert.match(archive.source_summary, /not used as verified service proof/i, slug)
  })

  assert.equal(
    staticBlogPosts.find(
      (post) => post.slug === 'for-concrete-or-circle-k-lacy-lake-view',
    )?.canonical_slug,
    'circle-k-concrete-flatwork-lacy-lakeview-tx',
  )
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
})

test('request-time blog headers fail closed when prerender or database state is stale', async () => {
  let redFetchCalled = false
  const red = await resolveBlogRequestIndexing('/blog/project-update-2026-02-25', {
    env: {},
    fetchImpl: async () => {
      redFetchCalled = true
      throw new Error('should not fetch')
    },
  })
  assert.equal(redFetchCalled, false)
  assert.deepEqual(blogIndexingResponseHeaders(red), {
    'X-Robots-Tag': 'noindex, follow',
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
    'sports-court-coating-waco-tx',
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

test('project migration reapplies authenticity guards after copying source rows', async () => {
  const source = await fs.readFile(
    path.join(projectRoot, 'scripts/migrate-supabase-project.mjs'),
    'utf8',
  )
  const copyCall = source.indexOf('await migratePublicTables()')
  const guardCall = source.indexOf('await enforcePostCopyAuthenticityGuards()')
  const authCall = source.indexOf('await migrateAuthUsers()')

  assert.ok(copyCall >= 0)
  assert.ok(guardCall > copyCall)
  assert.ok(authCall > guardCall)
  assert.match(source, /Evidence-Based Blog Photo Draft/)
  assert.match(source, /Do not target a word count\./)
  assert.match(source, /\.in\('slug', FORMULAIC_BLOG_SLUGS\)/)
  assert.match(source, /circle-k-concrete-flatwork-lacy-lakeview-tx/)
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
