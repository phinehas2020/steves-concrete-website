import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react'
import { ArrowRight, Phone } from 'lucide-react'
import heroImage from '../assets/images/hero.png'

// Animated counter component - slower, more deliberate
function AnimatedStat({ value, suffix = '', label }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.5 })
    const count = useMotionValue(0)
    const rounded = useTransform(count, (latest) => Math.round(latest))
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, value, {
                duration: 2.5,
                ease: [0.25, 0.1, 0.25, 1] // Slower, heavier ease
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
            className="relative min-h-dvh flex items-center pt-20 overflow-hidden bg-stone-900"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={heroImage}
                    alt="Stamped concrete driveway project in Waco, Texas"
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/90 to-stone-900/60" />
            </div>

            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='30' cy='70' r='1.5'/%3E%3Ccircle cx='80' cy='40' r='1'/%3E%3Ccircle cx='60' cy='90' r='1'/%3E%3Ccircle cx='90' cy='20' r='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-500" />

            <div className="container-main relative z-10 py-20 sm:py-24 md:py-28">
                <motion.div
                    className="max-w-3xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-stone-800/80 backdrop-blur-sm rounded-full mb-4 sm:mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <span className="size-2 bg-accent-500 rounded-full" />
                        <span className="text-xs sm:text-sm font-medium text-stone-300">
                            Serving Central Texas Since 2005
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        className="font-display font-bold text-white text-balance leading-tight mb-6"
                        style={{ fontSize: 'clamp(2.25rem, 1.5rem + 4vw, 4.5rem)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        Waco's Trusted
                        <span className="block text-accent-400">Concrete Contractor</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        className="text-lg sm:text-xl text-stone-300 text-pretty max-w-xl mb-8 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        500+ projects across McLennan County and surrounding areas. 
                        We specialize in stamped driveways, decorative patios, and commercial concrete 
                        built to handle Texas heat and black clay soil.
                    </motion.p>

                    {/* CTAs - simpler hover states */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        <a
                            href="#contact"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-200 min-h-[52px] text-lg"
                        >
                            Get Free Estimate
                            <ArrowRight className="size-5" aria-hidden="true" />
                        </a>
                        <a
                            href="tel:254-230-3102"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-stone-600 text-white font-semibold rounded-lg hover:bg-stone-800 hover:border-stone-500 transition-colors duration-200 min-h-[52px] text-lg"
                        >
                            <Phone className="size-5" aria-hidden="true" />
                            (254) 230-3102
                        </a>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-stone-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
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
