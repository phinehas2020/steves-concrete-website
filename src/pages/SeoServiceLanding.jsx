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

        <section className="section-padding">
          <div className="container-main space-y-12">
            {sections.map((section, index) => (
              <article
                key={section.heading}
                className={`grid gap-4 lg:grid-cols-[1fr_1.2fr] lg:items-start ${index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                  }`}
              >
                <h2 className="font-display font-semibold text-3xl text-stone-900">
                  {section.heading}
                </h2>
                <div className="space-y-4 text-stone-600 text-pretty">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
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
