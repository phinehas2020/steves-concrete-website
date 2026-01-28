import { motion } from 'motion/react'
import { useInView } from 'motion/react'
import { useRef } from 'react'

const processSteps = [
    {
        number: '01',
        title: 'Site Prep & Excavation',
        description: 'We dig to proper depth, accounting for McLennan County\'s black clay soil that expands and contracts with seasonal moisture changes.',
    },
    {
        number: '02',
        title: 'Steel & Forms',
        description: 'Reinforcement goes in — rebar grid at proper spacing, forms leveled with laser precision for proper drainage.',
    },
    {
        number: '03',
        title: 'The Pour',
        description: '4,000 PSI concrete mixed for Texas heat, poured and worked quickly before the sun affects the finish.',
    },
    {
        number: '04',
        title: 'Stamp & Cure',
        description: 'Patterns pressed at exactly the right time, then controlled curing for 28 days to full strength.',
    },
]

function StepCard({ step, index }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
        >
            {/* Connector line */}
            {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-stone-700 to-transparent" />
            )}
            
            <div className="flex gap-5 items-start">
                <span className="font-display text-4xl font-bold text-accent-500/30 leading-none">
                    {step.number}
                </span>
                <div>
                    <h3 className="font-display font-semibold text-lg text-white mb-2">
                        {step.title}
                    </h3>
                    <p className="text-stone-400 text-sm leading-relaxed">
                        {step.description}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

export function Values() {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

    return (
        <section ref={sectionRef} className="section-padding bg-stone-900 texture-grain-dark relative overflow-hidden">
            {/* Subtle Waco skyline silhouette */}
            <div className="absolute bottom-0 left-0 right-0 h-32 opacity-5 pointer-events-none">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                    <path fill="currentColor" d="M0,120 L0,80 L40,80 L40,60 L80,60 L80,90 L120,90 L120,40 L160,40 L160,100 L200,100 L200,70 L240,70 L240,85 L280,85 L280,50 L320,50 L320,95 L360,95 L360,65 L400,65 L400,80 L440,80 L440,45 L480,45 L480,90 L520,90 L520,55 L560,55 L560,85 L600,85 L600,35 L640,35 L640,100 L680,100 L680,70 L720,70 L720,80 L760,80 L760,60 L800,60 L800,90 L840,90 L840,50 L880,50 L880,95 L920,95 L920,65 L960,65 L960,85 L1000,85 L1000,40 L1040,40 L1040,90 L1080,90 L1080,75 L1120,75 L1120,80 L1160,80 L1160,60 L1200,60 L1200,120 Z" />
                </svg>
            </div>

            <div className="container-main relative z-10">
                <div className="grid gap-12 lg:gap-20 lg:grid-cols-2 items-start">
                    {/* Left - Story */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        <span className="inline-block text-accent-400 font-semibold text-sm uppercase tracking-wide mb-4">
                            Since 2005
                        </span>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white text-balance mb-6">
                            Built on Black Clay Soil
                        </h2>
                        <div className="space-y-4 text-stone-300 leading-relaxed">
                            <p>
                                Steve started Concrete Works after seeing too many driveways crack within five years 
                                around Waco. The problem wasn't the concrete — it was the preparation. McLennan County's 
                                notorious black clay expands when wet and shrinks when dry, heaving anything built on it 
                                if you don't account for it.
                            </p>
                            <p>
                                Twenty years and 500+ projects later, we've refined a process that accounts for Central 
                                Texas soil, summer heat that hits 105°F, and freeze-thaw cycles that test every seam. 
                                We don't pour and pray. We engineer for where we live.
                            </p>
                            <p className="text-stone-400 text-sm">
                                — Steve Adams, Owner
                            </p>
                        </div>

                        {/* Local credentials */}
                        <div className="mt-8 pt-8 border-t border-stone-800 grid grid-cols-2 gap-6">
                            <div>
                                <div className="text-2xl font-display font-bold text-white">500+</div>
                                <div className="text-sm text-stone-500">Projects in Central Texas</div>
                            </div>
                            <div>
                                <div className="text-2xl font-display font-bold text-white">50 mi</div>
                                <div className="text-sm text-stone-500">Service Radius from Waco</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Process */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-8"
                        >
                            <span className="inline-block text-accent-400 font-semibold text-sm uppercase tracking-wide mb-2">
                                How We Work
                            </span>
                            <h3 className="font-display font-semibold text-xl text-white">
                                Four Phases. No Shortcuts.
                            </h3>
                        </motion.div>

                        <div className="space-y-8">
                            {processSteps.map((step, index) => (
                                <StepCard key={step.number} step={step} index={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
