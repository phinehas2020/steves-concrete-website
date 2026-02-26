const defaultServices = [
  {
    title: 'Pickleball court resurfacing',
    description:
      'Color coating, texture tuning, and line striping for private and community pickleball courts.',
  },
  {
    title: 'Tennis court coating',
    description:
      'Acrylic resurfacing systems that restore pace consistency, traction, and visual finish.',
  },
  {
    title: 'Basketball court striping and repaint',
    description:
      'Outdoor court recoloring, line layout, and crack repair prep for safer play surfaces.',
  },
  {
    title: 'Crack repair and base prep',
    description:
      'Patch and leveling prep before coating so the finish holds up through heavy use and weather.',
  },
]

const defaultProcess = [
  {
    title: 'Site review and game-line planning',
    description:
      'We confirm current court condition, drainage, and striping specs before surfacing starts.',
  },
  {
    title: 'Repair and surface prep',
    description:
      'Crack treatment, cleaning, and base correction happen first so coatings bond correctly.',
  },
  {
    title: 'Acrylic coating and line striping',
    description:
      'We apply sport-surface coats, then stripe to approved dimensions for each court type.',
  },
]

export const sportsCourtAreaPages = [
  {
    slug: 'texas',
    areaName: 'Texas',
    heroTitle: 'Sports Court Coating Services in Texas',
    heroSubtitle:
      'Pickleball, tennis, and basketball court resurfacing with acrylic systems built for heat, UV, and daily use.',
    seoTitle:
      'Sports Court Coating Texas | Pickleball & Tennis Court Resurfacing',
    seoDescription:
      'Sports court coating in Texas for pickleball, tennis, and basketball courts. Acrylic resurfacing, crack repair, color coating, and professional striping.',
    intro:
      'We help property owners and facilities refresh worn sport surfaces with practical resurfacing plans and clean line work. Every coating system is matched to traffic, sun exposure, and existing slab condition.',
    nearbyAreas: ['Dallas', 'Fort Worth', 'Temple', 'Waco'],
    localFocus: [
      {
        title: 'Heat-ready coatings',
        description:
          'Texas summers demand UV-stable systems that resist color fade and premature wear.',
      },
      {
        title: 'Multi-sport flexibility',
        description:
          'We can stripe for single-use or shared-use courts depending on your property goals.',
      },
      {
        title: 'Maintenance-minded planning',
        description:
          'We design resurfacing cycles so operators can budget cleanly for long-term upkeep.',
      },
    ],
    targetKeywords: [
      'court resurfacing services texas',
      'tennis court maintenance texas',
      'pickleball court surface coating',
      'sports court paint',
    ],
    services: defaultServices,
    process: defaultProcess,
    faq: [
      {
        question: 'How often should an outdoor sports court be resurfaced in Texas?',
        answer:
          'Most outdoor acrylic courts need resurfacing every 4 to 8 years, depending on traffic, drainage, and UV exposure.',
      },
      {
        question: 'Do you resurface both pickleball and tennis courts?',
        answer:
          'Yes. We handle pickleball, tennis, basketball, and combination layouts with sport-specific striping.',
      },
    ],
  },
  {
    slug: 'dallas-tx',
    areaName: 'Dallas, TX',
    heroTitle: 'Sports Court Coating in Dallas, TX',
    heroSubtitle:
      'Acrylic resurfacing and striping for pickleball, tennis, and basketball courts across the Dallas area.',
    seoTitle:
      'Sports Court Coating Dallas TX | Pickleball Court Resurfacing',
    seoDescription:
      'Need sports court coating in Dallas, TX? We resurface pickleball, tennis, and basketball courts with crack repair, acrylic color systems, and precision striping.',
    intro:
      'Dallas facilities need coatings that keep traction and color through long heat cycles and heavy scheduling. We focus on prep quality first, then install finishes designed for daily play.',
    nearbyAreas: ['Plano', 'Frisco', 'Garland', 'Irving', 'Richardson', 'Mesquite'],
    localFocus: [
      {
        title: 'High-use court durability',
        description:
          'We stage resurfacing to reduce downtime for schools, HOAs, and private facilities.',
      },
      {
        title: 'Climate-aware prep',
        description:
          'Surface prep and cure timing are adjusted for Dallas temperature swings and sun load.',
      },
      {
        title: 'Clean game-line execution',
        description:
          'Accurate striping and color contrast help players track lines clearly during fast play.',
      },
    ],
    targetKeywords: [
      'sports court coating dallas tx',
      'pickleball court resurfacing dallas',
      'sports court paint',
      'pickleball court installation companies',
      'tennis court resurfacing companies near me',
    ],
    services: defaultServices,
    process: defaultProcess,
    faq: [
      {
        question: 'Can you re-stripe a court after resurfacing in Dallas?',
        answer:
          'Yes. Restriping is included in most resurfacing scopes, and we can configure single-sport or multi-sport line sets.',
      },
      {
        question: 'Do you work on HOA and school courts in Dallas?',
        answer:
          'Yes. We support residential associations, schools, parks, and private properties throughout the Dallas area.',
      },
    ],
  },
  {
    slug: 'fort-worth-tx',
    areaName: 'Fort Worth, TX',
    heroTitle: 'Sports Court Coating in Fort Worth, TX',
    heroSubtitle:
      'Court resurfacing and acrylic coating for tennis, pickleball, and basketball play surfaces.',
    seoTitle:
      'Sports Court Coating Fort Worth TX | Court Resurfacing Services',
    seoDescription:
      'Sports court coating in Fort Worth, TX for pickleball, tennis, and basketball courts. Resurfacing, crack repair, and line striping for reliable play.',
    intro:
      'Fort Worth court projects often combine crack repair, traction-focused coatings, and full line repainting. We build scopes around court condition and how often the surface is used.',
    nearbyAreas: ['Arlington', 'Benbrook', 'Keller', 'Burleson', 'Aledo', 'Saginaw'],
    localFocus: [
      {
        title: 'Surface consistency',
        description:
          'We balance texture and speed so the court feels predictable for both casual and competitive play.',
      },
      {
        title: 'Crack-first approach',
        description:
          'Addressing structural movement before coating helps protect finish life and appearance.',
      },
      {
        title: 'Facility-friendly scheduling',
        description:
          'We plan around occupancy windows to minimize disruption for clubs and community courts.',
      },
    ],
    targetKeywords: [
      'sports court coating fort worth tx',
      'pickleball court resurfacing fort worth',
      'basketball court line marking',
      'pickleball court surface coating',
    ],
    services: defaultServices,
    process: defaultProcess,
    faq: [
      {
        question: 'Do you handle outdoor basketball court repainting in Fort Worth?',
        answer:
          'Yes. We resurface and repaint outdoor basketball courts, including line layout and coating upgrades.',
      },
      {
        question: 'What affects resurfacing cost for Fort Worth courts?',
        answer:
          'Main factors are crack severity, square footage, coating system choice, and striping complexity.',
      },
    ],
  },
]

export const sportsCourtAreaLinks = sportsCourtAreaPages.map((page) => ({
  slug: page.slug,
  areaName: page.areaName,
  href: `/sports-court-coating/${page.slug}`,
  label: `Sports court coating in ${page.areaName}`,
}))
