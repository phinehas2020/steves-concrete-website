import { useSeo, SITE_URL } from '../lib/seo'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

const sections = [
  {
    title: 'Information We Collect',
    paragraphs: [
      'When you request an estimate or send a message, we collect the details you submit in our contact form: name, phone number, email, service type, and project message.',
      'We also collect limited technical information when you submit the form, including your IP address, device information, and the page from which you contacted us.',
      'If you call or message us, any information you share in those conversations is also considered part of your request.',
    ],
  },
  {
    title: 'How We Use Your Information',
    bullets: [
      'Respond to your estimate request and follow up with clear next steps.',
      'Schedule site visits, provide scope details, and prepare accurate project estimates.',
      'Send transactional notifications to our team when a new lead is submitted.',
      'Improve customer support and internal workflow for better service delivery.',
    ],
  },
  {
    title: 'Communication and SMS',
    paragraphs: [
      'Lead submissions can trigger SMS notifications from our business phone number to our team.',
      'If you submit your number, we may send SMS or call confirmations related to your request.',
      'Message and reply rates are based on standard carrier and messaging provider charges where applicable.',
    ],
  },
  {
    title: 'Third-Party Service Providers',
    bullets: [
      'Supabase, for secure lead storage and admin dashboard functionality.',
      'Vercel, for hosting and API function execution.',
      'Twilio, for SMS delivery.',
      'Resend, for email delivery.',
      'External mapping or contact tools when you interact with embedded services.',
    ],
  },
  {
    title: 'Data Retention',
    paragraphs: [
      'Lead records are retained for as long as needed to support customer communication, scheduling, and recordkeeping.',
      'You can request correction or removal by contacting us directly.',
    ],
  },
  {
    title: 'Your Rights',
    bullets: [
      'Request access to the personal data we store about your request.',
      'Ask for corrections to your submitted information.',
      'Ask for deletion of your information when appropriate.',
      'Withdraw consent for future SMS or email communications.',
    ],
  },
  {
    title: 'Children and Security',
    paragraphs: [
      'Our services are not directed at children under 13. We do not knowingly collect data from children for marketing purposes.',
      'We use practical safeguards inside our systems and admin access controls to reduce unauthorized access to stored lead information.',
    ],
  },
  {
    title: 'Policy Updates',
    paragraphs: [
      'This policy may change as we add new tools or communication workflows.',
      `Last updated: February 16, 2026. We will post a new date whenever this page is updated.`,
    ],
  },
]

const contactMethods = [
  { label: 'Email', value: 'slaconcrete@gmail.com', href: 'mailto:slaconcrete@gmail.com' },
  { label: 'Phone', value: '(254) 230-3102', href: 'tel:254-230-3102' },
]

export function PrivacyPolicy() {
  useSeo({
    title: 'Privacy Policy | Concrete Works LLC',
    description:
      'How Concrete Works LLC collects, uses, and protects personal data submitted through forms and contact requests.',
    canonical: `${SITE_URL}/privacy-policy`,
    url: `${SITE_URL}/privacy-policy`,
  })

  return (
    <div className="min-h-dvh flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        <section className="bg-white border-b border-stone-200">
          <div className="container-main section-padding">
            <p className="text-xs uppercase tracking-[0.25em] font-bold text-accent-600 mb-3">
              Privacy Policy
            </p>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-stone-900">
              Privacy Policy
            </h1>
            <p className="mt-4 text-stone-600 max-w-3xl text-pretty">
              Concrete Works LLC is committed to clear, practical data handling for leads, communication
              records, and project follow-up.
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

            <div className="mt-8 bg-stone-900 text-stone-100 rounded-2xl px-6 py-5 sm:px-8 sm:py-6 space-y-3">
              <h2 className="font-display font-bold text-lg sm:text-xl">Questions or requests?</h2>
              <p className="text-stone-300 text-pretty">
                If you want to update, correct, or request deletion of your data, contact us directly.
              </p>
              <div className="flex flex-wrap gap-3">
                {contactMethods.map((contact) => (
                  <a
                    key={contact.label}
                    href={contact.href}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-lg text-sm font-medium text-white hover:bg-white/15 transition-colors"
                  >
                    {contact.label}: {contact.value}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
