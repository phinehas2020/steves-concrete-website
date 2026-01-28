import stampedDrivewayImg from '../assets/images/gallery-stamped-driveway.png'
import patioAggregateImg from '../assets/images/gallery-patio-aggregate.png'
import commercialParkingImg from '../assets/images/gallery-commercial-parking.png'

const baseServices = [
  { label: 'Concrete Driveways', href: '/services/concrete-driveways' },
  { label: 'Concrete Patios', href: '/services/concrete-patios' },
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
  },
  {
    title: `${city} patio extension`,
    description: 'Exposed aggregate with a smooth border.',
    image: patioAggregateImg,
    alt: `Concrete patio extension in ${city}, Texas`,
  },
  {
    title: `${city} commercial slab`,
    description: 'Large pour with durable joint layout.',
    image: commercialParkingImg,
    alt: `Commercial concrete project near ${city}, Texas`,
  },
]

export const locationPages = [
  {
    slug: 'waco-tx-concrete-contractor',
    city: 'Waco',
    heroTitle: 'Concrete Contractor in Waco, TX',
    heroSubtitle:
      'Stamped concrete, driveways, patios, and commercial slabs built to last in Waco and nearby communities.',
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
    heroTitle: 'Concrete Contractor in Temple, TX',
    heroSubtitle:
      'Driveways, patios, stamped finishes, and commercial pours for Temple homes and businesses.',
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
    heroTitle: 'Concrete Contractor in Killeen, TX',
    heroSubtitle:
      'Concrete driveways, patios, stamped finishes, and repair work across Killeen and surrounding areas.',
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
    heroTitle: 'Concrete Contractor in Hewitt, TX',
    heroSubtitle:
      'Stamped concrete, patios, driveways, and repair work for Hewitt homes and businesses.',
    intro:
      'Hewitt homeowners trust us for clean layouts, thoughtful drainage planning, and finishes that keep their curb appeal sharp.',
    highlights: baseHighlights,
    services: baseServices,
    nearbyAreas: ['Woodway', 'Waco', 'Lorena', 'Robinson', 'Woodland Hills', 'Beverly Hills'],
    projects: baseProjects('Hewitt'),
    faq: [
      {
        question: 'What finishes are popular in Hewitt?',
        answer:
          'Stamped stone patterns and exposed aggregate are popular for patios and entry walkways in Hewitt neighborhoods.',
      },
      {
        question: 'Do you handle small concrete projects in Hewitt?',
        answer: 'Yes. We take on small pads, walkways, and repair jobs in addition to larger installs.',
      },
    ],
  },
]
