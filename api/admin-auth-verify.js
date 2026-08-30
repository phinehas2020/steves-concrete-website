import { createHash } from 'node:crypto'

const SITE_ID = 'steves_concrete'
const SUPABASE_ORIGIN = 'https://zcbhkptxbhtshpxdpnja.supabase.co'
const SUPABASE_VERIFY_PATH = '/auth/v1/verify'
const ADMIN_REDIRECT = 'https://www.concretewaco.com/admin'
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const TOKEN_HASH_PATTERN = /^[A-Za-z0-9_-]{16,2048}$/
const ALLOWED_VERIFY_TYPES = new Set(['magiclink', 'signup'])

function envString(env, ...names) {
  for (const name of names) {
    const value = env[name]
    if (typeof value !== 'string') continue
    const normalized = value.replace(/[\0\r\n]/g, '').trim()
    if (normalized) return normalized
  }
  return ''
}

function exactQueryValue(query, name) {
  const value = query?.[name]
  return typeof value === 'string' ? value : ''
}

function hasExactQuery(query) {
  if (!query || typeof query !== 'object') return false
  const keys = Object.keys(query).sort()
  return keys.length === 3 &&
    keys[0] === 'auth_intent' &&
    keys[1] === 'token_hash' &&
    keys[2] === 'type'
}

function invalidResponse(response) {
  return response.status(400).json({ ok: false, message: 'Invalid or expired sign-in request.' })
}

function errorDetails(error) {
  return {
    code: error && typeof error.code === 'string' ? error.code : undefined,
    status: error && Number.isInteger(error.status) ? error.status : undefined,
  }
}

export function createAdminAuthVerifyHandler({
  env = process.env,
  createClientImpl,
  logger = console,
} = {}) {
  return async function adminAuthVerify(request, response) {
    response.setHeader('Cache-Control', 'private, no-store, max-age=0')
    response.setHeader('Referrer-Policy', 'no-referrer')
    response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive')

    if (request.method !== 'GET') {
      response.setHeader('Allow', 'GET')
      return response.status(405).json({ ok: false, message: 'Method not allowed.' })
    }

    if (!hasExactQuery(request.query)) return invalidResponse(response)

    const tokenHash = exactQueryValue(request.query, 'token_hash')
    const type = exactQueryValue(request.query, 'type')
    const intentId = exactQueryValue(request.query, 'auth_intent')
    if (
      !ALLOWED_VERIFY_TYPES.has(type) ||
      !TOKEN_HASH_PATTERN.test(tokenHash) ||
      !UUID_PATTERN.test(intentId)
    ) {
      return invalidResponse(response)
    }

    const url = envString(env, 'SUPABASE_URL', 'VITE_SUPABASE_URL')
    const serviceRoleKey = envString(env, 'SUPABASE_SERVICE_ROLE_KEY')
    try {
      const configuredUrl = new URL(url)
      if (
        !url ||
        !serviceRoleKey ||
        configuredUrl.origin !== SUPABASE_ORIGIN ||
        configuredUrl.pathname !== '/' ||
        configuredUrl.username ||
        configuredUrl.password ||
        configuredUrl.search ||
        configuredUrl.hash
      ) {
        logger.error('[steves-admin-auth-verify] invalid server configuration')
        return invalidResponse(response)
      }

      const serviceClient = await createClientImpl(url, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
      const fingerprint = createHash('sha256').update(tokenHash).digest('hex')
      const { data: valid, error } = await serviceClient.schema('public').rpc(
        'validate_shared_auth_email_verification',
        {
          p_intent_id: intentId,
          p_site_id: SITE_ID,
          p_token_fingerprint: fingerprint,
          p_email_action_type: type,
        },
      )

      if (error) {
        logger.error('[steves-admin-auth-verify] verification failed', errorDetails(error))
        return invalidResponse(response)
      }
      if (valid !== true) return invalidResponse(response)

      const redirectTo = new URL(ADMIN_REDIRECT)
      redirectTo.searchParams.set('auth_intent', intentId)
      const supabaseVerify = new URL(SUPABASE_VERIFY_PATH, SUPABASE_ORIGIN)
      supabaseVerify.searchParams.set('token_hash', tokenHash)
      supabaseVerify.searchParams.set('type', type)
      supabaseVerify.searchParams.set('redirect_to', redirectTo.toString())

      response.setHeader('Location', supabaseVerify.toString())
      return response.status(302).end()
    } catch (error) {
      logger.error('[steves-admin-auth-verify] request failed', errorDetails(error))
      return invalidResponse(response)
    }
  }
}

async function createSupabaseClient(...args) {
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(...args)
}

export default createAdminAuthVerifyHandler({ createClientImpl: createSupabaseClient })
