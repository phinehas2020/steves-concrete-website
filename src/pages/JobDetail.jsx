import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, MapPin, Calendar } from 'lucide-react'
import { handleImageError } from '../lib/utils'
import { fetchJobs } from '../data/jobs'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useEffect, useState } from 'react'

export function JobDetail() {
  const { slug } = useParams()
  const [job, setJob] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    async function loadJobs() {
      const jobsData = await fetchJobs()
      setJobs(jobsData)
      const foundJob = jobsData.find((j) => j.slug === slug)
      setJob(foundJob)
      setLoading(false)
    }
    loadJobs()
  }, [slug])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-stone-500">Loading...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Job Not Found</h1>
            <Link to="/jobs" className="text-accent-600 hover:text-accent-700">
              Back to Jobs
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const getImageSrc = (imagePath) => {
    // Try the original path first, then try .jpg if .jpeg fails
    return imagePath
  }
  
  const currentImage = getImageSrc(job.images[currentImageIndex] || job.images[0])

  // Get related jobs (same category, exclude current)
  const relatedJobs = jobs
    .filter(j => j.category === job.category && j.id !== job.id)
    .slice(0, 3)

  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Image */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <img
            src={currentImage}
            alt={job.title}
            className="w-full h-full object-cover"
            loading="eager"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Navigation */}
          <div className="absolute top-8 left-8 z-10">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to Jobs
            </Link>
          </div>

          {/* Image Counter */}
          {job.images.length > 1 && (
            <div className="absolute bottom-8 right-8 z-10">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg text-sm">
                {currentImageIndex + 1} / {job.images.length}
              </div>
            </div>
          )}

          {/* Image Navigation */}
          {job.images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : job.images.length - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev => (prev < job.images.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Next image"
              >
                →
              </button>
            </>
          )}
        </section>

        {/* Job Details */}
        <section className="section-padding bg-white">
          <div className="container-main">
            <div className="max-w-4xl">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-accent-500 text-white text-xs font-bold uppercase tracking-widest rounded-full">
                    {job.category}
                  </span>
                  <span className="flex items-center gap-2 text-stone-600">
                    <MapPin className="size-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-2 text-stone-600">
                    <Calendar className="size-4" />
                    {job.dateFormatted}
                  </span>
                </div>
                <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-stone-900 mb-6">
                  {job.title}
                </h1>
                <p className="text-xl text-stone-600 leading-relaxed font-light">
                  {job.description}
                </p>
              </motion.div>

              {/* Image Gallery */}
              {job.images.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-stone-900 mb-6">Project Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {job.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? 'border-accent-500 ring-2 ring-accent-500/50'
                            : 'border-transparent hover:border-stone-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${job.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={handleImageError}
                        />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="p-8 bg-stone-950 rounded-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to start your project?
                </h3>
                <p className="text-stone-400 mb-6">
                  Get a free estimate for your concrete project in Central Texas.
                </p>
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
                >
                  Get Free Estimate
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <section className="section-padding bg-stone-50">
            <div className="container-main">
              <h2 className="text-3xl font-bold text-stone-900 mb-8">Related Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedJobs.map((relatedJob) => (
                  <Link
                    key={relatedJob.id}
                    to={`/jobs/${relatedJob.slug}`}
                    className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-stone-100"
                  >
                    <img
                      src={relatedJob.images[0]}
                      alt={relatedJob.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <span className="text-xs font-bold text-accent-400 uppercase tracking-widest mb-2">
                        {relatedJob.category}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-2">{relatedJob.title}</h3>
                      <span className="text-sm text-stone-300">{relatedJob.location}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
