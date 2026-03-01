import { useEffect, useRef, useState } from 'react'
import { Send, CheckCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from './Button'

const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let turnstileScriptPromise

function loadTurnstileScript() {
  if (typeof window === 'undefined') {
    return Promise.resolve(null)
  }

  if (window.turnstile) {
    return Promise.resolve(window.turnstile)
  }

  if (!turnstileScriptPromise) {
    turnstileScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${TURNSTILE_SCRIPT_SRC}"]`)
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.turnstile), { once: true })
        existingScript.addEventListener('error', () => reject(new Error('Turnstile failed to load')), { once: true })
        return
      }

      const script = document.createElement('script')
      script.src = TURNSTILE_SCRIPT_SRC
      script.async = true
      script.defer = true
      script.onload = () => resolve(window.turnstile)
      script.onerror = () => reject(new Error('Turnstile failed to load'))
      document.head.appendChild(script)
    })
  }

  return turnstileScriptPromise
}

function resetTurnstileWidget(widgetIdRef, setToken) {
  if (typeof window === 'undefined') return
  if (!window.turnstile || widgetIdRef.current === null) return

  window.turnstile.reset(widgetIdRef.current)
  setToken('')
}

export function ContactForm({
  className,
  source = 'website',
  showTitle = true,
  onSuccess,
}) {
  const turnstileSiteKey = String(import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim()
  const hasTurnstileValue = Boolean(turnstileSiteKey)
  const turnstileKeyLooksValid = /^0x[0-9A-Za-z_-]+$/.test(turnstileSiteKey)
  const requiresTurnstile = hasTurnstileValue

  const [formState, setFormState] = useState('idle') // idle, submitting, success, error
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [honeypot, setHoneypot] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileReady, setTurnstileReady] = useState(!requiresTurnstile)
  const [turnstileConfigError, setTurnstileConfigError] = useState('')

  const formStartedAtRef = useRef(Date.now())
  const turnstileContainerRef = useRef(null)
  const turnstileWidgetIdRef = useRef(null)

  useEffect(() => {
    if (!requiresTurnstile) {
      setTurnstileConfigError('')
      setTurnstileReady(true)
      if (turnstileWidgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current)
        turnstileWidgetIdRef.current = null
      }
      return undefined
    }

    let cancelled = false

    if (!turnstileKeyLooksValid) {
      setTurnstileConfigError('Turnstile site key format looks invalid. Please check VITE_TURNSTILE_SITE_KEY for extra characters or spaces.')
      setTurnstileReady(false)
      return undefined
    }

    loadTurnstileScript()
      .then((turnstileApi) => {
        if (cancelled || !turnstileApi || !turnstileContainerRef.current) return

        turnstileWidgetIdRef.current = turnstileApi.render(turnstileContainerRef.current, {
          sitekey: turnstileSiteKey,
          callback: (token) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(''),
          'error-callback': () => setTurnstileToken(''),
        })

        setTurnstileConfigError('')
        setTurnstileReady(true)
      })
      .catch((error) => {
        console.error('Turnstile setup failed:', error)
        if (!cancelled) {
          setTurnstileReady(false)
          setTurnstileConfigError('Turnstile failed to initialize. Please check your VITE_TURNSTILE_SITE_KEY and try again.')
        }
      })

    return () => {
      cancelled = true

      if (window.turnstile && turnstileWidgetIdRef.current !== null) {
        window.turnstile.remove(turnstileWidgetIdRef.current)
        turnstileWidgetIdRef.current = null
      }
    }
  }, [requiresTurnstile, turnstileSiteKey])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormState('submitting')

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          website: honeypot,
          turnstileToken,
          formStartedAt: formStartedAtRef.current,
          pageUrl: window.location.href,
          source,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Lead submission failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        })

        resetTurnstileWidget(turnstileWidgetIdRef, setTurnstileToken)
        throw new Error(errorData.error || 'Request failed')
      }

      const result = await response.json()
      console.log('Lead submitted successfully:', result)
      setFormState('success')
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error submitting lead:', error)
      setFormState('error')
    }
  }

  const handleChange = (e) => {
    if (formState === 'error') {
      setFormState('idle')
    }
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const isSubmitDisabled =
    formState === 'submitting' || (requiresTurnstile && (!turnstileReady || !turnstileToken))

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {formState === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-12"
          >
            <div className="size-20 bg-accent-500/10 rounded-full flex items-center justify-center mb-6 border border-accent-500/20">
              <CheckCircle className="size-10 text-accent-500" aria-hidden="true" />
            </div>
            <h3 className="font-display font-bold text-3xl text-stone-900 mb-4 tracking-tight">
              Ready to Pour!
            </h3>
            <p className="text-stone-600 mb-8 max-w-sm text-lg leading-relaxed font-light">
              We&apos;ve received your project details. Stephen will personally review this and reach out shortly.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setFormState('idle')
                setFormData({ name: '', email: '', phone: '', service: '', message: '' })
                setHoneypot('')
                formStartedAtRef.current = Date.now()
                resetTurnstileWidget(turnstileWidgetIdRef, setTurnstileToken)
              }}
            >
              Send Another Request
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="new-password"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </div>

            {showTitle && (
              <div className="mb-8">
                <h3 className="font-display font-black text-3xl text-stone-900 mb-2 tracking-tight">
                  Request an Estimate
                </h3>
                <div className="h-1 w-12 bg-accent-500 rounded-full" />
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all outline-none text-stone-900"
                  placeholder="John Smith"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block ml-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all outline-none text-stone-900"
                  placeholder="(254) 555-0123"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block ml-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all outline-none text-stone-900"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="service" className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block ml-1">
                Project Type
              </label>
              <div className="relative">
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all outline-none text-stone-900 appearance-none"
                >
                  <option value="">Select a service...</option>
                  <option value="driveway">Driveway Install/Replacement</option>
                  <option value="patio">Custom Patio</option>
                  <option value="stamped">Stamped & Decorative</option>
                  <option value="commercial">Commercial Slabs</option>
                  <option value="repair">Concrete Repair</option>
                  <option value="other">Other Project</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block ml-1">
                Project Details
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all outline-none text-stone-900 resize-none"
                placeholder="Tell us about the size and scope of your project..."
              />
            </div>

            {requiresTurnstile && (
                <div className="space-y-2">
                  <div ref={turnstileContainerRef} />
                  {turnstileConfigError && (
                    <p className="text-xs text-red-600">{turnstileConfigError}</p>
                  )}
                  {!turnstileReady && (
                    <p className="text-xs text-stone-500">Loading bot verification...</p>
                  )}
                </div>
              )}

            {formState === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-5 py-4 font-medium"
              >
                Something went wrong. Please call us directly at (254) 230-3102.
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full py-5 rounded-xl shadow-xl shadow-accent-500/20 group"
            >
              {formState === 'submitting' ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Sending Request...</span>
                </>
              ) : (
                <>
                  <span>Send Estimate Request</span>
                  <Send className="size-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
                </>
              )}
            </Button>

            <p className="text-[10px] text-stone-500 text-center font-bold uppercase tracking-widest">
              Direct: (254) 230-3102 • Licensed & Insured
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
