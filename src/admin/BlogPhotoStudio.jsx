import { useEffect, useMemo, useState } from 'react'
import { CheckSquare, ImagePlus, RefreshCw, Square, WandSparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'

const emptyAlbumForm = {
  name: '',
  url: '',
}

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

function previewCaption(photo) {
  const text = toTrimmedString(photo?.source_caption || photo?.alt_text || '')
  if (!text) return 'No caption yet.'
  if (text.length <= 90) return text
  return `${text.slice(0, 87).trim()}...`
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
  const [loadingAlbums, setLoadingAlbums] = useState(true)
  const [loadingPhotos, setLoadingPhotos] = useState(true)
  const [albumForm, setAlbumForm] = useState(emptyAlbumForm)
  const [selectedAlbumId, setSelectedAlbumId] = useState('')
  const [selectedPhotos, setSelectedPhotos] = useState(new Set())
  const [syncing, setSyncing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [message, setMessage] = useState('')

  const albumsById = useMemo(
    () => new Map((albums || []).map((album) => [album.id, album])),
    [albums]
  )

  const filteredPhotos = useMemo(() => {
    if (!selectedAlbumId) return photos
    return photos.filter((photo) => photo.album_id === selectedAlbumId)
  }, [photos, selectedAlbumId])

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

    setPhotos(data || [])
    setLoadingPhotos(false)
  }

  useEffect(() => {
    loadAlbums()
    loadPhotos()
  }, [])

  const onSelectAlbum = (albumId) => {
    setSelectedAlbumId(albumId)
    setSelectedPhotos(new Set())
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
    const next = new Set(filteredPhotos.map((photo) => photo.id))
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

    setGenerating(true)

    try {
      const response = await fetch('/api/blog-generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status,
          photoIds: Array.from(selectedPhotos),
        }),
      })

      const payload = await readApiPayload(response)
      if (!response.ok) {
        setMessage(payload.error || `Unable to create post from photos (${response.status}).`)
        return
      }

      setMessage(`Post created: ${payload.post.title}`)
      setSelectedPhotos(new Set())

      if (typeof onPostCreated === 'function') {
        onPostCreated(payload.post)
      }
    } catch (error) {
      setMessage(error.message || 'Unable to create post from photos.')
    } finally {
      setGenerating(false)
    }
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
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button
              type="button"
              onClick={selectAllVisible}
              disabled={filteredPhotos.length === 0 || loadingPhotos}
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
              {selectedPhotos.size} selected / {filteredPhotos.length} visible
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => createPostFromSelection('draft')}
              disabled={selectedPhotos.size === 0 || generating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50"
            >
              <WandSparkles className="size-4" />
              Create Draft from Selected
            </button>
            <button
              type="button"
              onClick={() => createPostFromSelection('published')}
              disabled={selectedPhotos.size === 0 || generating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50"
            >
              Publish from Selected
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="text-sm text-stone-600 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
          {message}
        </div>
      )}

      {loadingPhotos ? (
        <div className="text-sm text-stone-500">Loading photo library…</div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-lg p-4">
          No photos yet. Run a sync to import from your album.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredPhotos.map((photo) => {
            const isSelected = selectedPhotos.has(photo.id)
            const albumName = photo.album_id ? albumsById.get(photo.album_id)?.name : ''

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
                </div>
                <div className="p-2.5 space-y-1">
                  <p className="text-xs font-medium text-stone-700">{previewCaption(photo)}</p>
                  <p className="text-[11px] text-stone-500">
                    {albumName || 'Unsorted'}
                    {photo.source_taken_at
                      ? ` • ${new Date(photo.source_taken_at).toLocaleDateString()}`
                      : ''}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
