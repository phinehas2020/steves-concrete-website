import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import test from 'node:test'

import { createAdminAuthRequestHandler } from '../../api/admin-auth-request.js'

const INTENT_ID = '11111111-1111-4111-8111-111111111111'
const REDIRECT = 'https://www.concretewaco.com/admin'
const MESSAGE = 'If this email is authorized, you will receive a sign-in link.'
const env = {
  SUPABASE_URL: 'https://zcbhkptxbhtshpxdpnja.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'service-key',
  VITE_SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
  SUPABASE_DB_SCHEMA: 'steves_concrete',
}

function request(overrides = {}) {
  return {
    method: 'POST',
    body: { email: ' Admin@Example.com ' },
    headers: {
      origin: 'https://www.concretewaco.com',
      host: 'www.concretewaco.com',
      'x-forwarded-proto': 'https',
    },
    ...overrides,
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
  }
}

function harness({
  admin = true,
  adminUserId = 'auth-user-id',
  intentId = INTENT_ID,
  sendError = null,
  throwOnSend = null,
} = {}) {
  const calls = { adminEmail: null, rpcs: [], sends: [], clients: 0 }
  const publicClient = {
    async rpc(name, args) {
      calls.rpcs.push({ name, args })
      return name === 'create_shared_auth_email_intent'
        ? { data: intentId, error: null }
        : { data: true, error: null }
    },
  }
  const serviceClient = {
    from(table) {
      assert.equal(table, 'admin_users')
      return {
        select() { return this },
        eq(column, value) {
          assert.equal(column, 'email')
          calls.adminEmail = value
          return this
        },
        async maybeSingle() {
          return { data: admin ? { id: 'admin-id', user_id: adminUserId } : null, error: null }
        },
      }
    },
    schema(schema) {
      assert.equal(schema, 'public')
      return publicClient
    },
  }
  const authClient = {
    auth: {
      async signInWithOtp(input) {
        calls.sends.push(input)
        if (throwOnSend) throw throwOnSend
        return { data: {}, error: sendError }
      },
    },
  }
  const handler = createAdminAuthRequestHandler({
    env,
    createClientImpl(_url, key) {
      calls.clients += 1
      return key === 'service-key' ? serviceClient : authClient
    },
    logger: { error() {} },
  })
  return { calls, handler }
}

test('rejects a cross-origin request without touching Supabase', async () => {
  const { calls, handler } = harness()
  const res = response()
  await handler(request({ headers: { origin: 'https://attacker.example', host: 'www.concretewaco.com' } }), res)
  assert.equal(res.statusCode, 403)
  assert.equal(calls.clients, 0)
})

test('returns a uniform response without sending for a non-admin email', async () => {
  const { calls, handler } = harness({ admin: false })
  const res = response()
  await handler(request(), res)
  assert.deepEqual(res.body, { ok: true, message: MESSAGE })
  assert.equal(calls.adminEmail, 'admin@example.com')
  assert.equal(calls.rpcs.length, 0)
  assert.equal(calls.sends.length, 0)
})

test('creates a login intent for a bound admin without user creation', async () => {
  const { calls, handler } = harness()
  const res = response()
  await handler(request(), res)
  assert.deepEqual(calls.rpcs[0], {
    name: 'create_shared_auth_email_intent',
    args: {
      p_site_id: 'steves_concrete',
      p_email_hash: createHash('sha256').update('admin@example.com').digest('hex'),
      p_action: 'login',
      p_redirect_to: REDIRECT,
    },
  })
  assert.deepEqual(calls.sends[0], {
    email: 'admin@example.com',
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${REDIRECT}?auth_intent=${INTENT_ID}`,
    },
  })
  assert.deepEqual(res.body, { ok: true, message: MESSAGE })
})

test('creates an invite intent and permits first-time user creation for an unbound admin', async () => {
  const { calls, handler } = harness({ adminUserId: null })
  const res = response()
  await handler(request(), res)
  assert.equal(calls.rpcs[0].args.p_action, 'invite')
  assert.equal(calls.sends[0].options.shouldCreateUser, true)
  assert.deepEqual(res.body, { ok: true, message: MESSAGE })
})

test('a throttled intent stops before the auth email send', async () => {
  const { calls, handler } = harness({ intentId: null })
  const res = response()
  await handler(request(), res)
  assert.equal(calls.rpcs.length, 1)
  assert.equal(calls.sends.length, 0)
  assert.deepEqual(res.body, { ok: true, message: MESSAGE })
})

test('send failures cancel the shared intent and keep a uniform response', async () => {
  const { calls, handler } = harness({ sendError: { code: 'rate_limit', status: 429 } })
  const res = response()
  await handler(request(), res)
  assert.deepEqual(calls.rpcs[1], {
    name: 'cancel_shared_auth_email_intent',
    args: { p_intent_id: INTENT_ID },
  })
  assert.deepEqual(res.body, { ok: true, message: MESSAGE })
})

test('thrown send failures also cancel the shared intent', async () => {
  const { calls, handler } = harness({ throwOnSend: new Error('network unavailable') })
  const res = response()
  await handler(request(), res)
  assert.equal(calls.rpcs[1].name, 'cancel_shared_auth_email_intent')
  assert.deepEqual(res.body, { ok: true, message: MESSAGE })
})
