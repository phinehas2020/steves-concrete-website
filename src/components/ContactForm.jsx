import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { cn } from '../lib/utils'

export function ContactForm({
  className,
  source = 'website',
  showTitle = true,
  onSuccess,
}) {
  const [formState, setFormState] = useState('idle') // idle, submitting, success, error
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormState('submitting')

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pageUrl: window.location.href,
          source,
        }),
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      setFormState('success')
      if (onSuccess) onSuccess()
    } catch {
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

  return (
    <div className={className}>
      {formState === 'success' ? (
        <div className="flex flex-col items-center justify-center text-center h-full min-h-[320px]">
          <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="size-8 text-green-600" aria-hidden="true" />
          </div>
          <h3 className="font-display font-bold text-2xl text-stone-900 mb-2">
            Message Sent!
          </h3>
          <p className="text-stone-600 mb-6">
            Thanks for reaching out. We&apos;ll get back to you within 24 hours.
          </p>
          <button
            onClick={() => {
              setFormState('idle')
              setFormData({ name: '', email: '', phone: '', service: '', message: '' })
            }}
            className="text-accent-600 font-semibold hover:text-accent-700"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {showTitle && (
            <h3 className="font-display font-bold text-2xl text-stone-900 mb-6">
              Request a Free Estimate
            </h3>
          )}

          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1.5">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-shadow"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-shadow"
                placeholder="(254) 555-0123"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-shadow"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-medium text-stone-700 mb-1.5">
              Service Interested In
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-shadow appearance-none"
            >
              <option value="">Select a service...</option>
              <option value="driveway">Driveway</option>
              <option value="patio">Patio</option>
              <option value="stamped">Stamped Concrete</option>
              <option value="decorative">Decorative Concrete</option>
              <option value="commercial">Commercial Project</option>
              <option value="repair">Concrete Repair</option>
              <option value="foundation">Foundation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1.5">
              Project Details *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-shadow resize-none"
              placeholder="Tell us about your project..."
            />
          </div>

          {formState === 'error' && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              Something went wrong. Please call us at (254) 230-3102 or try again.
            </div>
          )}

          <button
            type="submit"
            disabled={formState === 'submitting'}
            className={cn(
              'w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg transition-colors duration-150 min-h-[52px]',
              formState === 'submitting'
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-accent-600'
            )}
          >
            {formState === 'submitting' ? (
              'Sending...'
            ) : (
              <>
                Send Message
                <Send className="size-5" aria-hidden="true" />
              </>
            )}
          </button>

          <p className="text-xs text-stone-500 text-center">
            We respect your privacy and will never share your information.
          </p>
        </form>
      )}
    </div>
  )
}
