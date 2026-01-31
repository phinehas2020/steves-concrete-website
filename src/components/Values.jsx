import { motion, useInView, useScroll, useTransform } from 'motion/react'
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
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="group relative p-6 bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl hover:border-accent-500/30 transition-all duration-500"
        >
            <div className="flex gap-6 items-start">
                <span className="font-display text-5xl font-black text-white/5 leading-none group-hover:text-accent-500/20 transition-colors duration-500">
                    {step.number}
                </span>
                <div>
                    <h3 className="font-display font-bold text-lg text-white mb-2 tracking-tight group-hover:text-accent-400 transition-colors">
                        {step.title}
                    </h3>
                    <p className="text-stone-400 text-sm leading-relaxed font-light">
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
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    })

    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

    return (
        <section ref={sectionRef} className="section-padding bg-stone-950 texture-grain-dark relative overflow-hidden">
            {/* Background Decorative Element */}
            <motion.div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ y: bgY }}
            >
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-500/30 blur-[150px] rounded-full -mr-96 -mt-96" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-stone-500/20 blur-[120px] rounded-full -ml-48 -mb-48" />
            </motion.div>

            {/* Subtle Waco skyline silhouette */}
            <div className="absolute bottom-0 left-0 right-0 h-48 opacity-[0.03] pointer-events-none">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                    <path fill="currentColor" className="text-white" d="M0,120 L0,80 L40,80 L40,60 L80,60 L80,90 L120,90 L120,40 L160,40 L160,100 L200,100 L200,70 L240,70 L240,85 L280,85 L280,50 L320,50 L320,95 L360,95 L360,65 L400,65 L400,80 L440,80 L440,45 L480,45 L480,90 L520,90 L520,55 L560,55 L560,85 L600,85 L600,35 L640,35 L640,100 L680,100 L680,70 L720,70 L720,80 L760,80 L760,60 L800,60 L800,90 L840,90 L840,50 L880,50 L880,95 L920,95 L920,65 L960,65 L960,85 L1000,85 L1000,40 L1040,40 L1040,90 L1080,90 L1080,75 L1120,75 L1120,80 L1160,80 L1160,60 L1200,60 L1200,120 Z" />
                </svg>
            </div>

            <div className="container-main relative z-10">
                <div className="grid gap-16 lg:gap-24 lg:grid-cols-2 items-center">
                    {/* Left - Story */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        <span className="inline-block text-accent-500 font-bold text-xs uppercase tracking-[0.2em] mb-6">
                            Est. 2005 / Waco, TX
                        </span>
                        <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white text-balance mb-8 leading-[1.05]">
                            Built to Outlast the <span className="text-stone-500 italic">Black Clay</span>
                        </h2>
                        <div className="space-y-6 text-stone-400 text-lg leading-relaxed font-light">
                            <p>
                                Stephen started Concrete Works after seeing too many driveways crack within five years 
                                around Waco. The problem wasn't the concrete — it was the preparation. McLennan County's 
                                notorious black clay expands when wet and shrinks when dry, heaving anything built on it 
                                if you don't account for it.
                            </p>
                            <p>
                                Twenty years and 500+ projects later, we've refined a process that accounts for Central 
                                Texas soil, summer heat that hits 105°F, and freeze-thaw cycles that test every seam. 
                                We don't pour and pray. We engineer for where we live.
                            </p>
                        </div>

                        {/* Founder Quote */}
                        <div className="mt-10 pl-6 border-l-2 border-accent-500/30">
                            <p className="text-stone-300 italic text-lg mb-2">
                                "If it cracks in five years, I didn't do my job. That's how I see it."
                            </p>
                            <p className="text-accent-400 text-sm font-bold uppercase tracking-widest">
                                — Stephen Alexander, Owner
                            </p>
                        </div>
                    </motion.div>

                    {/* Right - Process */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-10"
                        >
                            <h3 className="font-display font-bold text-2xl text-white mb-4">
                                The Master Plan
                            </h3>
                            <div className="h-1 w-20 bg-accent-500" />
                        </motion.div>

                        <div className="grid gap-4">
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

