import fs from 'node:fs/promises'
import path from 'node:path'
import { servicePages as servicePageData } from '../src/data/servicePages.js'
import { guidePages as guidePageData } from '../src/data/guides.js'
import { sportsCourtAreaPages as sportsCourtAreaPageData } from '../src/data/sportsCourtAreaPages.js'
import { FAQ_ITEMS } from '../src/data/faqs.js'

const projectRoot = process.cwd()
const distDir = path.join(projectRoot, 'dist')
const indexPath = path.join(distDir, 'index.html')

const SITE_URL = 'https://www.concretewaco.com'
const SITE_NAME = 'Concrete Works LLC'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`
const PHONE_DISPLAY = '(254) 230-3102'
const PHONE_HREF = 'tel:254-230-3102'

const homeMeta = {
  title: 'Concrete Contractor Waco TX | Driveways, Patios & Stamped Concrete | Concrete Works LLC',
  description:
    'Concrete Works LLC is a Waco, Texas concrete contractor with 20+ years experience. We specialize in stamped concrete driveways, decorative patios, and commercial concrete. Free estimates: (254) 230-3102.',
  canonical: `${SITE_URL}/`,
  h1: 'Concrete Contractor Waco TX',
}

const locationPages = [
  {
    city: 'Waco',
    slug: 'waco-tx-concrete-contractor',
    nearbyAreas: ['Woodway', 'Hewitt', 'Bellmead', 'Robinson', 'China Spring', 'Lorena'],
    intro:
      'We design concrete for black clay movement, summer heat, and the drainage issues common in McLennan County neighborhoods.',
  },
  {
    city: 'Temple',
    slug: 'temple-tx-concrete-contractor',
    nearbyAreas: ['Belton', "Morgan's Point", 'Little River-Academy', 'Salado', 'Troy'],
    intro:
      'Temple projects often combine driveway replacements with patio upgrades, so layout and slope planning are handled together.',
  },
  {
    city: 'Killeen',
    slug: 'killeen-tx-concrete-contractor',
    nearbyAreas: ['Harker Heights', 'Fort Cavazos', 'Nolanville', 'Copperas Cove', 'Belton'],
    intro:
      'Killeen slabs and driveways are planned for heavy daily traffic, long sun exposure, and fast scheduling needs.',
  },
  {
    city: 'Hewitt',
    slug: 'hewitt-tx-concrete-contractor',
    nearbyAreas: ['Woodway', 'Waco', 'Lorena', 'Robinson', 'Beverly Hills'],
    intro:
      'Hewitt homeowners typically choose decorative patio and driveway upgrades, with extra attention to clean transitions and curb appeal.',
  },
  {
    city: 'Woodway',
    slug: 'woodway-tx-concrete-contractor',
    nearbyAreas: ['Waco', 'Hewitt', 'Robinson', 'China Spring', 'Lorena'],
    intro:
      'Woodway projects prioritize polished finishes and long-term performance through freeze-thaw shifts and extreme summer heat.',
  },
  {
    city: 'Robinson',
    slug: 'robinson-tx-concrete-contractor',
    nearbyAreas: ['Waco', 'Hewitt', 'Woodway', 'Lorena', 'Bruceville-Eddy'],
    intro:
      'Robinson work often includes driveway replacements, slab repairs, and utility pads where strong base prep is critical.',
  },
  {
    city: 'Lorena',
    slug: 'lorena-tx-concrete-contractor',
    nearbyAreas: ['Waco', 'Hewitt', 'Robinson', 'Woodway', 'Golinda'],
    intro:
      'Lorena properties benefit from precise grading and moisture control that reduce long-term slab movement.',
  },
  {
    city: 'McGregor',
    slug: 'mcgregor-tx-concrete-contractor',
    nearbyAreas: ['Waco', 'Moody', 'Gatesville', 'Woodway', 'Oglesby'],
    intro:
      'McGregor projects frequently involve shop slabs and driveways where load planning and reinforcement matter most.',
  },
]

const staticRoutes = [
  {
    path: '/blog',
    title: 'Concrete Tips & Project Ideas | Concrete Works LLC',
    description:
      'Concrete tips, project ideas, and local insights from Concrete Works LLC in Waco, TX.',
    h1: 'Concrete Tips & Project Ideas',
    renderContent: renderBlogIndexContent,
  },
  {
    path: '/jobs',
    title: 'Concrete Project Gallery | Concrete Works LLC',
    description:
      'View recent concrete driveways, patios, stamped finishes, and commercial projects across Waco and Central Texas.',
    h1: 'Concrete Project Gallery',
    renderContent: renderJobsIndexContent,
  },
  {
    path: '/guides',
    title: 'Concrete Pricing Guides in Waco, TX | Concrete Works LLC',
    description:
      'Local pricing guides for concrete driveways, patios, and stamped concrete in Waco, TX. Built from real project experience.',
    h1: 'Concrete Pricing Guides in Waco, TX',
    renderContent: renderGuidesIndexContent,
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Concrete Works LLC',
    description:
      'Read how Concrete Works LLC collects, uses, and protects personal information submitted through website lead forms and communications.',
    h1: 'Privacy Policy',
    renderContent: renderPrivacyPolicyContent,
  },
  {
    path: '/terms-and-conditions',
    title: 'Terms and Conditions | Concrete Works LLC',
    description:
      'Review the terms for estimates, scheduling, communication, and service scope for Concrete Works LLC.',
    h1: 'Terms and Conditions',
    renderContent: renderTermsAndConditionsContent,
  },
]

const serviceLinks = servicePageData.map((service) => ({
  label: service.title,
  href: `/services/${service.slug}`,
  description: service.heroSubtitle,
}))

const guideLinks = guidePageData.map((guide) => ({
  label: guide.title,
  href: `/guides/${guide.slug}`,
  description: guide.heroSubtitle,
}))

const locationLinks = locationPages.map((location) => ({
  label: `${location.city} concrete contractor`,
  href: `/${location.slug}`,
  description: location.intro,
}))

const sportsCourtAreaLinks = sportsCourtAreaPageData.map((area) => ({
  label: `Sports court coating in ${area.areaName}`,
  href: `/sports-court-coating/${area.slug}`,
  description: area.heroSubtitle,
}))

const routeMeta = [
  {
    path: '/',
    ...homeMeta,
    contentHtml: renderHomeContent(),
  },
  ...servicePageData.map((service) => ({
    path: `/services/${service.slug}`,
    title: service.seoTitle || `${service.title} Waco TX | ${SITE_NAME}`,
    description:
      service.seoDescription || `${service.title} in Waco, TX. Free estimate: ${PHONE_DISPLAY}.`,
    canonical: `${SITE_URL}/services/${service.slug}`,
    h1: service.heroTitle,
    contentHtml: renderServiceContent(service),
  })),
  ...locationPages.map((location) => ({
    path: `/${location.slug}`,
    title: `${location.city} TX Concrete Contractor | ${SITE_NAME}`,
    description:
      `${location.city} concrete contractor for driveways, patios, stamped concrete, and slab work. Free estimate: ${PHONE_DISPLAY}.`,
    canonical: `${SITE_URL}/${location.slug}`,
    h1: `${location.city}, TX Concrete Contractor`,
    contentHtml: renderLocationContent(location),
  })),
  ...sportsCourtAreaPageData.map((area) => ({
    path: `/sports-court-coating/${area.slug}`,
    title: area.seoTitle || `${area.heroTitle} | ${SITE_NAME}`,
    description: area.seoDescription,
    canonical: `${SITE_URL}/sports-court-coating/${area.slug}`,
    h1: area.heroTitle,
    contentHtml: renderSportsCourtAreaContent(area),
  })),
  ...guidePageData.map((guide) => ({
    path: `/guides/${guide.slug}`,
    title: guide.seoTitle || `${guide.title} | ${SITE_NAME}`,
    description: guide.seoDescription,
    canonical: `${SITE_URL}/guides/${guide.slug}`,
    h1: guide.heroTitle,
    contentHtml: renderGuideContent(guide),
  })),
  ...staticRoutes.map((route) => ({
    path: route.path,
    title: route.title,
    description: route.description,
    canonical: `${SITE_URL}${route.path}`,
    h1: route.h1,
    contentHtml: route.renderContent(),
  })),
]

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function normalizeCanonical(url) {
  const value = String(url || '').trim()
  if (!value) return `${SITE_URL}/`
  if (value === SITE_URL || value === `${SITE_URL}/`) return `${SITE_URL}/`
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function truncateSentence(value, maxLength = 150) {
  const clean = String(value || '').replace(/\s+/g, ' ').trim()
  if (!clean || clean.length <= maxLength) return clean
  return `${clean.slice(0, maxLength - 1).trim()}...`
}

function renderActionLinks(links) {
  if (!links || links.length === 0) return ''
  return `<p style="margin:20px 0 0;display:flex;flex-wrap:wrap;gap:10px;">${links
    .map(
      (link) =>
        `<a href="${escapeHtml(link.href)}" style="display:inline-block;padding:10px 14px;border:1px solid #d6d3d1;border-radius:10px;color:#1c1917;font-weight:600;text-decoration:none;">${escapeHtml(link.label)}</a>`,
    )
    .join('')}</p>`
}

function renderBulletList(items, ordered = false) {
  if (!items || items.length === 0) return ''
  const tag = ordered ? 'ol' : 'ul'
  const listStyle = ordered
    ? 'padding:0 0 0 22px;margin:0 0 12px;color:#44403c;'
    : 'padding:0 0 0 18px;margin:0 0 12px;color:#44403c;'

  return `<${tag} style="${listStyle}">${items
    .map((item) => `<li style="margin:0 0 8px;">${escapeHtml(item)}</li>`)
    .join('')}</${tag}>`
}

function renderLinkList(items) {
  if (!items || items.length === 0) return ''
  return `<ul style="list-style:none;padding:0;margin:0;display:grid;gap:10px;">${items
    .map(
      (item) =>
        `<li style="border:1px solid #e7e5e4;border-radius:12px;padding:12px 14px;background:#fff;"><a href="${escapeHtml(item.href)}" style="font-weight:700;color:#1c1917;text-decoration:none;">${escapeHtml(item.label)}</a>${
          item.description
            ? `<p style="margin:6px 0 0;color:#57534e;font-size:0.95rem;">${escapeHtml(
                truncateSentence(item.description, 170),
              )}</p>`
            : ''
        }</li>`,
    )
    .join('')}</ul>`
}

function renderFaqList(items) {
  if (!items || items.length === 0) return ''
  return items
    .map(
      (item) =>
        `<article style="margin:0 0 14px;padding:12px 14px;border:1px solid #e7e5e4;border-radius:12px;background:#fff;"><h3 style="margin:0 0 8px;font-size:1.05rem;color:#1c1917;">${escapeHtml(
          item.question,
        )}</h3><p style="margin:0;color:#57534e;">${escapeHtml(item.answer)}</p></article>`,
    )
    .join('')
}

function renderSection({ title, paragraphs = [], bullets = [], orderedBullets = false, links = [], faq = [] }) {
  const paragraphHtml = paragraphs
    .filter(Boolean)
    .map((paragraph) => `<p style="margin:0 0 12px;color:#57534e;">${escapeHtml(paragraph)}</p>`)
    .join('')

  return `<section style="margin-top:28px;">${
    title
      ? `<h2 style="margin:0 0 10px;font-size:1.45rem;line-height:1.3;color:#1c1917;">${escapeHtml(
          title,
        )}</h2>`
      : ''
  }${paragraphHtml}${renderBulletList(bullets, orderedBullets)}${renderLinkList(links)}${renderFaqList(
    faq,
  )}</section>`
}

function renderPage({
  eyebrow,
  title,
  subtitle,
  introParagraphs = [],
  sections = [],
  actionLinks = [],
}) {
  const introHtml = introParagraphs
    .filter(Boolean)
    .map((paragraph) => `<p style="margin:0 0 14px;color:#57534e;">${escapeHtml(paragraph)}</p>`)
    .join('')

  return `<main data-prerender-content="true" style="max-width:980px;margin:0 auto;padding:96px 20px 64px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.65;background:#fafaf9;color:#1c1917;"><p style="margin:0 0 8px;font-size:0.82rem;letter-spacing:0.08em;text-transform:uppercase;color:#ea580c;font-weight:700;">${escapeHtml(
    eyebrow,
  )}</p><h1 style="margin:0 0 14px;font-size:clamp(2rem,3.5vw,3rem);line-height:1.15;color:#1c1917;">${escapeHtml(
    title,
  )}</h1><p style="margin:0 0 16px;color:#44403c;font-size:1.05rem;">${escapeHtml(
    subtitle,
  )}</p>${introHtml}${renderActionLinks(actionLinks)}${sections.map((section) => renderSection(section)).join('')}</main>`
}

function renderHomeContent() {
  return renderPage({
    eyebrow: 'Waco Concrete Contractor',
    title: 'Concrete Contractor Waco TX',
    subtitle:
      'Licensed and insured concrete contractor serving Waco and surrounding Central Texas communities since 2005.',
    introParagraphs: [
      `${SITE_NAME} builds driveways, patios, stamped concrete, foundations, and repair projects designed for black clay soil movement, heavy heat cycles, and daily traffic.`,
      `When people search for a Waco concrete contractor, they usually need clear pricing, honest timelines, and work that stays level after the first summer. Our process starts with site prep, slope planning, reinforcement, and realistic cure guidance so the finished slab performs for years.` ,
      `Call ${PHONE_DISPLAY} for a free estimate. Most leads get a same-day response and a clear next-step plan for site visit, scope, and scheduling.`,
    ],
    actionLinks: [
      { href: '/#contact', label: 'Request free estimate' },
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
      { href: '/guides', label: 'View local pricing guides' },
    ],
    sections: [
      {
        title: 'Our most requested concrete services in Waco',
        paragraphs: [
          'Each service page includes local planning notes, cost factors, and the exact process we use from estimate through finish.',
        ],
        links: serviceLinks,
      },
      {
        title: 'What keeps concrete projects stable in Central Texas',
        bullets: [
          'Compaction and base prep designed for expansion and contraction in McLennan County clay soil.',
          'Drainage-first layout so water moves away from slabs, foundations, and home entries.',
          'Joint planning and reinforcement that reduce random cracking and long-term movement risk.',
          'Cure timing guidance tailored to current weather so new concrete is protected early.',
        ],
      },
      {
        title: 'Waco concrete cost guides',
        paragraphs: [
          'These guides explain common price ranges, cost drivers, and planning checklists so you can budget before requesting a quote.',
        ],
        links: guideLinks,
      },
      {
        title: 'Service areas across Central Texas',
        paragraphs: [
          'We routinely work in Waco, Temple, Killeen, Hewitt, Woodway, Robinson, Lorena, and McGregor.',
        ],
        links: locationLinks,
      },
      {
        title: 'Sports court coating target areas',
        paragraphs: [
          'We are expanding sports-court resurfacing coverage with location pages for high-demand Texas markets and nearby metro areas.',
        ],
        links: sportsCourtAreaLinks,
      },
      {
        title: 'Common questions from homeowners and property managers',
        faq: FAQ_ITEMS,
      },
      {
        title: 'What happens after you contact us',
        bullets: [
          'We review project details, location, and timeline goals during the first call.',
          'A site visit confirms access, drainage, measurements, and finish options.',
          'You receive a detailed estimate with clear scope, timeline, and pricing assumptions.',
          'Once approved, we schedule prep, pour, finishing, and cure milestones with updates.',
        ],
        orderedBullets: true,
      },
    ],
  })
}

function renderServiceContent(service) {
  const relatedServiceLinks = servicePageData
    .filter((item) => item.slug !== service.slug)
    .slice(0, 6)
    .map((item) => ({
      label: item.title,
      href: `/services/${item.slug}`,
      description: item.heroSubtitle,
    }))

  const localizedGuideLinks = service.pricingGuide
    ? [
        {
          label: service.pricingGuide.title,
          href: service.pricingGuide.href,
          description: service.pricingGuide.description,
        },
      ]
    : guideLinks.slice(0, 3)

  const processSteps = (service.process || []).map(
    (step, index) => `Step ${index + 1}: ${step.title} - ${step.description}`,
  )

  const localNotes = (service.localNotes || []).map(
    (note) => `${note.title}: ${note.description}`,
  )

  return renderPage({
    eyebrow: 'Service Detail',
    title: service.heroTitle,
    subtitle: service.heroSubtitle,
    introParagraphs: [
      service.intro,
      `Our ${service.title.toLowerCase()} work is scoped for Central Texas conditions and backed by clear communication from estimate through final walkthrough.`,
    ],
    actionLinks: [
      { href: '/#contact', label: 'Request estimate' },
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
      ...(service.pricingGuide ? [{ href: service.pricingGuide.href, label: 'View pricing guide' }] : []),
    ],
    sections: [
      {
        title: `What is included in ${service.title.toLowerCase()}`,
        bullets: service.benefits || [],
      },
      {
        title: `How we deliver ${service.title.toLowerCase()} projects`,
        bullets: processSteps,
        orderedBullets: true,
      },
      {
        title: 'Local planning details for Waco and nearby cities',
        bullets: localNotes,
      },
      {
        title: 'Cost factors and scheduling expectations',
        paragraphs: [
          'Final pricing depends on access, base prep, drainage correction, slab thickness, and finish complexity.',
          service.timeline || 'Most projects include prep day, pour/finish day, and cure guidance before use.',
        ],
        bullets: service.costFactors || [],
      },
      {
        title: 'Related pricing resources',
        links: localizedGuideLinks,
      },
      {
        title: 'Other concrete services you may need',
        links: relatedServiceLinks,
      },
      {
        title: 'Service locations',
        links: locationLinks,
      },
      {
        title: `${service.title} FAQs`,
        faq: service.faq || [],
      },
    ],
  })
}

function renderLocationContent(location) {
  const cityServiceLinks = serviceLinks.slice(0, 8)
  const nearby = (location.nearbyAreas || []).map((area) => `${area}, TX`)

  const locationFaq = [
    {
      question: `Do you offer free estimates in ${location.city}?`,
      answer: `Yes. We schedule free, no-obligation estimates for ${location.city} projects and nearby communities.`,
    },
    {
      question: `What types of concrete projects do you handle in ${location.city}?`,
      answer:
        'Driveways, patios, stamped concrete, concrete repair, foundations, slabs, sealing, and leveling projects for residential and light commercial properties.',
    },
    {
      question: `How quickly can my ${location.city} project be scheduled?`,
      answer:
        'Timing depends on scope and weather, but we provide clear availability and sequence during estimate so there are no surprises.',
    },
  ]

  return renderPage({
    eyebrow: `${location.city} Service Area`,
    title: `${location.city}, TX Concrete Contractor`,
    subtitle: `Concrete driveways, patios, stamped finishes, repairs, and slab work in ${location.city} and surrounding areas.`,
    introParagraphs: [
      location.intro,
      `If you are comparing concrete contractors in ${location.city}, focus on site prep, drainage planning, joint layout, and documented cure guidance. Those details determine how the slab performs long after the project is finished.`,
      `Most ${location.city} jobs combine performance goals with curb-appeal upgrades, so we confirm access, grade transitions, and finish priorities before work begins.`,
    ],
    actionLinks: [
      { href: '/#contact', label: `Request ${location.city} estimate` },
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
    ],
    sections: [
      {
        title: `Concrete services available in ${location.city}`,
        links: cityServiceLinks,
      },
      {
        title: `Nearby areas around ${location.city}`,
        bullets: nearby,
      },
      {
        title: `Project planning checklist for ${location.city}`,
        bullets: [
          'Measure project footprint and note any drainage or pooling concerns.',
          'Choose finish goals: broom, exposed aggregate, stamped, or stained concrete.',
          'Identify demolition or haul-off needs if older concrete is being replaced.',
          'Confirm truck and crew access paths to avoid schedule delays.',
          'Set target timing for estimate, prep, pour, and cure milestones.',
        ],
      },
      {
        title: 'Pricing and planning resources',
        links: guideLinks,
      },
      {
        title: `${location.city} concrete FAQs`,
        faq: locationFaq,
      },
    ],
  })
}

function renderSportsCourtAreaContent(area) {
  const relatedAreaLinks = sportsCourtAreaLinks
    .filter((item) => item.href !== `/sports-court-coating/${area.slug}`)
    .slice(0, 6)

  const serviceBullets = (area.services || []).map(
    (service) => `${service.title}: ${service.description}`,
  )
  const processBullets = (area.process || []).map(
    (step, index) => `Step ${index + 1}: ${step.title} - ${step.description}`,
  )
  const localFocusBullets = (area.localFocus || []).map(
    (item) => `${item.title}: ${item.description}`,
  )
  const nearbyAreaBullets = (area.nearbyAreas || []).map((nearby) => `${nearby}, service coverage available`)

  return renderPage({
    eyebrow: 'Sports Court Coating Area',
    title: area.heroTitle,
    subtitle: area.heroSubtitle,
    introParagraphs: [
      area.intro,
      `Property owners in ${area.areaName} often prioritize traction, line clarity, and coating longevity. Our resurfacing process is structured around those outcomes.`,
    ],
    actionLinks: [
      { href: '/#contact', label: `Request ${area.areaName} quote` },
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
      { href: '/jobs', label: 'View project gallery' },
    ],
    sections: [
      {
        title: `Sports court services in ${area.areaName}`,
        bullets: serviceBullets,
      },
      {
        title: 'How the resurfacing process works',
        bullets: processBullets,
        orderedBullets: true,
      },
      {
        title: `${area.areaName} planning considerations`,
        bullets: localFocusBullets,
      },
      {
        title: `Search trends we are targeting in ${area.areaName}`,
        bullets: area.targetKeywords || [],
      },
      {
        title: `Nearby communities around ${area.areaName}`,
        bullets: nearbyAreaBullets,
      },
      {
        title: 'More sports court coating areas',
        links: relatedAreaLinks,
      },
      {
        title: `${area.areaName} sports-court FAQs`,
        faq: area.faq || [],
      },
    ],
  })
}

function renderGuidesIndexContent() {
  return renderPage({
    eyebrow: 'Pricing Guides',
    title: 'Waco concrete pricing, without guesswork',
    subtitle:
      'Local cost guides for driveways, patios, and stamped concrete based on common Central Texas project conditions.',
    introParagraphs: [
      'Every guide includes practical pricing ranges, what drives costs up or down, and what to prepare before requesting an estimate.',
      `If you need a scope-specific number, call ${PHONE_DISPLAY} and we will walk your site and provide a detailed estimate.`,
    ],
    actionLinks: [
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
      { href: '/#contact', label: 'Request estimate' },
    ],
    sections: [
      {
        title: 'Concrete pricing guides for Waco projects',
        links: guideLinks,
      },
      {
        title: 'Most common cost drivers',
        bullets: [
          'Square footage and slab thickness requirements.',
          'Base prep, grading correction, and drainage improvements.',
          'Reinforcement, mix PSI, and finish selections.',
          'Removal and disposal of existing concrete.',
          'Site access constraints for trucks and finishing equipment.',
        ],
      },
      {
        title: 'Services these guides support',
        links: serviceLinks,
      },
    ],
  })
}

function renderPrivacyPolicyContent() {
  return renderPage({
    eyebrow: 'Privacy',
    title: 'Privacy Policy',
    subtitle:
      'Concrete Works LLC values clear and practical privacy practices for leads and communication.',
    introParagraphs: [
      'Our goal is straightforward: only collect what helps us communicate and deliver projects safely and effectively.',
      'By submitting a request on our site, you are allowing us to process your contact details for estimates and project follow-up.',
    ],
    sections: [
      {
        title: 'Information We Collect',
        bullets: [
          'Name, phone number, email, project service, and message details from our contact form.',
          'IP address, user agent, and submitted page metadata for lead validation and support.',
          'Communication details you provide directly during calls or text follow-up.',
        ],
      },
      {
        title: 'How We Use Your Information',
        bullets: [
          'To process and prioritize incoming leads.',
          'To respond with estimate follow-up and scheduling communication.',
          'To send internal email and SMS notifications to our team.',
          'To improve lead workflow and client response quality.',
        ],
      },
      {
        title: 'Communications',
        bullets: [
          'If SMS is used, messaging may include lead details necessary for internal team follow-up.',
          'You can opt out of non-essential follow-up messaging at any time by replying STOP or contacting us.',
          'We do not sell lead data to advertising networks or unrelated third parties.',
        ],
      },
      {
        title: 'Third-Party Services',
        bullets: [
          'Supabase: lead storage and admin dashboard authentication.',
          'Vercel: hosting and serverless API execution.',
          'Twilio: SMS delivery.',
          'Resend: outbound email notifications.',
        ],
      },
      {
        title: 'Data Retention and Your Requests',
        bullets: [
          'Lead records are retained only for legitimate business follow-up and operations.',
          'You may request correction, access, or deletion by contacting us directly.',
          'This policy is updated as our systems evolve to stay accurate.',
        ],
      },
    ],
  })
}

function renderTermsAndConditionsContent() {
  return renderPage({
    eyebrow: 'Legal',
    title: 'Terms and Conditions',
    subtitle: 'Service terms for clients and prospective clients of Concrete Works LLC.',
    introParagraphs: [
      'By using this site or contacting our team, you agree to the terms described on this page.',
      'These terms clarify expectations before work starts, including estimates, scheduling, and communication.',
    ],
    sections: [
      {
        title: 'Acceptance of Terms',
        bullets: [
          'You agree to these terms when submitting an estimate request or using our services.',
          'If you do not agree, please contact us instead of submitting project details.',
        ],
      },
      {
        title: 'Estimates and Scope',
        bullets: [
          'Quoted pricing is based on the information provided and visible site conditions at the time of estimate.',
          'Project scope, mix, finish, and timeline are confirmed in writing before final scheduling.',
          'Hidden issues found during the job may change scope and pricing.',
        ],
      },
      {
        title: 'Client Responsibilities',
        bullets: [
          'Provide clear property access and accurate measurements.',
          'Inform us of site constraints, utility conflicts, and drainage concerns.',
          'Protect nearby surfaces and coordinate pets, vehicles, and occupied areas during active work.',
        ],
      },
      {
        title: 'Scheduling and Weather',
        bullets: [
          'Weather, permitting, and material availability may change planned delivery windows.',
          'We will promptly communicate delays and suggest practical alternatives.',
        ],
      },
      {
        title: 'Communication and SMS',
        bullets: [
          'You agree to receive email or text updates connected to your estimate or service request.',
          'Message frequency is based on project need, with standard carrier messaging rates and limits.',
          'If you reply STOP to any business text, we will stop non-essential outbound messages.',
        ],
      },
      {
        title: 'Liability and Limits',
        bullets: [
          'We are properly insured for business operations.',
          'Long-term concrete performance depends on soil movement, load patterns, and ongoing maintenance practices.',
          'All workmanship concerns should be reported promptly so we can review the issue in context.',
        ],
      },
      {
        title: 'Dispute Process',
        bullets: [
          'Contact us first with any concern so we can resolve it quickly.',
          'If unresolved, disputes may proceed under Texas law and in the courts of McLennan County.',
          'You should keep communication records and photos for review.',
        ],
      },
      {
        title: 'Updates',
        bullets: [
          'We may update these terms from time to time.',
          'Updated terms apply after the posting date shown on this page.',
        ],
      },
    ],
  })
}

function renderGuideContent(guide) {
  const ranges = (guide.costRanges || []).map(
    (range) => `${range.label}: ${range.range} - ${range.detail}`,
  )
  const notes = (guide.localNotes || []).map((note) => `${note.title}: ${note.description}`)

  return renderPage({
    eyebrow: 'Pricing Guide',
    title: guide.heroTitle,
    subtitle: guide.heroSubtitle,
    introParagraphs: [
      guide.summary,
      'Use this guide to set a realistic budget range before requesting a formal estimate. Final pricing depends on your site prep, access, and finish details.',
    ],
    actionLinks: [
      { href: '/#contact', label: 'Request project estimate' },
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
    ],
    sections: [
      {
        title: 'Quick pricing stats',
        bullets: (guide.quickStats || []).map((stat) => `${stat.label}: ${stat.value}`),
      },
      {
        title: 'Typical Waco pricing ranges',
        bullets: ranges,
      },
      {
        title: 'Factors that affect final cost',
        bullets: guide.factors || [],
      },
      {
        title: 'Local project considerations',
        bullets: notes,
      },
      {
        title: 'Pre-estimate checklist',
        bullets: guide.checklist || [],
        orderedBullets: true,
      },
      {
        title: 'Related services',
        links: (guide.relatedServices || []).map((service) => ({
          ...service,
          description: 'Compare scope details, process, and service-specific FAQs.',
        })),
      },
      {
        title: 'Guide FAQs',
        faq: guide.faq || [],
      },
    ],
  })
}

function renderBlogIndexContent() {
  return renderPage({
    eyebrow: 'Blog',
    title: 'Concrete tips and project ideas for Central Texas',
    subtitle:
      'Maintenance checklists, design options, and planning guides from the Concrete Works LLC team.',
    introParagraphs: [
      'Blog posts are loaded dynamically so we can publish new articles quickly. Use the links below to access our highest-value evergreen resources while new posts load.',
      'Most customers use the blog to compare finish options, understand cracking causes, and plan realistic budgets before requesting a quote.',
    ],
    actionLinks: [
      { href: '/#contact', label: 'Request estimate' },
      { href: '/guides', label: 'Explore pricing guides' },
    ],
    sections: [
      {
        title: 'Start with these local pricing resources',
        links: guideLinks,
      },
      {
        title: 'Popular service pages',
        links: serviceLinks.slice(0, 6),
      },
      {
        title: 'Local markets we serve',
        links: locationLinks,
      },
    ],
  })
}

function renderJobsIndexContent() {
  return renderPage({
    eyebrow: 'Project Gallery',
    title: 'Concrete projects across Waco and Central Texas',
    subtitle:
      'Driveways, patios, stamped concrete, slabs, and repair jobs with location-specific notes and finish details.',
    introParagraphs: [
      'Project photos and details are loaded dynamically from our jobs database so new work can be published quickly.',
      'For planning and pricing, review the linked service and guide pages below while gallery content loads.',
    ],
    actionLinks: [
      { href: '/#contact', label: 'Request project quote' },
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
    ],
    sections: [
      {
        title: 'Service pages referenced in recent projects',
        links: serviceLinks,
      },
      {
        title: 'Budget planning guides',
        links: guideLinks,
      },
      {
        title: 'Cities where we complete projects',
        links: locationLinks,
      },
    ],
  })
}

function renderNotFoundContent() {
  return renderPage({
    eyebrow: '404',
    title: 'Page Not Found',
    subtitle: 'The page you requested is not available.',
    introParagraphs: [
      'Use the links below to return to high-priority sections of the site.',
    ],
    actionLinks: [
      { href: '/', label: 'Back to homepage' },
      { href: '/services/concrete-driveways', label: 'View services' },
      { href: '/guides', label: 'View pricing guides' },
    ],
  })
}

function upsertTitle(html, title) {
  if (/<title[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  }
  return html.replace('</head>', `<title>${escapeHtml(title)}</title>\n</head>`)
}

function removeMetaTag(html, key) {
  const regexName = new RegExp(`<meta[^>]*name=["']${key}["'][^>]*>\\s*`, 'gi')
  const regexProperty = new RegExp(`<meta[^>]*property=["']${key}["'][^>]*>\\s*`, 'gi')
  return html.replace(regexName, '').replace(regexProperty, '')
}

