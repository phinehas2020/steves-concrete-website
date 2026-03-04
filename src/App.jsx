import { lazy, Suspense } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
const Services = lazy(() => import('./components/Services').then((m) => ({ default: m.Services })))
import { FeaturedServiceSpotlight } from './components/FeaturedServiceSpotlight'
import { DeferredSection } from './components/DeferredSection'
const Footer = lazy(() => import('./components/Footer').then((m) => ({ default: m.Footer })))
import { useSeo, buildJsonLdGraph, SITE_URL, DEFAULT_IMAGE } from './lib/seo'
import { servicePageLinks } from './data/seoServicePages'
import { locationLinks } from './data/locationPages'

const GOOGLE_REVIEW_URL =
  'https://www.google.com/maps/place/SLA+Concrete+Works/@31.6637838,-97.1149261,17z/data=!3m1!4b1!4m6!3m5!1s0x864f83d5fc2728cf:0x92d8085e5a37fa64!8m2!3d31.6637793!4d-97.1123512!16s%2Fg%2F11gf0qs4j0?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D'

const CostQuickAnswers = lazy(() =>
  import('./components/CostQuickAnswers').then((m) => ({ default: m.CostQuickAnswers })),
)
const BlogActivityStrip = lazy(() =>
  import('./components/BlogActivityStrip').then((m) => ({ default: m.BlogActivityStrip })),
)
const Values = lazy(() => import('./components/Values').then((m) => ({ default: m.Values })))
const Gallery = lazy(() => import('./components/Gallery').then((m) => ({ default: m.Gallery })))
const Testimonials = lazy(() =>
  import('./components/Testimonials').then((m) => ({ default: m.Testimonials })),
)
const FAQ = lazy(() => import('./components/FAQ').then((m) => ({ default: m.FAQ })))
const Contact = lazy(() => import('./components/Contact').then((m) => ({ default: m.Contact })))

function SectionFallback({ className = 'section-padding bg-white', minHeight = 320 }) {
  return <div className={className} style={{ minHeight }} aria-hidden="true" />
}

function HomeLocalBusinessSchema() {
  const cityNames = ['Waco', ...locationLinks.map((location) => location.city)]

  return {
    '@type': ['LocalBusiness', 'Contractor'],
    '@id': `${SITE_URL}/#organization`,
    additionalType: 'https://schema.org/ConcreteContractor',
    name: 'Concrete Works LLC',
    url: SITE_URL,
    image: DEFAULT_IMAGE,
    telephone: '+1-254-230-3102',
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: 47,
      bestRating: '5',
      worstRating: '1',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Waco',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    areaServed: cityNames.map((name) => ({
      '@type': 'City',
      name,
      addressRegion: 'TX',
      addressCountry: 'US',
    })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '08:00',
        closes: '16:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Concrete Services',
      itemListElement: servicePageLinks.map((service, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name: service.label,
          description: `${service.label} in Waco, TX and nearby communities.`,
        },
      })),
    },
  }
}

