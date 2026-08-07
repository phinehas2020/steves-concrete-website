import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { DeferredSection } from '../components/DeferredSection'
const Contact = lazy(() => import('../components/Contact').then((m) => ({ default: m.Contact })))
const Footer = lazy(() => import('../components/Footer').then((m) => ({ default: m.Footer })))
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
import { getServiceGalleryImages, serviceHeroImages } from '../data/clientProjects'

// Pool of planning/local links; each page shows a different rotation so the
// same five links don't repeat site-wide.
const planningLinkPool = [
  { href: '/waco-tx-concrete-contractor', label: 'Waco concrete contractor hub' },
  { href: '/hewitt-tx-concrete-contractor', label: 'Hewitt concrete contractor page' },
  { href: '/woodway-tx-concrete-contractor', label: 'Woodway concrete contractor page' },
  { href: '/temple-tx-concrete-contractor', label: 'Temple concrete contractor page' },
  { href: '/jobs', label: 'Recent project gallery' },
  { href: '/guides/concrete-driveway-cost-waco-tx', label: 'Driveway cost guide for Waco' },
  { href: '/guides/concrete-patio-cost-waco-tx', label: 'Patio cost guide for Waco' },
  { href: '/guides/stamped-concrete-cost-waco-tx', label: 'Stamped concrete cost guide' },
  { href: '/guides/do-i-need-a-permit-to-pour-a-concrete-slab-waco-tx', label: 'Slab permit guide for Waco' },
  { href: '/blog/waco-concrete-driveway-cost-factors', label: 'Waco driveway cost factors' },
  { href: '/blog/stamped-concrete-patio-ideas-central-texas', label: 'Stamped patio ideas for Central Texas' },
  { href: '/reviews', label: 'Customer reviews' },
]

export function SeoServiceLanding({ page: pageProp, slug: slugProp }) {
  const page = pageProp || seoServicePages.find((p) => p.slug === slugProp)
  if (!page) return null

  return <SeoServiceLandingPage page={page} />
}

