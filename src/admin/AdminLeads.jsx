import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Reply,
  Search,
  Send,
  Trash2,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { LinkPreview } from '../components/LinkPreview'

const statusOptions = ['new', 'contacted', 'scheduled', 'won', 'lost']
const statusStyles = {
  new: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  contacted: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
  scheduled: 'bg-purple-100 text-purple-700 ring-1 ring-purple-200',
  won: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
  lost: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
}

const serviceLabels = {
  driveway: 'Driveway Install/Replacement',
  patio: 'Custom Patio',
  stamped: 'Stamped & Decorative',
  commercial: 'Commercial Slabs',
  repair: 'Concrete Repair',
  other: 'Other Project',
}

const formatLabel = (value) =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const getServiceLabel = (service) => {
  if (!service) return 'Not specified'
  return serviceLabels[service] || formatLabel(service)
}

const getDefaultSubject = (lead) => {
  const serviceLabel = getServiceLabel(lead.service)
  if (serviceLabel === 'Not specified') {
    return 'Re: Concrete estimate request'
  }
  return `Re: ${serviceLabel} estimate request`
}

const getDefaultMessage = (lead) => {
  const firstName = lead.name ? lead.name.split(' ')[0] : 'there'
  const serviceLabel = getServiceLabel(lead.service)
  const serviceLine =
    serviceLabel === 'Not specified'
      ? 'about your project'
      : `about your ${serviceLabel.toLowerCase()} project`

  return `Hi ${firstName},\n\nThanks for reaching out to Concrete Works ${serviceLine}. I'd like to ask a couple quick questions and schedule a site visit.\n\nWhat address is the project at, and what timeline are you hoping for?\n\nThanks,\nConcrete Works LLC`
}

