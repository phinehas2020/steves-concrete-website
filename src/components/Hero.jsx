import { ArrowRight, Phone } from 'lucide-react'

export function Hero() {
    return (
        <section
            id="home"
            className="relative min-h-dvh flex items-center pt-20 overflow-hidden bg-stone-900"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-accent-500" />

            <div className="container-main relative z-10 py-16 md:py-24">
                <div className="max-w-3xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 rounded-full mb-6">
                        <span className="size-2 bg-accent-500 rounded-full" />
                        <span className="text-sm font-medium text-stone-300">
                            Serving Central Texas Since 2005
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white text-balance leading-tight mb-6">
                        Quality Concrete
                        <span className="block text-accent-400">Built to Last</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-stone-300 text-pretty max-w-xl mb-8 leading-relaxed">
                        From decorative driveways to commercial foundations, we bring
                        20+ years of experience to every project in the Waco area.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href="#contact"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150 min-h-[52px] text-lg"
                        >
                            Get Free Estimate
                            <ArrowRight className="size-5" aria-hidden="true" />
                        </a>
                        <a
                            href="tel:254-230-3102"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-stone-600 text-white font-semibold rounded-lg hover:bg-stone-800 hover:border-stone-500 transition-colors duration-150 min-h-[52px] text-lg"
                        >
                            <Phone className="size-5" aria-hidden="true" />
                            (254) 230-3102
                        </a>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-12 pt-8 border-t border-stone-700">
                        <div className="flex flex-wrap gap-8 md:gap-12">
                            <div>
                                <div className="font-display font-bold text-3xl text-white">20+</div>
                                <div className="text-sm text-stone-400">Years Experience</div>
                            </div>
                            <div>
                                <div className="font-display font-bold text-3xl text-white">500+</div>
                                <div className="text-sm text-stone-400">Projects Completed</div>
                            </div>
                            <div>
                                <div className="font-display font-bold text-3xl text-white">100%</div>
                                <div className="text-sm text-stone-400">Customer Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
