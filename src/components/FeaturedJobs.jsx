import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { fadeInUp, viewportConfig } from '../lib/animations'
import { handleImageError } from '../lib/utils'
import { fetchJobs } from '../data/jobs'
import { useEffect, useState } from 'react'

function ProjectImage({ job }) {
  const mainImage = job.images[0] || '/src/assets/images/gallery-driveway-custom.jpeg'
  
  // Handle image loading errors
  const handleError = (e) => {
    // Fallback to a default image if the job image fails to load
    e.target.src = '/src/assets/images/gallery-driveway-custom.jpeg'
  }
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <img
        src={mainImage}
        alt={job.title}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        onError={handleImageError}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 via-black/30 to-transparent group-hover:from-black/95 group-hover:via-black/65 group-hover:via-black/40 group-hover:to-transparent transition-all duration-500" />
    </div>
  )
}

export function FeaturedJobs() {
  const [featuredJobs, setFeaturedJobs] = useState([])

  useEffect(() => {
    async function loadJobs() {
      const jobs = await fetchJobs()
      setFeaturedJobs(jobs.filter((job) => job.featured).slice(0, 3))
    }
    loadJobs()
  }, [])

  return (
    <section id="gallery" className="section-padding bg-white texture-concrete relative">
      <div className="container-main relative z-10">
        {/* Section Header */}
        <motion.div
          className="max-w-2xl mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <span className="inline-block text-accent-600 font-bold text-xs uppercase tracking-[0.2em] mb-4">
            Portfolio
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-stone-900 text-balance mb-6">
            Recent <span className="text-stone-400">Pours</span>
          </h2>
          <p className="text-xl text-stone-600 text-pretty font-light leading-relaxed mb-8">
            Every project is a testament to our commitment to durability.
            From expansive commercial slabs to intricate stamped patios.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-accent-600 font-semibold hover:text-accent-700 transition-colors"
          >
            View All Projects
            <ArrowUpRight className="size-4" />
          </Link>
        </motion.div>

        {/* Projects Grid - Show 3-4 */}
        <motion.div
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {featuredJobs.slice(0, 3).map((job, index) => (
            <motion.article
              key={job.id}
              className="group relative rounded-2xl overflow-hidden bg-stone-100 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 aspect-[4/5]"
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/jobs/${job.slug}`} className="absolute inset-0 z-20">
                <span className="sr-only">View {job.title}</span>
              </Link>
              
              <ProjectImage job={job} />

              {/* Content Overlay */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-8">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-accent-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {job.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-white/90">
                      <MapPin className="size-3.5 text-accent-400" />
                      {job.location}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
                    {job.title}
                  </h3>

                  <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    <p className="text-sm text-stone-300 leading-relaxed mb-6 font-light line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
                    <span className="text-xs font-bold text-white uppercase tracking-widest">View Project</span>
                    <div className="size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-accent-500 transition-colors duration-300">
                      <ArrowUpRight className="size-5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
