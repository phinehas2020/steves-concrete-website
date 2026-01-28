import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function AdminStats() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchStats = async () => {
      const now = new Date()
      const monthAgo = new Date(now)
      monthAgo.setDate(now.getDate() - 30)

      const [totalLeads, newLeads, recentLeads, publishedPosts] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', monthAgo.toISOString()),
        supabase
          .from('blog_posts')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'published'),
      ])

      if (!isMounted) return

      if (totalLeads.error || newLeads.error || recentLeads.error || publishedPosts.error) {
        setError('Unable to load stats.')
        return
      }

      setStats({
        totalLeads: totalLeads.count || 0,
        newLeads: newLeads.count || 0,
        recentLeads: recentLeads.count || 0,
        publishedPosts: publishedPosts.count || 0,
      })
    }

    fetchStats()

    return () => {
      isMounted = false
    }
  }, [])

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg px-4 py-3">
        {error}
      </div>
    )
  }

  if (!stats) {
    return <div className="text-stone-500">Loading stats…</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-stone-900">Stats</h2>
        <p className="text-stone-600 text-pretty">
          Quick snapshot of leads and content activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <p className="text-sm text-stone-500">Total Leads</p>
          <p className="text-3xl font-display font-bold text-stone-900 tabular-nums">
            {stats.totalLeads}
          </p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <p className="text-sm text-stone-500">New Leads</p>
          <p className="text-3xl font-display font-bold text-stone-900 tabular-nums">
            {stats.newLeads}
          </p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <p className="text-sm text-stone-500">Last 30 Days</p>
          <p className="text-3xl font-display font-bold text-stone-900 tabular-nums">
            {stats.recentLeads}
          </p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <p className="text-sm text-stone-500">Published Posts</p>
          <p className="text-3xl font-display font-bold text-stone-900 tabular-nums">
            {stats.publishedPosts}
          </p>
        </div>
      </div>
    </div>
  )
}