function upsertMetaTag(html, key, value) {
  const content = escapeHtml(value)
  const selector = key.startsWith('og:') || key.startsWith('article:') ? 'property' : 'name'
  const regex = new RegExp(`<meta[^>]*${selector}=["']${key}["'][^>]*>`, 'i')
  const tag = `<meta ${selector}="${key}" content="${content}" />`
  if (regex.test(html)) return html.replace(regex, tag)
  return html.replace('</head>', `${tag}\n</head>`)
}

function upsertCanonical(html, canonical) {
  const href = escapeHtml(canonical)
  const regex = /<link[^>]*rel=["']canonical["'][^>]*>/i
  const tag = `<link rel="canonical" href="${href}" />`
  if (regex.test(html)) return html.replace(regex, tag)
  return html.replace('</head>', `${tag}\n</head>`)
}

function upsertJsonLd(html, canonical, title, description) {
  const json = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
      },
    ],
  }
  const tag = `<script type="application/ld+json" data-prerender="route">${JSON.stringify(json)}</script>`
  const regex = /<script type="application\/ld\+json" data-prerender="route">[\s\S]*?<\/script>/i
  if (regex.test(html)) return html.replace(regex, tag)
  return html.replace('</head>', `${tag}\n</head>`)
}

function upsertPrerenderContent(html, contentHtml) {
  const cleanHtml = html.replace(/<h1[^>]*data-prerender-route-h1[^>]*>[\s\S]*?<\/h1>\s*/gi, '')
  const replacement = `<div id="root">\n${contentHtml}\n</div>`

  if (/<div id="root"><\/div>/i.test(cleanHtml)) {
    return cleanHtml.replace(/<div id="root"><\/div>/i, replacement)
  }

  return cleanHtml.replace(/<div id="root">[\s\S]*?<\/div>/i, replacement)
}

