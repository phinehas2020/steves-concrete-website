const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
const schema = process.env.VITE_SUPABASE_DB_SCHEMA || process.env.SUPABASE_DB_SCHEMA

if (!url && !anonKey && !schema) {
  console.log('[supabase-build-target] skipped: no Supabase environment configured')
  process.exit(0)
}

if (!url || !anonKey || !schema) {
  throw new Error('[supabase-build-target] incomplete Supabase environment configuration')
}

const host = new URL(url).hostname
console.log(`[supabase-build-target] host=${host} schema=${schema}`)

const response = await fetch(`${url}/rest/v1/blog_posts?select=id&limit=1`, {
  method: 'HEAD',
  headers: {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    'Accept-Profile': schema,
  },
})

if (!response.ok) {
  throw new Error(`[supabase-build-target] ${host}/${schema} is unreachable (HTTP_${response.status})`)
}

console.log('[supabase-build-target] verified')
