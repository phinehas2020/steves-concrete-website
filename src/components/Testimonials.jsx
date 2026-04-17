import { useState } from 'react'
import { motion as Motion } from 'motion/react'
import { BadgeCheck, Quote, Star } from 'lucide-react'
import { fadeInUp, viewportConfig } from '../lib/animations'
import steveHeadshot from '../assets/images/steve-headshot.jpg'
import { FALLBACK_GOOGLE_REVIEW_URL } from '../lib/googleReviews'

const testimonials = [
  {
    quote:
      'SLA Concrete Works LLC is professional, very conscientious and did the job at a really fair price. The driveway still looks perfect three years later.',
    author: 'Tim T.',
    location: 'Sanger Heights, Waco',
    project: 'Stamped driveway',
    rating: 5,
  },
  {
    quote:
      'They transformed our backyard with a beautiful stamped patio. The attention to detail was incredible — they even matched the color to our house trim.',
    author: 'Sarah M.',
    location: 'Downtown Temple',
    project: 'Backyard patio',
    rating: 5,
  },
  {
    quote:
      'On time, on budget, and the results exceeded our expectations. Steve explained the whole process and why they do things certain ways. Highly recommend.',
    author: 'Robert J.',
    location: 'Hewitt (Waco area)',
    project: 'Circular driveway',
    rating: 5,
  },
]

const ownerHighlights = [
  'More than 20 years pouring concrete in Central Texas',
  'Knows what black clay soil and bad drainage can do to a slab',
  'Still the one walking jobs and answering questions',
]

function compactReviewText(value, maxLength = 220) {
  const cleaned = String(value || '').replace(/\s+/g, ' ').trim()
  if (cleaned.length <= maxLength) return cleaned

  const shortened = cleaned.slice(0, maxLength).trim()
  const lastSpace = shortened.lastIndexOf(' ')
  return `${(lastSpace > 80 ? shortened.slice(0, lastSpace) : shortened).trim()}...`
}

