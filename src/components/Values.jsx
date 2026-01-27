import { Clock, Sparkles, TrendingUp } from 'lucide-react'

const values = [
    {
        icon: Clock,
        title: 'Long-Term Quality',
        description: 'By its nature, concrete is going to be there a long time. We have the experience to ensure it looks good—for a long time.',
    },
    {
        icon: Sparkles,
        title: 'Beauty',
        description: 'We are experienced in decorative concrete with unlimited options to custom design different concrete finishes.',
    },
    {
        icon: TrendingUp,
        title: 'Value',
        description: 'We strive to maximize your project so it brings the most appreciation to your property.',
    },
]

export function Values() {
    return (
        <section className="section-padding bg-stone-900 text-white">
            <div className="container-main">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                    <span className="inline-block text-accent-400 font-semibold text-sm uppercase tracking-wide mb-3">
                        What Guides Us
                    </span>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-balance mb-4">
                        Our Commitment to Excellence
                    </h2>
                    <p className="text-lg text-stone-300 text-pretty">
                        Every project is built on these core principles that have guided
                        us for over two decades.
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid gap-8 md:grid-cols-3">
                    {values.map((value, index) => (
                        <div key={value.title} className="text-center">
                            <div className="inline-flex items-center justify-center size-16 bg-stone-800 rounded-2xl mb-6">
                                <value.icon className="size-8 text-accent-400" aria-hidden="true" />
                            </div>
                            <h3 className="font-display font-semibold text-2xl mb-3">
                                {value.title}
                            </h3>
                            <p className="text-stone-300 text-pretty leading-relaxed max-w-sm mx-auto">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