function SeoServiceLandingPage({ page }) {
  const {
    slug,
    title,
    introParagraph,
    metaTitle,
    metaDescription,
    sections,
    faq = [],
    heroImage,
    evidenceNote,
    scopeBoundary,
    showGallery = true,
    pageBadge,
    ctaLabel,
    decisionGuide,
    planningChecklist = [],
    officialResources = [],
  } = page
  const resolvedHeroImage = heroImage || serviceHeroImages[slug]
  const galleryImages = showGallery ? getServiceGalleryImages(slug, title) : []
  const seoImage = resolvedHeroImage?.startsWith('/') ? `${SITE_URL}${resolvedHeroImage}` : resolvedHeroImage

  // Rotate around the current page so each page surfaces different neighbors
  // instead of every page linking to the same first four entries.
  const nonRedirectServices = seoServicePages.filter((service) => !service.redirectTo)
  const currentIndex = nonRedirectServices.findIndex((service) => service.slug === slug)
  const relatedServices = (
    currentIndex === -1
      ? nonRedirectServices.filter((service) => service.slug !== slug)
      : [...nonRedirectServices.slice(currentIndex + 1), ...nonRedirectServices.slice(0, currentIndex)]
  ).slice(0, 4)

  const planningStart = ((currentIndex === -1 ? 0 : currentIndex) * 3) % planningLinkPool.length
  const wacoPlanningLinks = page.resourceLinks?.length
    ? page.resourceLinks
    : [
        ...planningLinkPool.slice(planningStart),
        ...planningLinkPool.slice(0, planningStart),
      ].slice(0, 5)

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
      name: 'SLA Concrete Works LLC',
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
    image: seoImage || DEFAULT_IMAGE,
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
            <div className={`grid gap-12 lg:items-center ${resolvedHeroImage ? 'lg:grid-cols-2' : ''}`}>
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800/80 text-stone-200 text-xs font-semibold uppercase tracking-wide">
                  {pageBadge || 'Service Detail'}
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
                    {ctaLabel || 'Get Free Estimate'}
                  </a>
                  <a
                    href="tel:254-230-3102"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-stone-600 text-white font-semibold rounded-lg hover:bg-stone-800 hover:border-stone-500 transition-colors duration-150 min-h-[52px]"
                  >
                    Call (254) 230-3102
                  </a>
                </div>
              </div>

              {resolvedHeroImage && (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={resolvedHeroImage}
                    alt={title}
                    width="640"
                    height="640"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl"></div>
                </div>
              )}
            </div>
          </div>
        </section>

        {scopeBoundary && (
          <section className="section-padding bg-white">
            <div className="container-main max-w-5xl">
              <div className="mb-8 max-w-3xl">
                <span className="inline-block px-3 py-1 mb-4 rounded-full bg-amber-50 text-amber-800 font-semibold text-sm tracking-wide uppercase border border-amber-200">
                  Scope Boundary
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance">
                  Concrete scope and specialist scope are separate
                </h2>
                {evidenceNote && (
                  <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-stone-700 leading-relaxed">
                    {evidenceNote}
                  </p>
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-2xl border border-stone-200 bg-stone-50 p-6 sm:p-8">
                  <h3 className="font-display font-semibold text-2xl text-stone-900 mb-5">
                    {scopeBoundary.slaTitle}
                  </h3>
                  <ul className="space-y-4 text-stone-700">
                    {scopeBoundary.slaItems.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 size-2 shrink-0 rounded-full bg-accent-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-2xl border border-stone-300 bg-stone-900 p-6 text-white sm:p-8">
                  <h3 className="font-display font-semibold text-2xl mb-5">
                    {scopeBoundary.specialistTitle}
                  </h3>
                  <ul className="space-y-4 text-stone-200">
                    {scopeBoundary.specialistItems.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 size-2 shrink-0 rounded-full bg-accent-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </section>
        )}

        {decisionGuide?.items?.length > 0 && (
          <section className="section-padding bg-accent-50/60 border-y border-accent-100">
            <div className="container-main">
              <div className="max-w-3xl mb-8">
                <span className="inline-block px-3 py-1 mb-4 rounded-full bg-white text-accent-700 font-semibold text-sm tracking-wide uppercase border border-accent-200">
                  Project Decision Guide
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  {decisionGuide.title}
                </h2>
                <p className="text-lg text-stone-600 text-pretty">{decisionGuide.intro}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {decisionGuide.items.map((item, index) => (
                  <article key={item.title} className="rounded-2xl border border-accent-100 bg-white p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-accent-700 font-semibold mb-3">
                      Starting point {index + 1}
                    </p>
                    <h3 className="font-display font-semibold text-xl text-stone-900 mb-3">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-stone-600 text-pretty">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

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

        {galleryImages.length > 0 && (
          <section className="section-padding bg-white">
            <div className="container-main">
              <div className="mb-8 max-w-3xl">
                <span className="inline-block px-3 py-1 mb-4 rounded-full bg-stone-100 text-stone-600 font-semibold text-sm tracking-wide uppercase border border-stone-200">
                  Recent Work
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900">
                  Project photos for Waco concrete planning
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {galleryImages.map((image) => (
                  <figure key={image.src} className="overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                    <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        width="480"
                        height="360"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                      />
                    </div>
                    <figcaption className="px-3 py-3 text-sm text-stone-600">
                      <span className="block font-semibold text-stone-900">{image.title}</span>
                      {image.location}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {(planningChecklist.length > 0 || officialResources.length > 0) && (
          <section className="section-padding bg-white">
            <div className="container-main">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                {planningChecklist.length > 0 && (
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6 sm:p-8">
                    <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                      Estimate Checklist
                    </span>
                    <h2 className="font-display font-bold text-3xl text-stone-900 text-balance mb-4">
                      Send one useful project packet
                    </h2>
                    <p className="text-stone-600 text-pretty mb-6">
                      These details make the first concrete review faster and reveal which design or site decision comes next.
                    </p>
                    <ul className="space-y-4 text-stone-700">
                      {planningChecklist.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 size-2 shrink-0 rounded-full bg-accent-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {officialResources.length > 0 && (
                  <div className="rounded-2xl bg-stone-900 p-6 text-white sm:p-8">
                    <span className="inline-block text-accent-300 font-semibold text-sm uppercase tracking-wide mb-3">
                      Official Planning Links
                    </span>
                    <h2 className="font-display font-bold text-3xl text-white text-balance mb-4">
                      Verify the actual site and scope
                    </h2>
                    <p className="text-stone-300 text-pretty mb-6">
                      Requirements depend on the address, ownership, use, funding, and work proposed. Confirm current project-specific requirements before construction.
                    </p>
                    <div className="space-y-4">
                      {officialResources.map((resource) => (
                        <a
                          key={resource.href}
                          href={resource.href}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-xl border border-stone-700 bg-stone-800 p-5 hover:border-accent-400 transition-colors"
                        >
                          <h3 className="font-display font-semibold text-lg text-white">{resource.label}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-stone-300">{resource.description}</p>
                          <span className="mt-3 inline-flex text-sm font-semibold text-accent-300">Open official resource →</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="section-padding bg-stone-50">
          <div className="container-main">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 mb-4">
              Related concrete services in Waco, TX
            </h2>
            <p className="text-stone-600 text-pretty max-w-2xl mb-8">
              A lot of projects end up combining two or three of these — a driveway replacement
              usually starts with demolition, and most patios get a decorative finish. Here is
              other work we handle around Waco.
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
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {wacoPlanningLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="bg-white rounded-xl border border-stone-200 px-5 py-4 font-semibold text-stone-900 hover:border-accent-500 transition-colors"
                >
                  {link.label}
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

        <DeferredSection anchorId="contact" rootMargin="520px 0px" minHeight={760}>
          <Suspense fallback={<div className="section-padding bg-stone-50" style={{ minHeight: 760 }} />}>
            <Contact sectionId={null} />
          </Suspense>
        </DeferredSection>
      </main>
      <DeferredSection rootMargin="640px 0px" minHeight={400}>
        <Suspense fallback={<div style={{ minHeight: 400 }} />}>
          <Footer />
        </Suspense>
      </DeferredSection>
    </div>
  )
}
