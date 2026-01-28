import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/utils'
import { fadeInUp, staggerContainer, staggerItem, viewportConfig, galleryCardHover } from '../lib/animations'

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
        title: 'Modern Stamped Driveway',
        category: 'Driveways',
        description: 'Custom ashlar slate pattern with charcoal color',
        image: stampedDrivewayImg,
        featured: true, // First item will be larger
    },
    {
        id: 2,
        title: 'Backyard Patio Extension',
        category: 'Patios',
        description: 'Exposed aggregate with decorative border',
        image: patioAggregateImg,
    },
    {
        id: 3,
        title: 'Commercial Parking Lot',
        category: 'Commercial',
        description: 'Large-scale pour for retail complex',
        image: commercialParkingImg,
    },
    {
        id: 4,
        title: 'Flagstone Pattern Patio',
        category: 'Stamped',
        description: 'Natural flagstone stamped design',
        image: flagstonePatioImg,
    },
    {
        id: 5,
        title: 'Circular Driveway',
        category: 'Driveways',
        description: 'Curved driveway with brick inlay border',
        image: circularDrivewayImg,
    },
    {
        id: 6,
        title: 'Pool Deck',
        category: 'Patios',
        description: 'Cool deck finish for poolside comfort',
        image: poolDeckImg,
    },
]

// Project image component - displays actual project photos
function ProjectImage({ project }) {
    return (
        <div className="absolute inset-0">
            <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
            />
            {/* Category label */}
            <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-semibold rounded-full shadow-sm">
                    {project.category}
                </span>
            </div>
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
        <section id="gallery" className="section-padding bg-white">
            <div className="container-main">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-10"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                        Our Work
                    </span>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-4">
                        Project Gallery
                    </h2>
                    <p className="text-lg text-stone-600 text-pretty">
                        Browse our recent projects to see the quality and craftsmanship
                        we bring to every job.
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
                    <div className="flex sm:flex-wrap sm:justify-center gap-2 overflow-x-auto sm:overflow-visible scroll-hide-bar pb-2 sm:pb-0">
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    'px-4 sm:px-5 py-2.5 rounded-full font-medium transition-colors duration-150 whitespace-nowrap flex-shrink-0',
                                    activeCategory === category
                                        ? 'bg-stone-900 text-white'
                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                )}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Projects Grid - Masonry-style with AnimatePresence */}
                <motion.div
                    className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    layout
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, index) => (
                            <motion.article
                                key={project.id}
                                className={cn(
                                    "group relative rounded-xl overflow-hidden bg-stone-100 cursor-pointer",
                                    // Featured item (first) spans 2 columns on desktop
                                    index === 0 && activeCategory === 'All'
                                        ? "lg:col-span-2 aspect-[16/9]"
                                        : "aspect-[4/3]"
                                )}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                    delay: index * 0.05
                                }}
                                whileHover={{
                                    y: -8,
                                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <ProjectImage project={project} />

                                {/* Hover Overlay with slide-up animation */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                                        <motion.h3
                                            className="font-display font-semibold text-xl text-white mb-1"
                                            initial={{ y: 20, opacity: 0 }}
                                            whileHover={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.3, delay: 0.05 }}
                                        >
                                            {project.title}
                                        </motion.h3>
                                        <motion.p
                                            className="text-stone-300 text-sm"
                                            initial={{ y: 20, opacity: 0 }}
                                            whileHover={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                        >
                                            {project.description}
                                        </motion.p>
                                    </div>
                                </motion.div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="text-center mt-12"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <p className="text-stone-600 mb-4">
                        Want to see more examples? Follow us on social media for our latest projects.
                    </p>
                    <motion.a
                        href="#contact"
                        className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150 min-h-[52px]"
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Start Your Project
                    </motion.a>
                </motion.div>
            </div>
        </section>
    )
}

