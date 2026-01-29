import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/utils'
import { fadeInUp, viewportConfig } from '../lib/animations'
import { Calendar, Ruler, MapPin } from 'lucide-react'

// Import gallery images
import stampedDrivewayImg from '../assets/images/gallery-stamped-driveway.png'
import patioAggregateImg from '../assets/images/gallery-patio-aggregate.png'
import commercialParkingImg from '../assets/images/gallery-commercial-parking.png'
import flagstonePatioImg from '../assets/images/gallery-flagstone-patio.png'
import circularDrivewayImg from '../assets/images/gallery-circular-driveway.png'
import poolDeckImg from '../assets/images/gallery-pool-deck.png'

const categories = ['All', 'Driveways', 'Patios', 'Stamped', 'Commercial']

const projects = [
    {
        id: 1,
        title: 'Ashlar Slate Driveway',
        category: 'Driveways',
        location: 'Woodway, TX',
        description: 'Charcoal-colored ashlar slate pattern with custom border. Homeowner wanted the look of natural stone without the maintenance.',
        image: stampedDrivewayImg,
        specs: { sqft: 680, mix: '4,000 PSI', date: 'Oct 2024' },
        featured: true,
    },
    {
        id: 2,
        title: 'Exposed Aggregate Patio',
        category: 'Patios',
        location: 'Hewitt, TX',
        description: 'Backyard extension with river rock exposed finish. Designed to match existing landscaping and provide slip resistance.',
        image: patioAggregateImg,
        specs: { sqft: 420, mix: '4,500 PSI', date: 'Sep 2024' },
    },
    {
        id: 3,
        title: 'Retail Parking Lot',
        category: 'Commercial',
        location: 'Waco, TX',
        description: '15,000 sq ft pour for a retail complex off Loop 340. Included proper drainage grading and ADA-compliant markings.',
        image: commercialParkingImg,
        specs: { sqft: 15200, mix: '5,000 PSI', date: 'Aug 2024' },
    },
    {
        id: 4,
        title: 'Flagstone Pattern Patio',
        category: 'Stamped',
        location: 'Lorena, TX',
        description: 'Random flagstone stamp with earth-tone color hardener. Client hosts outdoor gatherings — needed durability and aesthetics.',
        image: flagstonePatioImg,
        specs: { sqft: 540, mix: '4,000 PSI', date: 'Jul 2024' },
    },
    {
        id: 5,
        title: 'Circular Driveway',
        category: 'Driveways',
        location: 'Temple, TX',
        description: 'Curved entry with brick-pattern inlay border. Challenging grade required additional excavation for proper water runoff.',
        image: circularDrivewayImg,
        specs: { sqft: 890, mix: '4,000 PSI', date: 'Jun 2024' },
    },
    {
        id: 6,
        title: 'Pool Deck Resurface',
        category: 'Patios',
        location: 'McGregor, TX',
        description: 'Kool Deck overlay on existing concrete. Texas sun means pool decks need to stay cool under bare feet.',
        image: poolDeckImg,
        specs: { sqft: 380, mix: 'Overlay', date: 'May 2024' },
    },
]

// Project image component - displays actual project photos
function ProjectImage({ project }) {
    return (
        <div className="absolute inset-0">
            <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
            />
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        </div>
    )
}

export function Gallery() {
    const [activeCategory, setActiveCategory] = useState('All')

    const filteredProjects =
        activeCategory === 'All'
            ? projects
            : projects.filter((p) => p.category === activeCategory)

    return (
        <section id="gallery" className="section-padding bg-stone-50 texture-concrete relative">
            <div className="container-main relative z-10">
                {/* Section Header */}
                <motion.div
                    className="max-w-2xl mb-10"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                        Recent Work
                    </span>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-4">
                        Projects Across Central Texas
                    </h2>
                    <p className="text-lg text-stone-600 text-pretty">
                        Real jobs, real specs, real results. Every pour has its own challenges — 
                        black clay soil, summer heat, drainage grades. Here's how we handle them.
                    </p>
                </motion.div>

                {/* Filter Tabs - Horizontal scroll on mobile */}
                <motion.div
                    className="-mx-4 px-4 sm:mx-0 sm:px-0 mb-8 sm:mb-10"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <div className="flex sm:flex-wrap gap-2 overflow-x-auto sm:overflow-visible scroll-hide-bar pb-2 sm:pb-0">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    'px-4 sm:px-5 py-2.5 rounded-full font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0',
                                    activeCategory === category
                                        ? 'bg-stone-900 text-white'
                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                )}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                    className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    layout
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, index) => (
                            <motion.article
                                key={project.id}
                                className={cn(
                                    "group relative rounded-xl overflow-hidden bg-white shadow-sm cursor-pointer",
                                    index === 0 && activeCategory === 'All'
                                        ? "lg:col-span-2 aspect-[16/9]"
                                        : "aspect-[4/3]"
                                )}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                    delay: index * 0.05
                                }}
                            >
                                <ProjectImage project={project} />

                                {/* Always-visible overlay with basic info */}
                                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-semibold rounded-full">
                                            {project.category}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-white/80">
                                            <MapPin className="size-3" />
                                            {project.location}
                                        </span>
                                    </div>
                                    
                                    <h3 className="font-display font-semibold text-lg sm:text-xl text-white mb-1">
                                        {project.title}
                                    </h3>
                                    
                                    {/* Specs row */}
                                    <div className="flex items-center gap-4 text-xs text-white/70 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Ruler className="size-3" />
                                            {project.specs.sqft.toLocaleString()} sq ft
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="size-3" />
                                            {project.specs.date}
                                        </span>
                                    </div>

                                    {/* Description - visible on hover/larger screens */}
                                    <p className="text-sm text-white/80 leading-relaxed hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {project.description}
                                    </p>
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="mt-12 pt-8 border-t border-stone-200"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <p className="text-stone-600">
                            Have a project in mind? We typically respond within 4 hours.
                        </p>
                        <a
                            href="#contact"
                            className="inline-flex items-center justify-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150"
                        >
                            Discuss Your Project
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
