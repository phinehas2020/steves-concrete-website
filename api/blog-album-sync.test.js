/* global process */
import test from 'node:test'
import assert from 'node:assert/strict'

import { isCronRequest, resolveRequester } from './blog-album-sync.js'

function createRequest(headers = {}) {
  return {
    headers,
    url: 'https://example.com/api/blog-album-sync',
    body: null,
  }
}

function createAdminSupabase({ email = 'admin@example.com', role = 'super_admin' } = {}) {
  return {
    auth: {
      async getUser(token) {
        assert.equal(token, 'admin-token')
        return {
          data: {
            user: { email },
          },
          error: null,
        }
      },
    },
    from(table) {
      assert.equal(table, 'admin_users')

      return {
        select(selection) {
          assert.equal(selection, 'email, role')
          return this
        },
        eq(column, value) {
          if (column === 'email') {
            assert.equal(value, email)
          }
          return this
        },
        async single() {
          return {
            data: { email, role },
            error: null,
          }
        },
      }
    },
  }
}

async function withCronSecret(value, callback) {
  const previous = process.env.CRON_SECRET

  if (value === undefined) {
    delete process.env.CRON_SECRET
  } else {
    process.env.CRON_SECRET = value
  }

  try {
    await callback()
  } finally {
    if (previous === undefined) {
      delete process.env.CRON_SECRET
    } else {
      process.env.CRON_SECRET = previous
    }
  }
}

test('rejects spoofed cron header without matching secret', async () => {
  await withCronSecret('cron-secret', async () => {
    const req = createRequest({ 'x-vercel-cron': '1' })

    assert.equal(isCronRequest(req), false)
    await assert.rejects(resolveRequester(req, {}), /Missing auth token/)
  })
})

test('requires the vercel cron header even when the secret is present', async () => {
  await withCronSecret('cron-secret', async () => {
    const req = createRequest({
      authorization: 'Bearer cron-secret',
    })

    assert.equal(isCronRequest(req), false)
  })
})

test('accepts authorized cron requests as system callers', async () => {
  await withCronSecret('cron-secret', async () => {
    const req = createRequest({
      'x-vercel-cron': '1',
      authorization: 'Bearer cron-secret',
    })

    assert.equal(isCronRequest(req), true)
    const actor = await resolveRequester(req, {})
    assert.deepEqual(actor, {
      email: 'photo-studio-cron@system.local',
      role: 'system',
    })
  })
})

test('still allows authenticated admins through the normal path', async () => {
  await withCronSecret('cron-secret', async () => {
    const req = createRequest({
      authorization: 'Bearer admin-token',
    })

    assert.deepEqual(await resolveRequester(req, createAdminSupabase()), {
      email: 'admin@example.com',
      role: 'super_admin',
    })
  })
})
