import { useState } from 'react'
import { cn } from '../lib/utils'

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
                className="w-full h-full object-cover"
                loading="lazy"
            />
            {/* Category label */}
            <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 bg-white/90 text-stone-800 text-xs font-semibold rounded-full">
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
                <div className="text-center max-w-2xl mx-auto mb-10">
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
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                'px-5 py-2.5 rounded-full font-medium transition-colors duration-150 min-h-[44px]',
                                activeCategory === category
                                    ? 'bg-stone-900 text-white'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
                        <article
                            key={project.id}
                            className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100"
                        >
                            <ProjectImage project={project} />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/70 transition-colors duration-200">
                                <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <h3 className="font-display font-semibold text-xl text-white mb-1">
                                        {project.title}
                                    </h3>
                                    <p className="text-stone-300 text-sm">
                                        {project.description}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <p className="text-stone-600 mb-4">
                        Want to see more examples? Follow us on social media for our latest projects.
                    </p>
                    <a
                        href="#contact"
                        className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150 min-h-[52px]"
                    >
                        Start Your Project
                    </a>
                </div>
            </div>
        </section>
    )
}
