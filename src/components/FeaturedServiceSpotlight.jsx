import { Link } from 'react-router-dom'
import { ArrowRight, Layers, Trophy } from 'lucide-react'

const featuredServices = [
  {
    slug: 'concrete-resurfacing-waco-tx',
    title: 'Concrete Resurfacing',
    tag: 'High-Value Upgrade',
    icon: Layers,
    description:
      'Refresh worn driveways, patios, and walkways without full replacement. Ideal when the slab is structurally sound but the surface looks tired.',
    bullets: [
      'Overlay and skim systems for faded or pitted surfaces',
      'Decorative texture and color refresh options',
      'Lower disruption compared with full tear-out',
    ],
    cta: 'Explore resurfacing service',
  },
  {
    slug: 'sports-court-coating-waco-tx',
    title: 'Sports Court Coating',
    tag: 'Specialty Service',
    icon: Trophy,
    description:
      'Acrylic coating, crack prep, and game-line striping for pickleball, tennis, and basketball courts built for Texas heat and UV exposure.',
    bullets: [
      'Pickleball, tennis, and basketball court resurfacing',
      'Traction-focused color coating systems',
      'Precision line striping for clean play zones',
    ],
    cta: 'Explore court coating service',
  },
]

export function FeaturedServiceSpotlight() {
  return (
    <section className="relative overflow-hidden bg-stone-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 15% 20%, rgba(249, 115, 22, 0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(251, 146, 60, 0.18), transparent 40%), linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.6))',
        }}
      />
      <div className="container-main relative z-10 py-14 sm:py-16">
        <div className="max-w-3xl mb-10">
          <p className="text-xs uppercase tracking-[0.24em] font-bold text-accent-300 mb-4">
            Featured Services
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-balance">
            Fast-Growth Concrete Services Clients Ask For First
          </h2>
          <p className="mt-4 text-stone-300 text-lg text-pretty">
            These two pages are now front-and-center so visitors immediately see your most strategic services.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {featuredServices.map((service) => {
            const Icon = service.icon
            return (
              <article
                key={service.slug}
                className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] p-7 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent-400/60 hover:bg-white/[0.09]"
              >
                <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-3xl bg-gradient-to-br from-accent-400/30 to-transparent" />
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-200">
                  {service.tag}
                </span>
                <div className="mt-5 flex items-start gap-4">
                  <div className="size-12 shrink-0 rounded-xl bg-accent-500/15 border border-accent-400/30 flex items-center justify-center text-accent-300">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-2xl text-white text-balance">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-stone-300 text-pretty leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
                <ul className="mt-6 space-y-2.5">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm text-stone-200">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-400" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/${service.slug}`}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl border border-accent-400/60 bg-accent-500/20 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-500/35"
                >
                  {service.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
