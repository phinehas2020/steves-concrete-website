import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import test from 'node:test'

import { createAdminAuthVerifyHandler } from '../../api/admin-auth-verify.js'

const INTENT_ID = '11111111-1111-4111-8111-111111111111'
const TOKEN_HASH = 'abcdef0123456789abcdef0123456789'
const SUPABASE_ORIGIN = 'https://zcbhkptxbhtshpxdpnja.supabase.co'
const env = {
  SUPABASE_URL: SUPABASE_ORIGIN,
  SUPABASE_SERVICE_ROLE_KEY: 'service-key',
}

function request(query = {}) {
  return {
    method: 'GET',
    query: {
      token_hash: TOKEN_HASH,
      type: 'magiclink',
      auth_intent: INTENT_ID,
      ...query,
    },
  }
}

function response() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; return this },
    status(code) { this.statusCode = code; return this },
    json(body) { this.body = body; return this },
    end() { return this },
  }
}

function harness(valid = true) {
  const calls = []
  const serviceClient = {
    schema(schema) {
      assert.equal(schema, 'public')
      return {
        async rpc(name, args) {
          calls.push({ name, args })
          return { data: valid, error: null }
        },
      }
    },
  }
  const handler = createAdminAuthVerifyHandler({
    env,
    createClientImpl: async () => serviceClient,
    logger: { error() {} },
  })
  return { calls, handler }
}

test('rejects extra, duplicate, or malformed query parameters before RPC', async () => {
  const { calls, handler } = harness()
  for (const query of [
    { extra: 'value' },
    { type: ['magiclink', 'magiclink'] },
    { auth_intent: 'not-a-uuid' },
    { token_hash: 'short' },
  ]) {
    const res = response()
    await handler(request(query), res)
    assert.equal(res.statusCode, 400)
  }
  assert.equal(calls.length, 0)
})

test('hashes the token and calls the exact shared verification RPC', async () => {
  const { calls, handler } = harness(true)
  const res = response()
  await handler(request(), res)
  assert.deepEqual(calls[0], {
    name: 'validate_shared_auth_email_verification',
    args: {
      p_intent_id: INTENT_ID,
      p_site_id: 'steves_concrete',
      p_token_fingerprint: createHash('sha256').update(TOKEN_HASH).digest('hex'),
      p_email_action_type: 'magiclink',
    },
  })
  assert.equal(res.statusCode, 302)
  assert.equal(res.headers['Cache-Control'], 'private, no-store, max-age=0')
  assert.equal(res.headers['Referrer-Policy'], 'no-referrer')
})

test('redirects only a validated intent to the exact shared Supabase verifier', async () => {
  const { handler } = harness(true)
  const res = response()
  await handler(request(), res)
  const location = new URL(res.headers.Location)
  assert.equal(location.origin, SUPABASE_ORIGIN)
  assert.equal(location.pathname, '/auth/v1/verify')
  assert.equal(location.searchParams.get('token_hash'), TOKEN_HASH)
  assert.equal(location.searchParams.get('type'), 'magiclink')
  assert.equal(
    location.searchParams.get('redirect_to'),
    `https://www.concretewaco.com/admin?auth_intent=${INTENT_ID}`,
  )
})

test('preserves a validated first-login signup type', async () => {
  const { calls, handler } = harness(true)
  const res = response()
  await handler(request({ type: 'signup' }), res)
  assert.equal(calls[0].args.p_email_action_type, 'signup')
  const location = new URL(res.headers.Location)
  assert.equal(location.searchParams.get('type'), 'signup')
})

test('does not redirect when the shared verifier returns false', async () => {
  const { handler } = harness(false)
  const res = response()
  await handler(request(), res)
  assert.equal(res.statusCode, 400)
  assert.equal(res.headers.Location, undefined)
})
