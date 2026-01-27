import { useState } from 'react'
import { cn } from '../lib/utils'

const categories = ['All', 'Driveways', 'Patios', 'Stamped', 'Commercial']

const projects = [
    {
        id: 1,
        title: 'Modern Stamped Driveway',
        category: 'Driveways',
        description: 'Custom ashlar slate pattern with charcoal color',
        image: 'driveway-1',
    },
    {
        id: 2,
        title: 'Backyard Patio Extension',
        category: 'Patios',
        description: 'Exposed aggregate with decorative border',
        image: 'patio-1',
    },
    {
        id: 3,
        title: 'Commercial Parking Lot',
        category: 'Commercial',
        description: 'Large-scale pour for retail complex',
        image: 'commercial-1',
    },
    {
        id: 4,
        title: 'Flagstone Pattern Patio',
        category: 'Stamped',
        description: 'Natural flagstone stamped design',
        image: 'stamped-1',
    },
    {
        id: 5,
        title: 'Circular Driveway',
        category: 'Driveways',
        description: 'Curved driveway with brick inlay border',
        image: 'driveway-2',
    },
    {
        id: 6,
        title: 'Pool Deck',
        category: 'Patios',
        description: 'Cool deck finish for poolside comfort',
        image: 'patio-2',
    },
]

// Placeholder image component - generates a concrete-themed pattern
function ProjectImage({ project }) {
    const colors = {
        Driveways: 'from-stone-400 to-stone-600',
        Patios: 'from-stone-300 to-stone-500',
        Stamped: 'from-amber-200 to-stone-400',
        Commercial: 'from-stone-500 to-stone-700',
    }

    return (
        <div
            className={cn(
                'absolute inset-0 bg-gradient-to-br',
                colors[project.category] || 'from-stone-400 to-stone-600'
            )}
        >
            {/* Texture overlay */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
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