export function AdminLeads({ accessToken, currentUserEmail }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [expandedLeadId, setExpandedLeadId] = useState(null)
  const [replyDrafts, setReplyDrafts] = useState({})
  const [replyStatus, setReplyStatus] = useState({})

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    []
  )

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError('')

    let queryBuilder = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      queryBuilder = queryBuilder.eq('status', filter)
    }

    const { data, error: fetchError } = await queryBuilder

    if (fetchError) {
      setError('Unable to load leads.')
      setLoading(false)
      return
    }

    setLeads(data || [])
    setLoading(false)
  }, [filter])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const leadCounts = useMemo(() => {
    const counts = {
      total: leads.length,
      new: 0,
      contacted: 0,
      scheduled: 0,
      won: 0,
      lost: 0,
    }

    leads.forEach((lead) => {
      const status = lead.status || 'new'
      if (counts[status] !== undefined) {
        counts[status] += 1
      }
    })

    return counts
  }, [leads])

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return leads

    return leads.filter((lead) => {
      const values = [
        lead.name,
        lead.email,
        lead.phone,
        lead.service,
        lead.message,
        lead.source,
      ]
      return values.some(
        (value) =>
          value && String(value).toLowerCase().includes(normalizedQuery)
      )
    })
  }, [leads, query])

  const updateStatus = async (id, status) => {
    const { error: updateError } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)

    if (updateError) {
      setError('Unable to update lead status.')
      return
    }

    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    )
  }

  const deleteLead = async (id) => {
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      return
    }

    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError('Unable to delete lead.')
      return
    }

    setLeads((prev) => prev.filter((lead) => lead.id !== id))
  }

  const ensureReplyDraft = (lead) => {
    setReplyDrafts((prev) =>
      prev[lead.id]
        ? prev
        : {
            ...prev,
            [lead.id]: {
              subject: getDefaultSubject(lead),
              message: getDefaultMessage(lead),
            },
          }
    )
  }

  const updateReplyDraft = (leadId, field, value) => {
    setReplyDrafts((prev) => ({
      ...prev,
      [leadId]: {
        ...prev[leadId],
        [field]: value,
      },
    }))
  }

  const resetReplyDraft = (lead) => {
    setReplyDrafts((prev) => ({
      ...prev,
      [lead.id]: {
        subject: getDefaultSubject(lead),
        message: getDefaultMessage(lead),
      },
    }))
  }

  const toggleReply = (lead) => {
    const shouldOpen = expandedLeadId !== lead.id

    if (shouldOpen) {
      ensureReplyDraft(lead)
      setReplyStatus((prev) =>
        prev[lead.id]
          ? prev
          : {
              ...prev,
              [lead.id]: { state: 'idle', error: '' },
            }
      )
    }

    setExpandedLeadId(shouldOpen ? lead.id : null)
  }

  const sendReply = async (lead) => {
    const draft = replyDrafts[lead.id]

    if (!lead.email) {
      setReplyStatus((prev) => ({
        ...prev,
        [lead.id]: { state: 'error', error: 'Lead has no email address.' },
      }))
      return
    }

    if (!draft?.subject || !draft?.message) {
      setReplyStatus((prev) => ({
        ...prev,
        [lead.id]: { state: 'error', error: 'Subject and message are required.' },
      }))
      return
    }

    if (!accessToken) {
      setReplyStatus((prev) => ({
        ...prev,
        [lead.id]: { state: 'error', error: 'Missing admin session.' },
      }))
      return
    }

    setReplyStatus((prev) => ({
      ...prev,
      [lead.id]: { state: 'sending', error: '' },
    }))

    try {
      const response = await fetch('/api/lead-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          leadId: lead.id,
          subject: draft.subject,
          message: draft.message,
        }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unable to send reply.' }))
        throw new Error(errorData.error || 'Unable to send reply.')
      }

      setReplyStatus((prev) => ({
        ...prev,
        [lead.id]: { state: 'success', error: '' },
      }))

      if (lead.status === 'new') {
        setLeads((prev) =>
          prev.map((item) =>
            item.id === lead.id ? { ...item, status: 'contacted' } : item
          )
        )
      }
    } catch (replyError) {
      setReplyStatus((prev) => ({
        ...prev,
        [lead.id]: {
          state: 'error',
          error: replyError.message || 'Unable to send reply.',
        },
      }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-stone-900">Leads</h2>
          <p className="text-stone-600 text-pretty">
            Track inbound requests, reply directly, and keep statuses updated.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-stone-500">Total</p>
            <p className="text-2xl font-display font-bold text-stone-900 tabular-nums">
              {leadCounts.total}
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-stone-500">New</p>
            <p className="text-2xl font-display font-bold text-stone-900 tabular-nums">
              {leadCounts.new}
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-stone-500">Contacted</p>
            <p className="text-2xl font-display font-bold text-stone-900 tabular-nums">
              {leadCounts.contacted}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-lg">
          <Search className="size-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, phone, service, message..."
            className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="lead-filter" className="text-sm text-stone-600">
            Status
          </label>
          <select
            id="lead-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="px-3 py-2 border border-stone-200 rounded-lg bg-white text-sm"
          >
            <option value="all">All</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatLabel(status)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={fetchLeads}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-60"
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading && <div className="text-stone-500">Loading leads…</div>}

      {!loading && filteredLeads.length === 0 && (
        <div className="bg-white border border-stone-200 rounded-lg p-6 text-stone-600">
          No leads match this view.
        </div>
      )}

      {!loading && filteredLeads.length > 0 && (
        <div className="grid gap-4">
          {filteredLeads.map((lead) => {
            const serviceLabel = getServiceLabel(lead.service)
            const replyMeta = replyStatus[lead.id] || { state: 'idle', error: '' }
            const draft = replyDrafts[lead.id]
            const statusLabel = formatLabel(lead.status || 'new')
            const statusClass = statusStyles[lead.status || 'new'] || statusStyles.new
            const isExpanded = expandedLeadId === lead.id

            return (
              <div
                key={lead.id}
                className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-stone-900 text-lg">
                          {lead.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                      <p className="text-sm text-stone-500">
                        {lead.created_at
                          ? dateFormatter.format(new Date(lead.created_at))
                          : ''}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-stone-500">
                        Service: {serviceLabel}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={lead.status || 'new'}
                        onChange={(event) => updateStatus(lead.id, event.target.value)}
                        className="px-3 py-2 border border-stone-200 rounded-lg bg-white text-sm"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {formatLabel(status)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="text-stone-600 text-pretty leading-relaxed">
                    <LinkPreview text={lead.message} />
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 text-sm text-stone-600">
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-2 font-medium text-stone-700 hover:text-accent-600"
                      >
                        <Phone className="size-4" aria-hidden="true" />
                        {lead.phone}
                      </a>
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="inline-flex items-center gap-2 font-medium text-stone-700 hover:text-accent-600"
                        >
                          <Mail className="size-4" aria-hidden="true" />
                          {lead.email}
                        </a>
                      )}
                      {!lead.email && (
                        <span className="inline-flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                          <AlertTriangle className="size-3" aria-hidden="true" />
                          No email provided
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleReply(lead)}
                        className="inline-flex items-center gap-2 px-3 py-2 border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
                      >
                        <Reply className="size-4" aria-hidden="true" />
                        {isExpanded ? 'Close Reply' : 'Reply'}
                      </button>
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                        title="Delete lead"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-5 space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-stone-900">
                            Reply via Resend
                          </h4>
                          <p className="text-sm text-stone-500">
                            Replies will go to {currentUserEmail || 'your admin email'}.
                          </p>
                        </div>
                        {replyMeta.state === 'success' && (
                          <div className="inline-flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg">
                            <CheckCircle className="size-4" aria-hidden="true" />
                            Reply sent
                          </div>
                        )}
                      </div>

                      <div className="grid gap-3">
                        <div>
                          <label className="text-xs uppercase tracking-wide text-stone-500">
                            Subject
                          </label>
                          <input
                            type="text"
                            value={draft?.subject || ''}
                            onChange={(event) =>
                              updateReplyDraft(lead.id, 'subject', event.target.value)
                            }
                            className="mt-1 w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                            placeholder="Subject line"
                          />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-wide text-stone-500">
                            Message
                          </label>
                          <textarea
                            rows={6}
                            value={draft?.message || ''}
                            onChange={(event) =>
                              updateReplyDraft(lead.id, 'message', event.target.value)
                            }
                            className="mt-1 w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none"
                          />
                        </div>
                      </div>

                      {replyMeta.state === 'error' && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                          {replyMeta.error}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => resetReplyDraft(lead)}
                          className="text-sm font-medium text-stone-600 hover:text-stone-900"
                        >
                          Reset to template
                        </button>
                        <button
                          type="button"
                          onClick={() => sendReply(lead)}
                          disabled={replyMeta.state === 'sending' || !lead.email}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {replyMeta.state === 'sending' ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="size-4" aria-hidden="true" />
                              Send Reply
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
