import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import sitemapHandler from '../api/sitemap.xml.js'

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
  assert.ok(!urls.includes('https://www.concretewaco.com/services/concrete-contractors'))
  assert.ok(!urls.includes('https://www.concretewaco.com/concrete-repair-waco-tx'))
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
