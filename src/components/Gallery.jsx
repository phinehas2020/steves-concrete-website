import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/utils'
import { fadeInUp, viewportConfig } from '../lib/animations'
import { Calendar, Ruler, MapPin, ArrowUpRight } from 'lucide-react'

// Import gallery images
import stampedDrivewayImg from '../assets/images/gallery-stamped-driveway.png'
import patioAggregateImg from '../assets/images/gallery-patio-aggregate.png'
import commercialParkingImg from '../assets/images/gallery-commercial-parking.png'
import flagstonePatioImg from '../assets/images/gallery-flagstone-patio.png'
import circularDrivewayImg from '../assets/images/gallery-circular-driveway.png'
import poolDeckImg from '../assets/images/gallery-pool-deck.png'

// New user-provided images
import drivewayCustomImg from '../assets/images/gallery-driveway-custom.jpeg'
import patioCustomImg from '../assets/images/gallery-patio-custom.jpeg'
import parkingCustomImg from '../assets/images/gallery-parking-custom.jpeg'

const categories = ['All', 'Driveways', 'Patios', 'Stamped', 'Commercial']

const projects = [
    {
        id: 1,
        title: 'Custom Concrete Driveway',
        category: 'Driveways',
        location: 'Woodway, TX',
        description: 'High-quality custom concrete driveway designed for durability and curb appeal. A perfect blend of functionality and modern aesthetics.',
        image: drivewayCustomImg,
        specs: { sqft: 680, mix: '4,000 PSI', date: 'Oct 2024' },
        featured: true,
    },
    {
        id: 2,
        title: 'Exposed Aggregate Patio',
        category: 'Patios',
        location: 'Hewitt, TX',
        description: 'Backyard extension with river rock exposed finish. Designed to match existing landscaping and provide slip resistance.',
        image: patioCustomImg,
        specs: { sqft: 420, mix: '4,500 PSI', date: 'Sep 2024' },
    },
    {
        id: 3,
        title: 'Retail Parking Lot',
        category: 'Commercial',
        location: 'Waco, TX',
        description: '15,000 sq ft pour for a retail complex off Loop 340. Included proper drainage grading and ADA-compliant markings.',
        image: parkingCustomImg,
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
        <div className="absolute inset-0 z-0">
            <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
            />
            {/* Multi-layered overlay for depth and legibility */}
            <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-stone-950/40 transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-90" />
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
                        <p className="text-xl text-stone-600 text-pretty font-light leading-relaxed">
                            Every project is a testament to our commitment to durability.
                            From expansive commercial slabs to intricate stamped patios.
                        </p>
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
                <motion.div
                    className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    layout
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, index) => (
                            <motion.article
                                key={project.id}
                                className={cn(
                                    "group relative rounded-2xl overflow-hidden bg-stone-100 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500",
                                    index === 0 && activeCategory === 'All'
                                        ? "lg:col-span-2 lg:row-span-2 aspect-[16/10] lg:aspect-[16/12]"
                                        : "aspect-[4/5]"
                                )}
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
                                <ProjectImage project={project} />

                                {/* Content Overlay */}
                                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-8">
                                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-3 py-1 bg-accent-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                {project.category}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-white/90">
                                                <MapPin className="size-3.5 text-accent-400" />
                                                {project.location}
                                            </span>
                                        </div>

                                        <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
                                            {project.title}
                                        </h3>

                                        {/* Expandable details on hover */}
                                        <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                                            <p className="text-sm text-stone-300 leading-relaxed mb-6 font-light line-clamp-2">
                                                {project.description}
                                            </p>

                                            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">
                                                <span className="flex items-center gap-2">
                                                    <Ruler className="size-4 text-accent-500" />
                                                    {project.specs.sqft.toLocaleString()} SQ FT
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="size-4 text-accent-500" />
                                                    {project.specs.date}
                                                </span>
                                            </div>
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
                    </AnimatePresence>
                </motion.div>

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

