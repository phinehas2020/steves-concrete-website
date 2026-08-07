import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Values } from '../components/Values'
import { Testimonials } from '../components/Testimonials'
import { useGoogleReviews } from '../lib/googleReviews'
import { useSeo, SITE_URL, DEFAULT_IMAGE, buildJsonLdGraph, buildBreadcrumbs } from '../lib/seo'

export function About() {
  const aboutReviewsData = useGoogleReviews(8)
  const hasLiveReviews =
    aboutReviewsData.status === 'ready' && aboutReviewsData.reviews.length > 0
  const ratingValue =
    hasLiveReviews && aboutReviewsData.rating ? aboutReviewsData.rating.toFixed(1) : null
  const reviewCount =
    hasLiveReviews && aboutReviewsData.userRatingCount
      ? String(aboutReviewsData.userRatingCount)
      : null

  useSeo({
    title: 'About SLA Concrete Works | Owner-Run Waco Concrete Contractor',
    description:
      'Meet Steve Alexander, owner-operator of SLA Concrete Works LLC, and see how he scopes concrete work around access, drainage, soil, finish, and cure timing.',
    canonical: `${SITE_URL}/about`,
    url: `${SITE_URL}/about`,
    image: DEFAULT_IMAGE,
    imageAlt: 'About Steve and SLA Concrete Works LLC in Waco, TX',
    type: 'website',
    jsonLd: buildJsonLdGraph(
      buildBreadcrumbs([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'About', url: `${SITE_URL}/about` },
      ]),
    ),
  })

  return (
    <div className="min-h-dvh flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        <section className="relative overflow-hidden border-b border-stone-900 bg-stone-950 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                'radial-gradient(circle at 14% 22%, rgba(249, 115, 22, 0.28), transparent 24%), radial-gradient(circle at 82% 18%, rgba(168, 162, 158, 0.12), transparent 20%), linear-gradient(180deg, rgba(28,25,23,0.88), rgba(12,10,9,0.98))',
            }}
          />

          <div className="container-main relative z-10 section-padding">
            <div className="max-w-4xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-300 mb-4">Meet Steve</p>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-balance leading-[1.02]">
                The guy behind the phone call, the estimate, and the final walkthrough.
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-stone-300 text-pretty leading-relaxed">
                If you call SLA Concrete Works LLC, you are usually talking to Steve. He is the one asking
                what is going wrong, what you are trying to build, and whether the site has drainage
                or access issues before he starts talking numbers.
              </p>
              <p className="mt-4 max-w-3xl text-base text-stone-400 text-pretty leading-relaxed">
                His estimates start with the site and the work it actually needs. He looks at access,
                water, base conditions, intended use, and finish before putting the scope in writing.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-lg bg-accent-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
                >
                  Request a free estimate
                </a>
                <a
                  href="tel:254-230-3102"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
                >
                  Call Steve at (254) 230-3102
                </a>
                <a
                  href="/reviews"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
                >
                  Read customer reviews
                </a>
              </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="text-3xl font-display font-bold text-white">Local</div>
                <div className="mt-1 text-sm font-semibold text-stone-100">Waco-area concrete planning</div>
                <div className="mt-2 text-sm leading-relaxed text-stone-400">
                  Long enough to know where black clay, water, and rushed prep usually cause trouble.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="text-3xl font-display font-bold text-white">Owner-run</div>
                <div className="mt-1 text-sm font-semibold text-stone-100">Still walks jobs himself</div>
                <div className="mt-2 text-sm leading-relaxed text-stone-400">
                  The person giving the estimate is still paying attention when the work gets done.
                </div>
              </div>
              {hasLiveReviews && ratingValue && reviewCount ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="text-3xl font-display font-bold text-white">{ratingValue}</div>
                  <div className="mt-1 text-sm font-semibold text-stone-100">
                    Current Google rating across {reviewCount} reviews
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-stone-400">
                    Loaded from the Google Business Profile shown on the reviews page.
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="text-3xl font-display font-bold text-white">Written</div>
                  <div className="mt-1 text-sm font-semibold text-stone-100">Scope before the pour</div>
                  <div className="mt-2 text-sm leading-relaxed text-stone-400">
                    The estimate should state prep, finish, cleanup, exclusions, and next steps.
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <Testimonials reviewsData={aboutReviewsData} />
        <Values />
      </main>
      <Footer />
    </div>
  )
}
