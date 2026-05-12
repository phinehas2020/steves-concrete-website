import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Truck,
  Umbrella,
  Palette,
  Home,
  Building2,
  Hammer,
  Layout,
  Shield,
  Layers,
  Construction,
  Scissors,
  Trophy,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'
import { seoServicePages } from '../data/seoServicePages'
import { Link } from 'react-router-dom'
import { getServicePreviewImage } from '../data/clientProjects'

const iconMap = {
  'concrete-driveways-waco-tx': Truck,
  'concrete-patios-waco-tx': Umbrella,
  'concrete-sidewalks-waco-tx': Home,
  'commercial-concrete-contractor-waco-tx': Building2,
  'residential-concrete-contractor-waco-tx': Home,
  'concrete-repair-waco-tx': Hammer,
  'foundation-repair-waco-tx': Hammer,
  'concrete-demolition-waco-tx': Construction,
  'concrete-sawing-waco-tx': Scissors,
  'stamped-concrete-waco-tx': Palette,
  'decorative-concrete-waco': Palette,
  'concrete-foundations-waco-tx': Layout,
  'concrete-parking-lots-waco-tx': Building2,
  'parking-lot-concrete-waco': Building2,
  'retaining-walls-waco-tx': Shield,
  'hardscaping-waco-tx': Layers,
  'concrete-deck-contractors': Home,
  'contractors-in-waco-tx': Shield,
  'general-contractor-waco-tx': Shield,
  'concrete-resurfacing-waco-tx': Layers,
  'sports-court-coating-waco-tx': Trophy,
}

const servicePriorityOrder = [
  'foundation-repair-waco-tx',
  'concrete-demolition-waco-tx',
  'concrete-sawing-waco-tx',
  'parking-lot-concrete-waco',
  'concrete-driveways-waco-tx',
  'concrete-patios-waco-tx',
  'retaining-walls-waco-tx',
  'decorative-concrete-waco',
  'hardscaping-waco-tx',
  'concrete-deck-contractors',
  'contractors-in-waco-tx',
]

const servicePriorityMap = Object.fromEntries(
  servicePriorityOrder.map((slug, index) => [slug, index]),
)

export function Services() {
  const [showAll, setShowAll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const activeServices = seoServicePages
    .filter((service) => !service.redirectTo)
    .sort((a, b) => {
      const aPriority = servicePriorityMap[a.slug] ?? Number.MAX_SAFE_INTEGER
      const bPriority = servicePriorityMap[b.slug] ?? Number.MAX_SAFE_INTEGER
      if (aPriority !== bPriority) return aPriority - bPriority
      return a.title.localeCompare(b.title)
    })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const initialCount = isMobile ? 1 : 3
  const visibleServices = showAll ? activeServices : activeServices.slice(0, initialCount)
  const hasMore = activeServices.length > initialCount

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
            Professional Concrete Services in Waco, TX
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-stone-600 text-pretty"
          >
            From residential driveways to commercial slabs, we bring 20+ years of Waco-area
            concrete experience to every project. We plan for Central Texas soil movement,
            drainage, and heat so your concrete performs long after install.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleServices.map((service, index) => {
              const Icon = iconMap[service.slug] || Layout
              const previewImage = getServicePreviewImage(service.slug)
              return (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                  className="group overflow-hidden bg-stone-50 rounded-2xl border border-stone-100 hover:border-accent-500/30 hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 flex flex-col"
                >
                  {previewImage ? (
                    <div className="relative h-44 overflow-hidden bg-stone-200">
                      <img
                        src={previewImage}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-stone-950/10 to-transparent" />
                      <div className="absolute bottom-4 left-4 size-12 bg-white/95 rounded-xl flex items-center justify-center text-stone-900 shadow-sm group-hover:bg-accent-500 group-hover:text-white transition-colors duration-300">
                        <Icon className="size-6" />
                      </div>
                    </div>
                  ) : (
                    <div className="px-8 pt-8">
                      <div className="size-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-accent-500 group-hover:text-white transition-colors duration-300">
                        <Icon className="size-7" />
                      </div>
                    </div>
                  )}
                  <div className="p-8 flex flex-1 flex-col">
                    <h3 className="font-display font-bold text-xl text-stone-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-1">
                      {service.cardSummary}
                    </p>
                    <Link
                      to={`/${service.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-stone-900 hover:text-accent-600 transition-colors"
                    >
                      Learn More
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
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
