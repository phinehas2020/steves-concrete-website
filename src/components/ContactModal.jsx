import { useEffect } from 'react'
import { X } from 'lucide-react'
import { ContactForm } from './ContactForm'

export function ContactModal({ open, onClose, source = 'website' }) {
  useEffect(() => {
    if (!open) return
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-stone-900/60"
        role="presentation"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-stone-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-start justify-between px-6 pt-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-500 mb-2">
                Free Estimate
              </p>
              <h2 className="font-display font-bold text-2xl text-stone-900 text-balance">
                Tell us about your project
              </h2>
              <p className="text-stone-600 text-pretty mt-2">
                We respond within 24 hours with next steps.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="size-10 inline-flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500"
              aria-label="Close form"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="px-6 pb-6 pt-4">
            <ContactForm source={source} showTitle={false} />
          </div>
        </div>
      </div>
    </div>
  )
}
