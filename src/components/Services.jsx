import { useState } from 'react'
import { motion } from 'motion/react'
import { Palette, Home, Layers, Building2, Wrench, Truck } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem, viewportConfig } from '../lib/animations'

const services = [
    {
        icon: Palette,
        title: 'Stamped & Decorative',
        description: 'Ashlar slate, cobblestone, flagstone patterns pressed into fresh concrete. We color with integral hardeners that won\'t fade in the Texas sun like surface stains do.',
        detail: 'Most popular in Woodway and Hewitt neighborhoods',
    },
    {
        icon: Home,
        title: 'Driveways & Patios',
        description: '4,000 PSI concrete with fiber mesh reinforcement. We cut control joints every 10-12 feet to control cracking — the black clay soil here moves, we plan for it.',
        detail: '25-30 year lifespan with proper maintenance',
    },
    {
        icon: Layers,
        title: 'Exposed Aggregate',
        description: 'River rock or pea gravel finishes that stay cooler in summer and provide slip resistance around pools. The aggregate we use is sourced from Central Texas quarries.',
        detail: 'Ideal for pool decks and sloped areas',
    },
    {
        icon: Building2,
        title: 'Commercial Work',
        description: 'Parking lots, warehouse floors, loading docks. We\'ve poured up to 50,000 sq ft in single phases. Proper joint layout prevents the cracking you see in big-box parking lots.',
        detail: 'Serving Waco, Temple, and Killeen businesses',
    },
    {
        icon: Wrench,
        title: 'Repair & Resurfacing',
        description: 'Crack repair, spall patching, and Kool Deck overlays. We fix what other contractors got wrong — usually improper base prep or insufficient reinforcement.',
        detail: 'Free assessment of repair needs',
    },
    {
        icon: Truck,
        title: 'Foundations',
        description: 'Slab-on-grade and post-tension foundations built to Texas Residential Construction Commission standards. Critical in this area due to expansive clay soils.',
        detail: 'Engineered for McLennan County soil conditions',
    },
]

export function Services() {
    const [showAll, setShowAll] = useState(false)
    const visibleServices = showAll ? services : services.slice(0, 3)

    return (
        <section id="services" className="section-padding bg-white">
            <div className="container-main">
                {/* Section Header */}
                <motion.div
                    className="max-w-2xl mb-8 md:mb-12"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                        What We Do
                    </span>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-4">
                        Concrete Built for Central Texas
                    </h2>
                    <p className="text-lg text-stone-600 text-pretty">
                        We know the soil here — the black clay that swells when wet, the caliche layers 
                        that surprise you two feet down. Every spec we use accounts for where we pour.
                    </p>
                </motion.div>

                {/* MOBILE: Condensed paragraph summary */}
                <motion.div
                    className="md:hidden mb-8"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <div className="bg-stone-50 rounded-xl p-6 border-l-4 border-accent-500">
                        <p className="text-stone-700 text-pretty leading-relaxed">
                            Driveways, patios, stamped concrete, and commercial work. We use 4,000 PSI 
                            fiber-reinforced concrete, cut joints for our expansive soil, and don't take 
                            shortcuts on base prep. 20+ years working in McLennan County and surrounding areas.
                        </p>
                    </div>
                </motion.div>

                {/* DESKTOP: Full Services Grid */}
                <motion.div
                    className="hidden md:grid gap-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    {visibleServices.map((service) => (
                        <motion.div
                            key={service.title}
                            className="group p-6 bg-stone-50 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors"
                            variants={staggerItem}
                        >
                            <div className="flex items-start gap-4">
                                <div className="size-12 flex items-center justify-center bg-accent-500/10 text-accent-600 rounded-lg flex-shrink-0 group-hover:bg-accent-500 group-hover:text-white transition-colors duration-200">
                                    <service.icon className="size-6" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="font-display font-semibold text-lg text-stone-900 mb-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-stone-600 text-sm leading-relaxed mb-3">
                                        {service.description}
                                    </p>
                                    <p className="text-xs text-accent-600 font-medium">
                                        {service.detail}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Desktop actions */}
                <motion.div
                    className="hidden md:flex items-center gap-4 mt-8"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <button
                        type="button"
                        onClick={() => setShowAll((prev) => !prev)}
                        className="inline-flex items-center justify-center px-5 py-2.5 border border-stone-300 text-stone-700 font-medium rounded-lg hover:border-stone-400 hover:text-stone-900 transition-colors duration-150"
                        aria-expanded={showAll}
                    >
                        {showAll ? 'Show fewer services' : 'View all services'}
                    </button>
                    <a
                        href="#contact"
                        className="inline-flex items-center justify-center px-6 py-3 bg-stone-900 text-white font-semibold rounded-lg hover:bg-stone-800 transition-colors duration-150"
                    >
                        Get an Estimate
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