function applyMeta(html, meta) {
  const canonical = normalizeCanonical(meta.canonical || `${SITE_URL}${meta.path === '/' ? '/' : meta.path}`)
  let updated = html
  updated = upsertTitle(updated, meta.title)
  updated = upsertMetaTag(updated, 'description', meta.description)
  updated = upsertMetaTag(updated, 'robots', 'index, follow')
  updated = upsertCanonical(updated, canonical)
  updated = upsertMetaTag(updated, 'og:title', meta.title)
  updated = upsertMetaTag(updated, 'og:description', meta.description)
  updated = upsertMetaTag(updated, 'og:type', 'website')
  updated = upsertMetaTag(updated, 'og:site_name', SITE_NAME)
  updated = upsertMetaTag(updated, 'og:locale', 'en_US')
  updated = upsertMetaTag(updated, 'og:url', canonical)
  updated = upsertMetaTag(updated, 'og:image', DEFAULT_IMAGE)
  updated = upsertMetaTag(updated, 'og:image:alt', `${SITE_NAME} in Waco, Texas`)
  updated = upsertMetaTag(updated, 'twitter:card', 'summary_large_image')
  updated = upsertMetaTag(updated, 'twitter:title', meta.title)
  updated = upsertMetaTag(updated, 'twitter:description', meta.description)
  updated = upsertMetaTag(updated, 'twitter:image', DEFAULT_IMAGE)
  updated = upsertJsonLd(updated, canonical, meta.title, meta.description)
  updated = upsertPrerenderContent(updated, meta.contentHtml || renderNotFoundContent())
  if (meta.robots && meta.robots !== 'index, follow') {
    updated = upsertMetaTag(updated, 'robots', meta.robots)
  }
  return updated
}

