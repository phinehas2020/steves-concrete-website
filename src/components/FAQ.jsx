import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'
import { fadeInUp, viewportConfig } from '../lib/animations'

const faqs = [
    {
        question: 'How much does a concrete driveway cost in the Waco area?',
        answer: 'Standard concrete runs $6-12 per square foot. Stamped or decorative finishes are $12-18 per square foot. A typical two-car driveway (600 sq ft) runs $3,600-$10,800 depending on finish, site prep needs, and access. We provide free, detailed estimates — no surprises.',
    },
    {
        question: 'Why does concrete crack in Central Texas?',
        answer: 'Two main reasons: our black clay soil expands when wet and shrinks when dry, putting stress on the slab; and summer heat causes rapid curing if not managed. We prevent this with proper base prep, control joints cut at the right spacing, and curing compounds that slow moisture loss.',
    },
    {
        question: 'How long before I can drive on my new driveway?',
        answer: 'Light foot traffic in 24 hours. Vehicles should stay off for 7 days. Full cure strength takes 28 days, but by day 7 the concrete has reached about 70% strength — enough for normal vehicle use. We\'ll give you specific guidance based on your mix and weather conditions.',
    },
    {
        question: 'What areas do you serve?',
        answer: 'We work within approximately 50 miles of Waco, including Temple, Killeen, Hewitt, Woodway, Robinson, Lorena, McGregor, and surrounding communities in McLennan, Bell, and Coryell counties.',
    },
    {
        question: 'What\'s the difference between stamped and regular concrete?',
        answer: 'Stamped concrete has patterns pressed into the surface while it\'s still wet — replicating stone, brick, or slate. It costs 30-50% less than natural stone but requires sealing every 2-3 years. Regular broom-finished concrete is more utilitarian, lower cost, and needs less maintenance.',
    },
    {
        question: 'Do you offer warranties?',
        answer: 'We stand behind our work. Structural issues due to our installation are covered for 2 years. Cracking from soil movement — which no contractor can fully control in this area — isn\'t covered, but we design our joints and reinforcement to minimize it. We\'ll explain exactly what to expect before we start.',
    },
]

function FAQItem({ question, answer, isOpen, onClick }) {
    return (
        <div className="border-b border-stone-200 last:border-b-0">
            <button
                onClick={onClick}
                className="w-full py-5 flex items-center justify-between text-left min-h-[60px] group"
                aria-expanded={isOpen}
            >
                <span className="font-display font-semibold text-lg text-stone-900 pr-4 group-hover:text-accent-600 transition-colors text-left">
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown
                        className="size-5 text-stone-400 flex-shrink-0"
                        aria-hidden="true"
                    />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="text-stone-600 leading-relaxed text-pretty pb-5">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export function FAQ() {
    const [openIndex, setOpenIndex] = useState(0)

    return (
        <section id="faq" className="section-padding bg-stone-50">
            <div className="container-main">
                <div className="max-w-3xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        className="mb-10"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                    >
                        <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                            Questions & Answers
                        </span>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-4">
                            Straight Talk About Concrete
                        </h2>
                        <p className="text-lg text-stone-600 text-pretty">
                            No sales pitch — just honest answers about concrete work in Central Texas, 
                            based on 20+ years of dealing with our soil and climate.
                        </p>
                    </motion.div>

                    {/* FAQ List */}
                    <motion.div
                        className="bg-white rounded-xl shadow-sm p-6 md:p-8"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                    >
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                            />
                        ))}
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        className="mt-10 bg-stone-900 rounded-xl p-6 md:p-8 text-center"
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                    >
                        <h3 className="font-display font-semibold text-xl text-white mb-2">
                            Have a specific question?
                        </h3>
                        <p className="text-stone-400 mb-6">
                            Every project is different. Call Stephen directly for honest advice about your situation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:254-230-3102"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
                            >
                                Call (254) 230-3102
                            </a>
                            <a
                                href="#contact"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-stone-600 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
                            >
                                Send a Message
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
