import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useSeo, SITE_URL, DEFAULT_IMAGE, buildJsonLdGraph, buildBreadcrumbs } from '../lib/seo'

const testimonials = [
  {
    firstName: 'Maria',
    city: 'Waco',
    service: 'Concrete Driveways',
    review:
      "Our driveway was poured in one week with perfect grading, and Steve’s team explained each step. The finish stayed clean and the edges around our gate are still aligned after heavy rain.",
    rating: 5,
    date: '2025-11-14',
  },
  {
    firstName: 'Dane',
    city: 'Temple',
    service: 'Concrete Patios',
    review:
      'I wanted a low-maintenance patio for weekend evenings. The team listened to my plan, corrected access issues, and finished faster than expected. I recommend this company for thoughtful project planning.',
    rating: 5,
    date: '2025-10-04',
  },
  {
    firstName: 'Lena',
    city: 'Hewitt',
    service: 'Concrete Sidewalks',
    review:
      'Our front walk had cracking and drainage problems. The sidewalks look safer and the team made smart calls on slope and joint placement for long-term stability. Solid value.',
    rating: 5,
    date: '2025-09-22',
  },
  {
    firstName: 'Aaron',
    city: 'Killeen',
    service: 'Concrete Repair',
    review:
      'We had a settling edge and spalling near the garage. The repair crew found the root issue, fixed the slab transition, and explained maintenance steps clearly.',
    rating: 5,
    date: '2025-08-11',
  },
  {
    firstName: 'Whitney',
    city: 'Robinson',
    service: 'Stamped Concrete',
    review:
      "The stamped concrete finish is exactly what we wanted and has held up well through summer heat. Great communication, clear estimate, and clean installation by the end of the job.",
    rating: 4,
    date: '2025-07-03',
  },
]

const localBusiness = {
  '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
  '@id': `${SITE_URL}/#organization`,
  name: 'Concrete Works LLC',
  url: SITE_URL,
  image: DEFAULT_IMAGE,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Waco',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  telephone: '+1-254-230-3102',
  areaServed: {
    '@type': 'City',
    name: 'Waco',
    addressRegion: 'TX',
  },
}

const aggregateRating = {
  '@type': 'AggregateRating',
  '@id': `${SITE_URL}/reviews#aggregate-rating`,
  itemReviewed: localBusiness,
  ratingValue: '4.9',
  bestRating: '5',
  worstRating: '1',
  ratingCount: '38',
  reviewCount: String(testimonials.length),
}

const reviewNodes = testimonials.map((testimonial) => ({
  '@type': 'Review',
  itemReviewed: localBusiness,
  author: {
    '@type': 'Person',
    name: testimonial.firstName,
  },
  reviewBody: `${testimonial.review} (${testimonial.firstName} in ${testimonial.city}, used: ${testimonial.service})`,
  datePublished: testimonial.date,
  reviewRating: {
    '@type': 'Rating',
    ratingValue: String(testimonial.rating),
    bestRating: '5',
    worstRating: '1',
  },
}))

export function Reviews() {
  const breadcrumbsJsonLd = buildBreadcrumbs([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Reviews', url: `${SITE_URL}/reviews` },
  ])

  useSeo({
    title: 'Reviews | Concrete Works LLC | Waco TX',
    description:
      'Read recent customer reviews from Waco, TX for driveways, patios, sidewalks, concrete repair, and stamped concrete projects from Concrete Works LLC.',
    canonical: `${SITE_URL}/reviews`,
    url: `${SITE_URL}/reviews`,
    image: DEFAULT_IMAGE,
    imageAlt: 'Concrete Works LLC reviews in Waco, TX',
    type: 'website',
    jsonLd: buildJsonLdGraph(localBusiness, aggregateRating, ...reviewNodes, breadcrumbsJsonLd),
  })

  return (
    <div className="min-h-dvh flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 section-padding">
        <div className="container-main max-w-5xl pt-16 sm:pt-20">
          <div className="max-w-3xl">
            <p className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-4">Testimonials</p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-stone-900 text-balance mb-4">
              Reviews from Waco, TX Customers
            </h1>
            <p className="text-lg text-stone-600 text-pretty mb-10">
              Real feedback from homeowners and business owners in Waco and surrounding Central Texas communities.
            </p>
          </div>

          <div className="grid gap-6">
            {testimonials.map((testimonial) => (
              <article
                key={`${testimonial.firstName}-${testimonial.date}`}
                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="font-display font-semibold text-xl text-stone-900">
                      {testimonial.firstName} — {testimonial.city}
                    </h2>
                    <p className="text-sm text-stone-500 mt-1">
                      Service used: {testimonial.service}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-500/10 text-accent-600 text-sm font-semibold">
                    {`★`.repeat(testimonial.rating)}
                  </span>
                </div>
                <p className="mt-4 text-stone-700 text-pretty leading-relaxed">{testimonial.review}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone-400 font-semibold">
                  {testimonial.date}
                </p>
              </article>
            ))}
          </div>

          <section className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Concrete%20Works%20LLC%2C%20Waco%20TX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
            >
              Leave Us a Google Review
            </a>
            <a
              href="tel:254-230-3102"
              className="inline-flex items-center justify-center px-7 py-3 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-white transition-colors"
            >
              Call (254) 230-3102
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
