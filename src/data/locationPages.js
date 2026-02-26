import stampedDrivewayImg from '../assets/images/gallery-stamped-driveway.png'
import patioAggregateImg from '../assets/images/gallery-patio-aggregate.png'
import commercialParkingImg from '../assets/images/gallery-commercial-parking.png'

const baseServices = [
  { label: 'Concrete Contractors', href: '/services/concrete-contractors' },
  { label: 'Sidewalks & Driveways', href: '/services/sidewalks-driveways' },
  { label: 'Concrete Driveways', href: '/services/concrete-driveways' },
  { label: 'Concrete Patios', href: '/services/concrete-patios' },
  { label: 'Parking Lots', href: '/services/parking-lots' },
  { label: 'Stamped Concrete', href: '/services/stamped-concrete' },
  { label: 'Commercial Concrete', href: '/services/commercial-concrete' },
  { label: 'Concrete Repair', href: '/services/concrete-repair' },
  { label: 'Concrete Foundations', href: '/services/concrete-foundations' },
]

const baseHighlights = [
  {
    title: 'Local planning + prep',
    description: 'We plan drainage, base prep, and control joints for Central Texas soil conditions.',
  },
  {
    title: 'Decorative finishes',
    description: 'Stamped, stained, and exposed aggregate finishes tailored to your property style.',
  },
  {
    title: 'Clear communication',
    description: 'On-site updates and clean job sites so every step stays simple.',
  },
]

const baseProjects = (city) => [
  {
    title: `${city} stamped driveway`,
    description: 'Ashlar slate finish with charcoal accents.',
    image: stampedDrivewayImg,
    alt: `Stamped concrete driveway project in ${city}, Texas`,
    stats: [
      { label: 'Area', value: '720 sq ft' },
      { label: 'Mix', value: '4,000 PSI' },
      { label: 'Completion', value: 'May 2025' },
    ],
  },
  {
    title: `${city} patio extension`,
    description: 'Exposed aggregate with a smooth border.',
    image: patioAggregateImg,
    alt: `Concrete patio extension in ${city}, Texas`,
    stats: [
      { label: 'Area', value: '360 sq ft' },
      { label: 'Finish', value: 'Exposed aggregate' },
      { label: 'Completion', value: 'Aug 2024' },
    ],
  },
  {
    title: `${city} commercial slab`,
    description: 'Large pour with durable joint layout.',
    image: commercialParkingImg,
    alt: `Commercial concrete project near ${city}, Texas`,
    stats: [
      { label: 'Area', value: '2,400 sq ft' },
      { label: 'Use', value: 'Light industrial' },
      { label: 'Completion', value: 'Nov 2024' },
    ],
  },
]

