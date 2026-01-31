import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Trash2, Plus, Upload, X, ArrowUp, ArrowDown } from 'lucide-react'

const categories = ['All', 'Driveways', 'Patios', 'Stamped', 'Commercial', 'Residential']

const emptyJob = {
  title: '',
  slug: '',
  category: 'Commercial',
  location: 'Waco, TX',
  date: new Date().toISOString().split('T')[0],
  date_formatted: '',
  description: '',
  featured: false,
  display_order: 0,
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState(emptyJob)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [uploadingImages, setUploadingImages] = useState(false)

  const isEditing = useMemo(() => Boolean(editingId), [editingId])

  const fetchJobs = async () => {
    setLoading(true)
    const { data: jobsData, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .order('display_order', { ascending: true })
      .order('date', { ascending: false })

    if (jobsError) {
      console.error('Error fetching jobs:', jobsError)
      setLoading(false)
      return
    }

    // Fetch images for each job
    const jobsWithImages = await Promise.all(
      (jobsData || []).map(async (job) => {
        const { data: images } = await supabase
          .from('job_images')
          .select('*')
          .eq('job_id', job.id)
          .order('image_order', { ascending: true })

        return { ...job, images: images || [] }
      })
    )

    setJobs(jobsWithImages)
    setLoading(false)
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const startNew = () => {
    setEditingId(null)
    setFormData(emptyJob)
    setMessage('')
  }

  const startEdit = (job) => {
    setEditingId(job.id)
    setFormData({
      title: job.title || '',
      slug: job.slug || '',
      category: job.category || 'Commercial',
      location: job.location || 'Waco, TX',
      date: job.date || new Date().toISOString().split('T')[0],
      date_formatted: job.date_formatted || '',
      description: job.description || '',
      featured: job.featured || false,
      display_order: job.display_order || 0,
    })
    setMessage('')
  }

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && !prev.slug) {
        next.slug = slugify(value)
      }
      if (field === 'date') {
        const date = new Date(value)
        next.date_formatted = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      }
      return next
    })
  }

  const saveJob = async (event) => {
    event.preventDefault()
    setMessage('')

    if (!formData.title || !formData.slug) {
      setMessage('Title and slug are required.')
      return
    }

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('jobs')
          .update({
            title: formData.title.trim(),
            slug: formData.slug.trim(),
            category: formData.category,
            location: formData.location.trim(),
            date: formData.date,
            date_formatted: formData.date_formatted,
            description: formData.description.trim() || null,
            featured: formData.featured,
            display_order: formData.display_order,
          })
          .eq('id', editingId)

        if (error) throw error
        setMessage('Job updated successfully!')
      } else {
        const { error } = await supabase.from('jobs').insert({
          title: formData.title.trim(),
          slug: formData.slug.trim(),
          category: formData.category,
          location: formData.location.trim(),
          date: formData.date,
          date_formatted: formData.date_formatted,
          description: formData.description.trim() || null,
          featured: formData.featured,
          display_order: formData.display_order,
        })

        if (error) throw error
        setMessage('Job created successfully!')
      }

      await fetchJobs()
      setTimeout(() => {
        startNew()
        setMessage('')
      }, 2000)
    } catch (error) {
      console.error('Error saving job:', error)
      setMessage(`Error: ${error.message}`)
    }
  }

  const deleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this job? This will also delete all associated images.')) {
      return
    }

    try {
      const { error } = await supabase.from('jobs').delete().eq('id', id)
      if (error) throw error

      await fetchJobs()
      if (editingId === id) {
        startNew()
      }
    } catch (error) {
      console.error('Error deleting job:', error)
      setMessage(`Error deleting job: ${error.message}`)
    }
  }

  const handleImageUpload = async (jobId, files) => {
    setUploadingImages(true)
    try {
      const { data: existingImages } = await supabase
        .from('job_images')
        .select('image_order')
        .eq('job_id', jobId)
        .order('image_order', { ascending: false })
        .limit(1)

      let nextOrder = existingImages && existingImages.length > 0 ? existingImages[0].image_order + 1 : 0

      const uploadPromises = Array.from(files).map(async (file) => {
        // Create a file path
        const fileName = `${jobId}/${Date.now()}-${file.name}`
        const filePath = `jobs/${fileName}`

        // Upload to Supabase Storage (if you have storage set up)
        // For now, we'll use a public URL approach
        // You'll need to set up Supabase Storage bucket 'jobs' and configure it
        
        // For now, we'll store the file path and you can upload files manually
        // or set up storage later
        const imageUrl = `/jobs/${fileName}`

        const { error } = await supabase.from('job_images').insert({
          job_id: jobId,
          image_url: imageUrl,
          image_order: nextOrder++,
          alt_text: file.name,
        })

        if (error) throw error
      })

      await Promise.all(uploadPromises)
      await fetchJobs()
      setMessage('Images uploaded successfully!')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      console.error('Error uploading images:', error)
      setMessage(`Error uploading images: ${error.message}`)
    } finally {
      setUploadingImages(false)
    }
  }

  const deleteImage = async (imageId, jobId) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      const { error } = await supabase.from('job_images').delete().eq('id', imageId)
      if (error) throw error

      await fetchJobs()
    } catch (error) {
      console.error('Error deleting image:', error)
      setMessage(`Error deleting image: ${error.message}`)
    }
  }

  const moveImage = async (imageId, jobId, direction) => {
    const currentJob = jobs.find((j) => j.id === jobId)
    if (!currentJob) return

    const images = [...currentJob.images].sort((a, b) => a.image_order - b.image_order)
    const currentIndex = images.findIndex((img) => img.id === imageId)

    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === images.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const tempOrder = images[currentIndex].image_order
    images[currentIndex].image_order = images[newIndex].image_order
    images[newIndex].image_order = tempOrder

    try {
      await supabase
        .from('job_images')
        .update({ image_order: images[currentIndex].image_order })
        .eq('id', images[currentIndex].id)

      await supabase
        .from('job_images')
        .update({ image_order: images[newIndex].image_order })
        .eq('id', images[newIndex].id)

      await fetchJobs()
    } catch (error) {
      console.error('Error reordering images:', error)
      setMessage(`Error reordering images: ${error.message}`)
    }
  }

  const filteredJobs =
    filterCategory === 'All'
      ? jobs
      : jobs.filter((job) => job.category === filterCategory)

  if (loading) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-8 text-center text-stone-500">
        Loading jobs...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-stone-900">Jobs</h2>
          <p className="text-sm text-stone-600 mt-1">Manage project gallery and job listings</p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
        >
          <Plus className="size-4" />
          New Job
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterCategory === cat
                ? 'bg-accent-500 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
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

      {/* Form */}
      {isEditing && (
        <form onSubmit={saveJob} className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                {categories.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleChange('featured', e.target.checked)}
              className="size-4"
            />
            <label htmlFor="featured" className="text-sm font-medium text-stone-700">
              Featured (shows on homepage)
            </label>
          </div>

          {/* Image Management */}
          {isEditing && (
            <div className="border-t border-stone-200 pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-stone-900">Images</h3>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg cursor-pointer hover:bg-stone-200 transition-colors">
                  <Upload className="size-4" />
                  Upload Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(editingId, e.target.files)}
                    className="hidden"
                    disabled={uploadingImages}
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {jobs
                  .find((j) => j.id === editingId)
                  ?.images?.map((image, index, images) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_url}
                        alt={image.alt_text || 'Job image'}
                        className="w-full aspect-square object-cover rounded-lg border border-stone-200"
                        onError={(e) => {
                          e.target.src = '/src/assets/images/gallery-driveway-custom.jpeg'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveImage(image.id, editingId, 'up')}
                          disabled={index === 0}
                          className="p-2 bg-white/90 rounded hover:bg-white transition-colors disabled:opacity-50"
                          title="Move up"
                        >
                          <ArrowUp className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(image.id, editingId, 'down')}
                          disabled={index === images.length - 1}
                          className="p-2 bg-white/90 rounded hover:bg-white transition-colors disabled:opacity-50"
                          title="Move down"
                        >
                          <ArrowDown className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteImage(image.id, editingId)}
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
            >
              {isEditing ? 'Update Job' : 'Create Job'}
            </button>
            <button
              type="button"
              onClick={startNew}
              className="px-6 py-2 bg-stone-200 text-stone-700 font-semibold rounded-lg hover:bg-stone-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Jobs List */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Images
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-stone-500">
                    No jobs found. Create your first job!
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-900">{job.title}</div>
                      {job.featured && (
                        <span className="text-xs text-accent-600 font-medium">Featured</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-600">{job.category}</td>
                    <td className="px-4 py-3 text-sm text-stone-600">{job.location}</td>
                    <td className="px-4 py-3 text-sm text-stone-600">{job.date_formatted || job.date}</td>
                    <td className="px-4 py-3 text-sm text-stone-600">{job.images?.length || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(job)}
                          className="text-sm text-accent-600 hover:text-accent-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteJob(job.id)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
