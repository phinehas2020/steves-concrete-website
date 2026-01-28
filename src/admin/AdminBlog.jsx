import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const emptyPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  status: 'draft',
  cover_image_url: '',
}

const statusOptions = ['draft', 'published']

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function AdminBlog({ currentUserEmail }) {
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
    }
    setLoading(false)
  }

  useEffect(() => {
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

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      excerpt: formData.excerpt.trim() || null,
      content: formData.content.trim(),
      status,
      cover_image_url: formData.cover_image_url.trim() || null,
      author_email: currentUserEmail || null,
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

    setMessage(isEditing ? 'Post updated.' : 'Post created.')
    startNew()
    fetchPosts()
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
              <button
                key={post.id}
                type="button"
                onClick={() => startEdit(post)}
                className="w-full text-left border border-stone-200 rounded-lg p-3 hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-stone-900">{post.title}</p>
                  <span className="text-xs uppercase tracking-wide text-stone-500">
                    {post.status}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">{post.slug}</p>
              </button>
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
                <button
                  type="button"
                  onClick={startNew}
                  className="text-sm font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
