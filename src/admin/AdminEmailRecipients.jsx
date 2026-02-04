import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Mail, CheckCircle, XCircle } from 'lucide-react'

export function AdminEmailRecipients() {
  const [recipients, setRecipients] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const fetchRecipients = async () => {
    setLoading(true)
    setError('')
    const { data, error: fetchError } = await supabase
      .from('email_recipients')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('Unable to load email recipients.')
      setLoading(false)
      return
    }

    setRecipients(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchRecipients()
  }, [])

  const addRecipient = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!email) {
      setError('Email is required.')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    const { error: insertError } = await supabase
      .from('email_recipients')
      .insert({
        email: email.trim().toLowerCase(),
        notes: notes.trim() || null,
        active: true,
      })

    if (insertError) {
      if (insertError.code === '23505') {
        setError('This email is already in the list.')
      } else {
        setError('Unable to add email recipient.')
      }
      return
    }

    setMessage('Email recipient added.')
    setEmail('')
    setNotes('')
    fetchRecipients()
  }

  const toggleActive = async (id, currentActive) => {
    const { error: updateError } = await supabase
      .from('email_recipients')
      .update({ active: !currentActive })
      .eq('id', id)

    if (updateError) {
      setError('Unable to update email recipient.')
      return
    }

    fetchRecipients()
  }

  const deleteRecipient = async (id) => {
    if (!confirm('Are you sure you want to remove this email recipient?')) {
      return
    }

    const { error: deleteError } = await supabase
      .from('email_recipients')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError('Unable to delete email recipient.')
      return
    }

    fetchRecipients()
  }

  const activeRecipients = recipients.filter((r) => r.active)
  const inactiveRecipients = recipients.filter((r) => !r.active)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-stone-900">Email Recipients</h2>
        <p className="text-stone-600 text-pretty">
          Manage email addresses that receive notifications when new leads are submitted.
        </p>
      </div>

      <form
        onSubmit={addRecipient}
        className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6 space-y-4"
      >
        <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-wide text-stone-500 mb-1">
              Email Address
            </label>
            <input
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="recipient@example.com"
              className="w-full px-3 py-2 border border-stone-200 rounded-lg"
              type="email"
              required
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-xs uppercase tracking-wide text-stone-500 mb-1">
              Notes (optional)
            </label>
            <input
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="e.g., Primary contact"
              className="w-full px-3 py-2 border border-stone-200 rounded-lg"
              type="text"
            />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
        >
          <Plus className="size-4" />
          Add Recipient
        </button>
        {message && (
          <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            {message}
          </div>
        )}
        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
      </form>

      {loading && <div className="text-stone-500">Loading recipients...</div>}

      {!loading && (
        <div className="space-y-4">
          {activeRecipients.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-stone-900">Active Recipients</h3>
                <span className="text-sm text-stone-500">
                  {activeRecipients.length} {activeRecipients.length === 1 ? 'recipient' : 'recipients'}
                </span>
              </div>
              <div className="space-y-2">
                {activeRecipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Mail className="size-4 text-stone-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-stone-900 truncate">{recipient.email}</div>
                        {recipient.notes && (
                          <div className="text-xs text-stone-500 mt-0.5">{recipient.notes}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleActive(recipient.id, recipient.active)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded border border-stone-200"
                        title="Deactivate"
                      >
                        <CheckCircle className="size-3 text-emerald-600" />
                        Active
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRecipient(recipient.id)}
                        className="inline-flex items-center justify-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {inactiveRecipients.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-stone-900">Inactive Recipients</h3>
                <span className="text-sm text-stone-500">
                  {inactiveRecipients.length} {inactiveRecipients.length === 1 ? 'recipient' : 'recipients'}
                </span>
              </div>
              <div className="space-y-2">
                {inactiveRecipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded-lg opacity-60"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Mail className="size-4 text-stone-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-stone-900 truncate">{recipient.email}</div>
                        {recipient.notes && (
                          <div className="text-xs text-stone-500 mt-0.5">{recipient.notes}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleActive(recipient.id, recipient.active)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded border border-stone-200"
                        title="Activate"
                      >
                        <XCircle className="size-3 text-stone-400" />
                        Inactive
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRecipient(recipient.id)}
                        className="inline-flex items-center justify-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recipients.length === 0 && (
            <div className="bg-white border border-stone-200 rounded-xl p-6 text-center text-stone-600">
              No email recipients configured. Add one above to start receiving lead notifications.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
