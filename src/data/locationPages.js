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

// Shown on every city page under an honest "across Central Texas" heading —
// keep descriptions regional; never imply a card is a job in that city.
const baseProjects = () => [
  {
    title: 'Stamped concrete driveway',
    description: 'Ashlar slate pattern with charcoal accents on a Central Texas driveway.',
    image: stampedDrivewayImg,
    alt: 'Stamped concrete driveway with ashlar slate pattern and charcoal accents in Central Texas',
    stats: [
      { label: 'Pattern', value: 'Ashlar slate' },
      { label: 'Mix', value: '4,000 PSI' },
      { label: 'Finish', value: 'Stamped + sealed' },
    ],
  },
  {
    title: 'Patio extension',
    description: 'Exposed aggregate with a smooth trowel border — a common backyard upgrade here.',
    image: patioAggregateImg,
    alt: 'Exposed aggregate concrete patio extension with smooth trowel border in Central Texas',
    stats: [
      { label: 'Finish', value: 'Exposed aggregate' },
      { label: 'Border', value: 'Smooth trowel' },
      { label: 'Traction', value: 'Barefoot-friendly' },
    ],
  },
  {
    title: 'Commercial slab',
    description: 'Larger pour with a joint layout planned for trucks and equipment.',
    image: commercialParkingImg,
    alt: 'Commercial concrete slab with planned control joints in Central Texas',
    stats: [
      { label: 'Use', value: 'Light industrial' },
      { label: 'Joints', value: 'Sawcut layout' },
      { label: 'Mix', value: '4,000 PSI' },
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
      'Driveways, patios, stamped concrete, and slab work for Waco homes and businesses. Free estimate: (254) 230-3102.',
    seoDescription:
      'Waco concrete contractors for driveways, patios, stamped concrete, foundations, and repairs. Owner-run, 5.0 stars, 500+ local projects since 2005. Call (254) 230-3102.',
    intro:
      'We design concrete for black clay movement, summer heat, and the drainage issues common in McLennan County neighborhoods — clean prep, crisp finishing, and a written scope you can hold us to.',
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
    seoTitle: 'Concrete Contractor Temple TX | Driveways, Patios & Repair',
    heroTitle: 'Concrete Contractor in Temple, TX',
    heroSubtitle:
      'Driveways, patios, sidewalks, slabs, and concrete repairs for Temple homes, rentals, and light commercial properties.',
    seoDescription:
      'Concrete contractor in Temple TX for driveways, patios, sidewalks, slabs, repairs, and small commercial concrete. Clear estimates and local planning.',
    intro:
      'We help Temple property owners plan concrete work that handles Central Texas heat, daily traffic, drainage, and soil shifts. Driveways, patios, sidewalks, and small commercial slabs all start with site access, slope, base prep, and finish expectations.',
    planningSections: [
      {
        title: 'Temple driveway, patio, and sidewalk planning',
        paragraphs: [
          'Temple projects often involve practical upgrades: replacing a driveway, adding a patio, repairing a walkway, or improving access around a rental, shop, or small business. We start by checking where vehicles, people, water, and equipment will move.',
          'That first look shapes the scope. Tight side-yard access, existing garage elevations, tree roots, fence gates, and drainage near doors can all change the right slab thickness, base prep, joint layout, and finish.',
        ],
      },
      {
        title: 'Concrete repair versus replacement in Temple',
        paragraphs: [
          'If the concrete is cracked but mostly stable, repair or resurfacing may be worth discussing. If panels are settling, holding water, breaking apart, or moving because the base failed, replacement is usually the cleaner long-term choice.',
          'We explain the difference during the estimate so you do not pay for a patch that cannot hold. A practical recommendation should include the cause of the failure, not just the visible crack.',
        ],
      },
      {
        title: 'Commercial and rental-property scheduling',
        paragraphs: [
          'Temple commercial and rental-property work often needs clear access planning. Tenants, customers, deliveries, and parking all affect how the job should be phased.',
          'We talk through demolition, prep, pour, cure, and reopening windows before work starts so the project does not create avoidable surprises for the people using the property.',
        ],
      },
      {
        title: 'Temple neighborhoods and property types',
        paragraphs: [
          'Temple concrete calls come from a wide mix of properties: established neighborhoods west of downtown, newer subdivisions growing toward Belton and Troy, rental houses near the hospital and medical corridor, and light commercial sites along the I-35 frontage and Loop 363. Each setting changes how a driveway, patio, or slab should be planned, because access, parking during the pour, and how quickly the space needs to reopen all matter.',
          'Older Temple streets often mean narrow drives, mature trees, and existing sidewalks the new concrete has to tie into cleanly. Newer subdivisions usually have better truck access but tighter drainage and HOA expectations. We look at both before pricing so the estimate reflects the actual site instead of a generic square-foot guess.',
        ],
      },
      {
        title: 'Bell County clay, heat, and drainage',
        paragraphs: [
          'Temple sits on the same blackland clay belt that runs through most of Central Texas. That soil swells after rain and shrinks through long summer heat, which is why unprepared slabs crack early. Base compaction, reinforcement, and joint layout all have to be planned around that movement.',
          'Drainage is the other half. Roof runoff, low spots, and slopes that push water toward a slab edge will soften the base over time. We shape grade and plan drainage paths before the pour so the finished concrete is protected from the most common local failure mode.',
        ],
      },
      {
        title: 'What drives concrete pricing in Temple',
        paragraphs: [
          'Temple concrete pricing depends on more than square footage. Tear-out and haul-off, base correction, slab thickness, reinforcement, finish choice, and truck access all move the number. A straightforward broom-finish patio is a different scope than a stamped driveway with demolition and grade work.',
          'We put those items in writing so you can compare bids line for line. If a lower Temple bid leaves out haul-off, base prep, or reinforcement, it is not the same project — it is a smaller scope that usually costs more later.',
        ],
      },
      {
        title: 'What a useful Temple estimate should include',
        paragraphs: [
          'A strong concrete estimate should spell out demolition, haul-off, base correction, forms, reinforcement, finish, control joints, cleanup, and cure guidance.',
          'If you are comparing contractors, ask each one to explain those items in plain language. The most important parts of concrete work are usually covered up once the slab is finished.',
        ],
      },
    ],
    highlights: baseHighlights,
    services: baseServices,
    nearbyAreas: ["Belton", "Morgan's Point", 'Little River-Academy', 'Salado', 'Troy', 'Oenaville'],
    localSearchLinks: [
      {
        label: 'Temple driveway planning',
        href: '/concrete-driveways-waco-tx',
        description: 'Driveway tear-out, base prep, reinforcement, drainage, and cure guidance for Central Texas homes.',
      },
      {
        label: 'Temple patio and walkway ideas',
        href: '/concrete-patios-waco-tx',
        description: 'Patios, walks, outdoor transitions, and finish choices for homes and rental properties.',
      },
      {
        label: 'Concrete repair and slab movement',
        href: '/foundation-repair-waco-tx',
        description: 'How to decide whether cracked or settled concrete needs repair, replacement, or drainage correction.',
      },
    ],
    projects: baseProjects('Temple'),
    faq: [
      {
        question: 'Do you offer free concrete estimates in Temple?',
        answer:
          'Yes. We provide free estimates for Temple driveways, patios, sidewalks, slabs, repair work, and light commercial concrete when the scope fits our service area.',
      },
      {
        question: 'Can you help decide between repair and replacement?',
        answer:
          'Yes. We inspect cracking, settlement, drainage, base condition, and daily use before recommending repair, section replacement, or a full repour.',
      },
      {
        question: 'Can you match stamped concrete to my Temple home style?',
        answer:
          'We offer multiple stamp patterns and color options so your new surface complements your exterior finishes while still fitting traction and maintenance needs.',
      },
      {
        question: 'Do you travel from the Waco area to Temple?',
        answer:
          'Yes. Temple is a short run down I-35 from our home base, and we schedule Temple estimates and pours in efficient windows. Driveways, patios, slabs, and repair work are all in normal service range.',
      },
      {
        question: 'What concrete work do you do most in Temple?',
        answer:
          'Driveway replacements, backyard patios, sidewalk and walkway repairs, shop and shed slabs, and light commercial flatwork for rentals and small businesses are the most common Temple requests.',
      },
    ],
  },
  {
    slug: 'killeen-tx-concrete-contractor',
    city: 'Killeen',
    seoTitle: 'Concrete Contractor Killeen TX | Driveways, Patios & Slabs',
    heroTitle: 'Concrete Contractor in Killeen, TX',
    heroSubtitle:
      'Concrete driveways, patios, slabs, sidewalks, and repair work across Killeen and surrounding areas.',
    seoDescription:
      'Concrete contractor in Killeen TX for driveways, patios, slabs, sidewalks, concrete repair, and light commercial flatwork with clear estimates.',
    intro:
      'From new driveways to backyard patios, shop pads, sidewalks, and repair work, we plan Killeen concrete around access, heat, drainage, and daily traffic. The goal is a clear scope before the crew arrives.',
    planningSections: [
      {
        title: 'Killeen concrete projects need access planning',
        paragraphs: [
          'Killeen properties often involve busy driveways, rental turnover, tight schedules, or heavy daily vehicle use. Before quoting, we look at truck access, demolition staging, parking needs, and how the property will be used while work is underway.',
          'That planning matters for driveways, patios, sidewalks, and small commercial pads. A clean finish is only part of the job; the base, slope, reinforcement, and cure window decide how the slab performs.',
        ],
      },
      {
        title: 'Driveways, slabs, and repair work',
        paragraphs: [
          'Common Killeen calls include driveway replacement, patio additions, sidewalk repairs, shop pads, equipment pads, and concrete repair near entries or parking areas.',
          'We explain whether the existing concrete can be repaired or whether replacement is the better long-term path. If base failure, drainage, or repeated heavy traffic caused the damage, patching alone may not be enough.',
        ],
      },
      {
        title: 'Scheduling around homes, rentals, and businesses',
        paragraphs: [
          'Concrete work can interrupt access if it is not sequenced correctly. We discuss prep day, pour timing, cure milestones, and when foot or vehicle traffic can safely return.',
          'For rental or light commercial properties, that communication helps owners coordinate tenants, customers, and maintenance crews without guessing.',
        ],
      },
      {
        title: 'Killeen, Harker Heights, and Fort Cavazos-area properties',
        paragraphs: [
          'A lot of Killeen concrete work happens on rental homes and investment properties, where owners and property managers need dependable scheduling and a slab that survives tenant turnover. We also hear from military families near Fort Cavazos working against PCS timelines who need clear start dates and honest communication.',
          'For those projects we confirm scope quickly, put the schedule in writing, and sequence demolition, pour, and cure so driveways and entries are usable as soon as the concrete can safely take traffic.',
        ],
      },
      {
        title: 'Soil and drainage around Killeen',
        paragraphs: [
          'Killeen and Harker Heights sit on shallow limestone and clay mixes that handle water differently across even a single street. Some lots drain fast; others hold water against slab edges after storms. We check where runoff actually goes before we plan base prep and slope.',
          'That inspection shapes the pour. Thickness, reinforcement, joint spacing, and edge protection get matched to the soil and traffic on your site instead of copied from the last job.',
        ],
      },
      {
        title: 'Light commercial and parking concrete in Killeen',
        paragraphs: [
          'Killeen businesses ask for parking pads, sidewalk replacements, dumpster pads, accessible entry work, and equipment slabs. Those jobs need phasing so customers and deliveries keep moving while sections cure.',
          'We plan traffic control, pour sequence, and reopening milestones with the property owner up front so a small commercial project does not turn into a week of blocked entrances.',
        ],
      },
    ],
    highlights: baseHighlights,
    services: baseServices,
    nearbyAreas: ['Harker Heights', 'Fort Cavazos', 'Nolanville', 'Copperas Cove', 'Belton', 'Kempner'],
    localSearchLinks: [
      {
        label: 'Killeen driveway and slab planning',
        href: '/concrete-driveways-waco-tx',
        description: 'How base prep, reinforcement, vehicle use, and drainage affect driveway and slab projects.',
      },
      {
        label: 'Killeen concrete repair questions',
        href: '/foundation-repair-waco-tx',
        description: 'Crack, settlement, and drainage questions to answer before patching or replacing concrete.',
      },
      {
        label: 'Commercial concrete planning',
        href: '/commercial-concrete-contractor-waco-tx',
        description: 'Scheduling, access, and traffic-safe concrete planning for business properties.',
      },
    ],
    projects: baseProjects('Killeen'),
    faq: [
      {
        question: 'Do you offer concrete estimates in Killeen?',
        answer:
          'Yes. We provide estimates for Killeen driveways, patios, sidewalks, slabs, pads, and repair projects when the location and schedule fit our service area.',
      },
      {
        question: 'Can you repair existing concrete in Killeen?',
        answer:
          'Yes. We inspect cracks, spalling, settlement, drainage, and base condition before recommending repair or replacement.',
      },
      {
        question: 'Can Killeen projects be scheduled around limited access?',
        answer:
          'Often, yes. We discuss parking, tenant or customer access, cure timing, and job sequencing before work starts.',
      },
      {
        question: 'Do you serve Harker Heights, Nolanville, and Copperas Cove?',
        answer:
          'Yes. We cover the greater Killeen area including Harker Heights, Nolanville, and Copperas Cove when the project scope and schedule fit our routes.',
      },
      {
        question: 'Can you work around a PCS move or rental turnover deadline?',
        answer:
          'Often, yes. Tell us the deadline during the estimate and we will be honest about whether the prep, pour, and cure schedule can meet it.',
      },
    ],
  },
  {
    slug: 'hewitt-tx-concrete-contractor',
    city: 'Hewitt',
    seoTitle: 'Concrete Contractor Hewitt Texas | Driveways, Patios, Small Jobs',
    heroTitle: 'Concrete Contractor Hewitt Texas',
    heroSubtitle:
      'Driveways, patios, stamped concrete, small concrete jobs, and slab repairs for Hewitt homes. Free on-site estimates with clear start dates.',
    seoDescription:
      'Looking for a concrete contractor in Hewitt, Texas? SLA Concrete Works builds driveways, patios, stamped concrete, small slabs, and repairs for clay soil.',
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
        title: 'Small concrete jobs in Hewitt',
        paragraphs: [
          'A lot of Hewitt calls are small jobs — a short walkway, a patio extension, a shed or equipment pad — and plenty of contractors simply never call back on those. We take them, and we plan them properly, because a small pad on rushed base and bad drainage cracks just as fast as a big one.',
          'We handle small slabs, entry walks, patio add-ons, driveway approach repairs, shed pads, and single-section replacements. If we are already pouring nearby, bundling your small job with that trip is the easiest way to keep the price down — ask about it at the estimate.',
        ],
      },
      {
        title: 'Driveway replacement and patio extension priorities',
        paragraphs: [
          'Hewitt driveway replacement usually comes down to traffic loads, garage transitions, expansion space, and water movement away from the house. We look for low spots, edge failures, thin existing sections, and places where vehicles turn across the slab.',
          'Patio extensions need the same attention. Door thresholds, downspouts, shade lines, fence access, and furniture layout all affect the pour. We plan the slab so the finished space feels usable, drains cleanly, and fits the rest of the backyard instead of looking like an afterthought.',
        ],
      },
      {
        title: 'Hewitt neighborhoods and daily traffic',
        paragraphs: [
          'Hewitt work clusters around the neighborhoods off Hewitt Drive and Spring Valley Road, where driveways see steady school-run and commuter traffic. Widening a driveway, adding a parking pad, or replacing a cracked approach are frequent requests because many households have more vehicles than the original slab was designed for.',
          'That daily use shapes the plan. Extra width needs the same base quality as the original drive, approach transitions have to meet the street cleanly, and pours get scheduled so the household is not blocked in longer than necessary.',
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
    localSearchLinks: [
      {
        label: 'Hewitt driveway replacement',
        href: '/concrete-driveways-waco-tx',
        description: 'Driveway prep, tear-out, slope, reinforcement, and approach planning for Hewitt homes.',
      },
      {
        label: 'Hewitt patio extension planning',
        href: '/concrete-patios-waco-tx',
        description: 'Patio additions, backyard transitions, stamped options, and drainage around doors and fences.',
      },
      {
        label: 'Small slab and sidewalk work',
        href: '/concrete-sidewalks-waco-tx',
        description: 'Entry walks, small pads, sidewalk repairs, and practical flatwork for tight-access areas.',
      },
      {
        label: 'Recent Waco-area project updates',
        href: '/blog',
        description: 'Local job notes and concrete planning articles that support city and service pages.',
      },
    ],
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
      {
        question: 'Do you take small concrete jobs in Hewitt?',
        answer:
          'Yes, when the access, concrete minimums, and schedule make sense. Common small projects include patio extensions, entry walks, shed pads, approach repairs, and short sidewalk replacements.',
      },
      {
        question: 'How fast can you look at a Hewitt project?',
        answer:
          'Usually quickly — Hewitt sits minutes from our regular routes, so estimates are easy to schedule. Send photos and rough dimensions and we can often give a preliminary read before the site visit.',
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
      {
        title: 'Retaining walls, steps, and hardscape tie-ins',
        paragraphs: [
          'Woodway concrete work often touches slopes, mature landscaping, outdoor living spaces, or drainage transitions. When a patio, walkway, retaining wall, or step layout is planned separately, water and grade problems can show up between the pieces.',
          'We look at the whole hardscape path before recommending the next pour. That helps the driveway, patio, wall, or walkway connect cleanly and keeps runoff from collecting where it can soften the base.',
        ],
      },
      {
        title: 'Woodway lots along Bosque Boulevard and Highway 84',
        paragraphs: [
          'Woodway runs along Highway 84 with established neighborhoods, larger wooded lots, and grade changes that flat subdivisions do not have. Driveways and patios here often have to work around mature oaks, root zones, and slopes that move water fast during storms.',
          'We plan around those features instead of against them: approaches that protect root systems, patio elevations that step with the yard, and drainage that directs runoff away from both the new concrete and the trees the property was built around.',
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
    localSearchLinks: [
      {
        label: 'Woodway retaining wall planning',
        href: '/retaining-walls-waco-tx',
        description: 'Slope control, drainage relief, patio edges, and wall-to-flatwork transitions for Woodway properties.',
      },
      {
        label: 'Woodway patio and hardscape layouts',
        href: '/hardscaping-waco-tx',
        description: 'Patios, walks, retaining walls, steps, drainage transitions, and outdoor living layouts.',
      },
      {
        label: 'Woodway driveway replacement',
        href: '/concrete-driveways-waco-tx',
        description: 'Driveway tear-out, widening, reinforcement, drainage, and finish choices for daily use.',
      },
    ],
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
      {
        question: 'Do you build retaining walls or drainage transitions in Woodway?',
        answer:
          'Yes. We plan retaining walls, patio edges, walks, and drainage transitions together so water does not collect against slabs or soft soil pockets.',
      },
      {
        question: 'Can you pour around mature trees in Woodway?',
        answer:
          'Yes, carefully. We adjust layout, edge lines, and slab thickness near root zones, and we talk through the tradeoffs so the driveway or patio does not damage the trees that make the lot valuable.',
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
      'Robinson work is usually driveway replacements, slab repairs, shop pads, and patios — planned around the same black clay that moves everything in McLennan County.',
    planningSections: [
      {
        title: 'What Robinson properties usually need',
        paragraphs: [
          'Robinson sits right on the clay like the rest of the county, but the lots run bigger than central Waco, and that changes the work. We see more shop slabs, RV and trailer pads, and longer driveways here — pours where the concrete has to carry real weight, not just a sedan. Those get thicker sections and heavier reinforcement where the wheels actually go.',
          'The newer subdivisions off the Robinson Drive corridor bring the opposite kind of job: builder-grade driveways and patios that were poured fast and are showing it a few years in. Replacing a cracked approach or extending a too-small patio are two of our most common Robinson calls.',
        ],
      },
      {
        title: 'Drainage on flat lots',
        paragraphs: [
          'A lot of Robinson ground is flat, which sounds ideal until you need water to leave. Flat lots hold water against slab edges after storms, and wet clay under a slab edge is how corners crack and settle. We plan slope into every pour — even when the yard barely has any — so water moves off the concrete instead of soaking in beside it.',
        ],
      },
      {
        title: 'Rural-edge and shop work',
        paragraphs: [
          'Toward the edges of Robinson and out to Bruceville-Eddy and Lorena, projects get more rural: shop foundations, equipment pads, aprons where gravel drives meet new concrete. Access is usually easy on these lots, which helps the price — the concrete truck can get close, and there is room to stage forms and base material without tearing up the yard.',
        ],
      },
    ],
    highlights: baseHighlights,
    services: baseServices,
    nearbyAreas: ['Waco', 'Hewitt', 'Woodway', 'Lorena', 'Bruceville-Eddy', 'Bellmead'],
    projects: baseProjects('Robinson'),
    faq: [
      {
        question: 'Do you offer free estimates in Robinson?',
        answer: 'Yes — Stephen does the site visit himself, measures, and puts the price in writing. No obligation.',
      },
      {
        question: 'Can you handle small concrete pads in Robinson?',
        answer:
          'Yes. Walkways, shed and equipment pads, and single-section repairs are regular work for us in Robinson, often scheduled alongside bigger pours nearby.',
      },
      {
        question: 'Do you pour shop slabs and RV pads in Robinson?',
        answer:
          'All the time — larger Robinson lots make these common. We size thickness and reinforcement for the actual loads: a slab that holds a trailer or lift needs more than a patio does.',
      },
    ],
  },
  {
    slug: 'lorena-tx-concrete-contractor',
    city: 'Lorena',
    seoTitle: 'Concrete Contractor Lorena TX | Patios, Driveways & Hardscaping',
    heroTitle: 'Concrete Contractor in Lorena, TX',
    heroSubtitle:
      'Stamped concrete, patios, driveways, hardscaping, and repairs for Lorena homes and properties.',
    seoDescription:
      'Concrete contractor in Lorena, TX for durable driveways, patios, hardscaping, stamped concrete, and concrete repairs. Free estimates for Lorena-area concrete work.',
    intro:
      'Lorena homeowners trust us for detailed prep, smooth finishes, drainage-aware hardscaping, and long-lasting concrete work that fits the property.',
    highlights: baseHighlights,
    planningSections: [
      {
        title: 'Hardscaping and drainage planning in Lorena',
        paragraphs: [
          'A good hardscaping contractor in Lorena should think beyond the finished surface. Patios, walkways, retaining wall edges, steps, driveway tie-ins, and outdoor living areas all change how water moves across the property. If those pieces are planned separately, runoff can collect against slab edges or push into soft clay pockets.',
          'We look at slope, roof runoff, fence lines, gates, yard access, existing concrete, and where people actually walk before recommending the layout. That helps a Lorena patio, walkway, or hardscape transition feel natural while still protecting the base below the concrete.',
        ],
      },
      {
        title: 'Driveways, patios, shop pads, and rural access',
        paragraphs: [
          'Many Lorena projects need a different plan than a tight city-lot pour. Longer driveways, shop slabs, equipment pads, backyard patios, and driveway extensions can involve more grading, vehicle turning space, and drainage review than the square footage alone suggests.',
          'During the estimate, we document demolition, base prep, reinforcement assumptions, finish, joint layout, access for trucks, and anything that might need a permit. That gives you a clearer way to compare bids before the pour is scheduled.',
        ],
      },
    ],
    services: [
      ...baseServices.slice(0, 4),
      { label: 'Hardscaping', href: '/hardscaping-waco-tx' },
      { label: 'Retaining Walls', href: '/retaining-walls-waco-tx' },
      ...baseServices.slice(4),
    ],
    nearbyAreas: ['Waco', 'Hewitt', 'Robinson', 'Woodway', 'Golinda', 'McGregor'],
    projects: baseProjects('Lorena'),
    localSearchLinks: [
      {
        label: 'Hardscaping contractor for Lorena projects',
        href: '/hardscaping-waco-tx',
        description:
          'Patios, walkways, retaining wall tie-ins, steps, pads, and drainage transitions planned around Central Texas soil.',
      },
      {
        label: 'Retaining wall installation near Lorena',
        href: '/retaining-walls-waco-tx',
        description:
          'Slope control, soil pressure, patio edges, and water movement for properties that need grade support.',
      },
      {
        label: 'Concrete slab permit planning',
        href: '/guides/do-i-need-a-permit-to-pour-a-concrete-slab-waco-tx',
        description:
          'What to check before pouring a patio, driveway extension, shop pad, sidewalk, or support slab.',
      },
    ],
    faq: [
      {
        question: 'What finishes are available in Lorena?',
        answer:
          'We offer broom, exposed aggregate, and stamped finishes with multiple color options.',
      },
      {
        question: 'Do you handle hardscaping contractor work in Lorena?',
        answer:
          'Yes. We plan Lorena hardscaping projects such as patios, walkways, retaining wall tie-ins, steps, pads, and drainage transitions so the layout works with the property instead of creating low spots.',
      },
      {
        question: 'Can you build a driveway extension or shop pad in Lorena?',
        answer:
          'Yes. We review vehicle use, slab thickness, reinforcement, access, drainage, and cure timing before pricing driveway extensions, garage pads, shop slabs, and similar concrete work.',
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
      'McGregor projects lean toward shop slabs, driveways, and equipment pads where load planning matters — plus the usual patios and repairs around town.',
    planningSections: [
      {
        title: 'Shop slabs and working concrete',
        paragraphs: [
          'McGregor is a working town — between the industrial park, the ranches, and the properties along US-84, a lot of what we pour here has to carry equipment, not just foot traffic. Shop foundations, welding and equipment pads, and aprons where a gravel drive meets the slab are the bread and butter of our McGregor work.',
          'For those pours, the conversation starts with what will actually sit on the concrete. A slab under a car lift, a tractor, or a loaded trailer gets sized differently — thicker sections, heavier steel, joints planned around where the weight parks. Getting that right up front costs a little more; getting it wrong costs a new slab.',
        ],
      },
      {
        title: 'Driveways and home concrete in town',
        paragraphs: [
          'In McGregor proper, the calls look more like the rest of the county: driveway replacements, patio pours, sidewalk sections, and steps around older homes. Older-in-town lots often have existing concrete the new work has to tie into cleanly — we set elevations so old and new meet flush, with no trip lip and no water trapped at the seam.',
        ],
      },
      {
        title: 'Rural drives and long runs',
        paragraphs: [
          'Outside town toward Moody, Oglesby, and Gatesville, driveways get long. Pouring a full rural drive in concrete is a real budget number, so we often talk through practical hybrids: concrete where it matters most — the apron at the road, the parking and turnaround by the house, the shop approach — with gravel holding the run between. It keeps the cost sane and puts the concrete where wheels turn and water crosses.',
        ],
      },
    ],
    highlights: baseHighlights,
    services: baseServices,
    nearbyAreas: ['Waco', 'Moody', 'Gatesville', 'Woodway', 'Lorena', 'Oglesby'],
    projects: baseProjects('McGregor'),
    faq: [
      {
        question: 'Do you work on commercial concrete in McGregor?',
        answer:
          'Yes — pads, parking areas, aprons, and slabs for shops and light industrial use. Load planning is most of the conversation on these jobs.',
      },
      {
        question: 'Can you match stamped concrete colors in McGregor?',
        answer:
          'We can blend colors and release agents to match stone or brick tones that fit your exterior.',
      },
      {
        question: 'Do you pour full rural driveways?',
        answer:
          'We do, and we will also tell you when a hybrid makes more sense — concrete at the road apron, house parking, and shop approach, with gravel between. It is often half the cost and covers the spots that actually fail.',
      },
    ],
  },
]

export const locationLinks = locationPages.map((page) => ({
  slug: page.slug,
  city: page.city,
}))
