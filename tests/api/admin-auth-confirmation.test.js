import assert from 'node:assert/strict'
import test from 'node:test'

import { validateAdminConfirmationUrl } from '../../src/lib/adminAuthConfirmation.js'

const INTENT_ID = '11111111-1111-4111-8111-111111111111'

function confirmationUrl({
  origin = 'https://www.concretewaco.com',
  path = '/api/admin-auth-verify',
  type = 'magiclink',
  intent = INTENT_ID,
  tokenHash = 'abcdef0123456789abcdef0123456789',
} = {}) {
  const url = new URL(path, origin)
  url.searchParams.set('token_hash', tokenHash)
  url.searchParams.set('type', type)
  url.searchParams.set('auth_intent', intent)
  return url.toString()
}

test('accepts only Steve’s exact same-origin verifier URL', () => {
  const value = confirmationUrl()
  assert.equal(validateAdminConfirmationUrl(value), value)

  const signup = confirmationUrl({ type: 'signup' })
  assert.equal(validateAdminConfirmationUrl(signup), signup)
})

test('rejects a foreign host or verifier path', () => {
  assert.equal(validateAdminConfirmationUrl(confirmationUrl({ origin: 'https://evil.example' })), null)
  assert.equal(validateAdminConfirmationUrl(confirmationUrl({ path: '/auth/v1/callback' })), null)
})

test('rejects non-login actions and invalid intent ids', () => {
  assert.equal(validateAdminConfirmationUrl(confirmationUrl({ type: 'recovery' })), null)
  assert.equal(
    validateAdminConfirmationUrl(confirmationUrl({ intent: 'not-a-uuid' })),
    null,
  )
})

test('requires a valid token hash and exactly three query parameters', () => {
  assert.equal(validateAdminConfirmationUrl(confirmationUrl({ tokenHash: 'short' })), null)

  const extra = new URL(confirmationUrl())
  extra.searchParams.set('next', '/')
  assert.equal(
    validateAdminConfirmationUrl(extra.toString()),
    null,
  )
})

test('rejects duplicate critical fields', () => {
  const duplicateIntent = new URL(confirmationUrl())
  duplicateIntent.searchParams.append('auth_intent', INTENT_ID)
  assert.equal(validateAdminConfirmationUrl(duplicateIntent.toString()), null)
})
