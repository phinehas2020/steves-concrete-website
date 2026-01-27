import { Quote, Star } from 'lucide-react'

const testimonials = [
    {
        quote: 'Concrete Works is professional, very conscientious and did the job at a really fair price.',
        author: 'Tim T.',
        location: 'Waco, TX',
        rating: 5,
    },
    {
        quote: 'They transformed our backyard with a beautiful stamped patio. The attention to detail was incredible.',
        author: 'Sarah M.',
        location: 'Temple, TX',
        rating: 5,
    },
    {
        quote: 'On time, on budget, and the results exceeded our expectations. Highly recommend for any concrete project.',
        author: 'Robert J.',
        location: 'Killeen, TX',
        rating: 5,
    },
]

export function Testimonials() {
    return (
        <section id="about" className="section-padding bg-stone-50">
            <div className="container-main">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                    <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                        Testimonials
                    </span>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-4">
                        What Our Clients Say
                    </h2>
                    <p className="text-lg text-stone-600 text-pretty">
                        Don't just take our word for it—hear from homeowners and businesses
                        across Central Texas.
                    </p>
                </div>

                {/* Testimonials Grid - Mobile stacking */}
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="p-6 md:p-8 bg-white rounded-xl shadow-sm"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="size-5 fill-accent-500 text-accent-500"
                                        aria-hidden="true"
                                    />
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="relative mb-6">
                                <Quote
                                    className="absolute -top-2 -left-2 size-8 text-stone-200"
                                    aria-hidden="true"
                                />
                                <p className="text-stone-700 text-pretty leading-relaxed pl-6">
                                    "{testimonial.quote}"
                                </p>
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-stone-200 rounded-full flex items-center justify-center">
                                    <span className="font-semibold text-stone-600">
                                        {testimonial.author.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-semibold text-stone-900">
                                        {testimonial.author}
                                    </div>
                                    <div className="text-sm text-stone-500">
                                        {testimonial.location}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
