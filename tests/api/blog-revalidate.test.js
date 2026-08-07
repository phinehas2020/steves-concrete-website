import assert from 'node:assert/strict'
import test from 'node:test'

import { createBlogRevalidateHandler } from '../../api/blog-revalidate.js'

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.body = body
      return this
    },
  }
}

function createSupabase({ email = 'admin@example.com', admin = true } = {}) {
  return {
    auth: {
      async getUser() {
        return { data: { user: email ? { email } : null }, error: null }
      },
    },
    from(table) {
      assert.equal(table, 'admin_users')
      return {
        select() {
          return this
        },
        eq() {
          return this
        },
        async single() {
          return { data: admin ? { id: 'admin-id' } : null, error: admin ? null : new Error('no') }
        },
      }
    },
  }
}

const baseEnv = {
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
}

test('blog rebuild endpoint requires an admin bearer token', async () => {
  const handler = createBlogRevalidateHandler({
    env: baseEnv,
    createClientImpl: () => createSupabase(),
  })
  const res = createResponse()
  await handler({ method: 'POST', headers: {} }, res)
  assert.equal(res.statusCode, 401)
})

test('blog rebuild endpoint rejects authenticated non-admin users', async () => {
  const handler = createBlogRevalidateHandler({
    env: baseEnv,
    createClientImpl: () => createSupabase({ admin: false }),
  })
  const res = createResponse()
  await handler({ method: 'POST', headers: { authorization: 'Bearer user-token' } }, res)
  assert.equal(res.statusCode, 403)
})

test('blog rebuild endpoint reports a missing deploy hook after admin authorization', async () => {
  const handler = createBlogRevalidateHandler({
    env: baseEnv,
    createClientImpl: () => createSupabase(),
  })
  const res = createResponse()
  await handler({ method: 'POST', headers: { authorization: 'Bearer admin-token' } }, res)
  assert.equal(res.statusCode, 503)
  assert.equal(res.body.code, 'DEPLOY_HOOK_MISSING')
})

test('blog rebuild endpoint requests the configured Vercel deploy hook', async () => {
  let requestedUrl = ''
  const handler = createBlogRevalidateHandler({
    env: {
      ...baseEnv,
      VERCEL_DEPLOY_HOOK_URL: 'https://api.vercel.com/v1/integrations/deploy/example',
    },
    createClientImpl: () => createSupabase(),
    fetchImpl: async (url, init) => {
      requestedUrl = url
      assert.equal(init.method, 'POST')
      return { ok: true }
    },
  })
  const res = createResponse()
  await handler({ method: 'POST', headers: { authorization: 'Bearer admin-token' } }, res)
  assert.equal(res.statusCode, 202)
  assert.equal(requestedUrl, 'https://api.vercel.com/v1/integrations/deploy/example')
})

test('blog rebuild endpoint aborts a stalled deploy hook request', async () => {
  const handler = createBlogRevalidateHandler({
    env: {
      ...baseEnv,
      VERCEL_DEPLOY_HOOK_URL: 'https://api.vercel.com/v1/integrations/deploy/example',
    },
    createClientImpl: () => createSupabase(),
    timeoutMs: 5,
    fetchImpl: async (_url, { signal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true })
      }),
  })
  const res = createResponse()
  await handler({ method: 'POST', headers: { authorization: 'Bearer admin-token' } }, res)
  assert.equal(res.statusCode, 502)
})
