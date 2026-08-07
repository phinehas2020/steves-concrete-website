import { createClient } from '@supabase/supabase-js'

const DEFAULT_DEPLOY_HOOK_TIMEOUT_MS = 5000

function envString(env, name) {
  const value = env?.[name]
  return typeof value === 'string' ? value.replace(/[\0\r\n]/g, '').trim() : ''
}

function normalizeDeployHook(value) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.hostname !== 'api.vercel.com') return null
    return url.toString()
  } catch {
    return null
  }
}

function bearerToken(req) {
  return String(req.headers?.authorization || '').match(/^Bearer\s+(.+)$/i)?.[1] || ''
}

export function createBlogRevalidateHandler({
  env = process.env,
  createClientImpl = createClient,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_DEPLOY_HOOK_TIMEOUT_MS,
} = {}) {
  return async function blogRevalidateHandler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const supabaseUrl = envString(env, 'SUPABASE_URL')
    const serviceRoleKey = envString(env, 'SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !serviceRoleKey) {
      res.status(500).json({ error: 'Supabase server config missing' })
      return
    }

    const token = bearerToken(req)
    if (!token) {
      res.status(401).json({ error: 'Missing auth token' })
      return
    }

    const supabase = createClientImpl(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    const email = userData?.user?.email

    if (userError || !email) {
      res.status(401).json({ error: 'Invalid auth token' })
      return
    }

    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single()

    if (adminError || !adminUser) {
      res.status(403).json({ error: 'Not authorized' })
      return
    }

    const deployHook = normalizeDeployHook(envString(env, 'VERCEL_DEPLOY_HOOK_URL'))
    if (!deployHook) {
      res.status(503).json({
        error: 'Crawler HTML rebuild hook is not configured',
        code: 'DEPLOY_HOOK_MISSING',
      })
      return
    }

    let hookResponse
    const controller = new AbortController()
    const safeTimeoutMs = Number.isFinite(Number(timeoutMs)) && Number(timeoutMs) > 0
      ? Number(timeoutMs)
      : DEFAULT_DEPLOY_HOOK_TIMEOUT_MS
    const timeout = setTimeout(() => controller.abort(), safeTimeoutMs)
    try {
      hookResponse = await fetchImpl(deployHook, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })
    } catch {
      res.status(502).json({ error: 'Unable to request crawler HTML rebuild' })
      return
    } finally {
      clearTimeout(timeout)
    }

    if (!hookResponse.ok) {
      res.status(502).json({ error: 'Crawler HTML rebuild request was rejected' })
      return
    }

    res.status(202).json({ requested: true })
  }
}

export default createBlogRevalidateHandler()
