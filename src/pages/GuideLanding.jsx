import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Contact } from '../components/Contact'
import {
  useSeo,
  SITE_URL,
  DEFAULT_IMAGE,
  buildBreadcrumbs,
  buildFaqPage,
  buildJsonLdGraph,
} from '../lib/seo'

export function GuideLanding({ page }) {
  const {
    slug,
    title,
    heroTitle,
    heroSubtitle,
    seoTitle,
    seoDescription,
    summary,
    quickStats = [],
    costRanges = [],
    factors = [],
    localNotes = [],
    checklist = [],
    relatedServices = [],
    faq = [],
  } = page

  const breadcrumbsJsonLd = buildBreadcrumbs([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Pricing Guides', url: `${SITE_URL}/guides` },
    { name: title, url: `${SITE_URL}/guides/${slug}` },
  ])
  const faqJsonLd = buildFaqPage(faq)

  useSeo({
    title: seoTitle || `${title} | Concrete Works LLC`,
    description: seoDescription,
    canonical: `${SITE_URL}/guides/${slug}`,
    url: `${SITE_URL}/guides/${slug}`,
    image: DEFAULT_IMAGE,
    imageAlt: `${title} guide`,
    type: 'article',
    jsonLd: buildJsonLdGraph(faqJsonLd, breadcrumbsJsonLd),
  })

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header transparent={false} />
      <main className="flex-1 pt-20 sm:pt-24">
        <section className="bg-white">
          <div className="container-main py-14 sm:py-18 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold uppercase tracking-wide">
                  Pricing Guide
                </span>
                <h1 className="mt-5 font-display font-bold text-stone-900 text-balance leading-tight" style={{ fontSize: 'clamp(2.25rem, 1.5rem + 4vw, 3.75rem)' }}>
                  {heroTitle}
                </h1>
                <p className="mt-5 text-lg text-stone-600 text-pretty max-w-2xl">
                  {heroSubtitle}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <a
                    href="#pricing"
                    className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-150 min-h-[52px]"
                  >
                    View Pricing Factors
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-stone-300 text-stone-800 font-semibold rounded-lg hover:border-stone-400 transition-colors duration-150 min-h-[52px]"
                  >
                    Request Estimate
                  </a>
                </div>
              </div>
              <div className="bg-stone-900 text-white rounded-2xl p-7 shadow-lg">
                <h3 className="font-display font-semibold text-2xl mb-3">At a glance</h3>
                <p className="text-stone-300 mb-4">{summary}</p>
                <ul className="space-y-3 text-sm">
                  {quickStats.map((stat) => (
                    <li key={stat.label} className="flex items-start gap-3">
                      <span className="mt-1 size-2 rounded-full bg-accent-500" />
                      <span className="font-semibold text-white">{stat.label}:</span>
                      <span className="text-stone-300">{stat.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {costRanges.length > 0 && (
          <section className="section-padding bg-stone-50">
            <div className="container-main">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  Typical ranges
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  Waco pricing ranges
                </h2>
                <p className="text-lg text-stone-600 text-pretty">
                  Ranges reflect common Waco projects and local site conditions.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {costRanges.map((range) => (
                  <div key={range.label} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-display font-semibold text-xl text-stone-900 mb-2">
                      {range.label}
                    </h3>
                    <p className="text-2xl font-bold text-accent-600 mb-2">{range.range}</p>
                    <p className="text-stone-600 text-pretty">{range.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="pricing" className="section-padding bg-white">
          <div className="container-main">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  What affects price
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  Factors that move your estimate
                </h2>
                <p className="text-lg text-stone-600 text-pretty mb-6">
                  Every site is different. These are the items that most often shift total cost.
                </p>
                <ul className="space-y-3 text-stone-700">
                  {factors.map((factor) => (
                    <li key={factor} className="flex items-start gap-3">
                      <span className="mt-2 size-2 rounded-full bg-accent-500" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
                <h3 className="font-display font-semibold text-2xl text-stone-900 mb-3">
                  Estimate checklist
                </h3>
                <ul className="space-y-3 text-stone-700">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 size-2 rounded-full bg-accent-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {localNotes.length > 0 && (
          <section className="section-padding bg-stone-50">
            <div className="container-main">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  Local considerations
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  Why Waco projects price differently
                </h2>
                <p className="text-lg text-stone-600 text-pretty">
                  Central Texas soil and climate influence how concrete is planned and built.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {localNotes.map((note) => (
                  <div key={note.title} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-display font-semibold text-xl text-stone-900 mb-2">
                      {note.title}
                    </h3>
                    <p className="text-stone-600 text-pretty">{note.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {relatedServices.length > 0 && (
          <section className="section-padding bg-white">
            <div className="container-main">
              <div className="bg-stone-900 text-white rounded-2xl p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h3 className="font-display font-semibold text-2xl mb-2">
                    Ready for a concrete estimate?
                  </h3>
                  <p className="text-stone-300">
                    Compare services and get a tailored quote from Concrete Works LLC.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {relatedServices.map((service) => (
                    <a
                      key={service.href}
                      href={service.href}
                      className="inline-flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors"
                    >
                      {service.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {faq.length > 0 && (
          <section className="section-padding bg-stone-50">
            <div className="container-main max-w-3xl">
              <div className="text-center mb-10">
                <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  FAQs
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  {title} questions
                </h2>
                <p className="text-lg text-stone-600 text-pretty">
                  Quick answers to common pricing questions.
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
        )}

        <Contact />
      </main>
      <Footer />
    </div>
  )
}
