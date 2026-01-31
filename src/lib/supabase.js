import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseClient

if (supabaseUrl && supabaseAnonKey) {
  // Log connection details for debugging
  console.log('Connecting to Supabase:', supabaseUrl)
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  })
} else {
  // Avoid throwing in build/dev; surface a clear error in runtime usage.
  // eslint-disable-next-line no-console
  console.warn('Missing Supabase env vars: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Supabase features will be disabled.')
  
  // Create a mock client that prevents crashes but logs errors on usage
  supabaseClient = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: 'Supabase not configured' }),
      insert: () => Promise.resolve({ data: null, error: 'Supabase not configured' }),
      update: () => Promise.resolve({ data: null, error: 'Supabase not configured' }),
      delete: () => Promise.resolve({ data: null, error: 'Supabase not configured' }),
      eq: function() { return this },
      order: function() { return this },
      single: function() { return this },
    }),
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
    storage: {
        from: () => ({
            getPublicUrl: () => ({ data: { publicUrl: '' } })
        })
    }
  }
}

export const supabase = supabaseClient