export const locationPages = [
  {
    slug: 'waco-tx-concrete-contractor',
    city: 'Waco',
    heroTitle: 'Concrete Contractor Waco TX',
    seoTitle: 'Concrete Contractor Waco TX | Driveways, Patios, Stamped Concrete',
    heroSubtitle:
      'Driveways, patios, stamped concrete, and foundations. Free estimate: (254) 230-3102.',
    seoDescription:
      'Concrete contractor in Waco, Texas for driveways, patios, stamped concrete, foundations, and repairs. Need a concrete contractor near me in Waco? Call for a fast estimate.',
    intro:
      'Concrete Works LLC partners with Waco homeowners, builders, and businesses for reliable concrete installs and repairs. We focus on clean prep, crisp finishing, and long-term durability.',
    highlights: baseHighlights,
    services: baseServices,
    nearbyAreas: ['Woodway', 'Hewitt', 'Bellmead', 'Robinson', 'China Spring', 'Lorena'],
    projects: baseProjects('Waco'),
    faq: [
      {
        question: 'Do you offer free estimates in Waco?',
        answer: 'Yes. We provide free, no-obligation estimates across the Waco area.',
      },
      {
        question: 'How soon can you start a Waco project?',
        answer:
          'Scheduling depends on season and scope, but we prioritize clear timelines and quick turnaround on estimates.',
      },
    ],
  },
  {
    slug: 'temple-tx-concrete-contractor',
    city: 'Temple',
    seoTitle: 'Concrete Contractor Temple TX | Concrete Contractor Near Me in Central Texas',
    heroTitle: 'Concrete Contractor in Temple, TX',
    heroSubtitle:
      'Driveways, patios, stamped finishes, and commercial pours for Temple homes and businesses.',
    seoDescription:
      'Concrete contractor in Temple, TX and nearby communities. Need a concrete contractor near me for driveways, patios, stamped concrete, or repairs? Call for a free estimate.',
    intro:
      'We help Temple property owners upgrade curb appeal with durable concrete work that handles Central Texas heat and soil shifts.',
    highlights: baseHighlights,
    services: baseServices,
    nearbyAreas: ["Belton", "Morgan's Point", 'Little River-Academy', 'Salado', 'Troy', 'Oenaville'],
    projects: baseProjects('Temple'),
    faq: [
      {
        question: 'Can you match stamped concrete to my Temple home style?',
        answer:
          'We offer multiple stamp patterns and color options so your new surface complements your exterior finishes.',
      },
      {
        question: 'Do you handle commercial concrete in Temple?',
        answer: 'Yes. We support small to mid-size commercial slabs, pads, and parking areas.',
      },
    ],
  },
  {
    slug: 'killeen-tx-concrete-contractor',
    city: 'Killeen',
    seoTitle: 'Concrete Contractor Killeen TX | Waco Area Concrete Contractor',
    heroTitle: 'Concrete Contractor in Killeen, TX',
    heroSubtitle:
      'Concrete driveways, patios, stamped finishes, and repair work across Killeen and surrounding areas.',
    seoDescription:
      'Concrete contractor in Killeen, Texas for driveways, patios, stamped concrete, and concrete repair. Serving nearby Waco communities with free estimates.',
    intro:
      'From new driveways to backyard upgrades, we deliver clean concrete lines and dependable performance for Killeen properties.',
    highlights: baseHighlights,
    services: baseServices,
    nearbyAreas: ['Harker Heights', 'Fort Cavazos', 'Nolanville', 'Copperas Cove', 'Belton', 'Kempner'],
    projects: baseProjects('Killeen'),
    faq: [
      {
        question: 'Do you work with military families in Killeen?',
        answer:
          'Absolutely. We schedule efficiently and provide clear documentation for every project.',
      },
      {
        question: 'Can you repair existing concrete in Killeen?',
        answer:
          'Yes. We inspect cracks, spalling, and settling before recommending the best repair approach.',
      },
    ],
  },
  {
    slug: 'hewitt-tx-concrete-contractor',
    city: 'Hewitt',
    seoTitle: 'Concrete Contractor Hewitt Texas | Driveways, Patios, Concrete Repair',
    heroTitle: 'Concrete Contractor Hewitt Texas',
    heroSubtitle:
      'Driveways, patios, stamped concrete, and slab repairs for Hewitt homes. Free on-site estimates with clear start dates.',
    seoDescription:
      'Looking for a concrete contractor Hewitt Texas homeowners trust? We build driveways, patios, stamped concrete, and repairs designed for Central Texas black clay soil and heat expansion.',
    intro:
      'Concrete Works LLC helps Hewitt homeowners and property managers install concrete that lasts through hot summers and shifting black clay soil. We focus on proper base prep, drainage, and control-joint layout so your project looks sharp and performs long-term.',
    highlights: [
      {
        title: 'Engineered for Hewitt soil conditions',
        description:
          'We compact base material and plan joint spacing to reduce stress from Central Texas black clay soil movement.',
      },
      {
        title: 'Residential and light commercial concrete',
        description:
          'From driveway replacements to patio extensions and approach repairs, we handle practical concrete upgrades with clean finishes.',
      },
      {
        title: 'Fast communication from estimate to pour',
        description:
          'You get a straightforward scope, honest timeline, and dependable follow-through from the first call to final cleanup.',
      },
    ],
    services: baseServices,
    nearbyAreas: ['Waco', 'Woodway', 'Robinson', 'Lorena', 'Beverly Hills', 'Woodland Hills'],
    projects: baseProjects('Hewitt'),
    faq: [
      {
        question: 'How do you help prevent driveway cracking in Hewitt?',
        answer:
          'No slab is crack-proof in black clay soil, but we lower risk with strong base prep, reinforcement, drainage planning, and control joints sized for heat expansion.',
      },
      {
        question: 'Can I get a quick estimate for a Hewitt patio or driveway?',
        answer:
          'Yes. We offer free on-site estimates in Hewitt and can usually schedule a site visit quickly so you can compare options and pricing.',
      },
    ],
  },
  {
    slug: 'woodway-tx-concrete-contractor',
    city: 'Woodway',
    seoTitle: 'Concrete Contractor Woodway Texas | Driveways, Patios, Stamped Concrete',
    heroTitle: 'Concrete Contractor Woodway Texas',
    heroSubtitle:
      'Concrete driveways, patios, decorative finishes, and repairs for Woodway homes with free local estimates.',
    seoDescription:
      'Need a concrete contractor Woodway Texas property owners recommend? We install and replace driveways, patios, stamped concrete, and repairs built for Central Texas heat and clay soil movement.',
    intro:
      'Concrete Works LLC delivers Woodway concrete projects with careful grading, reinforcement, and finishing detail. We account for black clay soil and summer heat expansion so your driveway, patio, or slab holds up and stays attractive.',
    highlights: [
      {
        title: 'Woodway-focused prep and drainage',
        description:
          'We shape grade and base layers to move water away from slabs and support better long-term performance.',
      },
      {
        title: 'Decorative and practical concrete options',
        description:
          'Choose broom-finish, stamped, or exposed aggregate surfaces that fit your home style and daily use.',
      },
      {
        title: 'Clear bids and dependable scheduling',
        description:
          'We keep scopes simple, timelines realistic, and job sites orderly so your project stays low-stress.',
      },
    ],
    services: baseServices,
    nearbyAreas: ['Waco', 'Hewitt', 'China Spring', 'Robinson', 'Lorena', 'Beverly Hills'],
    projects: baseProjects('Woodway'),
    faq: [
      {
        question: 'Do you replace older driveways in Woodway?',
        answer:
          'Yes. We remove failing concrete, rebuild the base, and repour with proper reinforcement and joint layout for better durability.',
      },
      {
        question: 'Can you install a stamped concrete patio in Woodway?',
        answer:
          'Absolutely. We offer stamped patterns and color options, then seal the surface and share maintenance tips to keep it looking clean.',
      },
    ],
  },
  {
    slug: 'robinson-tx-concrete-contractor',
    city: 'Robinson',
    seoTitle: 'Concrete Contractor Robinson TX | Concrete Driveways & Patios',
    heroTitle: 'Concrete Contractor in Robinson, TX',
    heroSubtitle:
      'Concrete driveways, patios, and repairs tailored to Robinson homes and light commercial sites.',
    seoDescription:
      'Concrete contractor in Robinson, Texas for concrete driveways, patios, and repair work. Local team, clear pricing, and free estimate support.',
    intro:
      'We help Robinson property owners add curb appeal with smooth finishes, clean edges, and solid drainage planning.',
    highlights: baseHighlights,
    services: baseServices,
    nearbyAreas: ['Waco', 'Hewitt', 'Woodway', 'Lorena', 'Bruceville-Eddy', 'Bellmead'],
    projects: baseProjects('Robinson'),
    faq: [
      {
        question: 'Do you offer free estimates in Robinson?',
        answer: 'Yes. We provide free on-site estimates for Robinson projects.',
      },
      {
        question: 'Can you handle small concrete pads in Robinson?',
        answer:
          'Absolutely. We take on walkways, pads, and smaller pours alongside larger installs.',
      },
    ],
  },
  {
    slug: 'lorena-tx-concrete-contractor',
    city: 'Lorena',
    seoTitle: 'Concrete Contractor Lorena TX | Concrete Work in Central Texas',
    heroTitle: 'Concrete Contractor in Lorena, TX',
    heroSubtitle:
      'Stamped concrete, patios, driveways, and repairs for Lorena homes and properties.',
    seoDescription:
      'Concrete contractor in Lorena, TX for durable driveways, patios, stamped concrete, and concrete repairs. Reliable estimates for Lorena-area concrete work.',
    intro:
      'Lorena homeowners trust us for detailed prep, smooth finishes, and long-lasting concrete work that fits the property.',
    highlights: baseHighlights,
    services: baseServices,
    nearbyAreas: ['Waco', 'Hewitt', 'Robinson', 'Woodway', 'Golinda', 'McGregor'],
    projects: baseProjects('Lorena'),
    faq: [
      {
        question: 'What finishes are available in Lorena?',
        answer:
          'We offer broom, exposed aggregate, and stamped finishes with multiple color options.',
      },
      {
        question: 'How far out are you scheduling Lorena projects?',
        answer:
          'Timing depends on scope and season, but we provide fast estimate scheduling and clear start dates.',
      },
    ],
  },
  {
    slug: 'mcgregor-tx-concrete-contractor',
    city: 'McGregor',
    seoTitle: 'Concrete Contractor McGregor TX | Concrete Driveways, Patios & Slabs',
    heroTitle: 'Concrete Contractor in McGregor, TX',
    heroSubtitle:
      'Concrete driveways, patios, and commercial slabs for McGregor properties.',
    seoDescription:
      'Concrete contractor in McGregor, Texas for driveways, patios, commercial slabs, and repair projects. Get a free, no-obligation estimate from the local team.',
    intro:
      'Concrete Works LLC delivers dependable concrete installs in McGregor with careful grading, reinforcement, and clean finishing.',
    highlights: baseHighlights,
    services: baseServices,
    nearbyAreas: ['Waco', 'Moody', 'Gatesville', 'Woodway', 'Lorena', 'Oglesby'],
    projects: baseProjects('McGregor'),
    faq: [
      {
        question: 'Do you work on commercial concrete in McGregor?',
        answer: 'Yes. We handle pads, parking areas, and light commercial pours.',
      },
      {
        question: 'Can you match stamped concrete colors in McGregor?',
        answer:
          'We can blend colors and release agents to match stone or brick tones that fit your exterior.',
      },
    ],
  },
]

export const locationLinks = locationPages.map((page) => ({
  slug: page.slug,
  city: page.city,
}))
