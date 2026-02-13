import { motion } from 'motion/react'
import { DollarSign, ArrowRight } from 'lucide-react'
import { fadeInUp, viewportConfig } from '../lib/animations'
const quickAnswers = [
  {
    question: 'How much does a concrete driveway cost in Waco?',
    answer: 'Standard driveways typically run $6–12/sq ft; stamped $12–18/sq ft.',
    href: '/guides/concrete-driveway-cost-waco-tx',
  },
  {
    question: 'How much does a patio cost?',
    answer: 'Standard patios $6–12/sq ft; stamped or stained $12–18/sq ft.',
    href: '/guides/concrete-patio-cost-waco-tx',
  },
  {
    question: 'How much does stamped concrete cost?',
    answer: 'Typically $12–18 per square foot depending on pattern and color.',
    href: '/guides/stamped-concrete-cost-waco-tx',
  },
  {
    question: 'Do you offer free estimates?',
    answer: 'Yes. Call (254) 230-3102 for a free, no-obligation site visit and quote.',
    href: 'tel:254-230-3102',
    isPhone: true,
  },
]

export function CostQuickAnswers() {
  return (
    <section className="section-padding bg-stone-50 border-y border-stone-200">
      <div className="container-main">
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <div>
            <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-2">
              Quick Answers
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900">
              How much does concrete cost in Waco?
            </h2>
          </div>
          <a
            href="/guides"
            className="inline-flex items-center gap-2 text-accent-600 font-semibold hover:text-accent-700 transition-colors"
          >
            View all pricing guides
            <ArrowRight className="size-4" />
          </a>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {quickAnswers.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              className="flex gap-4 p-4 sm:p-5 bg-white rounded-xl border border-stone-200 hover:border-accent-300 hover:shadow-md transition-all group"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              transition={{ delay: index * 0.05 }}
            >
              <div className="size-10 flex-shrink-0 bg-accent-100 text-accent-600 rounded-lg flex items-center justify-center group-hover:bg-accent-500 group-hover:text-white transition-colors">
                <DollarSign className="size-5" aria-hidden="true" />
              </div>
              <div>
                <div className="font-display font-semibold text-stone-900 text-sm sm:text-base group-hover:text-accent-600 transition-colors">
                  {item.question}
                </div>
                <p className="text-sm text-stone-600 mt-1">{item.answer}</p>
              </div>
              <ArrowRight className="size-4 text-stone-400 flex-shrink-0 self-center ml-auto group-hover:text-accent-500 group-hover:translate-x-1 transition-all" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
