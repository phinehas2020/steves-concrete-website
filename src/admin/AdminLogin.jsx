import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    })

    if (error) {
      setStatus('error')
      setMessage('Unable to send login link. Please try again.')
      return
    }

    setStatus('sent')
    setMessage('Check your inbox for a secure login link.')
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        <h1 className="font-display font-bold text-2xl text-stone-900 mb-2 text-balance">
          Admin Login
        </h1>
        <p className="text-stone-600 text-pretty mb-6">
          Enter your email and we’ll send a secure login link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-shadow"
              placeholder="you@company.com"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full inline-flex items-center justify-center px-4 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150 min-h-[48px]"
          >
            {status === 'loading' ? 'Sending…' : 'Send Login Link'}
          </button>

          {message && (
            <div
              className={`text-sm rounded-lg px-3 py-2 ${
                status === 'error'
                  ? 'bg-red-50 text-red-600 border border-red-100'
                  : 'bg-stone-50 text-stone-600 border border-stone-200'
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
