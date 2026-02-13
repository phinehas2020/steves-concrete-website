import { motion } from 'motion/react'
import { Quote, Star } from 'lucide-react'
import { fadeInUp, viewportConfig } from '../lib/animations'

const testimonials = [
    {
        quote: 'Concrete Works is professional, very conscientious and did the job at a really fair price. The driveway still looks perfect three years later.',
        author: 'Tim T.',
        location: 'Sanger Heights, Waco',
        project: 'Stamped driveway',
        rating: 5,
    },
    {
        quote: 'They transformed our backyard with a beautiful stamped patio. The attention to detail was incredible — they even matched the color to our house trim.',
        author: 'Sarah M.',
        location: 'Downtown Temple',
        project: 'Backyard patio',
        rating: 5,
    },
    {
        quote: 'On time, on budget, and the results exceeded our expectations. Steve explained the whole process and why they do things certain ways. Highly recommend.',
        author: 'Robert J.',
        location: 'Hewitt (Waco area)',
        project: 'Circular driveway',
        rating: 5,
    },
]

export function Testimonials() {
    return (
        <section id="about" className="section-padding bg-white texture-grain-light relative">
            <div className="container-main relative z-10">
                {/* Section Header */}
                <motion.div
                    className="max-w-2xl mb-10 md:mb-14"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                        Client Reviews
                    </span>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-4">
                        What Central Texas Homeowners Say
                    </h2>
                    <p className="text-lg text-stone-600 text-pretty">
                        Real reviews from real projects across Waco, Temple, Killeen, and surrounding areas.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            className="p-6 bg-stone-50 rounded-xl border border-stone-100"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="size-4 fill-accent-500 text-accent-500"
                                        aria-hidden="true"
                                    />
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="relative mb-6">
                                <Quote
                                    className="absolute -top-1 -left-1 size-6 text-stone-200"
                                    aria-hidden="true"
                                />
                                <p className="text-stone-700 text-pretty leading-relaxed pl-5 text-sm">
                                    "{testimonial.quote}"
                                </p>
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 bg-stone-200 rounded-full flex items-center justify-center">
                                        <span className="font-semibold text-sm text-stone-600">
                                            {testimonial.author.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-stone-900 text-sm">
                                            {testimonial.author}
                                        </div>
                                        <div className="text-xs text-stone-500">
                                            {testimonial.location}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded">
                                    {testimonial.project}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats row */}
                <motion.div
                    className="mt-12 pt-8 border-t border-stone-200"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <div className="text-center">
                            <div className="text-3xl font-display font-bold text-stone-900">5.0</div>
                            <div className="flex justify-center gap-0.5 mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="size-4 fill-accent-500 text-accent-500" />
                                ))}
                            </div>
                            <div className="text-sm text-stone-500 mt-1">Average Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-display font-bold text-stone-900">47+</div>
                            <div className="text-sm text-stone-500 mt-1">Verified Reviews</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-display font-bold text-stone-900">20+</div>
                            <div className="text-sm text-stone-500 mt-1">Years in Business</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