function ServiceAreas() {
  const nearbyAreas = ['Woodway', 'Hewitt', 'Temple', 'Killeen', 'Robinson', 'Lorena', 'McGregor']

  return (
    <section id="service-areas" className="section-padding bg-stone-50">
      <div className="container-main">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-accent-600 mb-4">Service Areas</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-stone-900 text-balance mb-4">
            Waco Concrete Contractors Serving Nearby Neighborhoods
          </h2>
          <p className="text-lg text-stone-600 text-pretty mb-6">
            From Waco to surrounding communities, we serve homeowners and businesses who need
            contractors in Waco TX for concrete projects that last through heat, rain, and soil movement.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 rounded-full bg-stone-900 text-white text-sm font-semibold">Waco, TX</span>
          {nearbyAreas.map((area) => (
            <span
              key={area}
              className="px-4 py-2 rounded-full bg-white border border-stone-200 text-stone-700 text-sm font-semibold"
            >
              {area}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function DirectoryListings() {
const directories = [
    { label: 'Google Business Profile', url: GOOGLE_REVIEW_URL },
    { label: 'Bing Places', url: 'https://www.bing.com/business/' },
    { label: 'Yelp', url: 'https://www.yelp.com/biz/signup' },
    { label: 'BBB', url: 'https://www.bbb.org/' },
    { label: 'Angi', url: 'https://www.angi.com/companylist?trm=1' },
    { label: 'HomeAdvisor', url: 'https://www.homeadvisor.com/join/' },
    { label: 'Houzz', url: 'https://www.houzz.com/pro' },
    { label: 'Greater Waco Chamber of Commerce', url: 'https://www.gcwtx.com/' },
    { label: 'Facebook Business', url: 'https://www.facebook.com/business' },
  ]

  return (
    <section className="section-padding bg-stone-950 text-white">
      <div className="container-main">
        <div className="max-w-3xl mb-8">
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-accent-400 mb-4">Directory Listings</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-balance text-white">
            Local Citations to Submit Manually
          </h2>
          <p className="text-stone-300 text-pretty mt-4">
            Ask the owner to claim and keep these listings current to support local ranking signals.
            We have not linked these directly yet because profiles and profile IDs are account-specific.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {directories.map((directory) => (
            <li key={directory.label}>
              <p className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white">
                {directory.label}:
                <a href={directory.url} className="ml-2 text-accent-400 hover:text-white underline" target="_blank" rel="noreferrer">
                  Open platform
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function App() {
  useSeo({
    title: 'Waco Concrete Contractors | Concrete Companies Waco TX | Concrete Works LLC',
    description:
      'Need concrete contractors in Waco TX? Concrete Works LLC provides full concrete services in Waco TX for driveways, patios, sidewalks, slabs, and commercial concrete. Fast free estimates: (254) 230-3102.',
    canonical: `${SITE_URL}/`,
    url: `${SITE_URL}/`,
    type: 'website',
    image: DEFAULT_IMAGE,
    imageAlt: 'Concrete Works LLC - Waco, TX concrete contractor',
    jsonLd: buildJsonLdGraph(HomeLocalBusinessSchema()),
  })

  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="order-1 md:order-none">
          <Hero />
        </div>
        <div className="order-2 md:order-none">
          <FeaturedServiceSpotlight />
        </div>
        <div className="order-3 md:order-none">
          <DeferredSection rootMargin="420px 0px" minHeight={480}>
            <Suspense fallback={<SectionFallback className="section-padding bg-white" minHeight={480} />}>
              <Services />
            </Suspense>
          </DeferredSection>
        </div>
        <div className="order-4 md:order-none">
          <ServiceAreas />
        </div>
        <div className="order-5 md:order-none">
          <DeferredSection rootMargin="420px 0px" minHeight={360}>
            <Suspense fallback={<SectionFallback className="section-padding bg-stone-50" minHeight={360} />}>
              <CostQuickAnswers />
            </Suspense>
          </DeferredSection>
        </div>
        <div className="order-6 md:order-none">
          <DeferredSection rootMargin="420px 0px" minHeight={420}>
            <Suspense fallback={<SectionFallback className="section-padding bg-stone-100" minHeight={420} />}>
              <BlogActivityStrip />
            </Suspense>
          </DeferredSection>
        </div>
        <div className="order-7 md:order-none">
          <DeferredSection rootMargin="520px 0px" minHeight={900}>
            <Suspense fallback={<SectionFallback className="section-padding bg-white" minHeight={900} />}>
              <Gallery />
            </Suspense>
          </DeferredSection>
        </div>
        {/* Values - Hidden on mobile to reduce scroll to Gallery */}
        <div className="hidden md:block md:order-none">
          <DeferredSection rootMargin="520px 0px" minHeight={520}>
            <Suspense fallback={<SectionFallback className="section-padding bg-stone-100" minHeight={520} />}>
              <Values />
            </Suspense>
          </DeferredSection>
        </div>
        <div className="order-8 md:order-none">
          <DeferredSection rootMargin="500px 0px" minHeight={680}>
            <Suspense fallback={<SectionFallback className="section-padding bg-white" minHeight={680} />}>
              <Testimonials />
            </Suspense>
          </DeferredSection>
        </div>
        <div className="order-9 md:order-none">
          <DeferredSection rootMargin="520px 0px" minHeight={620}>
            <Suspense fallback={<SectionFallback className="section-padding bg-stone-50" minHeight={620} />}>
              <FAQ />
            </Suspense>
          </DeferredSection>
        </div>
        <div className="order-10 md:order-none">
          <DeferredSection rootMargin="560px 0px" minHeight={760}>
            <Suspense fallback={<SectionFallback className="section-padding bg-stone-50" minHeight={760} />}>
              <Contact />
            </Suspense>
          </DeferredSection>
        </div>
        <div className="order-11 md:order-none">
          <DirectoryListings />
        </div>
      </main>
      <DeferredSection rootMargin="640px 0px" minHeight={680}>
        <Suspense fallback={<SectionFallback minHeight={680} />}>
          <Footer />
        </Suspense>
      </DeferredSection>
    </div>
  )
}

export default App
