import { Link } from 'react-router-dom'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import {
  useSeo,
  SITE_URL,
  DEFAULT_IMAGE,
  buildBreadcrumbs,
  buildFaqPage,
  buildJsonLdGraph,
} from '../lib/seo'
import { seoServicePages } from '../data/seoServicePages'

export function SeoServiceLanding({ page }) {
  const { slug, title, introParagraph, metaTitle, metaDescription, sections, faq = [], heroImage } = page

  const relatedServices = seoServicePages
    .filter((service) => service.slug !== slug)
    .slice(0, 4)

  const serviceJsonLd = {
    '@type': 'Service',
    '@id': `${SITE_URL}/${slug}#service`,
    name: title,
    serviceType: title,
    areaServed: {
      '@type': 'City',
      name: 'Waco',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    provider: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Concrete Works LLC',
      telephone: '+1-254-230-3102',
      url: `${SITE_URL}/`,
    },
  }

  const breadcrumbsJsonLd = buildBreadcrumbs([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Service Pages', url: `${SITE_URL}/#services` },
    { name: title, url: `${SITE_URL}/${slug}` },
  ])
  const faqJsonLd = buildFaqPage(faq)

  useSeo({
    title: metaTitle,
    description: metaDescription,
    canonical: `${SITE_URL}/${slug}`,
    url: `${SITE_URL}/${slug}`,
    image: DEFAULT_IMAGE,
    imageAlt: `${title} in Waco, Texas`,
    type: 'website',
    jsonLd: buildJsonLdGraph(serviceJsonLd, faqJsonLd, breadcrumbsJsonLd),
  })

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header transparent={false} />
      <main className="flex-1 pt-20 sm:pt-24">
        <section className="bg-stone-900 text-white relative overflow-hidden">
          <div className="container-main py-16 sm:py-20 md:py-24">
            <div className={`grid gap-12 lg:items-center ${heroImage ? 'lg:grid-cols-2' : ''}`}>
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800/80 text-stone-200 text-xs font-semibold uppercase tracking-wide">
                  Service Detail
                </span>
                <h1 className="mt-5 font-display font-bold text-balance leading-tight" style={{ fontSize: 'clamp(2.4rem, 1.6rem + 3vw, 4rem)' }}>
                  {title}
                </h1>
                <p className="mt-5 text-lg text-stone-300 text-pretty max-w-2xl">
                  {introParagraph}
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
              </div>

              {heroImage && (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={heroImage}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl"></div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="section-padding relative">
          {/* Subtle background texture */}
          <div className="absolute inset-0 bg-stone-50/50 -z-10" />

          <div className="container-main max-w-4xl">
            <div className="mb-12 text-center md:text-left">
              <span className="inline-block px-3 py-1 mb-4 rounded-full bg-stone-100 text-stone-600 font-semibold text-sm tracking-wide uppercase border border-stone-200">
                Service Breakdown
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900">
                What to expect during your project
              </h2>
            </div>

            <div className="space-y-8 sm:space-y-12">
              {sections.map((section, index) => (
                <article
                  key={section.heading}
                  className="relative grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 group"
                >
                  {/* Step Connector Line (visible on desktop) */}
                  {index !== sections.length - 1 && (
                    <div className="hidden md:block absolute left-[1.375rem] top-14 bottom-[-3rem] w-px bg-stone-200 group-hover:bg-accent-200 transition-colors duration-300" />
                  )}

                  {/* Number Badge */}
                  <div className="relative z-10 hidden md:flex shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-stone-200 text-stone-400 flex items-center justify-center font-display font-bold text-lg group-hover:border-accent-500 group-hover:text-accent-600 transition-all duration-300 shadow-sm mt-1">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-100 group-hover:shadow-md group-hover:border-accent-200 transition-all duration-300">
                    {/* Mobile Number Badge */}
                    <div className="flex items-center gap-4 mb-4 md:hidden">
                      <div className="w-10 h-10 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center font-display font-bold text-sm shrink-0 border border-accent-100">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>

                    <h3 className="font-display font-semibold text-2xl text-stone-900 mb-4 group-hover:text-accent-600 transition-colors duration-200">
                      {section.heading}
                    </h3>
                    <div className="space-y-4 text-stone-600 leading-relaxed text-pretty">
                      {section.paragraphs.map((paragraph, pIndex) => (
                        <p key={pIndex}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-stone-50">
          <div className="container-main">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 mb-4">
              Related concrete services in Waco, TX
            </h2>
            <p className="text-stone-600 text-pretty max-w-2xl mb-8">
              Need more ideas for your project? Explore these related services with local teams and
              concrete planning experience.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedServices.map((service) => (
                <Link
                  key={service.slug}
                  to={`/${service.slug}`}
                  className="bg-white rounded-xl border border-stone-200 px-5 py-4 font-semibold text-stone-900 hover:border-accent-500 transition-colors"
                >
                  {service.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {faq.length > 0 && (
          <section className="section-padding bg-white">
            <div className="container-main max-w-3xl">
              <h2 className="font-display font-bold text-3xl text-stone-900 text-balance mb-6">
                {title} FAQs
              </h2>
              <div className="space-y-4">
                {faq.map((item) => (
                  <details key={item.question} className="group border border-stone-200 rounded-xl p-5">
                    <summary className="cursor-pointer list-none font-display font-semibold text-stone-900">
                      {item.question}
                    </summary>
                    <p className="mt-4 text-stone-600 text-pretty">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section-padding bg-stone-50">
          <div className="container-main">
            <Contact />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
