import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react'
import { ArrowRight, Phone } from 'lucide-react'
import heroImage from '../assets/images/hero.jpeg'
import { heroStagger, staggerItem, viewportEager } from '../lib/animations'

// Animated counter component
function AnimatedStat({ value, suffix = '', label }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.5 })
    const count = useMotionValue(0)
    const rounded = useTransform(count, (latest) => Math.round(latest))
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, value, {
                duration: 2,
                ease: [0.25, 0.46, 0.45, 0.94]
            })

            const unsubscribe = rounded.on('change', (latest) => {
                setDisplayValue(latest)
            })

            return () => {
                controls.stop()
                unsubscribe()
            }
        }
    }, [isInView, value, count, rounded])

    return (
        <div ref={ref} className="text-center sm:text-left">
            <div className="font-display font-bold text-2xl sm:text-3xl text-white tabular-nums">
                {displayValue}{suffix}
            </div>
            <div className="text-xs sm:text-sm text-stone-400">{label}</div>
        </div>
    )
}

export function Hero() {
    return (
        <section
            id="home"
            className="relative min-h-dvh flex items-center pt-20 overflow-hidden bg-stone-900 texture-grain-dark"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={heroImage}
                    alt="Stamped concrete driveway project in Waco, Texas"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ minHeight: '100vh', minWidth: '100%' }}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-900/75 via-stone-900/70 to-stone-900/55" />
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Gradient Mesh Overlay for depth */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(ellipse 80% 50% at 20% 40%, rgba(251, 146, 60, 0.08), transparent 70%),
                        radial-gradient(ellipse 60% 60% at 80% 20%, rgba(251, 146, 60, 0.05), transparent 60%)
                    `
                }}
            />

            {/* Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-accent-500" />

            <div className="container-main relative z-10 py-20 sm:py-24 md:py-6">
                <motion.div
                    className="max-w-3xl"
                    variants={heroStagger}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-stone-800/80 backdrop-blur-sm rounded-full mb-4 sm:mb-6"
                        variants={staggerItem}
                    >
                        <motion.span
                            className="size-2 bg-accent-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <span className="text-xs sm:text-sm font-medium text-stone-300">
                            Serving Central Texas Since 2005
                        </span>
                    </motion.div>

                    {/* Headline - Fluid Typography */}
                    <motion.h1
                        className="font-display font-bold text-white text-balance leading-tight mb-6"
                        style={{ fontSize: 'clamp(2.25rem, 1.5rem + 4vw, 4.5rem)' }}
                        variants={staggerItem}
                    >
                        Waco's Trusted
                        <span className="block text-accent-400">Concrete Contractor</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        className="text-lg sm:text-xl text-stone-300 text-pretty max-w-xl mb-8 leading-relaxed"
                        variants={staggerItem}
                    >
                        <span className="sm:hidden">500+ projects across Central Texas. Stamped driveways, decorative patios, and commercial concrete.</span>
                        <span className="hidden sm:inline">Concrete Works LLC has completed 500+ projects across Central Texas since 2005. We specialize in stamped driveways, decorative patios, and commercial concrete.</span>
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        variants={staggerItem}
                    >
                        <motion.a
                            href="#contact"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150 min-h-[52px] text-lg"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Get Free Estimate
                            <ArrowRight className="size-5" aria-hidden="true" />
                        </motion.a>
                        <motion.a
                            href="tel:254-230-3102"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-stone-600 text-white font-semibold rounded-lg hover:bg-stone-800 hover:border-stone-500 transition-colors duration-150 min-h-[52px] text-lg"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Phone className="size-5" aria-hidden="true" />
                            (254) 230-3102
                        </motion.a>
                    </motion.div>

                    {/* Trust Indicators - Animated Count Up */}
                    <motion.div
                        className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-stone-700"
                        variants={staggerItem}
                    >
                        <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12">
                            <AnimatedStat value={20} suffix="+" label="Years Experience" />
                            <AnimatedStat value={500} suffix="+" label="Projects Completed" />
                            <AnimatedStat value={100} suffix="%" label="Customer Satisfaction" />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
