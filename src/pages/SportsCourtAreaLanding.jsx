import { lazy, Suspense } from 'react'
import { Header } from '../components/Header'
import { DeferredSection } from '../components/DeferredSection'
const Footer = lazy(() => import('../components/Footer').then((m) => ({ default: m.Footer })))
const Contact = lazy(() => import('../components/Contact').then((m) => ({ default: m.Contact })))
import {
  useSeo,
  SITE_URL,
  DEFAULT_IMAGE,
  ORGANIZATION_ID,
  buildFaqPage,
  buildBreadcrumbs,
  buildJsonLdGraph,
} from '../lib/seo'
import { sportsCourtAreaPages } from '../data/sportsCourtAreaPages'

export function SportsCourtAreaLanding({ page: pageProp, slug: slugProp }) {
  const page = pageProp || sportsCourtAreaPages.find((p) => p.slug === slugProp)
  if (!page) return null

  return <SportsCourtAreaLandingPage page={page} />
}

function SportsCourtAreaLandingPage({ page }) {
  const {
    slug,
    areaName,
    heroTitle,
    heroSubtitle,
    intro,
    badge,
    seoTitle,
    seoDescription,
    scopeTitle,
    scopeIntro,
    localFocus = [],
    services = [],
    process = [],
    availability,
    coverageTitle,
    coverageIntro,
    coveragePoints = [],
    decisionGuide,
    checklistTitle,
    checklistIntro,
    decisionChecklist = [],
    officialResources = [],
    faq = [],
  } = page

  const canonicalUrl = `${SITE_URL}/sports-court-coating/${slug}`

  const webPageJsonLd = {
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: seoTitle || heroTitle,
    description: seoDescription,
    about: {
      '@type': 'Thing',
      name: `Sports-court concrete-base planning for ${areaName}`,
    },
    publisher: {
      '@id': ORGANIZATION_ID,
    },
  }

  const faqJsonLd = buildFaqPage(faq)
  const breadcrumbsJsonLd = buildBreadcrumbs([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Sports Court Concrete Base Planning', url: `${SITE_URL}/sports-court-coating-waco-tx` },
    { name: `${areaName} Planning Guide`, url: canonicalUrl },
  ])

  useSeo({
    title: seoTitle || `${heroTitle} | SLA Concrete Works`,
    description:
      seoDescription ||
      `Plan a sports-court concrete base, specialist handoff, and estimate review for ${areaName}.`,
    canonical: canonicalUrl,
    url: canonicalUrl,
    image: DEFAULT_IMAGE,
    imageAlt: `Sports-court concrete-base planning for ${areaName}`,
    type: 'website',
    jsonLd: buildJsonLdGraph(webPageJsonLd, faqJsonLd, breadcrumbsJsonLd),
  })

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header transparent={false} />
      <main className="flex-1 pt-20 sm:pt-24">
        <section className="relative overflow-hidden bg-stone-900 texture-grain-dark">
          <div className="container-main py-16 sm:py-20 md:py-24">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800/80 text-stone-200 text-xs font-semibold uppercase tracking-wide">
                {badge || 'Waco-based project availability'}
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
                  Send Project Details
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
                  Project Roles
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  {scopeTitle || `Trade boundaries for a ${areaName} court inquiry`}
                </h2>
                <p className="text-lg text-stone-600 text-pretty mb-6">
                  {scopeIntro ||
                    'Concrete, athletic surfacing, striping, design, and other trades are separate responsibilities.'}
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

        {decisionGuide?.items?.length > 0 && (
          <section className="section-padding bg-accent-50/60 border-y border-accent-100">
            <div className="container-main">
              <div className="max-w-3xl mb-8">
                <span className="inline-block text-accent-700 font-semibold text-sm uppercase tracking-wide mb-3">
                  Decision Guide
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
                      Decision {index + 1}
                    </p>
                    <h3 className="font-display font-semibold text-xl text-stone-900 mb-3">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-stone-600 text-pretty">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section-padding bg-stone-50">
          <div className="container-main">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  Estimate Process
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  How a concept becomes a buildable concrete scope
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
                  {availability?.title || 'Availability must be confirmed'}
                </h3>
                <div className="space-y-3 text-stone-600 text-pretty">
                  {(availability?.paragraphs || []).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <p>
                    Send project facts to{' '}
                    <a href="sms:+12542303102" className="font-semibold text-accent-600 hover:underline">
                      (254) 230-3102
                    </a>{' '}
                    for an initial concrete-scope review. The first review identifies the next decision,
                    missing document, or site step needed for a useful estimate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-main">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
              <div>
                <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  Planning Checklist
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  {coverageTitle || `What availability means for ${areaName}`}
                </h2>
                <p className="text-lg text-stone-600 text-pretty mb-6">
                  {coverageIntro}
                </p>
                <ul className="space-y-3 text-stone-700">
                  {coveragePoints.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-accent-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-stone-900 text-white rounded-2xl p-8">
                <h3 className="font-display font-semibold text-2xl mb-3">
                  {checklistTitle || 'Estimate-readiness checklist'}
                </h3>
                <p className="text-stone-300 mb-6">
                  {checklistIntro || 'Bring these facts together before requesting a firm concrete proposal.'}
                </p>
                <ul className="space-y-4 text-stone-200">
                  {decisionChecklist.map((requirement) => (
                    <li key={requirement} className="flex gap-3">
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-accent-400" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {officialResources.length > 0 && (
          <section className="section-padding bg-stone-50">
            <div className="container-main">
              <div className="max-w-3xl mb-8">
                <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  Official Planning Links
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
                  Verify requirements for the actual site and scope
                </h2>
                <p className="text-lg text-stone-600 text-pretty">
                  Permit and accessibility decisions belong to the owner and design team. These official resources are useful starting points; confirm current project-specific requirements before construction.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {officialResources.map((resource) => (
                  <a
                    key={resource.href}
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-2xl border border-stone-200 bg-white p-6 hover:border-accent-400 hover:shadow-sm transition-all"
                  >
                    <h3 className="font-display font-semibold text-xl text-stone-900 group-hover:text-accent-700 transition-colors">
                      {resource.label}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-stone-600 text-pretty">{resource.description}</p>
                    <span className="mt-4 inline-flex text-sm font-semibold text-accent-700">Open official resource →</span>
                  </a>
                ))}
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
                  Sports-court planning questions for {areaName}
                </h2>
                <p className="text-lg text-stone-600 text-pretty">
                  Clear answers for organizing the concrete scope, specialist handoff, and estimate review.
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
