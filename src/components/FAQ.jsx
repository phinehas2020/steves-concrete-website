import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

const faqs = [
    {
        question: 'How much does a concrete driveway cost in Waco, Texas?',
        answer: 'Concrete driveway costs in Waco typically range from $6-$12 per square foot for standard finishes, and $12-$18 per square foot for stamped or decorative concrete. A typical two-car driveway (400-600 sq ft) costs $2,400-$10,800 depending on finish and site preparation needs. We provide free estimates for accurate pricing on your specific project.',
    },
    {
        question: 'How long does concrete take to cure in Texas heat?',
        answer: 'In Texas summer heat, concrete reaches initial set within 4-8 hours but requires 7 days before light use and 28 days for full cure strength. We adjust our mix designs and curing methods for Texas temperatures to ensure proper hydration and prevent cracking.',
    },
    {
        question: 'What areas does Concrete Works LLC serve?',
        answer: 'Concrete Works LLC serves Waco and the surrounding Central Texas area, including Temple, Killeen, Hewitt, Woodway, Robinson, Lorena, McGregor, and nearby communities within approximately 50 miles of Waco.',
    },
    {
        question: 'What is stamped concrete?',
        answer: 'Stamped concrete is a decorative concrete finish where patterns are pressed into freshly poured concrete to replicate the look of stone, brick, slate, or tile. It costs 30-50% less than natural stone while providing the same durability as standard concrete. Popular patterns include ashlar slate, cobblestone, and flagstone.',
    },
    {
        question: 'Do you offer free estimates?',
        answer: 'Yes, Concrete Works LLC provides free, no-obligation estimates for all concrete projects in the Waco and Central Texas area. Call (254) 230-3102 or fill out our contact form to schedule your free estimate.',
    },
    {
        question: 'How long will my concrete driveway or patio last?',
        answer: 'A properly installed and maintained concrete driveway or patio in Central Texas typically lasts 25-30 years or more. Factors affecting longevity include proper base preparation, correct mix design, control joint placement, and regular sealing every 2-3 years.',
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
                <span className="font-display font-semibold text-lg text-stone-900 pr-4 group-hover:text-accent-600 transition-colors">
                    {question}
                </span>
                <ChevronDown
                    className={cn(
                        'size-5 text-stone-400 flex-shrink-0 transition-transform duration-200',
                        isOpen && 'rotate-180'
                    )}
                    aria-hidden="true"
                />
            </button>
            <div
                className={cn(
                    'overflow-hidden transition-all duration-200',
                    isOpen ? 'max-h-96 pb-5' : 'max-h-0'
                )}
            >
                <p className="text-stone-600 leading-relaxed text-pretty">
                    {answer}
                </p>
            </div>
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
                    <div className="text-center mb-10">
                        <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                            Common Questions
                        </span>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-stone-600 text-pretty">
                            Get answers to common questions about concrete work in Central Texas.
                        </p>
                    </div>

                    {/* FAQ List */}
                    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                            />
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-10">
                        <p className="text-stone-600 mb-4">
                            Have a question we didn't answer?
                        </p>
                        <a
                            href="#contact"
                            className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150 min-h-[52px]"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
