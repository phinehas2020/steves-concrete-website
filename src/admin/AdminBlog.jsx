import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { isSourceManagedBlogSlug } from '../data/staticBlogPosts'
import { BlogPhotoStudio } from './BlogPhotoStudio'

const emptyPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  status: 'draft',
  cover_image_url: '',
  seo_status: 'needs_facts',
  author_name: '',
  reviewed_by: '',
  reviewed_at: null,
  source_notes: '',
  source_summary: '',
  canonical_slug: '',
  project_series_id: '',
  series_phase: '',
  unique_facts: '',
  first_hand_observation: '',
  scope_boundary: '',
  local_decision: '',
  exact_project_photos: false,
  photo_captions_reviewed: false,
  claims_verified: false,
  client_permission_checked: false,
}

const statusOptions = ['draft', 'published']
const seoStatusOptions = [
  { value: 'needs_facts', label: 'Needs first-hand facts' },
  { value: 'review', label: 'Ready for review' },
  { value: 'approved', label: 'SEO approved' },
  { value: 'noindex', label: 'Public archive (noindex)' },
]
function factsFromTextarea(value) {
  return String(value || '')
    .split('\n')
    .map((fact) => fact.replace(/^[-*\d.)\s]+/, '').trim())
    .filter(Boolean)
}

function authenticityFields(post) {
  const data = post?.authenticity_data || {}
  return {
    unique_facts: Array.isArray(data.unique_facts) ? data.unique_facts.join('\n') : '',
    first_hand_observation: data.first_hand_observation || '',
    scope_boundary: data.scope_boundary || '',
    local_decision: data.local_decision || '',
    exact_project_photos: Boolean(data.exact_project_photos),
    photo_captions_reviewed: Boolean(data.photo_captions_reviewed),
    claims_verified: Boolean(data.claims_verified),
    client_permission_checked: Boolean(data.client_permission_checked),
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

async function requestCrawlerHtmlRebuild() {
  const { data, error } = await supabase.auth.getSession()
  const token = data?.session?.access_token

  if (error || !token) {
    return { ok: false, message: 'Sign in again before requesting the crawler HTML rebuild.' }
  }

  try {
    const response = await fetch('/api/blog-revalidate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason: 'blog-editorial-state-changed' }),
    })
    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        ok: false,
        message: result.error || 'Crawler HTML rebuild could not be requested.',
      }
    }

    return { ok: true, message: 'Crawler HTML rebuild requested.' }
  } catch {
    return { ok: false, message: 'Crawler HTML rebuild could not be requested.' }
  }
}

