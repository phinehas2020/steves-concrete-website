import { getCanonicalServicePath } from './servicePages.js'

// Use public/ WebP images instead of bundled PNG imports to keep them out of
// the main JS chunk (~2.6 MB of PNGs were inflating the initial bundle).
const stampedDrivewayImg = '/images/gallery-stamped-driveway.webp'
const patioAggregateImg = '/images/gallery-patio-aggregate.webp'
const commercialParkingImg = '/images/gallery-commercial-parking.webp'

const baseServices = [
  { label: 'Concrete Contractors', href: getCanonicalServicePath('concrete-contractors') },
  { label: 'Sidewalks & Driveways', href: getCanonicalServicePath('sidewalks-driveways') },
  { label: 'Concrete Driveways', href: getCanonicalServicePath('concrete-driveways') },
  { label: 'Concrete Patios', href: getCanonicalServicePath('concrete-patios') },
  { label: 'Parking Lots', href: getCanonicalServicePath('parking-lots') },
  { label: 'Stamped Concrete', href: getCanonicalServicePath('stamped-concrete') },
  { label: 'Commercial Concrete', href: getCanonicalServicePath('commercial-concrete') },
  { label: 'Concrete Repair', href: getCanonicalServicePath('concrete-repair') },
  { label: 'Concrete Demolition', href: getCanonicalServicePath('concrete-demolition') },
  { label: 'Concrete Sawing', href: getCanonicalServicePath('concrete-sawing') },
  { label: 'Concrete Foundations', href: getCanonicalServicePath('concrete-foundations') },
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
    seoTitle: 'Waco Concrete Contractors | Concrete Companies Waco TX',
    heroSubtitle:
      'Looking for contractors in Waco TX for driveways, patios, stamped concrete, or slab work? Free estimate: (254) 230-3102.',
    seoDescription:
      'Waco concrete contractors for driveways, patios, stamped concrete, foundations, and repairs. Need concrete companies in Waco TX with fast estimates? Call (254) 230-3102.',
    intro:
      'SLA Concrete Works LLC partners with Waco homeowners, builders, and businesses searching for "concrete companies near me" for reliable installs and repairs. We focus on clean prep, crisp finishing, and long-term durability.',
    planningSections: [
      {
        title: 'Concrete work in Waco starts with soil and drainage',
        paragraphs: [
          'Waco concrete does not fail only because of the mix. Most early problems start below the slab, where expansive black clay swells after rain and shrinks during long hot stretches. That movement puts stress on driveway panels, patio edges, sidewalks, and approach slabs. Before we talk finish options, we look at subgrade condition, slope, drainage paths, and where water will sit after the next storm.',
          'For homes around Castle Heights, Brookview, Woodway, Hewitt, Robinson, Lorena, and China Spring, the right prep depends on the site. A shaded backyard patio, a sloped driveway apron, and a shop slab on open ground all need different base and joint decisions. We check access, grade changes, roof runoff, vehicle loads, and nearby structures so the pour is planned for the actual property instead of a generic square-foot number.',
        ],
      },
      {
        title: 'Service scope and technical details',
        paragraphs: [
          'Driveways usually need a compacted base, planned control joints, reinforced edges where traffic turns, and a finish that gives traction without trapping too much dirt. Patios need attention to house transitions, door thresholds, drainage away from the slab, and shade or cover plans. Sidewalks need smooth transitions, clean edges, and expansion space near existing concrete or masonry.',
          'For slabs and light commercial concrete, we talk through thickness, reinforcement, expected loads, finish tolerance, and whether the slab will carry vehicles, storage racks, equipment, or foot traffic only. Common residential work uses broom finish for traction, while decorative patios may use stamped patterns, exposed aggregate, integral color, stained concrete, or a sealed smooth border when that fits the site and budget.',
        ],
      },
      {
        title: 'Process and timeline',
        paragraphs: [
          'A normal Waco project starts with a site walk and measurements. We confirm demolition, haul-off, access for forms and concrete delivery, drainage concerns, utility conflicts, and finish goals. After that, the estimate should clearly separate prep, forming, reinforcement, concrete, finishing, and any decorative or sealing work.',
          'Once scheduled, the crew moves through excavation or removal, base prep, forming, reinforcement, pour, finish, and cure guidance. Some smaller residential jobs can be prepped and poured quickly; larger driveways, patios with decorative detail, commercial slabs, or projects with drainage correction need more sequencing. Weather matters too. Extreme heat, heavy rain, and sudden cold snaps can change timing, so cure protection is part of the plan rather than an afterthought.',
        ],
      },
      {
        title: 'Pricing transparency',
        paragraphs: [
          'We do not quote one flat number for every slab because that hides the real cost drivers. Square footage matters, but Waco concrete pricing also depends on tear-out, base correction, truck access, thickness, reinforcement, finish choice, drainage work, and how much hand forming is needed. A simple broom-finished patio is not the same scope as a stamped driveway with demolition and grade correction.',
          'When pricing ranges are discussed, they should be treated as planning numbers until the site is measured. The estimate is where the real scope gets locked down. If a lower price leaves out haul-off, reinforcement, base work, or cure guidance, it is not an apples-to-apples concrete bid.',
        ],
      },
      {
        title: 'Permits, trust, and project communication',
        paragraphs: [
          'Texas does not have a single statewide concrete-contractor license for ordinary residential flatwork, but municipal requirements and right-of-way rules can still apply depending on the project. Work touching approaches, sidewalks near public access, drainage, or commercial sites may need extra review. We flag those issues during the estimate instead of assuming every slab is permit-free.',
          'Customers also need to know who is responsible for communication. Steve stays involved from the first call through the site visit and scope discussion, so the person looking at drainage, soil, and access is connected to the plan. That matters when a project changes after demolition or weather shifts the pour window.',
        ],
      },
      {
        title: 'Neighborhoods and common project types',
        paragraphs: [
          'Older Waco neighborhoods often need concrete that ties into existing walks, narrow drives, mature trees, and drainage that was not designed for today\'s vehicle use. Newer subdivisions may have cleaner access but still need attention around garage lips, sidewalks, and yard grades. Rural properties outside town can add longer access paths, shop approaches, equipment pads, and thicker sections where vehicles or trailers will cross the slab.',
          'We see different priorities across the area. Castle Heights and Woodway projects often lean toward clean curb appeal and decorative patios. Robinson, Lorena, and China Spring properties may need longer drives, shop slabs, or drainage correction. Commercial Waco jobs usually need scheduling clarity, safe access, and a finish that works for customers, trucks, or employees without turning into a maintenance problem.',
        ],
      },
      {
        title: 'What to prepare before the estimate',
        paragraphs: [
          'The best estimate starts with practical details: approximate square footage, photos of the site, whether old concrete needs to be removed, where water currently drains, and how soon you need the work finished. For driveways, note vehicle types and whether delivery trucks or trailers use the area. For patios, note shade structures, outdoor kitchens, door thresholds, and where water should move during heavy rain.',
          'If you are comparing multiple Waco concrete bids, ask each contractor to spell out base prep, reinforcement, joint spacing, finish, cure timing, haul-off, and cleanup. That keeps the conversation about build quality instead of only total price. A clear scope protects both sides before the pour day arrives.',
          'Good photos help too. A few wide shots, close-ups of cracks or pooling water, and a picture of access from the street can answer early questions before the site visit. That lets the estimate focus on the decisions that actually change the build.',
        ],
      },
    ],
    highlights: baseHighlights,
    services: baseServices,
    nearbyAreas: ['Woodway', 'Hewitt', 'Bellmead', 'Robinson', 'China Spring', 'Lorena'],
    projects: baseProjects('Waco'),
    faq: [
      {
        question: 'How do I choose between concrete companies in Waco TX?',
        answer:
          'Start with base-prep detail, drainage planning, reinforcement, and timeline clarity. We provide those details in writing so you can compare Waco concrete contractors apples-to-apples.',
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
        question: 'Are you available if I need concrete repair near me in Temple?',
        answer: 'Yes. We handle concrete repairs, small slab upgrades, and mid-size commercial slabs, pads, and parking areas across Temple.',
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
      'Looking for a concrete contractor in Hewitt, Texas? SLA Concrete Works builds driveways, patios, stamped concrete, and repairs for clay soil.',
    intro:
      'SLA Concrete Works LLC helps Hewitt homeowners and property managers install concrete that lasts through hot summers and shifting black clay soil. We focus on proper base prep, drainage, and control-joint layout so your project looks sharp and performs long-term.',
    planningSections: [
      {
        title: 'Driveway and patio planning in Hewitt',
        paragraphs: [
          'Hewitt concrete work often has to tie cleanly into garage aprons, sidewalks, fences, and backyard gates. Before we price a driveway or patio, we look at access, existing grades, roof runoff, and where water collects after a storm.',
          'That matters because a good-looking slab can still fail early if water sits at the edge or the base is soft. We plan subgrade correction, compacted base, reinforcement, and control joints around the way the driveway or patio will actually be used.',
        ],
      },
      {
        title: 'Central Texas clay and drainage',
        paragraphs: [
          'Hewitt sits in the same black-clay belt that affects Waco, Woodway, Robinson, and Lorena. Clay can swell after rain and shrink during long hot stretches, which adds stress to patios, walks, and driveway panels.',
          'We cannot promise concrete will never crack, but we can reduce avoidable movement by shaping drainage, avoiding trapped water, planning joints, and matching slab thickness to the expected use.',
        ],
      },
      {
        title: 'Common Hewitt concrete projects',
        paragraphs: [
          'The most common Hewitt scopes are driveway replacement, patio extensions, sidewalk repairs, stamped patios, shed pads, and small slab repairs around homes and light commercial properties.',
          'For decorative work, we talk through traction, color, sealer maintenance, furniture placement, and how the finish will look next to brick, stone, fencing, or landscaping already on the property.',
        ],
      },
      {
        title: 'What the estimate should answer',
        paragraphs: [
          'A useful Hewitt estimate should explain tear-out, haul-off, base prep, reinforcement, finish, joint layout, cure timing, and cleanup. Those details make it easier to compare bids without guessing what is included.',
          'We also flag schedule risks early. Heavy rain, extreme heat, tight access, demolition surprises, and drainage corrections can change the sequence, so the plan should leave room for the real site conditions.',
        ],
      },
    ],
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
      'Need a concrete contractor in Woodway, Texas? SLA Concrete Works installs driveways, patios, stamped concrete, and repairs built for heat and clay soil.',
    intro:
      'SLA Concrete Works LLC delivers Woodway concrete projects with careful grading, reinforcement, and finishing detail. We account for black clay soil and summer heat expansion so your driveway, patio, or slab holds up and stays attractive.',
    planningSections: [
      {
        title: 'Concrete work for Woodway properties',
        paragraphs: [
          'Woodway projects often balance curb appeal with practical drainage and grade control. Driveways, patios, walkways, and retaining-wall tie-ins need to look clean while still moving water away from the slab and nearby structures.',
          'Before the pour, we review access, slope, shade, existing flatwork, and any low spots that hold water. Those details shape the base prep, thickness, joint layout, finish selection, and cure plan.',
        ],
      },
      {
        title: 'Drainage around slopes, trees, and outdoor living areas',
        paragraphs: [
          'Many Woodway lots have mature landscaping, shade, grade changes, or backyard living areas where concrete has to fit into the property instead of just filling a rectangle.',
          'We plan concrete edges, transitions, and runoff paths so patios and walkways do not push water toward doors, wall edges, or soft soil pockets. Good drainage is one of the best ways to protect the finished surface.',
        ],
      },
      {
        title: 'Finish choices that fit the site',
        paragraphs: [
          'Broom finish works well where traction and low maintenance matter most. Stamped, stained, exposed aggregate, and border details can make patios or front walks feel more finished when the site supports the extra maintenance.',
          'We explain the tradeoffs before the job starts: decorative surfaces need sealing and care, while simpler finishes are easier to maintain around trees, shade, irrigation, and heavy foot traffic.',
        ],
      },
      {
        title: 'Comparing Woodway concrete bids',
        paragraphs: [
          'When comparing Woodway bids, ask whether demolition, haul-off, compacted base, reinforcement, drainage correction, finish, sealing, and cleanup are included. Those items change the real cost more than a headline square-foot price.',
          'A clear scope protects the project. It also helps avoid shortcuts around base prep or joint layout, which are the parts you cannot see once the concrete is finished.',
        ],
      },
    ],
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
      'SLA Concrete Works LLC delivers dependable concrete installs in McGregor with careful grading, reinforcement, and clean finishing.',
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
