import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
    Truck,
    Umbrella,
    Palette,
    Building2,
    Hammer,
    Layout,
    Shield,
    ArrowRight,
    ChevronDown
} from 'lucide-react'
import { servicePages } from '../data/servicePages'
import { Link } from 'react-router-dom'

const iconMap = {
    'concrete-driveways': Truck,
    'concrete-patios': Umbrella,
    'stamped-concrete': Palette,
    'commercial-concrete': Building2,
    'concrete-repair': Hammer,
    'concrete-foundations': Layout,
    'concrete-slabs': Layout,
    'stained-concrete': Palette,
    'concrete-sealing': Shield,
    'concrete-leveling': Hammer,
}

export function Services() {
    const [showAll, setShowAll] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768) // md breakpoint
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const initialCount = isMobile ? 1 : 3
    const visibleServices = showAll ? servicePages : servicePages.slice(0, initialCount)
    const hasMore = servicePages.length > initialCount

    return (
        <section id="services" className="section-padding bg-white texture-grain-light">
            <div className="container-main">
                <div className="max-w-3xl mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wider mb-4"
                    >
                        Our Expertise
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 mb-6"
                    >
                        Professional Concrete Services
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-stone-600 text-pretty"
                    >
                        From residential driveways to commercial slabs, we bring 20+ years of
                        Waco-area concrete experience to every pour. We plan for Central Texas
                        soil movement, drainage, and heat so your slab performs long after install.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {visibleServices.map((service, index) => {
                            const Icon = iconMap[service.slug] || Layout
                            return (
                                <motion.div
                                    key={service.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.1 }}
                                    layout
                                    className="group p-8 bg-stone-50 rounded-2xl border border-stone-100 hover:border-accent-500/30 hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 flex flex-col"
                                >
                                    <div className="size-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-accent-500 group-hover:text-white transition-colors duration-300">
                                        <Icon className="size-7" />
                                    </div>
                                    <h3 className="font-display font-bold text-xl text-stone-900 mb-3">
                                        {service.title}
                                    </h3>
                                    <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-1">
                                        {service.intro}
                                    </p>
                                    <Link
                                        to={`/services/${service.slug}`}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-stone-900 hover:text-accent-600 transition-colors"
                                    >
                                        Learn More
                                        <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                {/* See More Button */}
                {hasMore && (
                    <motion.div
                        className="flex justify-center mt-10"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-100 text-stone-700 font-semibold rounded-xl hover:bg-stone-200 transition-colors duration-200"
                        >
                            {showAll ? 'Show Less' : 'See More Services'}
                            <ChevronDown className={`size-5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