export function AdminBlog({ currentUserEmail, accessToken }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState(emptyPost)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState('draft')
  const [message, setMessage] = useState('')

  const isEditing = useMemo(() => Boolean(editingId), [editingId])

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setPosts(data || [])
      setLoading(false)
      return data || []
    }
    setLoading(false)
    return []
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts()
  }, [])

  const startNew = () => {
    setEditingId(null)
    setFormData(emptyPost)
    setStatus('draft')
    setMessage('')
  }

  const startEdit = (post) => {
    setEditingId(post.id)
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      status: post.status || 'draft',
      cover_image_url: post.cover_image_url || '',
      published_at: post.published_at || null,
      seo_status: post.seo_status || 'needs_facts',
      author_name: post.author_name || '',
      reviewed_by: post.reviewed_by || '',
      reviewed_at: post.reviewed_at || null,
      source_notes: post.source_notes || '',
      source_summary: post.source_summary || '',
      canonical_slug: post.canonical_slug || '',
      project_series_id: post.project_series_id || '',
      series_phase: post.series_phase ? String(post.series_phase) : '',
      ...authenticityFields(post),
    })
    setStatus(post.status || 'draft')
    setMessage('')
  }

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && !prev.slug) {
        next.slug = slugify(value)
      }
      return next
    })
  }

  const savePost = async (event) => {
    event.preventDefault()
    setMessage('')

    if (!formData.title || !formData.slug) {
      setMessage('Title and slug are required.')
      return
    }

    const normalizedSlug = formData.slug.trim().toLowerCase()
    if (isSourceManagedBlogSlug(normalizedSlug)) {
      setMessage(
        'That slug belongs to a source-managed article. Update it in the repository so its content and crawler HTML ship together.',
      )
      return
    }

    const uniqueFacts = factsFromTextarea(formData.unique_facts)
    if (formData.seo_status === 'approved') {
      const missingApprovalItems = [
        uniqueFacts.length < 3 && 'three unique project facts',
        !formData.first_hand_observation.trim() && "Stephen's first-hand observation",
        !formData.scope_boundary.trim() && 'SLA / other-trade scope boundary',
        !formData.local_decision.trim() && 'one local field decision',
        !formData.source_notes.trim() && 'internal source notes',
        !formData.source_summary.trim() && 'public source summary',
        !formData.author_name.trim() && 'author name',
        !formData.reviewed_by.trim() && 'reviewer name or email',
        !formData.exact_project_photos && 'exact-project photo confirmation',
        !formData.photo_captions_reviewed && 'useful photo-caption review',
        !formData.claims_verified && 'claim and number verification',
        !formData.client_permission_checked && 'client-name/photo permission check',
      ].filter(Boolean)

      if (missingApprovalItems.length > 0) {
        setMessage(`SEO approval still needs: ${missingApprovalItems.join(', ')}.`)
        return
      }
    }

    const reviewedAt =
      formData.seo_status === 'approved'
        ? formData.reviewed_at || new Date().toISOString()
        : null

    const payload = {
      title: formData.title.trim(),
      slug: normalizedSlug,
      excerpt: formData.excerpt.trim() || null,
      content: formData.content.trim(),
      status,
      cover_image_url: formData.cover_image_url.trim() || null,
      author_email: currentUserEmail || null,
      author_name: formData.author_name.trim() || null,
      seo_status: formData.seo_status,
      reviewed_by: formData.reviewed_by.trim() || null,
      reviewed_at: reviewedAt,
      source_notes: formData.source_notes.trim() || null,
      source_summary: formData.source_summary.trim() || null,
      canonical_slug: formData.canonical_slug.trim() || null,
      project_series_id: formData.project_series_id.trim() || null,
      series_phase: formData.series_phase ? Number(formData.series_phase) : null,
      authenticity_data: {
        unique_facts: uniqueFacts,
        first_hand_observation: formData.first_hand_observation.trim(),
        scope_boundary: formData.scope_boundary.trim(),
        local_decision: formData.local_decision.trim(),
        exact_project_photos: formData.exact_project_photos,
        photo_captions_reviewed: formData.photo_captions_reviewed,
        claims_verified: formData.claims_verified,
        client_permission_checked: formData.client_permission_checked,
      },
      published_at:
        status === 'published'
          ? formData.published_at || new Date().toISOString()
          : null,
      updated_at: new Date().toISOString(),
    }

    const { error } = editingId
      ? await supabase.from('blog_posts').update(payload).eq('id', editingId)
      : await supabase.from('blog_posts').insert(payload)

    if (error) {
      setMessage('Unable to save post.')
      return
    }

    const rebuild = await requestCrawlerHtmlRebuild()
    const savedMessage = `${isEditing ? 'Post updated.' : 'Post created.'} ${rebuild.message}`
    startNew()
    setMessage(savedMessage)
    fetchPosts()
  }

  const deletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    const { error } = await supabase.from('blog_posts').delete().eq('id', postId)

    if (error) {
      setMessage('Unable to delete post.')
      return
    }

    const rebuild = await requestCrawlerHtmlRebuild()
    if (editingId === postId) {
      startNew()
    }
    setMessage(`Post deleted. ${rebuild.message}`)
    fetchPosts()
  }

  const handlePostCreatedFromPhotos = async (newPost) => {
    const refreshed = await fetchPosts()
    const matched = refreshed.find(
      (post) => post.id === newPost?.id || post.slug === newPost?.slug
    )
    if (matched) {
      startEdit(matched)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-stone-900">Blog</h2>
        <p className="text-stone-600 text-pretty">
          Draft, publish, and manage blog posts.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-900">Posts</h3>
            <button
              type="button"
              onClick={startNew}
              className="text-sm font-semibold text-accent-600 hover:text-accent-700"
            >
              New Post
            </button>
          </div>

          {loading && <div className="text-stone-500">Loading posts…</div>}

          {!loading && posts.length === 0 && (
            <div className="text-stone-500">No posts yet.</div>
          )}

          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-2 border border-stone-200 rounded-lg p-3 hover:border-stone-300 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => startEdit(post)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-stone-900">{post.title}</p>
                    <span className="text-xs uppercase tracking-wide text-stone-500">
                      {post.status} · {post.seo_status || 'needs facts'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">{post.slug}</p>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    deletePost(post.id)
                  }}
                  className="text-red-600 hover:text-red-700 text-sm font-semibold px-2 py-1"
                  title="Delete post"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6">
          <h3 className="font-semibold text-stone-900 mb-4">
            {isEditing ? 'Edit Post' : 'New Post'}
          </h3>

          <form onSubmit={savePost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Title
              </label>
              <input
                value={formData.title}
                onChange={(event) => handleChange('title', event.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                placeholder="Stamped concrete maintenance tips"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Slug
              </label>
              <input
                value={formData.slug}
                onChange={(event) => handleChange('slug', event.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                placeholder="stamped-concrete-maintenance"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Search status
                </label>
                <select
                  value={formData.seo_status}
                  onChange={(event) => handleChange('seo_status', event.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                >
                  {seoStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-stone-500">
                  Only published + SEO approved posts enter the sitemap. Other published posts remain
                  available by direct link with noindex.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Cover Image URL
                </label>
                <input
                  value={formData.cover_image_url}
                  onChange={(event) => handleChange('cover_image_url', event.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  placeholder="https://..."
                />
              </div>
            </div>

            <fieldset className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
              <legend className="px-2 text-sm font-semibold text-stone-900">
                First-hand authenticity review
              </legend>
              <p className="text-sm text-stone-600">
                AI can organize this evidence, but it cannot create it. Every item is required before
                SEO approval.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Author shown publicly
                  </label>
                  <input
                    value={formData.author_name}
                    onChange={(event) => handleChange('author_name', event.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                    placeholder="Stephen Alexander"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Reviewed by
                  </label>
                  <input
                    value={formData.reviewed_by}
                    onChange={(event) => handleChange('reviewed_by', event.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                    placeholder={currentUserEmail || 'Name or email'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Three or more facts unique to this job (one per line)
                </label>
                <textarea
                  value={formData.unique_facts}
                  onChange={(event) => handleChange('unique_facts', event.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white resize-none"
                  rows={4}
                  placeholder="Measured dimensions, concrete ticket quantity, project date..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Stephen's observation or decision
                  </label>
                  <textarea
                    value={formData.first_hand_observation}
                    onChange={(event) => handleChange('first_hand_observation', event.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Local constraint and field decision
                  </label>
                  <textarea
                    value={formData.local_decision}
                    onChange={(event) => handleChange('local_decision', event.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white resize-none"
                    rows={3}
                    placeholder="Runoff, soil, access, traffic, cure timing..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Scope boundary
                </label>
                <textarea
                  value={formData.scope_boundary}
                  onChange={(event) => handleChange('scope_boundary', event.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white resize-none"
                  rows={3}
                  placeholder="What SLA completed, what another trade completed, and what SLA did not offer."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Internal source notes / job ID
                  </label>
                  <textarea
                    value={formData.source_notes}
                    onChange={(event) => handleChange('source_notes', event.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white resize-none"
                    rows={3}
                    placeholder="Job sheet, tickets, photo album, voice note..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Public source summary
                  </label>
                  <textarea
                    value={formData.source_summary}
                    onChange={(event) => handleChange('source_summary', event.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white resize-none"
                    rows={3}
                    placeholder="Based on field photos, job records, and Stephen's review."
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Project series ID
                  </label>
                  <input
                    value={formData.project_series_id}
                    onChange={(event) => handleChange('project_series_id', event.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                    placeholder="burnet-shop-2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Series phase
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.series_phase}
                    onChange={(event) => handleChange('series_phase', event.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Canonical slug (true duplicate only)
                  </label>
                  <input
                    value={formData.canonical_slug}
                    onChange={(event) => handleChange('canonical_slug', event.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                    placeholder="master-case-study-slug"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['exact_project_photos', 'Every photo belongs to this exact project'],
                  ['photo_captions_reviewed', 'Captions explain a real detail or decision'],
                  ['claims_verified', 'Numbers, products, dates, and claims were checked'],
                  ['client_permission_checked', 'Naming and photo permissions were checked'],
                ].map(([field, label]) => (
                  <label key={field} className="flex items-start gap-3 text-sm text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData[field]}
                      onChange={(event) => handleChange(field, event.target.checked)}
                      className="mt-0.5 size-4 rounded border-stone-300 text-accent-600"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(event) => handleChange('excerpt', event.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg resize-none"
                rows={3}
                placeholder="Short summary shown on the blog listing."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Content (Markdown)
              </label>
              <textarea
                value={formData.content}
                onChange={(event) => handleChange('content', event.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg resize-none"
                rows={10}
                placeholder="Write the full post here..."
              />
            </div>

            {message && (
              <div className="text-sm text-stone-600 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
                {message}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
              >
                {isEditing
                  ? 'Update Post'
                  : status === 'published'
                    ? 'Publish Post'
                    : 'Save Draft'}
              </button>
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={startNew}
                    className="text-sm font-semibold text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePost(editingId)}
                    className="text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      <BlogPhotoStudio
        accessToken={accessToken}
        onPostCreated={handlePostCreatedFromPhotos}
      />
    </div>
  )
}
