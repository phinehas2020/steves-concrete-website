import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { FeaturedServiceSpotlight } from './components/FeaturedServiceSpotlight'
import { CostQuickAnswers } from './components/CostQuickAnswers'
import { BlogActivityStrip } from './components/BlogActivityStrip'
import { Values } from './components/Values'
import { Gallery } from './components/Gallery'
import { Testimonials } from './components/Testimonials'
import { FAQ } from './components/FAQ'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { useSeo, buildJsonLdGraph, SITE_URL, DEFAULT_IMAGE } from './lib/seo'
import { servicePageLinks } from './data/seoServicePages'
import { locationLinks } from './data/locationPages'

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
            Waco, TX Concrete Work in Nearby Neighborhoods
          </h2>
          <p className="text-lg text-stone-600 text-pretty mb-6">
            From Waco to surrounding communities, we serve local homeowners and businesses across central
            Texas for concrete projects that last through heat and weather.
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
    { label: 'Google Business Profile', url: 'https://business.google.com/create' },
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
    title: 'Concrete Contractors Waco TX | Concrete Works LLC',
    description:
      'Looking for trusted concrete contractors in Waco, TX? Concrete Works LLC offers driveways, patios, sidewalks, and commercial concrete services. Call for a free estimate!',
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
          <Services />
        </div>
        <div className="order-4 md:order-none">
          <ServiceAreas />
        </div>
        <div className="order-5 md:order-none">
          <CostQuickAnswers />
        </div>
        <div className="order-6 md:order-none">
          <BlogActivityStrip />
        </div>
        <div className="order-7 md:order-none">
          <Gallery />
        </div>
        {/* Values - Hidden on mobile to reduce scroll to Gallery */}
        <div className="hidden md:block md:order-none">
          <Values />
        </div>
        <div className="order-8 md:order-none">
          <Testimonials />
        </div>
        <div className="order-9 md:order-none">
          <FAQ />
        </div>
        <div className="order-10 md:order-none">
          <Contact />
        </div>
        <DirectoryListings />
      </main>
      <Footer />
    </div>
  )
}

export default App
