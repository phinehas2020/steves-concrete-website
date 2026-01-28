import { motion } from 'motion/react'
import { Layers, Palette, Home, Building2, Wrench, Truck } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem, viewportConfig } from '../lib/animations'

const services = [
    {
        icon: Palette,
        title: 'Decorative Concrete',
        description: 'Decorative concrete includes stamped patterns, exposed aggregate, and integral coloring. These finishes cost 20-40% less than natural stone while matching its appearance.',
    },
    {
        icon: Home,
        title: 'Driveways & Patios',
        description: 'A concrete driveway in Central Texas typically lasts 25-30 years with proper installation. We use 4,000 PSI concrete with fiber reinforcement for maximum durability.',
    },
    {
        icon: Layers,
        title: 'Stamped Concrete',
        description: 'Stamped concrete replicates stone, brick, or tile at 30-50% lower cost. Popular patterns include ashlar slate, cobblestone, and European fan for driveways and patios.',
    },
    {
        icon: Building2,
        title: 'Commercial Projects',
        description: 'Commercial concrete projects include parking lots, warehouse floors, and loading docks. We handle pours from 1,000 to 50,000+ square feet.',
    },
    {
        icon: Wrench,
        title: 'Concrete Repair',
        description: 'Concrete repair addresses cracks, spalling, and surface damage. Early repair prevents water infiltration that causes further deterioration in Texas freeze-thaw cycles.',
    },
    {
        icon: Truck,
        title: 'Foundations',
        description: 'Foundation work for residential and commercial structures follows Texas building codes. We provide slab-on-grade, pier and beam, and post-tension foundation installation.',
    },
]

export function Services() {
    return (
        <section id="services" className="section-padding bg-white texture-grain-light">
            <div className="container-main">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-8 md:mb-16"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                        What We Do
                    </span>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-4">
                        Professional Concrete Services
                    </h2>
                    <p className="hidden md:block text-lg text-stone-600 text-pretty">
                        From residential projects to commercial applications, we handle
                        all types of concrete work with precision and care.
                    </p>
                </motion.div>

                {/* MOBILE: Condensed paragraph summary */}
                <motion.div
                    className="md:hidden"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <div className="bg-stone-50 rounded-xl p-6">
                        <p className="text-stone-700 text-pretty leading-relaxed">
                            We specialize in driveways, patios, stamped concrete, decorative finishes, commercial projects, foundations, and repairs. Serving Central Texas for 20+ years, we use 4,000 PSI fiber-reinforced concrete for durability that holds up 25-30 years.
                        </p>
                    </div>
                </motion.div>

                {/* DESKTOP: Full Services Grid - Staggered Animation */}
                <motion.div
                    className="hidden md:grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    {services.map((service) => (
                        <motion.div
                            key={service.title}
                            className="group p-6 md:p-8 bg-stone-50 rounded-xl cursor-pointer"
                            variants={staggerItem}
                            whileHover={{
                                y: -6,
                                backgroundColor: '#f5f5f4',
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                                transition: { duration: 0.3, ease: 'easeOut' }
                            }}
                        >
                            <motion.div
                                className="size-12 flex items-center justify-center bg-accent-500/10 text-accent-600 rounded-lg mb-4 group-hover:bg-accent-500 group-hover:text-white transition-colors duration-150"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <service.icon className="size-6" aria-hidden="true" />
                            </motion.div>
                            <h3 className="font-display font-semibold text-xl text-stone-900 mb-2">
                                {service.title}
                            </h3>
                            <p className="text-stone-600 text-pretty leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Desktop CTA */}
                <motion.div
                    className="hidden md:block text-center mt-12"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <motion.a
                        href="#contact"
                        className="inline-flex items-center justify-center px-8 py-4 bg-stone-900 text-white font-semibold rounded-lg hover:bg-stone-800 transition-colors duration-150 min-h-[52px]"
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Discuss Your Project
                    </motion.a>
                </motion.div>
            </div>
        </section>
    )
}
