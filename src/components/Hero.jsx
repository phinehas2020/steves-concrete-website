import { useEffect, useRef, useState } from 'react'
import { motion as Motion, useInView, useMotionValue, useTransform, animate } from 'motion/react'
import { ArrowRight, Phone } from 'lucide-react'
import { heroStagger, staggerItem } from '../lib/animations'
import { getOptimizedImageUrl, getResponsiveImageSrcSet } from '../lib/imageOptimization'

// Static hero image served from public/ — browser can discover this immediately
// via <link rel="preload"> in index.html, bypassing the JS→React→Supabase waterfall.
const STATIC_HERO_SRC = '/hero.webp'

const topLocationLinks = [
    { label: 'Woodway', href: '/woodway-tx-concrete-contractor' },
    { label: 'Hewitt', href: '/hewitt-tx-concrete-contractor' },
    { label: 'Temple', href: '/temple-tx-concrete-contractor' },
    { label: 'Killeen', href: '/killeen-tx-concrete-contractor' },
]

const featuredServiceLinks = [
    { label: 'Foundation Repair', href: '/foundation-repair-waco-tx' },
    { label: 'Parking Lot Concrete', href: '/parking-lot-concrete-waco' },
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
    const [heroImages, setHeroImages] = useState([])
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [rotationEnabled, setRotationEnabled] = useState(false)

    // Fetch hero images from Supabase — non-blocking, swaps in after initial paint
    useEffect(() => {
        const fetchHeroImages = async () => {
            try {
                const { supabase } = await import('../lib/supabase')
                const { data, error } = await supabase
                    .from('hero_images')
                    .select('*')
                    .eq('active', true)
                    .order('display_order', { ascending: true })

                if (error) {
                    console.error('Error fetching hero images:', error)
                    setHeroImages([])
                } else if (data && data.length > 0) {
                    setHeroImages(data)
                } else {
                    setHeroImages([])
                }
            } catch (error) {
                console.error('Error fetching hero images:', error)
                setHeroImages([])
            }
        }

        fetchHeroImages()
    }, [])

    // Start rotation only after initial load and idle time.
    useEffect(() => {
        if (heroImages.length <= 1 || typeof window === 'undefined') return undefined

        let cancelled = false
        let timeoutId
        let idleCallbackId

        const enableRotation = () => {
            if (!cancelled) setRotationEnabled(true)
        }

        const scheduleEnable = () => {
            if ('requestIdleCallback' in window) {
                idleCallbackId = window.requestIdleCallback(() => {
                    timeoutId = window.setTimeout(enableRotation, 1800)
                }, { timeout: 3000 })
                return
            }
            timeoutId = window.setTimeout(enableRotation, 2200)
        }

        if (document.readyState === 'complete') {
            scheduleEnable()
        } else {
            window.addEventListener('load', scheduleEnable, { once: true })
        }

        return () => {
            cancelled = true
            if (timeoutId) window.clearTimeout(timeoutId)
            if (idleCallbackId && 'cancelIdleCallback' in window) {
                window.cancelIdleCallback(idleCallbackId)
            }
            window.removeEventListener('load', scheduleEnable)
        }
    }, [heroImages.length])

    useEffect(() => {
        if (!rotationEnabled || heroImages.length <= 1) return undefined

        const intervalId = window.setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
        }, 7000)

        return () => window.clearInterval(intervalId)
    }, [rotationEnabled, heroImages.length])

    useEffect(() => {
        if (!rotationEnabled || heroImages.length <= 1 || typeof window === 'undefined') return

        const nextIndex = (currentImageIndex + 1) % heroImages.length
        const nextImage = heroImages[nextIndex]
        if (!nextImage?.image_url) return

        const preloaded = new window.Image()
        preloaded.src = getOptimizedImageUrl(nextImage.image_url, {
            width: 1600,
            quality: 72,
        })
    }, [rotationEnabled, currentImageIndex, heroImages])

    // Determine which image to display:
    // Start with the static hero image (preloaded in HTML, no waterfall).
    // Once Supabase data arrives, swap to the dynamic image.
    const hasSupabaseImages = heroImages.length > 0
    const safeCurrentImageIndex = hasSupabaseImages ? currentImageIndex % heroImages.length : 0
    const currentImage = hasSupabaseImages ? heroImages[safeCurrentImageIndex] : null

    let imageSrc, imageSrcSet
    if (currentImage?.image_url) {
        const rawImageSrc = currentImage.image_url
        imageSrc = getOptimizedImageUrl(rawImageSrc, { width: 1600, quality: 72 })
        imageSrcSet = getResponsiveImageSrcSet(rawImageSrc, [640, 960, 1280, 1600], { quality: 72 })
    } else {
        imageSrc = STATIC_HERO_SRC
        imageSrcSet = undefined
    }
    const imageAlt = currentImage?.alt_text || "Stamped concrete driveway project in Waco, Texas"

    return (
        <section
            id="home"
            className="relative min-h-dvh flex items-center pt-20 overflow-hidden bg-stone-900 texture-grain-dark"
        >
            {/* Background Image — static src renders immediately, Supabase swaps in later */}
            <div className="absolute inset-0">
                <img
                    key={hasSupabaseImages ? imageSrc : 'static-hero'}
                    src={imageSrc}
                    srcSet={imageSrcSet || undefined}
                    sizes="100vw"
                    alt={imageAlt}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ minHeight: '100vh', minWidth: '100%' }}
                    width={1600}
                    height={1066}
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
                <Motion.div
                    className="max-w-3xl"
                    variants={heroStagger}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Badge */}
                    <Motion.div
                        className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-stone-800/80 backdrop-blur-sm rounded-full mb-4 sm:mb-6"
                        variants={staggerItem}
                    >
                        <Motion.span
                            className="size-2 bg-accent-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <span className="text-xs sm:text-sm font-medium text-stone-300">
                            Serving Waco, Temple & McLennan County Since 2005
                        </span>
                    </Motion.div>

                    {/* Headline - GSC keyword-aligned: concrete contractor waco tx */}
                    <Motion.h1
                        className="font-display font-bold text-white text-balance leading-tight mb-6"
                        style={{ fontSize: 'clamp(2.25rem, 1.5rem + 4vw, 4.5rem)' }}
                        variants={staggerItem}
                    >
                        Concrete Contractors
                        <span className="block text-accent-400">in Waco, TX</span>
                        <span className="block text-lg sm:text-xl font-medium text-stone-400 mt-2">
                            Licensed &amp; Insured · 20+ Years
                        </span>
                    </Motion.h1>

                    {/* Subheadline */}
                    <Motion.p
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
                    </Motion.p>

                    {/* CTAs */}
                    <Motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        variants={staggerItem}
                    >
                        <Motion.a
                            href="#contact"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150 min-h-[52px] text-lg"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Get Free Estimate
                            <ArrowRight className="size-5" aria-hidden="true" />
                        </Motion.a>
                        <Motion.a
                            href="tel:254-230-3102"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-stone-600 text-white font-semibold rounded-lg hover:bg-stone-800 hover:border-stone-500 transition-colors duration-150 min-h-[52px] text-lg"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Phone className="size-5" aria-hidden="true" />
                            (254) 230-3102
                        </Motion.a>
                    </Motion.div>

                    <Motion.div
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
                    </Motion.div>

                    <Motion.div
                        className="mt-4 flex flex-wrap items-center gap-2"
                        variants={staggerItem}
                    >
                        <span className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                            Featured services:
                        </span>
                        {featuredServiceLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="inline-flex items-center rounded-full border border-white/70 bg-white px-3 py-1.5 text-xs font-bold text-stone-900 shadow-sm hover:border-accent-400 hover:bg-accent-500 hover:text-white transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </Motion.div>

                    {/* Trust Indicators - Animated Count Up */}
                    <Motion.div
                        className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-stone-700"
                        variants={staggerItem}
                    >
                        <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12">
                            <AnimatedStat value={20} suffix="+" label="Years Experience" />
                            <AnimatedStat value={500} suffix="+" label="Projects Completed" />
                            <AnimatedStat value={100} suffix="%" label="Customer Satisfaction" />
                        </div>
                    </Motion.div>
                </Motion.div>
            </div>
        </section>
    )
}
