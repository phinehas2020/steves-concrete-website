import { useSeo, SITE_URL } from '../lib/seo'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

const sections = [
  {
    title: 'Acceptance',
    paragraphs: [
      'By using this website or contacting Concrete Works LLC, you agree to these Terms and Conditions.',
      'If you do not agree, please do not use this site, request an estimate, or rely on information published here.',
    ],
  },
  {
    title: 'Scope Of Services',
    bullets: [
      'We provide concrete contracting services in and around Central Texas, including Waco and surrounding communities.',
      'All estimates and scheduling discussions are based on information shared by the client and current site conditions.',
      'Final pricing and timeline are confirmed only after a formal estimate and on-site assessment.',
    ],
  },
  {
    title: 'Estimates and Quotes',
    bullets: [
      'Any estimate may change after a full scope review, weather change, hidden drainage issues, or additional permit requirements.',
      'Quoted prices are valid for the scope, measurements, and conditions at the time of estimate unless written changes are agreed in advance.',
      'Payment terms are discussed before work begins and confirmed in project-specific paperwork.',
    ],
  },
  {
    title: 'Client Responsibilities',
    bullets: [
      'Provide clear access and accurate project details before and during work.',
      'Keep the site clear of obstructions and flag known utility, line, or driveway access constraints.',
      'Ensure pets and children are kept out of active work zones while crews are on site.',
    ],
  },
  {
    title: 'Scheduling, Delays, and Weather',
    paragraphs: [
      'Weather, utility conflicts, material availability, and safety conditions may require schedule changes.',
      'We will communicate changes promptly and work with you to confirm the next practical date.',
    ],
  },
  {
    title: 'Liability',
    paragraphs: [
      'We carry industry-standard liability insurance for business operations.',
      'Any claims for damage, material disputes, or workmanship concerns must be reported promptly to allow immediate review.',
      'Our obligations are limited to the services clearly described in the project scope unless otherwise required by law.',
    ],
  },
  {
    title: 'Communication',
    bullets: [
      'By submitting your information, you consent to receive texts and emails related to your estimate request.',
      'For SMS, rates and message frequency may apply based on your carrier and chosen settings.',
      'Reply STOP to opt out of promotional messaging; you may still receive essential project-related notices.',
    ],
  },
  {
    title: 'Disclaimer',
    paragraphs: [
      'Concrete Works LLC does not guarantee a crack-free or maintenance-free slab under extreme movement, load changes, or abnormal weather events.',
      'Long-term performance depends on subgrade, cure practices, load expectations, and homeowner maintenance.',
    ],
  },
  {
    title: 'Contact',
    paragraphs: [
      'Questions about these Terms? You can contact us at slaconcrete@gmail.com or call (254) 230-3102.',
      `Last updated: February 16, 2026. We may update these terms and will post the latest date here when changed.`,
    ],
  },
]

export function TermsAndConditions() {
  useSeo({
    title: 'Terms and Conditions | Concrete Works LLC',
    description:
      'Service terms for Concrete Works LLC, including estimates, scheduling, responsibility, and communication terms.',
    canonical: `${SITE_URL}/terms-and-conditions`,
    url: `${SITE_URL}/terms-and-conditions`,
  })

  return (
    <div className="min-h-dvh flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        <section className="bg-white border-b border-stone-200">
          <div className="container-main section-padding">
            <p className="text-xs uppercase tracking-[0.25em] font-bold text-accent-600 mb-3">Legal</p>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-stone-900">
              Terms and Conditions
            </h1>
            <p className="mt-4 text-stone-600 max-w-3xl text-pretty">
              Concrete Works LLC uses practical terms that define what to expect before, during, and after every job.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-main max-w-4xl">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-8">
              {sections.map((section) => (
                <section key={section.title} className="space-y-3">
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                    {section.title}
                  </h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph} className="text-stone-600 leading-relaxed text-pretty">
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="space-y-2 pl-5 text-stone-600">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="list-disc">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