export function Testimonials({ reviewsData }) {
  const [showAllReviews, setShowAllReviews] = useState(false)
  const hasLiveReviews = reviewsData?.status === 'ready' && reviewsData.reviews.length > 0
  const liveTestimonials = hasLiveReviews
    ? reviewsData.reviews.map((review) => ({
        key: review.id,
        quote: compactReviewText(review.text),
        author: review.authorName,
        authorUri: review.authorUri,
        authorPhotoUri: review.authorPhotoUri,
        location: 'Google review',
        badge: review.relativePublishTimeDescription || 'Recent review',
        rating: review.rating,
      }))
    : []
  const visibleTestimonials = hasLiveReviews
    ? liveTestimonials
    : testimonials.map((testimonial) => ({
        key: testimonial.author,
        ...testimonial,
        badge: testimonial.project,
      }))
  const hasHiddenReviews = hasLiveReviews && visibleTestimonials.length > 2
  const featuredTestimonials =
    hasHiddenReviews && !showAllReviews ? visibleTestimonials.slice(0, 2) : visibleTestimonials
  const stats = [
    {
      value:
        hasLiveReviews && reviewsData?.rating
          ? reviewsData.rating.toFixed(1)
          : '5.0',
      label: 'Average rating',
      detail: hasLiveReviews ? '' : 'Based on verified client feedback',
    },
    {
      value:
        hasLiveReviews && reviewsData?.userRatingCount
          ? `${reviewsData.userRatingCount}+`
          : '47+',
      label: 'Verified reviews',
      detail: hasLiveReviews ? '' : 'Homeowners and business owners',
    },
    {
      value: '20+',
      label: 'Years in business',
      detail: 'Local experience in Waco and nearby cities',
    },
  ]
  const reviewsLink =
    reviewsData?.reviewUri || reviewsData?.placeUri || FALLBACK_GOOGLE_REVIEW_URL
  const leaveReviewLink =
    reviewsData?.writeReviewUri || reviewsData?.reviewUri || reviewsData?.placeUri || FALLBACK_GOOGLE_REVIEW_URL
  const reviewsCtaLabel =
    hasLiveReviews && reviewsData?.userRatingCount
      ? `See all ${reviewsData.userRatingCount} Google reviews`
      : 'See all reviews'

  return (
    <section id="about" className="section-padding bg-white texture-grain-light relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 12% 15%, rgba(249, 115, 22, 0.12), transparent 28%), radial-gradient(circle at 88% 18%, rgba(120, 113, 108, 0.12), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.94))',
        }}
      />

      <div className="container-main relative z-10">
        <Motion.div
          className="max-w-3xl mb-10 md:mb-14"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <span className="inline-block text-accent-600 font-semibold text-sm uppercase tracking-wide mb-3">
            About the Owner
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 text-balance mb-4">
            Meet Steve
          </h2>
          <p className="text-lg text-stone-600 text-pretty max-w-2xl">
            Steve still runs the business the same way he always has. He answers straight, shows up,
            and wants the concrete to hold up long after he leaves the jobsite.
          </p>
        </Motion.div>

        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <Motion.div
            className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-950 text-white shadow-2xl shadow-stone-200/40"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.35),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.45))]" />
            <div className="relative p-5 sm:p-6">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-stone-900">
                <img
                  src={steveHeadshot}
                  alt="Steve from SLA Concrete Works LLC"
                  className="h-[34rem] w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-200">
                    Owner-operator
                  </div>
                  <h3 className="mt-3 font-display font-bold text-2xl text-white">Steve</h3>
                  <p className="mt-1 text-sm text-stone-300">
                    The guy you talk to up front and the one still checking the job before it wraps.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <BadgeCheck className="size-5 text-accent-300" />
                  <span className="text-sm font-semibold text-white">You work with the owner</span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {ownerHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Motion.div>

          <div className="space-y-6">
            <Motion.div
              className="rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8 shadow-sm"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.05 }}
            >
              <p className="text-xs uppercase tracking-[0.24em] font-bold text-accent-600 mb-4">
                Why people hire Steve
              </p>
              <blockquote className="relative">
                <Quote className="absolute -top-1 -left-1 size-7 text-stone-200" aria-hidden="true" />
                <p className="pl-6 text-lg sm:text-xl text-stone-700 text-pretty leading-relaxed">
                  Around Waco, the finish gets all the attention. Steve worries just as much about
                  the base, the drainage, and the timing, because that is usually what decides if a
                  slab holds up.
                </p>
              </blockquote>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-stone-50 border border-stone-200 p-4">
                    <div className="text-3xl font-display font-bold text-stone-900">{stat.value}</div>
                    <div className="mt-1 text-sm font-semibold text-stone-700">{stat.label}</div>
                    {stat.detail ? (
                      <div className="mt-1 text-xs leading-relaxed text-stone-500">{stat.detail}</div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="/reviews"
                  className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
                >
                  See all reviews
                </a>
                <a
                  href={leaveReviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
                >
                  Leave a review
                </a>
              </div>
            </Motion.div>

            <div className="grid gap-4 md:grid-cols-2">
              {featuredTestimonials.map((testimonial, index) => (
                <Motion.article
                  key={testimonial.key}
                  className="flex h-full flex-col rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <div className="flex gap-1 mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="size-4 fill-accent-500 text-accent-500" aria-hidden="true" />
                    ))}
                  </div>

                  <blockquote className="relative mb-5 flex-1">
                    <Quote className="absolute -top-1 -left-1 size-5 text-stone-200" aria-hidden="true" />
                    <p className="pl-4 text-sm leading-relaxed text-stone-700 text-pretty">
                      {testimonial.quote}
                    </p>
                  </blockquote>

                  <div className="flex items-start justify-between gap-4 border-t border-stone-200 pt-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {testimonial.authorPhotoUri ? (
                        <img
                          src={testimonial.authorPhotoUri}
                          alt={testimonial.author}
                          className="size-10 rounded-full object-cover"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-stone-600">
                          {testimonial.author.charAt(0)}
                        </div>
                      )}

                      <div className="min-w-0">
                        {testimonial.authorUri ? (
                          <a
                            href={testimonial.authorUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate font-semibold text-stone-900 text-sm hover:text-accent-600"
                          >
                            {testimonial.author}
                          </a>
                        ) : (
                          <div className="font-semibold text-stone-900 text-sm">{testimonial.author}</div>
                        )}
                        <div className="text-xs text-stone-500">{testimonial.location}</div>
                      </div>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                      {testimonial.badge}
                    </span>
                  </div>

                  {hasLiveReviews ? (
                    <div className="mt-4 border-t border-stone-200 pt-4">
                      <a
                        href="/reviews"
                        className="text-sm font-semibold text-accent-600 transition-colors hover:text-accent-700"
                      >
                        Read the full review
                      </a>
                    </div>
                  ) : null}
                </Motion.article>
              ))}
            </div>

            {hasLiveReviews ? (
              <div className="rounded-[2rem] border border-stone-200 bg-stone-50 px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      Live from Google Business Profile
                    </p>
                    <p className="text-sm text-stone-600">
                      {showAllReviews
                        ? 'Showing the full review list here on the homepage.'
                        : 'Start with a couple of recent reviews, then open the full list if you want to read more.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {hasHiddenReviews ? (
                      <button
                        type="button"
                        onClick={() => setShowAllReviews((current) => !current)}
                        className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
                      >
                        {showAllReviews ? 'Show fewer reviews' : `See more reviews (${visibleTestimonials.length})`}
                      </button>
                    ) : null}

                    <a
                      href="/reviews"
                      className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100"
                    >
                      {reviewsCtaLabel}
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
