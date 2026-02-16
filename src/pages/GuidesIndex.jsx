import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Contact } from '../components/Contact'
import { guidePages } from '../data/guides'
import { servicePages } from '../data/servicePages'
import { locationLinks } from '../data/locationPages'
import { useSeo, SITE_URL, DEFAULT_IMAGE, buildBreadcrumbs, buildJsonLdGraph } from '../lib/seo'

export function GuidesIndex() {
  const breadcrumbsJsonLd = buildBreadcrumbs([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Pricing Guides', url: `${SITE_URL}/guides` },
  ])

  useSeo({
    title: 'Concrete Cost Guide Waco TX | Driveway, Patio, Stamped',
    description:
      'Concrete driveway, patio & stamped concrete cost guides for Waco. Free estimate: (254) 230-3102.',
    canonical: `${SITE_URL}/guides`,
    url: `${SITE_URL}/guides`,
    image: DEFAULT_IMAGE,
    imageAlt: 'Concrete pricing guides in Waco, Texas',
    type: 'website',
    jsonLd: buildJsonLdGraph(breadcrumbsJsonLd),
  })

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header transparent={false} />
      <main className="flex-1 pt-20 sm:pt-24">
        <section className="bg-stone-900 text-white">
          <div className="container-main py-16 sm:py-20 md:py-24">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800/80 text-stone-200 text-xs font-semibold uppercase tracking-wide">
                Pricing Guides
              </span>
              <h1 className="mt-5 font-display font-bold text-balance leading-tight" style={{ fontSize: 'clamp(2.4rem, 1.6rem + 3vw, 4rem)' }}>
                Waco concrete pricing, without the guesswork
              </h1>
              <p className="mt-5 text-lg text-stone-300 text-pretty max-w-2xl">
                Straightforward, local guidance based on real Central Texas projects.
                Use these guides to plan your budget before requesting an estimate.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="#guides"
                  className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150 min-h-[52px]"
                >
                  View Guides
                </a>
                <a
                  href="tel:254-230-3102"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-stone-600 text-white font-semibold rounded-lg hover:border-stone-500 transition-colors duration-150 min-h-[52px]"
                >
                  Call (254) 230-3102
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="guides" className="section-padding bg-white">
          <div className="container-main">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {guidePages.map((guide) => (
                <article
                  key={guide.slug}
                  className="group rounded-2xl border border-stone-200 bg-stone-50 p-6 shadow-sm hover:bg-white hover:shadow-lg hover:shadow-stone-200/60 transition-all"
                >
                  <h2 className="font-display font-semibold text-2xl text-stone-900 mb-3">
                    {guide.title}
                  </h2>
                  <p className="text-stone-600 text-pretty mb-6">
                    {guide.heroSubtitle}
                  </p>
                  <a
                    href={`/guides/${guide.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-stone-900 hover:text-accent-600 transition-colors"
                  >
                    Read guide
                    <span aria-hidden="true">-&gt;</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-stone-50">
          <div className="container-main">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="bg-white border border-stone-200 rounded-2xl p-6">
                <h2 className="font-display font-semibold text-2xl text-stone-900 mb-4">
                  Related concrete services
                </h2>
                <div className="space-y-3">
                  {servicePages.slice(0, 6).map((service) => (
                    <a
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="flex items-center justify-between px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg hover:border-stone-300"
                    >
                      <span className="font-semibold text-stone-800">{service.title}</span>
                      <span className="text-sm text-stone-500">View service</span>
                    </a>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl p-6">
                <h2 className="font-display font-semibold text-2xl text-stone-900 mb-4">
                  City pages
                </h2>
                <div className="space-y-3">
                  {locationLinks.map((location) => (
                    <a
                      key={location.slug}
                      href={`/${location.slug}`}
                      className="flex items-center justify-between px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg hover:border-stone-300"
                    >
                      <span className="font-semibold text-stone-800">{location.city}</span>
                      <span className="text-sm text-stone-500">View location</span>
                    </a>
                  ))}
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
