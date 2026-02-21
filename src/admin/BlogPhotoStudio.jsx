import { useEffect, useMemo, useState } from 'react'
import { CheckSquare, ImagePlus, RefreshCw, Square, WandSparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { DEFAULT_JOB_CATEGORIES } from '../data/jobs'

const emptyAlbumForm = {
  name: '',
  url: '',
}
const BLOG_AI_PROMPT_KEY = 'blog_photo_post'
const DEFAULT_BLOG_SYSTEM_PROMPT = [
  'You write short blog intro paragraphs for a concrete contractor in Waco, Texas.',
  'Return exactly one paragraph between 90 and 130 words.',
  'Tone: practical, honest, and down-to-earth.',
  'Use local SEO naturally where it fits, including some of: concrete contractor Waco TX, concrete driveway, concrete patio, concrete repair, free estimate.',
  'Mention visible concrete work details and craftsmanship quality.',
  'Do not use bullet points, hashtags, emojis, all caps, or long dashes.',
  'Do not invent facts. Output only the paragraph.',
].join('\n')

function toTrimmedString(value) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function parseAlbumToken(value) {
  const raw = toTrimmedString(value)
  if (!raw) return ''
  if (raw.includes('#')) return raw.split('#').pop().trim()
  const match = raw.match(/sharedalbum\/(?:#)?([a-z0-9]+)/i)
  if (match?.[1]) return match[1].trim()
  if (/^[a-z0-9]+$/i.test(raw)) return raw
  return ''
}

function isGenericPhotoLabel(value) {
  const text = toTrimmedString(value)
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

  if (!text) return true

  return (
    /^project photo(?:\s+#?\d+)?$/.test(text) ||
    /^photo(?:\s+#?\d+)?$/.test(text) ||
    /^image(?:\s+#?\d+)?$/.test(text) ||
    /^(?:img|dsc|pic)[_\s-]?\d+$/.test(text)
  )
}

function previewCaption(photo) {
  const sourceCaption = toTrimmedString(photo?.source_caption || '')
  const altText = toTrimmedString(photo?.alt_text || '')
  const preferred =
    sourceCaption && !isGenericPhotoLabel(sourceCaption)
      ? sourceCaption
      : altText && !isGenericPhotoLabel(altText)
        ? altText
        : ''

  const text = toTrimmedString(preferred)
  if (!text) return 'No caption yet.'
  if (text.length <= 90) return text
  return `${text.slice(0, 87).trim()}...`
}

function statusPillClass(status) {
  const normalized = toTrimmedString(status).toLowerCase()
  if (normalized === 'completed') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  if (normalized === 'failed') return 'bg-red-100 text-red-700 border-red-200'
  if (normalized === 'processing') return 'bg-amber-100 text-amber-800 border-amber-200'
  return 'bg-stone-100 text-stone-700 border-stone-200'
}

function statusLabel(status) {
  const normalized = toTrimmedString(status).toLowerCase()
  if (!normalized) return 'Unknown'
  return `${normalized.slice(0, 1).toUpperCase()}${normalized.slice(1)}`
}

async function readApiPayload(response) {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return { error: text.slice(0, 300) }
  }
}

export function BlogPhotoStudio({ accessToken, onPostCreated }) {
  const [albums, setAlbums] = useState([])
  const [photos, setPhotos] = useState([])
  const [photoUsageById, setPhotoUsageById] = useState(new Map())
  const [loadingAlbums, setLoadingAlbums] = useState(true)
  const [loadingPhotos, setLoadingPhotos] = useState(true)
  const [loadingPrompt, setLoadingPrompt] = useState(true)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [albumForm, setAlbumForm] = useState(emptyAlbumForm)
  const [selectedAlbumId, setSelectedAlbumId] = useState('')
  const [selectedPhotos, setSelectedPhotos] = useState(new Set())
  const [targetType, setTargetType] = useState('blog_post')
  const [jobCategory, setJobCategory] = useState(DEFAULT_JOB_CATEGORIES[0] || 'Commercial')
  const [showPostedBin, setShowPostedBin] = useState(false)
  const [recentJobs, setRecentJobs] = useState([])
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_BLOG_SYSTEM_PROMPT)
  const [savedSystemPrompt, setSavedSystemPrompt] = useState(DEFAULT_BLOG_SYSTEM_PROMPT)
  const [syncing, setSyncing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [savingPrompt, setSavingPrompt] = useState(false)
  const [promptMessage, setPromptMessage] = useState('')
  const [message, setMessage] = useState('')

  const albumsById = useMemo(
    () => new Map((albums || []).map((album) => [album.id, album])),
    [albums]
  )

  const filteredPhotos = useMemo(() => {
    if (!selectedAlbumId) return photos
    return photos.filter((photo) => photo.album_id === selectedAlbumId)
  }, [photos, selectedAlbumId])

  const usedPhotoIds = useMemo(() => {
    const used = new Set()
    photoUsageById.forEach((count, photoId) => {
      if (count > 0) used.add(photoId)
    })
    return used
  }, [photoUsageById])

  const readyPhotos = useMemo(
    () => filteredPhotos.filter((photo) => !usedPhotoIds.has(photo.id)),
    [filteredPhotos, usedPhotoIds]
  )

  const postedBinPhotos = useMemo(
    () => filteredPhotos.filter((photo) => usedPhotoIds.has(photo.id)),
    [filteredPhotos, usedPhotoIds]
  )

  const visiblePhotos = useMemo(
    () => (showPostedBin ? [...readyPhotos, ...postedBinPhotos] : readyPhotos),
    [showPostedBin, readyPhotos, postedBinPhotos]
  )

  const selectedVisibleCount = useMemo(
    () => visiblePhotos.filter((photo) => selectedPhotos.has(photo.id)).length,
    [visiblePhotos, selectedPhotos]
  )

  const loadAlbums = async () => {
    setLoadingAlbums(true)
    const { data, error } = await supabase
      .from('blog_photo_albums')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setMessage(`Unable to load albums: ${error.message}`)
      setLoadingAlbums(false)
      return
    }

    setAlbums(data || [])
    setLoadingAlbums(false)
  }

  const loadPhotos = async () => {
    setLoadingPhotos(true)
    const { data, error } = await supabase
      .from('blog_photos')
      .select('id, album_id, image_url, alt_text, source_caption, source_taken_at, source_batch_key, created_at')
      .order('source_taken_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(500)

    if (error) {
      setMessage(`Unable to load photos: ${error.message}`)
      setLoadingPhotos(false)
      return
    }

    const loadedPhotos = data || []
    setPhotos(loadedPhotos)

    if (loadedPhotos.length === 0) {
      setPhotoUsageById(new Map())
      setLoadingPhotos(false)
      return
    }

    const photoIds = loadedPhotos.map((photo) => photo.id).filter(Boolean)
    const { data: usageRows, error: usageError } = await supabase
      .from('blog_post_photos')
      .select('photo_id, blog_posts!inner(status)')
      .in('photo_id', photoIds)
      .eq('blog_posts.status', 'published')
      .limit(5000)

    if (usageError) {
      setMessage(`Unable to load photo usage: ${usageError.message}`)
      setPhotoUsageById(new Map())
      setLoadingPhotos(false)
      return
    }

    const usageMap = new Map()
    ;(usageRows || []).forEach((row) => {
      const photoId = row?.photo_id
      if (!photoId) return
      usageMap.set(photoId, (usageMap.get(photoId) || 0) + 1)
    })

    setPhotoUsageById(usageMap)
    setLoadingPhotos(false)
  }

  const loadSystemPrompt = async () => {
    setLoadingPrompt(true)
    const { data, error } = await supabase
      .from('blog_ai_prompt_settings')
      .select('system_prompt')
      .eq('key', BLOG_AI_PROMPT_KEY)
      .maybeSingle()

    if (error) {
      setPromptMessage(`Unable to load AI prompt: ${error.message}`)
      setLoadingPrompt(false)
      return
    }

    const promptText = toTrimmedString(data?.system_prompt) || DEFAULT_BLOG_SYSTEM_PROMPT
    setSystemPrompt(promptText)
    setSavedSystemPrompt(promptText)
    setLoadingPrompt(false)
  }

  const loadRecentJobs = async () => {
    setLoadingJobs(true)
    const { data, error } = await supabase
      .from('blog_post_generation_jobs')
      .select('id, status, target_type, target_post_status, target_job_category, created_at, completed_at, result_post_slug, result_job_slug, error_message')
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) {
      setMessage(`Unable to load background jobs: ${error.message}`)
      setLoadingJobs(false)
      return
    }

    setRecentJobs(data || [])
    setLoadingJobs(false)
  }

  useEffect(() => {
    loadAlbums()
    loadPhotos()
    loadSystemPrompt()
    loadRecentJobs()
  }, [])

  const pendingJobCount = recentJobs.filter(
    (job) => job.status === 'queued' || job.status === 'processing'
  ).length

  useEffect(() => {
    if (pendingJobCount === 0) return undefined
    const timer = setInterval(() => {
      loadRecentJobs()
    }, 5000)
    return () => clearInterval(timer)
  }, [pendingJobCount])

  const saveSystemPrompt = async () => {
    setPromptMessage('')

    const promptText = toTrimmedString(systemPrompt)
    if (!promptText) {
      setPromptMessage('System prompt cannot be empty.')
      return
    }

    setSavingPrompt(true)
    const { error } = await supabase
      .from('blog_ai_prompt_settings')
      .upsert(
        {
          key: BLOG_AI_PROMPT_KEY,
          label: 'Blog Photo Post Paragraph',
          system_prompt: promptText,
        },
        { onConflict: 'key' }
      )

    if (error) {
      setPromptMessage(`Unable to save AI prompt: ${error.message}`)
      setSavingPrompt(false)
      return
    }

    setSystemPrompt(promptText)
    setSavedSystemPrompt(promptText)
    setPromptMessage('AI system prompt saved.')
    setSavingPrompt(false)
  }

  const resetPromptToDefault = () => {
    setSystemPrompt(DEFAULT_BLOG_SYSTEM_PROMPT)
    setPromptMessage('Default prompt loaded. Save to make it active.')
  }

  const onSelectAlbum = (albumId) => {
    setSelectedAlbumId(albumId)
    setSelectedPhotos(new Set())
    setShowPostedBin(false)
    setMessage('')

    if (!albumId) {
      setAlbumForm(emptyAlbumForm)
      return
    }

    const album = albumsById.get(albumId)
    if (!album) return

    setAlbumForm({
      name: album.name || '',
      url: album.source_url || '',
    })
  }

  const saveAlbumConfig = async () => {
    setMessage('')

    const url = toTrimmedString(albumForm.url)
    const token = parseAlbumToken(url)

    if (!url || !token) {
      setMessage('Enter a valid iCloud shared album URL first.')
      return
    }

    const payload = {
      name: toTrimmedString(albumForm.name) || 'iCloud Blog Album',
      source_type: 'icloud_shared',
      source_url: `https://www.icloud.com/sharedalbum/#${token}`,
      source_token: token,
      active: true,
    }

    const query = selectedAlbumId
      ? supabase.from('blog_photo_albums').update(payload).eq('id', selectedAlbumId)
      : supabase.from('blog_photo_albums').insert(payload)

    const { error } = await query

    if (error) {
      setMessage(`Unable to save album: ${error.message}`)
      return
    }

    setMessage(selectedAlbumId ? 'Album updated.' : 'Album saved.')
    await loadAlbums()
  }

  const runSync = async ({ autoCreatePost }) => {
    setMessage('')

    if (!accessToken) {
      setMessage('Missing admin session token. Please sign out and back in.')
      return
    }

    const body = {
      autoCreatePost,
    }

    if (selectedAlbumId) {
      body.albumId = selectedAlbumId
    } else {
      body.albumName = toTrimmedString(albumForm.name) || 'iCloud Blog Album'
      body.albumUrl = toTrimmedString(albumForm.url)
    }

    if (!body.albumId && !body.albumUrl) {
      setMessage('Select an album or enter an album URL before syncing.')
      return
    }

    setSyncing(true)

    try {
      const response = await fetch('/api/blog-album-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      })

      const payload = await readApiPayload(response)
      if (!response.ok) {
        setMessage(payload.error || `Album sync failed (${response.status}).`)
        return
      }

      setMessage(
        [
          `Synced ${payload.photosWithAssetUrls || 0} photos`,
          `(new ${payload.imported || 0}, updated ${payload.updated || 0}).`,
          payload.generatedPost ? `Post created: ${payload.generatedPost.title}` : '',
        ]
          .filter(Boolean)
          .join(' ')
      )

      await Promise.all([loadAlbums(), loadPhotos()])

      if (payload.generatedPost && typeof onPostCreated === 'function') {
        onPostCreated(payload.generatedPost)
      }
    } catch (error) {
      setMessage(error.message || 'Album sync failed.')
    } finally {
      setSyncing(false)
    }
  }

  const togglePhotoSelection = (photoId) => {
    setSelectedPhotos((prev) => {
      const next = new Set(prev)
      if (next.has(photoId)) {
        next.delete(photoId)
      } else {
        next.add(photoId)
      }
      return next
    })
  }

  const selectAllVisible = () => {
    const next = new Set(visiblePhotos.map((photo) => photo.id))
    setSelectedPhotos(next)
  }

  const clearSelection = () => {
    setSelectedPhotos(new Set())
  }

  const createPostFromSelection = async (status) => {
    if (!accessToken) {
      setMessage('Missing admin session token. Please sign out and back in.')
      return
    }

    if (selectedPhotos.size === 0) {
      setMessage('Select one or more photos first.')
      return
    }

    const promptText = toTrimmedString(systemPrompt)
    if (targetType === 'blog_post' && !promptText) {
      setMessage('System prompt cannot be empty.')
      return
    }

    setGenerating(true)

    try {
      const response = await fetch('/api/blog-generate-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status,
          targetType,
          jobCategory: targetType === 'job_listing' ? jobCategory : null,
          photoIds: Array.from(selectedPhotos),
          systemPrompt: targetType === 'blog_post' ? promptText : null,
        }),
      })

      const payload = await readApiPayload(response)
      if (!response.ok) {
        setMessage(payload.error || `Unable to queue post generation (${response.status}).`)
        return
      }

      setMessage(
        payload.message ||
          `Generation queued. Job ${payload?.job?.id || ''} will continue in the background even if you leave this page.`
      )
      setSelectedPhotos(new Set())
      await loadRecentJobs()
    } catch (error) {
      setMessage(error.message || 'Unable to queue post generation.')
    } finally {
      setGenerating(false)
    }
  }

  const hasPromptChanges = toTrimmedString(systemPrompt) !== toTrimmedString(savedSystemPrompt)

  const renderPhotoCard = (photo) => {
    const isSelected = selectedPhotos.has(photo.id)
    const albumName = photo.album_id ? albumsById.get(photo.album_id)?.name : ''
    const usageCount = photoUsageById.get(photo.id) || 0
    const isUsed = usageCount > 0

    return (
      <button
        key={photo.id}
        type="button"
        onClick={() => togglePhotoSelection(photo.id)}
        className={[
          'text-left border rounded-lg overflow-hidden transition-colors',
          isSelected
            ? 'border-accent-500 ring-2 ring-accent-200'
            : 'border-stone-200 hover:border-stone-300',
        ].join(' ')}
      >
        <div className="relative">
          <img
            src={photo.image_url}
            alt={photo.alt_text || 'Blog photo'}
            className="w-full aspect-square object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 bg-white/90 rounded p-1 shadow-sm">
            {isSelected ? (
              <CheckSquare className="size-4 text-accent-600" />
            ) : (
              <Square className="size-4 text-stone-500" />
            )}
          </div>
          {isUsed && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] rounded px-1.5 py-0.5">
              Used {usageCount}x
            </div>
          )}
        </div>
        <div className="p-2.5 space-y-1">
          <p className="text-xs font-medium text-stone-700">{previewCaption(photo)}</p>
          <p className="text-[11px] text-stone-500">
            {albumName || 'Unsorted'}
            {photo.source_taken_at
              ? ` • ${new Date(photo.source_taken_at).toLocaleDateString()}`
              : ''}
            {isUsed ? ` • Posted ${usageCount}x` : ''}
          </p>
        </div>
      </button>
    )
  }

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-stone-900">Photo Studio</h3>
        <p className="text-sm text-stone-600 mt-1">
          Sync iCloud album photos into your blog library, then select images to auto-build posts.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-stone-700">Album</label>
          <select
            value={selectedAlbumId}
            onChange={(event) => onSelectAlbum(event.target.value)}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
            disabled={loadingAlbums || syncing}
          >
            <option value="">Use custom URL (or default env album)</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.name}
              </option>
            ))}
          </select>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Album Name</label>
            <input
              value={albumForm.name}
              onChange={(event) => setAlbumForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg"
              placeholder="Field Updates"
              disabled={syncing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">iCloud Album URL</label>
            <input
              value={albumForm.url}
              onChange={(event) => setAlbumForm((prev) => ({ ...prev, url: event.target.value }))}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg"
              placeholder="https://www.icloud.com/sharedalbum/#..."
              disabled={syncing}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={saveAlbumConfig}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors disabled:opacity-50"
            >
              <ImagePlus className="size-4" />
              Save Album
            </button>
            <button
              type="button"
              onClick={() => runSync({ autoCreatePost: false })}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`size-4 ${syncing ? 'animate-spin' : ''}`} />
              Sync Album
            </button>
            <button
              type="button"
              onClick={() => runSync({ autoCreatePost: true })}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50"
            >
              <WandSparkles className="size-4" />
              Sync + Auto Post
            </button>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="block text-sm font-medium text-stone-700">Blog AI System Prompt</label>
              <span className="text-xs text-stone-500">
                {hasPromptChanges ? 'Unsaved changes' : 'Saved'}
              </span>
            </div>
            <textarea
              value={systemPrompt}
              onChange={(event) => {
                setSystemPrompt(event.target.value)
                setPromptMessage('')
              }}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white text-sm resize-y min-h-[180px]"
              placeholder="System prompt for generating blog post intro text."
              disabled={loadingPrompt || savingPrompt}
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={saveSystemPrompt}
                disabled={loadingPrompt || savingPrompt || !hasPromptChanges}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-stone-900 text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50"
              >
                {savingPrompt ? 'Saving...' : 'Save Prompt'}
              </button>
              <button
                type="button"
                onClick={resetPromptToDefault}
                disabled={loadingPrompt || savingPrompt}
                className="px-3 py-1.5 text-sm bg-white border border-stone-200 rounded-lg hover:bg-stone-100 disabled:opacity-50"
              >
                Reset to Default
              </button>
            </div>
            {promptMessage && (
              <p className="text-xs text-stone-600">{promptMessage}</p>
            )}
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button
              type="button"
              onClick={selectAllVisible}
              disabled={visiblePhotos.length === 0 || loadingPhotos}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-stone-200 rounded-lg hover:bg-stone-100 disabled:opacity-50"
            >
              <CheckSquare className="size-4" />
              Select All Visible
            </button>
            <button
              type="button"
              onClick={clearSelection}
              disabled={selectedPhotos.size === 0}
              className="px-3 py-1.5 text-sm bg-white border border-stone-200 rounded-lg hover:bg-stone-100 disabled:opacity-50"
            >
              Clear
            </button>
            <span className="text-xs text-stone-500">
              {selectedVisibleCount} selected visible ({selectedPhotos.size} total) / {visiblePhotos.length} visible
              {' '}({readyPhotos.length} ready, {postedBinPhotos.length} posted)
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Create As</label>
              <select
                value={targetType}
                onChange={(event) => setTargetType(event.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg"
              >
                <option value="blog_post">Blog Post</option>
                <option value="job_listing">Permanent Job Listing</option>
              </select>
            </div>
            {targetType === 'job_listing' && (
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Job Category</label>
                <select
                  value={jobCategory}
                  onChange={(event) => setJobCategory(event.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg"
                >
                  {DEFAULT_JOB_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {targetType === 'job_listing' ? (
              <button
                type="button"
                onClick={() => createPostFromSelection('published')}
                disabled={selectedPhotos.size === 0 || generating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50"
              >
                <WandSparkles className="size-4" />
                Queue Job Listing from Selected
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => createPostFromSelection('draft')}
                  disabled={selectedPhotos.size === 0 || generating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50"
                >
                  <WandSparkles className="size-4" />
                  Queue Draft Blog from Selected
                </button>
                <button
                  type="button"
                  onClick={() => createPostFromSelection('published')}
                  disabled={selectedPhotos.size === 0 || generating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50"
                >
                  Queue Publish Blog from Selected
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div className="text-sm text-stone-600 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
          {message}
        </div>
      )}

      <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="font-medium text-stone-900">Background Generation Jobs</h4>
            <p className="text-xs text-stone-500">
              Blog posts and permanent job listings keep running on the server even if you close this page.
            </p>
          </div>
          <button
            type="button"
            onClick={loadRecentJobs}
            className="px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg hover:bg-stone-100"
          >
            Refresh
          </button>
        </div>

        {loadingJobs ? (
          <p className="text-xs text-stone-500">Loading recent jobs…</p>
        ) : recentJobs.length === 0 ? (
          <p className="text-xs text-stone-500">No queued jobs yet.</p>
        ) : (
          <div className="space-y-2">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-stone-200 rounded-lg px-3 py-2 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs text-stone-600 break-all">Job {job.id}</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {job.target_type === 'job_listing'
                      ? `Job Listing${job.target_job_category ? ` (${job.target_job_category})` : ''}`
                      : job.target_post_status === 'published'
                        ? 'Publish Blog'
                        : 'Draft Blog'}{' '}
                    ·{' '}
                    {new Date(job.created_at).toLocaleString()}
                    {job.result_post_slug ? ` · ${job.result_post_slug}` : ''}
                    {job.result_job_slug ? ` · ${job.result_job_slug}` : ''}
                  </p>
                  {toTrimmedString(job.error_message) && (
                    <p className="text-xs text-red-600 mt-1">{job.error_message}</p>
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium border rounded-full px-2 py-0.5 whitespace-nowrap ${statusPillClass(job.status)}`}
                >
                  {statusLabel(job.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {loadingPhotos ? (
        <div className="text-sm text-stone-500">Loading photo library…</div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-lg p-4">
          No photos yet. Run a sync to import from your album.
        </div>
      ) : (
        <div className="space-y-4">
          {readyPhotos.length === 0 ? (
            <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-lg p-4">
              No ready photos in this view. Expand the posted bin to see photos that were already used.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {readyPhotos.map((photo) => renderPhotoCard(photo))}
            </div>
          )}

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h5 className="text-sm font-semibold text-stone-900">Posted Bin</h5>
                <p className="text-xs text-stone-500">
                  Photos that have already been used in generated posts. Collapsed by default.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPostedBin((prev) => !prev)}
                className="px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg hover:bg-stone-100"
              >
                {showPostedBin ? `Collapse (${postedBinPhotos.length})` : `Expand (${postedBinPhotos.length})`}
              </button>
            </div>

            {showPostedBin ? (
              postedBinPhotos.length === 0 ? (
                <p className="text-xs text-stone-500">No posted photos yet.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {postedBinPhotos.map((photo) => renderPhotoCard(photo))}
                </div>
              )
            ) : (
              <p className="text-xs text-stone-500">
                Expand to view or select previously used photos.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
