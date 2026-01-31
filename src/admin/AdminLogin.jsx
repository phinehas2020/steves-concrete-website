import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [usePassword, setUsePassword] = useState(false)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    if (usePassword && password) {
      // Try to sign in with password first
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      // If user doesn't exist, try to sign up
      if (error && error.message?.includes('Invalid login credentials')) {
        // Try signup if login fails
        const signupResult = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        })
        
        if (signupResult.error) {
          setStatus('error')
          setMessage(signupResult.error.message || 'Unable to create account.')
          return
        }
        
        // After signup, try login
        const loginResult = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        data = loginResult.data
        error = loginResult.error
      }
      
      console.log('Auth response:', { data, error })

      if (error) {
        setStatus('error')
        console.error('Login error:', error)
        setMessage(error.message || 'Invalid email or password.')
        return
      }

      // Success - redirect handled by AdminApp
      window.location.href = '/admin'
      return
    }

    // Magic link login (original)
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    })
    
    console.log('Auth response:', { data, error })

    if (error) {
      setStatus('error')
      console.error('Login error:', error)
      console.error('Full error details:', JSON.stringify(error, null, 2))
      const errorMsg = error.message || 'Unable to send login link. Please try again.'
      setMessage(`${errorMsg} (Error code: ${error.status || 'unknown'})`)
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="usePassword"
              checked={usePassword}
              onChange={(e) => setUsePassword(e.target.checked)}
              className="w-4 h-4 text-accent-500 border-stone-300 rounded focus:ring-accent-500"
            />
            <label htmlFor="usePassword" className="text-sm text-stone-600">
              Use password login (temporary)
            </label>
          </div>

          {usePassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required={usePassword}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-shadow"
                placeholder="Enter password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full inline-flex items-center justify-center px-4 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150 min-h-[48px]"
          >
            {status === 'loading' ? (usePassword ? 'Logging in…' : 'Sending…') : (usePassword ? 'Log In' : 'Send Login Link')}
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
