import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Phone, Mail, Trash2 } from 'lucide-react'
import { LinkPreview } from '../components/LinkPreview'

const statusOptions = ['new', 'contacted', 'scheduled', 'won', 'lost']

export function AdminLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')

  const fetchLeads = async () => {
    setLoading(true)
    setError('')

    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error: fetchError } = await query

    if (fetchError) {
      setError('Unable to load leads.')
      setLoading(false)
      return
    }

    setLeads(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchLeads()
  }, [filter])

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-stone-900">Leads</h2>
          <p className="text-stone-600 text-pretty">
            Track inbound requests and update lead status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="lead-filter" className="text-sm text-stone-600">
            Filter
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
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading && <div className="text-stone-500">Loading leads…</div>}

      {!loading && leads.length === 0 && (
        <div className="bg-white border border-stone-200 rounded-lg p-6 text-stone-600">
          No leads yet.
        </div>
      )}

      {!loading && leads.length > 0 && (
        <div className="grid gap-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-stone-900 text-lg">
                    {lead.name}
                  </h3>
                  <p className="text-sm text-stone-500">
                    {lead.created_at
                      ? new Date(lead.created_at).toLocaleString()
                      : ''}
                  </p>
                  <div className="text-stone-600 text-pretty mt-3">
                    <LinkPreview text={lead.message} />
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[220px]">
                  <a
                    href={`tel:${lead.phone}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-accent-600"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    {lead.phone}
                  </a>
                  {lead.email && (
                    <a
                      href={`mailto:${lead.email}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-accent-600"
                    >
                      <Mail className="size-4" aria-hidden="true" />
                      {lead.email}
                    </a>
                  )}
                  <div className="text-xs text-stone-500">
                    Service: {lead.service || 'Not specified'}
                  </div>
                  <select
                    value={lead.status || 'new'}
                    onChange={(event) => updateStatus(lead.id, event.target.value)}
                    className="px-3 py-2 border border-stone-200 rounded-lg bg-white text-sm"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
