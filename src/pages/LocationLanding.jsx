import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Contact } from '../components/Contact'
import {
  useSeo,
  SITE_URL,
  DEFAULT_IMAGE,
  ORGANIZATION_ID,
  buildBreadcrumbs,
  buildFaqPage,
  buildJsonLdGraph,
} from '../lib/seo'
import { guideLinks } from '../data/guides'
import { locationLinks } from '../data/locationPages'

export function LocationLanding({ page }) {
  const {
    city,
    slug,
    heroTitle,
    heroSubtitle,
    intro,
    highlights,
    services,
    nearbyAreas,
    projects,
    faq,
    seoTitle,
    seoDescription,
  } = page

  const resolvedTitle = seoTitle || `${heroTitle} | Free Estimate (254) 230-3102`
  const description = seoDescription || `${city} concrete contractor. Driveways, patios, stamped concrete, foundations. Free estimate: (254) 230-3102.`
  const nearbyCityLinks = [
    ...nearbyAreas
      .map((area) => {
        const match = locationLinks.find(
          (location) => location.city.toLowerCase() === area.toLowerCase(),
        )
        if (!match) return null
        return {
          href: `/${match.slug}`,
          label: `${match.city} concrete contractor`,
        }
      })
      .filter(Boolean),
    ...locationLinks
      .filter((location) => location.city.toLowerCase() !== city.toLowerCase())
      .map((location) => ({
        href: `/${location.slug}`,
        label: `${location.city} concrete contractor`,
      })),
  ]
    .filter(
      (link, index, allLinks) =>
        allLinks.findIndex((candidate) => candidate.href === link.href) === index,
    )
    .slice(0, 4)
  const relatedServiceLinks = services.slice(0, 4).map((service) => ({
    href: service.href,
    label: `${service.label} in ${city}`,
  }))

  const serviceJsonLd = {
    '@type': 'Service',
    '@id': `${SITE_URL}/${slug}#service`,
    name: `${city} Concrete Contractor`,
    serviceType: 'Concrete contractor',
    areaServed: {
      '@type': 'City',
      name: city,
      addressRegion: 'TX',
    },
    provider: {
      '@id': ORGANIZATION_ID,
    },
  }
  const localBusinessJsonLd = {
    '@type': ['LocalBusiness', 'Contractor'],
    '@id': `${SITE_URL}/${slug}#local-business`,
    additionalType: 'https://schema.org/ConcreteContractor',
    name: `Concrete Works LLC - ${city}`,
    url: `${SITE_URL}/${slug}`,
    image: DEFAULT_IMAGE,
    telephone: '+1-254-230-3102',
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: city,
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    parentOrganization: {
      '@id': ORGANIZATION_ID,
    },
  }

  const faqJsonLd = buildFaqPage(faq)
  const breadcrumbsJsonLd = buildBreadcrumbs([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: `${city} Concrete Contractor`, url: `${SITE_URL}/${slug}` },
  ])

  useSeo({
    title: resolvedTitle,
    description,
    canonical: `${SITE_URL}/${slug}`,
    url: `${SITE_URL}/${slug}`,
    image: DEFAULT_IMAGE,
    imageAlt: `Concrete work in ${city}, Texas`,
    type: 'website',
    jsonLd: buildJsonLdGraph(serviceJsonLd, localBusinessJsonLd, faqJsonLd, breadcrumbsJsonLd),
  })

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header transparent={false} />
      <main className="flex-1 pt-20 sm:pt-24">
        <section className="relative overflow-hidden bg-stone-900 texture-grain-dark">
          <div className="container-main py-16 sm:py-20 md:py-24">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800/80 text-stone-200 text-xs font-semibold uppercase tracking-wide">
                Serving Central Texas since 2005
              </span>
              <h1 className="mt-5 font-display font-bold text-white text-balance leading-tight" style={{ fontSize: 'clamp(2.25rem, 1.5rem + 4vw, 4rem)' }}>
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
                  Get Free Estimate
                </a>
                <a
                  href="tel:254-230-3102"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-stone-600 text-white font-semibold rounded-lg hover:bg-stone-800 hover:border-stone-500 transition-colors duration-150 min-h-[52px]"
                >
                  Call (254) 230-3102
                </a>
              </div>
              <p className="mt-6 text-sm text-stone-400">
                {intro}
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-main">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  Services in {city}
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  Concrete work tailored to {city} properties
                </h2>
                <p className="text-lg text-stone-600 text-pretty mb-6">
                  From new pours to repairs, we design every project for Central Texas soil conditions and day-to-day use.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((service) => (
                    <a
                      key={service.href}
                      href={service.href}
                      className="flex items-center justify-between gap-3 px-4 py-3 bg-stone-50 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-100 transition-colors"
                    >
                      <span className="font-semibold text-stone-800">{service.label}</span>
                      <span className="text-sm text-stone-500">Learn more</span>
                    </a>
                  ))}
                </div>
              </div>
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6">
                <h3 className="font-display font-semibold text-2xl text-stone-900 mb-4">
                  Why {city} homeowners choose us
                </h3>
                <div className="space-y-4">
                  {highlights.map((item) => (
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
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                Recent Projects
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                Concrete projects near {city}
              </h2>
              <p className="text-lg text-stone-600 text-pretty">
                A snapshot of the finishes and scale we bring to properties across the area.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.title}
                  className="group rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-xl text-stone-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-stone-600 text-pretty">{project.description}</p>
                    {project.stats && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.stats.map((stat) => (
                          <span
                            key={`${project.title}-${stat.label}`}
                            className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-medium"
                          >
                            {stat.label}: {stat.value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-main">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  Service Area
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  Serving {city} and nearby communities
                </h2>
                <p className="text-lg text-stone-600 text-pretty mb-6">
                  We regularly work throughout the {city} area. If your neighborhood is nearby, we can schedule a site visit.
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
                  Need a quote for {city}?
                </h3>
                <p className="text-stone-300 mb-6">
                  Tell us about your project and we will get back to you with next steps.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
                  >
                    Request Estimate
                  </a>
                  <a
                    href="tel:254-230-3102"
                    className="inline-flex items-center justify-center px-6 py-3 border border-stone-600 text-white font-semibold rounded-lg hover:border-stone-500"
                  >
                    Call 254-230-3102
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-stone-50">
          <div className="container-main">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                Pricing Resources
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                Concrete pricing guides for {city} projects
              </h2>
              <p className="text-lg text-stone-600 text-pretty">
                Use these local cost guides to compare options before your estimate.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {guideLinks.map((guide) => (
                <a
                  key={guide.href}
                  href={guide.href}
                  className="flex items-center justify-between gap-3 px-4 py-4 bg-white rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-100 transition-colors"
                >
                  <span className="font-semibold text-stone-800">{guide.label}</span>
                  <span className="text-sm text-stone-500">Open</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-main">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 text-balance mb-3">
                  Nearby city concrete pages
                </h2>
                <p className="text-stone-600 text-pretty mb-5">
                  Compare coverage across nearby areas for concrete projects similar to yours.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {nearbyCityLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between gap-3 px-4 py-3 bg-stone-50 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-100 transition-colors"
                    >
                      <span className="font-semibold text-stone-800">{link.label}</span>
                      <span className="text-sm text-stone-500">View page</span>
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 text-balance mb-3">
                  Popular services in {city}
                </h3>
                <p className="text-stone-600 text-pretty mb-5">
                  Jump straight to service details, pricing guidance, and FAQs.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {relatedServiceLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between gap-3 px-4 py-3 bg-stone-50 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-100 transition-colors"
                    >
                      <span className="font-semibold text-stone-800">{link.label}</span>
                      <span className="text-sm text-stone-500">Learn more</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-stone-50">
          <div className="container-main max-w-3xl">
            <div className="text-center mb-10">
              <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                FAQs
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                {city} concrete questions
              </h2>
              <p className="text-lg text-stone-600 text-pretty">
                Quick answers for common project questions in {city}.
              </p>
            </div>
            <div className="space-y-4">
              {faq.map((item) => (
                <div key={item.question} className="bg-white border border-stone-200 rounded-xl p-6">
                  <h3 className="font-display font-semibold text-lg text-stone-900 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-stone-600 text-pretty">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </div>
  )
}
