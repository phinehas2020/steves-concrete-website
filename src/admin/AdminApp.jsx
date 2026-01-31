import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { AdminLogin } from './AdminLogin'
import { AdminLeads } from './AdminLeads'
import { AdminStats } from './AdminStats'
import { AdminBlog } from './AdminBlog'
import { AdminUsers } from './AdminUsers'
import { AdminJobs } from './AdminJobs'
import { useSeo, SITE_URL } from '../lib/seo'

const navItems = [
  { label: 'Stats', path: '' },
  { label: 'Leads', path: 'leads' },
  { label: 'Jobs', path: 'jobs' },
  { label: 'Blog', path: 'blog' },
  { label: 'Admins', path: 'admins' },
]

export function AdminApp() {
  useSeo({
    title: 'Admin Dashboard | Concrete Works LLC',
    description: 'Concrete Works LLC admin dashboard.',
    robots: 'noindex, nofollow',
    canonical: `${SITE_URL}/admin`,
    url: `${SITE_URL}/admin`,
  })

  const [session, setSession] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [adminProfile, setAdminProfile] = useState(null)
  const [profileChecked, setProfileChecked] = useState(false)
  const [accessError, setAccessError] = useState('')

  useEffect(() => {
    let isMounted = true

    // Check for existing session
    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return
      console.log('Session check:', { session: data.session, error })
      setSession(data.session)
      setAuthChecked(true)
    })

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.email)
      if (!isMounted) return
      setSession(newSession)
      setAuthChecked(true)
    })

    return () => {
      isMounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const fetchAdminProfile = async () => {
      if (!session?.user?.email) return
      setProfileChecked(false)
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .single()

      if (!isMounted) return

      if (error || !data) {
        setAccessError('Access denied. You are not an admin.')
        setAdminProfile(null)
        setProfileChecked(true)
        return
      }

      setAccessError('')
      setAdminProfile(data)
      setProfileChecked(true)
    }

    fetchAdminProfile()

    return () => {
      isMounted = false
    }
  }, [session])

  if (!authChecked) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-stone-50 text-stone-500">
        Checking access…
      </div>
    )
  }

  if (!session) {
    return <AdminLogin />
  }

  if (!profileChecked) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-stone-50 text-stone-500">
        Checking admin access…
      </div>
    )
  }

  if (accessError) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-stone-50 px-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 max-w-md text-center">
          <h1 className="font-display font-bold text-2xl text-stone-900 mb-2">
            Access Denied
          </h1>
          <p className="text-stone-600 text-pretty mb-6">{accessError}</p>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-500">Admin</p>
              <h1 className="font-display font-bold text-2xl text-stone-900">
                Concrete Works Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-600">{session.user.email}</span>
              <button
                type="button"
                onClick={() => supabase.auth.signOut()}
                className="text-sm font-semibold text-accent-600 hover:text-accent-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-main py-8">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr] items-stretch">
          <nav className="bg-white border border-stone-200 rounded-xl p-4 self-stretch h-full">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={`/admin/${item.path}`}
                    end={item.path === ''}
                    className={({ isActive }) =>
                      [
                        'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-accent-500 text-white'
                          : 'text-stone-600 hover:bg-stone-100',
                      ].join(' ')
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-6">
            <Routes>
              <Route path="/" element={<AdminStats />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="blog" element={<AdminBlog currentUserEmail={session.user.email} />} />
              <Route
                path="admins"
                element={<AdminUsers canManage={adminProfile?.role === 'super_admin'} />}
              />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  )
}
