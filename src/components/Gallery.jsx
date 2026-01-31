import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'
import { fadeInUp, viewportConfig } from '../lib/animations'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { fetchJobs } from '../data/jobs'
import { handleImageError } from '../lib/utils'

const categories = ['All', 'Driveways', 'Patios', 'Stamped', 'Commercial', 'Residential']

// Project image component - displays actual project photos
function ProjectImage({ job }) {
    const mainImage = job.images && job.images.length > 0 
        ? job.images[0] 
        : '/src/assets/images/gallery-driveway-custom.jpeg'
    
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <img
                src={mainImage}
                alt={job.title}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                loading="lazy"
                onError={handleImageError}
            />
            {/* Gradient overlay for text readability - smooth gradual fade */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 via-black/30 to-transparent group-hover:from-black/95 group-hover:via-black/65 group-hover:via-black/40 group-hover:to-transparent transition-all duration-500" />
        </div>
    )
}

export function Gallery() {
    const [activeCategory, setActiveCategory] = useState('All')
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadJobs() {
            try {
                setError(null)
                const jobsData = await fetchJobs()
                // Filter to only show featured jobs, limit to 6
                const featuredJobs = jobsData
                    .filter((job) => job.featured)
                    .slice(0, 6)
                setJobs(featuredJobs)
            } catch (err) {
                console.error('Error loading featured jobs:', err)
                setError('Failed to load featured projects.')
                setJobs([])
            } finally {
                setLoading(false)
            }
        }
        loadJobs()
    }, [])

    const filteredProjects =
        activeCategory === 'All'
            ? jobs
            : jobs.filter((job) => job.category === activeCategory)

    return (
        <section id="gallery" className="section-padding bg-white texture-concrete relative">
            <div className="container-main relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div
                        className="max-w-2xl"
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
                        <p className="text-xl text-stone-600 text-pretty font-light leading-relaxed mb-6">
                            Every project is a testament to our commitment to durability.
                            From expansive commercial slabs to intricate stamped patios.
                        </p>
                        <Link
                            to="/jobs"
                            className="inline-flex items-center gap-2 text-accent-600 font-semibold hover:text-accent-700 transition-colors"
                        >
                            See All Projects
                            <ArrowUpRight className="size-4" />
                        </Link>
                    </motion.div>

                    {/* Filter Tabs - Refined design */}
                    <motion.div
                        className="flex flex-wrap gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    'px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border',
                                    activeCategory === category
                                        ? 'bg-stone-900 text-white border-stone-900 shadow-lg shadow-stone-900/20'
                                        : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-900'
                                )}
                            >
                                {category}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="text-center py-12 text-stone-500">Loading featured projects...</div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-12 text-stone-500">
                        No featured projects yet. Check back soon!
                    </div>
                ) : (
                    <motion.div
                        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((job, index) => (
                                <motion.article
                                    key={job.id}
                                    className="group relative rounded-2xl overflow-hidden bg-stone-100 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 aspect-[4/5]"
                                    style={{ position: 'relative' }}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{
                                        duration: 0.5,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                        delay: index * 0.05
                                    }}
                                >
                                    <Link 
                                        to={`/jobs/${job.slug}`}
                                        className="absolute inset-0 z-20"
                                        aria-label={`View ${job.title}`}
                                    >
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

                                            {/* Expandable details on hover */}
                                            {job.description && (
                                                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                                                    <p className="text-sm text-stone-300 leading-relaxed mb-6 font-light line-clamp-2">
                                                        {job.description}
                                                    </p>
                                                </div>
                                            )}

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
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* CTA Box - Modern Industrial Design */}
                <motion.div
                    className="mt-20 p-8 sm:p-12 bg-stone-950 rounded-[2rem] relative overflow-hidden group"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/20 blur-[100px] rounded-full -mr-48 -mt-48 group-hover:bg-accent-500/30 transition-colors duration-700" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="max-w-xl text-center lg:text-left">
                            <h3 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
                                Ready to build something that lasts?
                            </h3>
                            <p className="text-stone-400 text-lg font-light">
                                We're currently booking for next month. Secure your spot in the schedule today.
                            </p>
                        </div>
                        <a
                            href="#contact"
                            className="inline-flex items-center justify-center px-10 py-5 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition-all duration-300 shadow-xl shadow-accent-500/20 whitespace-nowrap"
                        >
                            Start Your Estimate
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