async function ensureRouteFile(routePath, htmlTemplate, meta) {
  const relativePath = routePath === '/' ? 'index.html' : `${routePath.replace(/^\//, '')}/index.html`
  const filePath = path.join(distDir, relativePath)
  const parentDir = path.dirname(filePath)
  await fs.mkdir(parentDir, { recursive: true })
  const html = applyMeta(htmlTemplate, meta)
  await fs.writeFile(filePath, html, 'utf8')
}

async function main() {
  const htmlTemplate = await fs.readFile(indexPath, 'utf8')

  for (const route of routeMeta) {
    await ensureRouteFile(route.path, htmlTemplate, route)
  }

  const notFoundPath = path.join(distDir, '404.html')
  let notFoundHtml = applyMeta(htmlTemplate, {
    path: '/404',
    title: 'Page Not Found | Concrete Works LLC',
    description: 'The page you requested could not be found on Concrete Works LLC.',
    canonical: `${SITE_URL}/404`,
    h1: 'Page Not Found',
    robots: 'noindex, nofollow',
    contentHtml: renderNotFoundContent(),
  })
  notFoundHtml = removeMetaTag(notFoundHtml, 'article:published_time')
  notFoundHtml = removeMetaTag(notFoundHtml, 'article:modified_time')
  await fs.writeFile(notFoundPath, notFoundHtml, 'utf8')
}

main().catch((error) => {
  console.error('prerender-routes failed:', error)
  process.exitCode = 1
})
