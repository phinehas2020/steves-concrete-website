const ADMIN_VERIFY_ORIGIN = 'https://www.concretewaco.com'
const ADMIN_VERIFY_PATH = '/api/admin-auth-verify'
const ALLOWED_TYPES = new Set(['magiclink', 'signup'])
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const TOKEN_HASH_PATTERN = /^[A-Za-z0-9_-]{16,2048}$/

export function validateAdminConfirmationUrl(value) {
  if (typeof value !== 'string' || value.length === 0 || value.length > 4096) return null

  try {
    const confirmation = new URL(value)
    if (
      confirmation.origin !== ADMIN_VERIFY_ORIGIN ||
      confirmation.pathname !== ADMIN_VERIFY_PATH ||
      confirmation.hash
    ) {
      return null
    }

    const types = confirmation.searchParams.getAll('type')
    if (types.length !== 1 || !ALLOWED_TYPES.has(types[0])) return null

    const tokenValues = confirmation.searchParams.getAll('token_hash')
    if (tokenValues.length !== 1 || !TOKEN_HASH_PATTERN.test(tokenValues[0])) return null

    const intentValues = confirmation.searchParams.getAll('auth_intent')
    if (
      intentValues.length !== 1 ||
      !UUID_PATTERN.test(intentValues[0]) ||
      [...confirmation.searchParams.keys()].length !== 3
    ) {
      return null
    }

    return confirmation.toString()
  } catch {
    return null
  }
}
