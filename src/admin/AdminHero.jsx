import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Trash2, Upload, ArrowUp, ArrowDown, X, CheckSquare, Square } from 'lucide-react'

export function AdminHero() {
  const [heroImages, setHeroImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedImages, setSelectedImages] = useState(new Set())
  const [error, setError] = useState(null)

  const fetchHeroImages = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if Supabase is configured
      if (!supabase || typeof supabase.from !== 'function') {
        throw new Error('Supabase is not configured. Please check your environment variables.')
      }
      
      const { data, error: fetchError } = await supabase
        .from('hero_images')
        .select('*')
        .order('display_order', { ascending: true })

      if (fetchError) {
        console.error('Error fetching hero images:', fetchError)
        setError(fetchError.message)
        setMessage(`Error fetching images: ${fetchError.message}`)
        setHeroImages([])
      } else {
        console.log('Hero images fetched successfully:', data?.length || 0, 'images')
        setHeroImages(data || [])
        if (data && data.length === 0) {
          setMessage('')
        }
      }
    } catch (err) {
      console.error('Unexpected error fetching hero images:', err)
      setError(err.message)
      setMessage(`Unexpected error: ${err.message}`)
      setHeroImages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('AdminHero component mounted, fetching images...')
    fetchHeroImages()
  }, [])

  // Prevent navigation during uploads
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (uploadingImages) {
        e.preventDefault()
        e.returnValue = 'Images are still uploading. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [uploadingImages])

  const handleImageUpload = async (files) => {
    setUploadingImages(true)
    setUploadProgress(0)
    try {
      const { data: existingImages } = await supabase
        .from('hero_images')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)

      let nextOrder = existingImages && existingImages.length > 0 ? existingImages[0].display_order + 1 : 0

      const fileArray = Array.from(files)
      const totalFiles = fileArray.length

      // Upload files one by one to track progress
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        
        // Create a unique filename
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 9)
        const fileExt = file.name.split('.').pop()
        const fileName = `${timestamp}-${randomStr}.${fileExt}`
        const filePath = `hero-images/${fileName}`

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('hero-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Storage upload error:', uploadError)
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`)
        }

        // Get public URL from Supabase Storage
        const { data: urlData } = supabase.storage
          .from('hero-images')
          .getPublicUrl(filePath)

        const imageUrl = urlData.publicUrl

        // Insert image record with public URL
        const { error: insertError } = await supabase.from('hero_images').insert({
          image_url: imageUrl,
          display_order: nextOrder++,
          alt_text: file.name,
          active: true,
        })

        if (insertError) {
          // If insert fails, try to clean up the uploaded file
          await supabase.storage.from('hero-images').remove([filePath])
          throw insertError
        }

        // Update progress
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100))
      }

      await fetchHeroImages()
      setMessage('Images uploaded successfully!')
      setTimeout(() => {
        setMessage('')
        setUploadProgress(0)
      }, 2000)
    } catch (error) {
      console.error('Error uploading images:', error)
      setMessage(`Error uploading images: ${error.message}`)
      setUploadProgress(0)
    } finally {
      setUploadingImages(false)
    }
  }

  const toggleImageSelection = (imageId) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(imageId)) {
        newSet.delete(imageId)
      } else {
        newSet.add(imageId)
      }
      return newSet
    })
  }

  const selectAllImages = () => {
    setSelectedImages(new Set(heroImages.map((img) => img.id)))
  }

  const clearSelection = () => {
    setSelectedImages(new Set())
  }

  const deleteSelectedImages = async () => {
    if (selectedImages.size === 0) return

    if (!confirm(`Are you sure you want to delete ${selectedImages.size} image(s)?`)) {
      return
    }

    try {
      // Get image URLs to delete from storage
      const imagesToDelete = heroImages.filter((img) => selectedImages.has(img.id))
      
      // Delete from database
      const { error: deleteError } = await supabase
        .from('hero_images')
        .delete()
        .in('id', Array.from(selectedImages))

      if (deleteError) throw deleteError

      // Delete from storage
      const filePaths = imagesToDelete.map((img) => {
        // Extract file path from URL
        const url = new URL(img.image_url)
        return url.pathname.replace('/storage/v1/object/public/hero-images/', '')
      })

      if (filePaths.length > 0) {
        await supabase.storage.from('hero-images').remove(filePaths)
      }

      await fetchHeroImages()
      setSelectedImages(new Set())
      setMessage('Images deleted successfully!')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      console.error('Error deleting images:', error)
      setMessage(`Error deleting images: ${error.message}`)
    }
  }

  const toggleActive = async (imageId, currentActive) => {
    try {
      const { error } = await supabase
        .from('hero_images')
        .update({ active: !currentActive })
        .eq('id', imageId)

      if (error) throw error
      await fetchHeroImages()
      setMessage(`Image ${!currentActive ? 'activated' : 'deactivated'} successfully!`)
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      console.error('Error toggling active status:', error)
      setMessage(`Error: ${error.message}`)
    }
  }

  const updateDisplayOrder = async (imageId, direction) => {
    const currentIndex = heroImages.findIndex((img) => img.id === imageId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= heroImages.length) return

    const currentImage = heroImages[currentIndex]
    const swapImage = heroImages[newIndex]

    try {
      // Swap display orders
      const { error: error1 } = await supabase
        .from('hero_images')
        .update({ display_order: swapImage.display_order })
        .eq('id', currentImage.id)

      if (error1) throw error1

      const { error: error2 } = await supabase
        .from('hero_images')
        .update({ display_order: currentImage.display_order })
        .eq('id', swapImage.id)

      if (error2) throw error2

      await fetchHeroImages()
    } catch (error) {
      console.error('Error updating display order:', error)
      setMessage(`Error updating order: ${error.message}`)
    }
  }

  const updateAltText = async (imageId, altText) => {
    try {
      const { error } = await supabase
        .from('hero_images')
        .update({ alt_text: altText })
        .eq('id', imageId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating alt text:', error)
      setMessage(`Error updating alt text: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-stone-900">Hero Images</h2>
          <p className="text-sm text-stone-600 mt-1">Manage images that rotate on the homepage hero section</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-8 text-center text-stone-500">
          <p>Loading hero images...</p>
        </div>
      </div>
    )
  }

  if (error && !message) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-8">
        <h2 className="font-display font-bold text-2xl text-stone-900 mb-4">Hero Images</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold mb-2">Error loading hero images</p>
          <p className="text-sm">{error}</p>
          <button
            type="button"
            onClick={fetchHeroImages}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-stone-900">Hero Images</h2>
          <p className="text-sm text-stone-600 mt-1">Manage images that rotate on the homepage hero section</p>
          {error && (
            <p className="text-xs text-red-600 mt-1">Error: {error}</p>
          )}
          {!loading && !error && (
            <p className="text-xs text-stone-500 mt-1">
              {heroImages.length} image{heroImages.length !== 1 ? 's' : ''} configured
            </p>
          )}
        </div>
        <label className={`inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent-500 text-white font-semibold rounded-lg transition-colors ${
          uploadingImages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-accent-600'
        }`}>
          <Upload className="size-4" />
          Upload Images
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            className="hidden"
            disabled={uploadingImages}
          />
        </label>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      {/* Upload Progress */}
      {uploadingImages && uploadProgress > 0 && (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone-700">Uploading images...</span>
            <span className="text-sm text-stone-500">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2">
            <div
              className="bg-accent-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Image Selection Controls */}
      {heroImages.length > 0 && (
        <div className="flex items-center gap-2">
          {selectedImages.size > 0 ? (
            <>
              <button
                type="button"
                onClick={deleteSelectedImages}
                disabled={uploadingImages}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="size-4" />
                Delete Selected ({selectedImages.size})
              </button>
              <button
                type="button"
                onClick={clearSelection}
                disabled={uploadingImages}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={selectAllImages}
              disabled={uploadingImages}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckSquare className="size-4" />
              Select All
            </button>
          )}
        </div>
      )}

      {/* Images Grid */}
      {heroImages.length === 0 && !loading && (
        <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
          <p className="text-stone-500 mb-4 font-medium">No hero images yet. Upload some images to get started!</p>
          <p className="text-sm text-stone-400 mb-6">
            Images will automatically rotate on the homepage every 5 seconds.
          </p>
          <p className="text-xs text-stone-500">
            Use the "Upload Images" button above to add your first hero image.
          </p>
        </div>
      )}
      {heroImages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroImages.map((image, index) => (
            <div
              key={image.id}
              className={`bg-white border-2 rounded-xl overflow-hidden transition-all ${
                selectedImages.has(image.id)
                  ? 'border-accent-500 shadow-lg'
                  : 'border-stone-200 hover:border-stone-300'
              } ${!image.active ? 'opacity-60' : ''}`}
            >
              {/* Image */}
              <div className="relative aspect-video bg-stone-100">
                <img
                  src={image.image_url}
                  alt={image.alt_text || 'Hero image'}
                  className="w-full h-full object-cover"
                />
                {!image.active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">Inactive</span>
                  </div>
                )}
                {/* Selection Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleImageSelection(image.id)}
                  className="absolute top-2 left-2 p-1 bg-white/90 rounded hover:bg-white transition-colors"
                >
                  {selectedImages.has(image.id) ? (
                    <CheckSquare className="size-5 text-accent-500" />
                  ) : (
                    <Square className="size-5 text-stone-400" />
                  )}
                </button>
              </div>

              {/* Controls */}
              <div className="p-4 space-y-3">
                {/* Alt Text */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Alt Text</label>
                  <input
                    type="text"
                    defaultValue={image.alt_text || ''}
                    onBlur={(e) => updateAltText(image.id, e.target.value)}
                    placeholder="Image description"
                    className="w-full px-2 py-1 text-sm border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateDisplayOrder(image.id, 'up')}
                    disabled={index === 0}
                    className="p-2 bg-stone-100 text-stone-700 rounded hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateDisplayOrder(image.id, 'down')}
                    disabled={index === heroImages.length - 1}
                    className="p-2 bg-stone-100 text-stone-700 rounded hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleActive(image.id, image.active)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      image.active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {image.active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this image?')) {
                        try {
                          // Get image URL to delete from storage
                          const url = new URL(image.image_url)
                          const filePath = url.pathname.replace('/storage/v1/object/public/hero-images/', '')
                          
                          // Delete from database
                          const { error: deleteError } = await supabase
                            .from('hero_images')
                            .delete()
                            .eq('id', image.id)

                          if (deleteError) throw deleteError

                          // Delete from storage
                          await supabase.storage.from('hero-images').remove([filePath])

                          await fetchHeroImages()
                          setMessage('Image deleted successfully!')
                          setTimeout(() => setMessage(''), 2000)
                        } catch (error) {
                          console.error('Error deleting image:', error)
                          setMessage(`Error deleting image: ${error.message}`)
                        }
                      }
                    }}
                    className="ml-auto p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                {/* Order Indicator */}
                <div className="text-xs text-stone-500">
                  Order: {image.display_order}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
