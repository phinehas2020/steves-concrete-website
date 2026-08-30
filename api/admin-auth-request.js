import { createHash } from 'node:crypto'

const SITE_ID = 'steves_concrete'
const CANONICAL_REDIRECT = 'https://www.concretewaco.com/admin'
const EXPECTED_SUPABASE_ORIGIN = 'https://zcbhkptxbhtshpxdpnja.supabase.co'
const UNIFORM_MESSAGE = 'If this email is authorized, you will receive a sign-in link.'
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function envString(env, ...names) {
  for (const name of names) {
    const value = env[name]
    if (typeof value !== 'string') continue
    const normalized = value.replace(/[\0\r\n]/g, '').trim()
    if (normalized) return normalized
  }
  return ''
}

function normalizeEmail(value) {
  if (typeof value !== 'string') return ''
  const email = value.trim().toLowerCase()
  if (email.length > 320 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return ''
  return email
}

function parseBody(body) {
  if (body && typeof body === 'object') return body
  if (typeof body !== 'string') return null

  try {
    return JSON.parse(body)
  } catch {
    return null
  }
}

function firstHeader(value) {
  if (Array.isArray(value)) return value[0] || ''
  if (typeof value !== 'string') return ''
  return value.split(',')[0].trim()
}

function isSameOrigin(request) {
  const origin = firstHeader(request.headers?.origin)
  const host = firstHeader(request.headers?.['x-forwarded-host']) || firstHeader(request.headers?.host)
  const protocol = firstHeader(request.headers?.['x-forwarded-proto']) ||
    (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https')

  if (!origin || !host) return false

  try {
    return new URL(origin).origin === new URL(`${protocol}://${host}`).origin
  } catch {
    return false
  }
}

function uniformResponse(response) {
  return response.status(200).json({ ok: true, message: UNIFORM_MESSAGE })
}

function errorDetails(error) {
  return {
    code: error && typeof error.code === 'string' ? error.code : undefined,
    status: error && Number.isInteger(error.status) ? error.status : undefined,
  }
}

async function cancelIntent(publicClient, intentId, logger) {
  try {
    const { error } = await publicClient.rpc(
      'cancel_shared_auth_email_intent',
      { p_intent_id: intentId },
    )
    if (error) {
      logger.error('[steves-admin-auth-request] intent cancellation failed', errorDetails(error))
    }
  } catch (error) {
    logger.error('[steves-admin-auth-request] intent cancellation failed', errorDetails(error))
  }
}

export function createAdminAuthRequestHandler({
  env = process.env,
  createClientImpl,
  logger = console,
} = {}) {
  return async function adminAuthRequest(request, response) {
    response.setHeader('Cache-Control', 'private, no-store')
    response.setHeader('Vary', 'Origin')

    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST')
      return response.status(405).json({ ok: false, message: 'Method not allowed.' })
    }

    if (!isSameOrigin(request)) {
      return response.status(403).json({ ok: false, message: 'Request rejected.' })
    }

    const body = parseBody(request.body)
    const email = normalizeEmail(body?.email)
    if (!email) {
      return response.status(400).json({ ok: false, message: 'Enter a valid email address.' })
    }

    const url = envString(env, 'SUPABASE_URL', 'VITE_SUPABASE_URL')
    const serviceRoleKey = envString(env, 'SUPABASE_SERVICE_ROLE_KEY')
    const authKey = envString(
      env,
      'SUPABASE_PUBLISHABLE_KEY',
      'SUPABASE_ANON_KEY',
      'VITE_SUPABASE_PUBLISHABLE_KEY',
      'VITE_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
    )
    const schema = envString(env, 'SUPABASE_DB_SCHEMA', 'VITE_SUPABASE_DB_SCHEMA') || SITE_ID
    let configuredCorrectly = false
    try {
      const configuredUrl = new URL(url)
      configuredCorrectly = configuredUrl.origin === EXPECTED_SUPABASE_ORIGIN &&
        (configuredUrl.pathname === '/' || configuredUrl.pathname === '') &&
        !configuredUrl.username &&
        !configuredUrl.password &&
        !configuredUrl.search &&
        !configuredUrl.hash
    } catch {
      configuredCorrectly = false
    }

    if (
      !url ||
      !configuredCorrectly ||
      !serviceRoleKey ||
      !authKey ||
      schema !== SITE_ID
    ) {
      logger.error('[steves-admin-auth-request] invalid server configuration')
      return uniformResponse(response)
    }

    let publicClient = null
    let intentId = null

    try {
      const serviceClient = await createClientImpl(url, serviceRoleKey, {
        db: { schema },
        auth: { autoRefreshToken: false, persistSession: false },
      })

      const { data: admin, error: adminError } = await serviceClient
        .from('admin_users')
        .select('id,user_id')
        .eq('email', email)
        .maybeSingle()

      if (adminError) {
        logger.error('[steves-admin-auth-request] admin lookup failed', errorDetails(adminError))
        return uniformResponse(response)
      }

      if (!admin) return uniformResponse(response)

      const intentAction = admin.user_id ? 'login' : 'invite'
      const shouldCreateUser = !admin.user_id

      const emailHash = createHash('sha256').update(email).digest('hex')
      publicClient = serviceClient.schema('public')
      const { data, error: intentError } = await publicClient.rpc(
        'create_shared_auth_email_intent',
        {
          p_site_id: SITE_ID,
          p_email_hash: emailHash,
          p_action: intentAction,
          p_redirect_to: CANONICAL_REDIRECT,
        },
      )
      intentId = data

      if (intentError) {
        logger.error('[steves-admin-auth-request] intent creation failed', errorDetails(intentError))
        return uniformResponse(response)
      }

      if (intentId === null) return uniformResponse(response)

      if (typeof intentId !== 'string' || !UUID_PATTERN.test(intentId)) {
        logger.error('[steves-admin-auth-request] intent creation returned an invalid id')
        return uniformResponse(response)
      }

      const redirect = new URL(CANONICAL_REDIRECT)
      redirect.searchParams.set('auth_intent', intentId)

      const authClient = await createClientImpl(url, authKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
      const { error: sendError } = await authClient.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser,
          emailRedirectTo: redirect.toString(),
        },
      })

      if (sendError) {
        await cancelIntent(publicClient, intentId, logger)
        logger.error('[steves-admin-auth-request] auth email send failed', errorDetails(sendError))
      }
    } catch (error) {
      if (publicClient && intentId && UUID_PATTERN.test(intentId)) {
        await cancelIntent(publicClient, intentId, logger)
      }
      logger.error('[steves-admin-auth-request] request failed', errorDetails(error))
    }

    return uniformResponse(response)
  }
}

async function createSupabaseClient(...args) {
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(...args)
}

export default createAdminAuthRequestHandler({ createClientImpl: createSupabaseClient })
