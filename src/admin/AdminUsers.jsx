import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function AdminUsers({ canManage }) {
  const [admins, setAdmins] = useState([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('admin')
  const [message, setMessage] = useState('')

  const fetchAdmins = async () => {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setAdmins(data || [])
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const addAdmin = async (event) => {
    event.preventDefault()
    setMessage('')

    if (!email) {
      setMessage('Email is required.')
      return
    }

    const { error } = await supabase.from('admin_users').insert({
      email: email.trim().toLowerCase(),
      role,
    })

    if (error) {
      setMessage('Unable to add admin.')
      return
    }

    setMessage('Admin added.')
    setEmail('')
    setRole('admin')
    fetchAdmins()
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display font-bold text-2xl text-stone-900">Admins</h2>
        <p className="text-stone-600 text-pretty">
          Manage admin access to the dashboard.
        </p>
      </div>

      {!canManage && (
        <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-stone-600">
          You have view-only access. Only super admins can add admins.
        </div>
      )}

      {canManage && (
        <form onSubmit={addAdmin} className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6 space-y-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="newadmin@company.com"
              className="px-3 py-2 border border-stone-200 rounded-lg"
              type="email"
              required
            />
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="px-3 py-2 border border-stone-200 rounded-lg bg-white"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
          >
            Add Admin
          </button>
          {message && (
            <div className="text-sm text-stone-600 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
              {message}
            </div>
          )}
        </form>
      )}

      <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold text-stone-900 mb-3">Current Admins</h3>
        <div className="space-y-2 text-sm text-stone-600">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between">
              <span>{admin.email}</span>
              <span className="text-xs uppercase tracking-wide text-stone-500">
                {admin.role}
              </span>
            </div>
          ))}
          {admins.length === 0 && <div>No admins found.</div>}
        </div>
      </div>
    </div>
  )
}
