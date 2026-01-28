import { InteriorHeader } from '../components/InteriorHeader'
import { Footer } from '../components/Footer'
import { Contact } from '../components/Contact'
import { useSeo, SITE_URL, DEFAULT_IMAGE } from '../lib/seo'

export function ServiceLanding({ page }) {
  const { slug, title, heroTitle, heroSubtitle, intro, benefits, process, finishes } = page

  const description = `${title} in Waco and Central Texas. Free estimates from Concrete Works LLC.`

  useSeo({
    title: `${title} | Concrete Works LLC`,
    description,
    canonical: `${SITE_URL}/services/${slug}`,
    url: `${SITE_URL}/services/${slug}`,
    image: DEFAULT_IMAGE,
    imageAlt: `${title} in Central Texas`,
    type: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: title,
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Central Texas',
      },
      provider: {
        '@type': 'LocalBusiness',
        name: 'Concrete Works LLC',
        url: SITE_URL,
        telephone: '+1-254-230-3102',
      },
    },
  })

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <InteriorHeader />
      <main className="flex-1">
        <section className="bg-white">
          <div className="container-main py-14 sm:py-18 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold uppercase tracking-wide">
                  Service Detail
                </span>
                <h1 className="mt-5 font-display font-bold text-stone-900 text-balance leading-tight" style={{ fontSize: 'clamp(2.25rem, 1.5rem + 4vw, 3.75rem)' }}>
                  {heroTitle}
                </h1>
                <p className="mt-5 text-lg text-stone-600 text-pretty max-w-2xl">
                  {heroSubtitle}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150 min-h-[52px]"
                  >
                    Request Estimate
                  </a>
                  <a
                    href="tel:254-230-3102"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-stone-300 text-stone-800 font-semibold rounded-lg hover:border-stone-400 transition-colors duration-150 min-h-[52px]"
                  >
                    Call (254) 230-3102
                  </a>
                </div>
              </div>
              <div className="bg-stone-900 text-white rounded-2xl p-7 shadow-lg">
                <h3 className="font-display font-semibold text-2xl mb-3">What to expect</h3>
                <p className="text-stone-300 mb-4">{intro}</p>
                <ul className="space-y-3 text-sm">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span className="mt-1 size-2 rounded-full bg-accent-500" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-stone-50">
          <div className="container-main">
            <div className="grid gap-8 lg:grid-cols-3">
              {process.map((step, index) => (
                <div key={step.title} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-accent-600 font-semibold mb-2">
                    Step {index + 1}
                  </p>
                  <h3 className="font-display font-semibold text-xl text-stone-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-stone-600 text-pretty">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-main">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  Finish Options
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  Finish options for {title.toLowerCase()}
                </h2>
                <p className="text-lg text-stone-600 text-pretty mb-6">
                  We will help you match texture, color, and pattern to your property goals and budget.
                </p>
                <div className="flex flex-wrap gap-3">
                  {finishes.map((finish) => (
                    <span
                      key={finish}
                      className="px-4 py-2 rounded-full bg-stone-100 text-stone-700 text-sm font-medium"
                    >
                      {finish}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
                <h3 className="font-display font-semibold text-2xl text-stone-900 mb-3">
                  Service areas
                </h3>
                <p className="text-stone-600 text-pretty mb-6">
                  We provide {title.toLowerCase()} across Waco, Temple, Killeen, Hewitt, and surrounding Central Texas communities.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href="/waco-tx-concrete-contractor"
                    className="flex items-center justify-between px-4 py-3 bg-white border border-stone-200 rounded-lg hover:border-stone-300"
                  >
                    <span className="font-semibold text-stone-800">Waco</span>
                    <span className="text-sm text-stone-500">View location</span>
                  </a>
                  <a
                    href="/temple-tx-concrete-contractor"
                    className="flex items-center justify-between px-4 py-3 bg-white border border-stone-200 rounded-lg hover:border-stone-300"
                  >
                    <span className="font-semibold text-stone-800">Temple</span>
                    <span className="text-sm text-stone-500">View location</span>
                  </a>
                  <a
                    href="/killeen-tx-concrete-contractor"
                    className="flex items-center justify-between px-4 py-3 bg-white border border-stone-200 rounded-lg hover:border-stone-300"
                  >
                    <span className="font-semibold text-stone-800">Killeen</span>
                    <span className="text-sm text-stone-500">View location</span>
                  </a>
                  <a
                    href="/hewitt-tx-concrete-contractor"
                    className="flex items-center justify-between px-4 py-3 bg-white border border-stone-200 rounded-lg hover:border-stone-300"
                  >
                    <span className="font-semibold text-stone-800">Hewitt</span>
                    <span className="text-sm text-stone-500">View location</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </div>
  )
}
