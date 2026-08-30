import { useLayoutEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSeo, SITE_URL } from '../lib/seo'
import { validateAdminConfirmationUrl } from '../lib/adminAuthConfirmation'

export function AdminAuthConfirm() {
  const location = useLocation()
  useSeo({
    title: 'Confirm Admin Sign-In | SLA Concrete Works LLC',
    description: 'Confirm a requested SLA Concrete Works admin sign-in.',
    robots: 'noindex, nofollow, noarchive',
    canonical: `${SITE_URL}/admin/confirm`,
    url: `${SITE_URL}/admin/confirm`,
  })

  const [confirmationUrl] = useState(() => {
    const search = new URLSearchParams(location.search)
    const values = search.getAll('confirmation_url')
    if (values.length !== 1) return null
    return validateAdminConfirmationUrl(values[0])
  })

  useLayoutEffect(() => {
    if (!location.search) return
    window.history.replaceState(window.history.state, '', '/admin/confirm')
  }, [location.search])

  return (
    <main className="min-h-dvh flex items-center justify-center bg-stone-50 px-4">
      <section className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Admin portal</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-stone-900">
          Confirm sign-in
        </h1>

        {confirmationUrl ? (
          <>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Continue only if you requested this SLA Concrete Works admin sign-in. The secure
              one-time link has not been opened yet.
            </p>
            <a
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-accent-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-accent-600"
              href={confirmationUrl}
              referrerPolicy="no-referrer"
              rel="nofollow noreferrer"
            >
              Continue to secure sign-in
            </a>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              This sign-in link is invalid or incomplete. Return to the admin login and request a
              new one.
            </p>
            <Link
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-stone-300 px-4 py-3 font-semibold text-stone-800 transition-colors hover:bg-stone-100"
              to="/admin"
            >
              Return to admin login
            </Link>
          </>
        )}
      </section>
    </main>
  )
}
