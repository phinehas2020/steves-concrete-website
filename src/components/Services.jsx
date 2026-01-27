import { Layers, Palette, Home, Building2, Wrench, Truck } from 'lucide-react'

const services = [
    {
        icon: Palette,
        title: 'Decorative Concrete',
        description: 'Custom stamped patterns, exposed aggregate, and colored concrete to enhance your property\'s curb appeal.',
    },
    {
        icon: Home,
        title: 'Driveways & Patios',
        description: 'Durable, professionally finished surfaces built to withstand Texas weather and heavy use.',
    },
    {
        icon: Layers,
        title: 'Stamped Concrete',
        description: 'Replicate the look of stone, brick, or tile at a fraction of the cost with our stamped finishes.',
    },
    {
        icon: Building2,
        title: 'Commercial Projects',
        description: 'Large-scale concrete work for businesses, parking lots, and industrial applications.',
    },
    {
        icon: Wrench,
        title: 'Concrete Repair',
        description: 'Fix cracks, spalling, and damage to extend the life of your existing concrete surfaces.',
    },
    {
        icon: Truck,
        title: 'Foundations',
        description: 'Solid foundation work for residential and commercial structures built to code.',
    },
]

export function Services() {
    return (
        <section id="services" className="section-padding bg-white">
            <div className="container-main">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                    <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                        What We Do
                    </span>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-4">
                        Professional Concrete Services
                    </h2>
                    <p className="text-lg text-stone-600 text-pretty">
                        From residential projects to commercial applications, we handle
                        all types of concrete work with precision and care.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="group p-6 md:p-8 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors duration-150"
                        >
                            <div className="size-12 flex items-center justify-center bg-accent-500/10 text-accent-600 rounded-lg mb-4 group-hover:bg-accent-500 group-hover:text-white transition-colors duration-150">
                                <service.icon className="size-6" aria-hidden="true" />
                            </div>
                            <h3 className="font-display font-semibold text-xl text-stone-900 mb-2">
                                {service.title}
                            </h3>
                            <p className="text-stone-600 text-pretty leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <a
                        href="#contact"
                        className="inline-flex items-center justify-center px-8 py-4 bg-stone-900 text-white font-semibold rounded-lg hover:bg-stone-800 transition-colors duration-150 min-h-[52px]"
                    >
                        Discuss Your Project
                    </a>
                </div>
            </div>
        </section>
    )
}
