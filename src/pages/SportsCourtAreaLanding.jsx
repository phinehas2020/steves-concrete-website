import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Contact } from '../components/Contact'
import {
  useSeo,
  SITE_URL,
  DEFAULT_IMAGE,
  ORGANIZATION_ID,
  buildFaqPage,
  buildBreadcrumbs,
  buildJsonLdGraph,
} from '../lib/seo'
import { sportsCourtAreaLinks } from '../data/sportsCourtAreaPages'

export function SportsCourtAreaLanding({ page }) {
  const {
    slug,
    areaName,
    heroTitle,
    heroSubtitle,
    intro,
    seoTitle,
    seoDescription,
    localFocus = [],
    targetKeywords = [],
    services = [],
    process = [],
    nearbyAreas = [],
    faq = [],
  } = page

  const canonicalUrl = `${SITE_URL}/sports-court-coating/${slug}`
  const relatedAreas = sportsCourtAreaLinks.filter((item) => item.slug !== slug).slice(0, 4)

  const serviceJsonLd = {
    '@type': 'Service',
    '@id': `${canonicalUrl}#service`,
    name: `Sports Court Coating in ${areaName}`,
    serviceType: 'Sports court resurfacing and acrylic coating',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: areaName,
      addressCountry: 'US',
    },
    provider: {
      '@id': ORGANIZATION_ID,
    },
  }

  const faqJsonLd = buildFaqPage(faq)
  const breadcrumbsJsonLd = buildBreadcrumbs([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Sports Court Coating', url: `${SITE_URL}/sports-court-coating/texas` },
    { name: areaName, url: canonicalUrl },
  ])

  useSeo({
    title: seoTitle || `${heroTitle} | Sports Court Resurfacing`,
    description:
      seoDescription ||
      `Sports court coating in ${areaName} for pickleball, tennis, and basketball surfaces.`,
    canonical: canonicalUrl,
    url: canonicalUrl,
    image: DEFAULT_IMAGE,
    imageAlt: `Sports court coating services in ${areaName}`,
    type: 'website',
    jsonLd: buildJsonLdGraph(serviceJsonLd, faqJsonLd, breadcrumbsJsonLd),
  })

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header transparent={false} />
      <main className="flex-1 pt-20 sm:pt-24">
        <section className="relative overflow-hidden bg-stone-900 texture-grain-dark">
          <div className="container-main py-16 sm:py-20 md:py-24">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800/80 text-stone-200 text-xs font-semibold uppercase tracking-wide">
                Sports Surface Specialists
              </span>
              <h1
                className="mt-5 font-display font-bold text-white text-balance leading-tight"
                style={{ fontSize: 'clamp(2.25rem, 1.5rem + 4vw, 4rem)' }}
              >
                {heroTitle}
              </h1>
              <p className="mt-5 text-lg text-stone-300 text-pretty max-w-2xl">
                {heroSubtitle}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150 min-h-[52px]"
                >
                  Request Quote
                </a>
                <a
                  href="tel:254-230-3102"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-stone-600 text-white font-semibold rounded-lg hover:bg-stone-800 hover:border-stone-500 transition-colors duration-150 min-h-[52px]"
                >
                  Call (254) 230-3102
                </a>
              </div>
              <p className="mt-6 text-sm text-stone-400">{intro}</p>
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-main">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  Core Services
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  Sports court resurfacing in {areaName}
                </h2>
                <p className="text-lg text-stone-600 text-pretty mb-6">
                  We restore worn courts with a prep-first workflow and acrylic coating systems
                  designed for long-term playability.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {services.map((service) => (
                    <article
                      key={service.title}
                      className="border border-stone-200 rounded-xl bg-stone-50 p-4"
                    >
                      <h3 className="font-semibold text-stone-900 mb-2">{service.title}</h3>
                      <p className="text-sm text-stone-600 text-pretty">{service.description}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6">
                <h3 className="font-display font-semibold text-2xl text-stone-900 mb-4">
                  Local planning focus
                </h3>
                <div className="space-y-4">
                  {localFocus.map((item) => (
                    <div key={item.title} className="border border-stone-200 rounded-xl bg-white p-4">
                      <h4 className="font-semibold text-stone-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-stone-600 text-pretty">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-stone-50">
          <div className="container-main">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  Process
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  How we resurface sport courts
                </h2>
                <div className="space-y-4">
                  {process.map((step, index) => (
                    <article key={step.title} className="bg-white border border-stone-200 rounded-xl p-5">
                      <p className="text-xs uppercase tracking-wide text-accent-600 font-semibold mb-2">
                        Step {index + 1}
                      </p>
                      <h3 className="font-semibold text-stone-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-stone-600 text-pretty">{step.description}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl p-6">
                <h3 className="font-display font-semibold text-2xl text-stone-900 mb-4">
                  Search trends in {areaName}
                </h3>
                <p className="text-stone-600 text-pretty mb-5">
                  These are common phrases people use when looking for court repair and resurfacing
                  help in this market.
                </p>
                <div className="flex flex-wrap gap-2">
                  {targetKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-full text-xs font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-main">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  Coverage
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  Nearby service coverage from {areaName}
                </h2>
                <p className="text-lg text-stone-600 text-pretty mb-6">
                  We coordinate projects across neighboring communities and can confirm scheduling
                  options during your estimate call.
                </p>
                <div className="flex flex-wrap gap-2">
                  {nearbyAreas.map((area) => (
                    <span
                      key={area}
                      className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-full text-sm font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-stone-900 text-white rounded-2xl p-8">
                <h3 className="font-display font-semibold text-2xl mb-3">
                  Explore more sports court areas
                </h3>
                <p className="text-stone-300 mb-6">
                  Compare nearby market pages to align your project scope and resurfacing plan.
                </p>
                <div className="space-y-3">
                  {relatedAreas.map((item) => (
                    <a
                      key={item.slug}
                      href={item.href}
                      className="flex items-center justify-between px-4 py-3 bg-stone-800 rounded-lg hover:bg-stone-700 transition-colors"
                    >
                      <span className="font-semibold text-white">{item.areaName}</span>
                      <span className="text-xs uppercase tracking-wide text-stone-300">View</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {faq.length > 0 && (
          <section className="section-padding bg-stone-50">
            <div className="container-main max-w-3xl">
              <div className="text-center mb-10">
                <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  FAQs
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  Sports court coating questions in {areaName}
                </h2>
                <p className="text-lg text-stone-600 text-pretty">
                  Quick answers property owners ask before scheduling resurfacing work.
                </p>
              </div>
              <div className="space-y-4">
                {faq.map((item) => (
                  <article key={item.question} className="bg-white border border-stone-200 rounded-xl p-6">
                    <h3 className="font-display font-semibold text-lg text-stone-900 mb-2">
                      {item.question}
                    </h3>
                    <p className="text-stone-600 text-pretty">{item.answer}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <Contact />
      </main>
      <Footer />
    </div>
  )
}
