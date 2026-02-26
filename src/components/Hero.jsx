import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react'
import { ArrowRight, Phone } from 'lucide-react'
import heroImage from '../assets/images/hero.jpeg'
import { heroStagger, staggerItem, viewportEager } from '../lib/animations'
import { supabase } from '../lib/supabase'
import { buildSupabaseImageSrcSet, getSupabaseOptimizedImageUrl } from '../lib/utils'

const topLocationLinks = [
    { label: 'Woodway', href: '/woodway-tx-concrete-contractor' },
    { label: 'Hewitt', href: '/hewitt-tx-concrete-contractor' },
    { label: 'Temple', href: '/temple-tx-concrete-contractor' },
    { label: 'Killeen', href: '/killeen-tx-concrete-contractor' },
]

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
    const [currentHeroImage, setCurrentHeroImage] = useState(null)
    const [heroImageReady, setHeroImageReady] = useState(false)

    useEffect(() => {
        let isMounted = true

        const fetchHeroImage = async () => {
            const prefersReducedData =
                typeof navigator !== 'undefined' && navigator.connection?.saveData

            if (prefersReducedData) {
                setHeroImageReady(true)
                return
            }

            try {
                const { data, error } = await supabase
                    .from('hero_images')
                    .select('id, image_url, alt_text')
                    .eq('active', true)
                    .order('display_order', { ascending: true })
                    .limit(1)

                if (!isMounted) return

                if (error) {
                    console.error('Error fetching hero image:', error)
                    setCurrentHeroImage(null)
                } else {
                    setCurrentHeroImage((data && data[0]) || null)
                }
            } catch (error) {
                if (!isMounted) return
                console.error('Error fetching hero image:', error)
                setCurrentHeroImage(null)
            } finally {
                if (isMounted) {
                    setHeroImageReady(true)
                }
            }
        }

        fetchHeroImage()

        return () => {
            isMounted = false
        }
    }, [])

    const remoteImageUrl = currentHeroImage?.image_url
    const imageSrc = remoteImageUrl
        ? getSupabaseOptimizedImageUrl(remoteImageUrl, { width: 1600, quality: 68, format: 'webp' })
        : heroImage
    const imageSrcSet = remoteImageUrl
        ? buildSupabaseImageSrcSet(remoteImageUrl, [480, 768, 1024, 1280, 1600], {
            quality: 68,
            format: 'webp',
        })
        : undefined
    const imageAlt = currentHeroImage?.alt_text || "Stamped concrete driveway project in Waco, Texas"

    return (
        <section
            id="home"
            className="relative min-h-dvh flex items-center pt-20 overflow-hidden bg-stone-900 texture-grain-dark"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                {heroImageReady && (
                    <img
                        src={imageSrc}
                        srcSet={imageSrcSet}
                        sizes="100vw"
                        alt={imageAlt}
                        width="1600"
                        height="900"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        style={{ minHeight: '100vh', minWidth: '100%' }}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                    />
                )}
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
                            Serving Waco, Temple & McLennan County Since 2005
                        </span>
                    </motion.div>

                    {/* Headline - GSC keyword-aligned: concrete contractor waco tx */}
                    <motion.h1
                        className="font-display font-bold text-white text-balance leading-tight mb-6"
                        style={{ fontSize: 'clamp(2.25rem, 1.5rem + 4vw, 4.5rem)' }}
                        variants={staggerItem}
                    >
                        Concrete Contractors
                        <span className="block text-accent-400">in Waco, TX</span>
                        <span className="block text-lg sm:text-xl font-medium text-stone-400 mt-2">
                            Licensed &amp; Insured · 20+ Years
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        className="text-lg sm:text-xl text-stone-300 text-pretty max-w-xl mb-8 leading-relaxed"
                        variants={staggerItem}
                    >
                        <span className="sm:hidden">500+ projects across Central Texas. Built for black clay soil, heat, and long-term durability.</span>
                        <span className="hidden sm:inline">
                          Concrete Works LLC has completed 500+ projects in Waco, TX since 2005. We build concrete driveways,
                          concrete patios, and more for homeowners who want durable results from
                          concrete contractors Waco TX with experience in black clay soil movement and long Texas heat cycles.
                          If you are looking for reliable concrete companies Waco TX, we are ready to help.
                        </span>
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

                    <motion.div
                        className="mt-6 flex flex-wrap items-center gap-2"
                        variants={staggerItem}
                    >
                        <span className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                            City pages:
                        </span>
                        {topLocationLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="inline-flex items-center rounded-full border border-stone-600/80 px-3 py-1.5 text-xs font-semibold text-stone-200 hover:border-stone-400 hover:text-white transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
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
