export const SERVICE_CANONICAL_PATH_BY_SLUG = {
  'concrete-contractors': '/contractors-in-waco-tx',
  'concrete-driveways': '/concrete-driveways-waco-tx',
  'concrete-patios': '/concrete-patios-waco-tx',
  'parking-lots': '/parking-lot-concrete-waco',
  'concrete-repair': '/foundation-repair-waco-tx',
  'concrete-demolition': '/concrete-demolition-waco-tx',
  'concrete-sawing': '/concrete-sawing-waco-tx',
  'sidewalks-driveways': '/concrete-sidewalks-waco-tx',
  'stamped-concrete': '/stamped-concrete-waco-tx',
  'commercial-concrete': '/commercial-concrete-contractor-waco-tx',
  'concrete-foundations': '/concrete-foundations-waco-tx',
}

export function getCanonicalServicePath(serviceSlug = '') {
  return SERVICE_CANONICAL_PATH_BY_SLUG[serviceSlug] || `/services/${serviceSlug}`
}

export function isServicePageCanonicalized(serviceSlug = '') {
  return Object.prototype.hasOwnProperty.call(SERVICE_CANONICAL_PATH_BY_SLUG, serviceSlug)
}

const baseProcess = [
  {
    title: 'Site walk + estimate',
    description: 'We review access, drainage, and scope so the estimate is accurate and clear.',
  },
  {
    title: 'Prep + base work',
    description: 'Proper grading, compaction, and reinforcement create a stable foundation.',
  },
  {
    title: 'Pour + finish',
    description: 'Clean edges, consistent slope, and the finish you choose.',
  },
]

const baseBenefits = [
  'Durable surface that handles Texas heat swings',
  'Custom finishes for curb appeal and backyard style',
  'Low-maintenance upkeep with simple sealing schedules',
]

const baseServicePages = [
  {
    slug: 'concrete-contractors',
    title: 'Concrete Contractors',
    heroTitle: 'Waco Concrete Contractors',
    heroSubtitle:
      'Driveways, patios, slabs, and repairs for homes and businesses around Waco, with owner-led scoping and a written estimate.',
    seoTitle: 'Concrete Contractors Waco TX | SLA Concrete Works LLC',
    seoDescription:
      'Owner-run Waco concrete contractor for driveways, patios, stamped concrete, slabs, and repair, with written estimates that show what is included. (254) 230-3102.',
    intro:
      'We pour driveways, patios, slabs, and stamped concrete across Waco and the surrounding towns, and we put every part of the job in writing — demolition, base work, steel, finish, cleanup — so you can compare bids on what is actually included instead of just the bottom number.',
    benefits: baseBenefits,
    process: baseProcess,
    finishes: ['Broom finish', 'Stamped patterns', 'Sealed concrete', 'Slip-resistant options'],
    pricingGuide: {
      title: 'Waco concrete contractor pricing',
      description: 'How scope, prep, size, and finish choices affect your concrete estimate.',
      href: '/guides/concrete-driveway-cost-waco-tx',
    },
    localNotes: [
      {
        title: 'Commercial and residential reach',
        description: 'We support one-stop concrete work for homes, businesses, and light commercial properties.',
      },
      {
        title: 'Local soil-aware planning',
        description: 'In McLennan County, black clay movement is a major factor we design around on every project.',
      },
      {
        title: 'Direct scope review',
        description: 'Project details are reviewed before a site visit or estimate is scheduled.',
      },
    ],
    costFactors: [
      'Project type: driveway, patio, slab, commercial, or repair',
      'Square footage and shape complexity',
      'Site access and demolition needs',
      'Soil condition and drainage requirements',
      'Finish level, stain options, and sealing schedule',
    ],
    timeline:
      'Most concrete projects are estimated and scheduled through a single in-person consult, then move through prep, pour, and cure milestones.',
    faq: [
      {
        question: 'Do you do both residential and commercial work?',
        answer:
          'Yes. Most of our work is residential — driveways, patios, slabs — but we also handle light commercial projects like walkways, parking areas, and building pads.',
      },
      {
        question: 'What should I compare when choosing concrete companies in Waco TX?',
        answer:
          'Compare prep scope, drainage planning, control-joint layout, reinforcement, and timeline clarity. We walk through each item during your estimate so scope and price stay transparent.',
      },
      {
        question: 'Can you handle concrete installation and repair?',
        answer:
          'Yes. We offer full-service concrete installs, replacements, and repair packages so most projects stay with one team.',
      },
      {
        question: 'What areas do you cover?',
        answer:
          'SLA is based in Elm Mott. Send the project address, scope, dimensions, access, and timing so current coverage, travel, and any practical job minimum can be confirmed before scheduling.',
      },
      {
        question: 'How do you handle heavy summer heat in Waco TX?',
        answer:
          'We plan materials, timing, and curing practices for Central Texas conditions to protect quality and long-term performance.',
      },
    ],
  },
  {
    slug: 'sidewalks-driveways',
    title: 'Sidewalks & Driveways',
    heroTitle: 'Sidewalks and Driveways in Waco, TX',
    heroSubtitle:
      'Safe, level surfaces for sidewalks and driveways with better drainage, control joints, and long-term durability.',
    seoTitle: 'Sidewalk & Driveway Concrete Waco TX | SLA Concrete Works LLC',
    seoDescription:
      'Concrete sidewalks and driveways in Waco, TX. We build safe-access concrete for sidewalks, sidewalks repair, and driveway replacements with a focus on drainage and crack control.',
    intro:
      'We create practical sidewalks and driveways that reduce settling, pooling, and uneven wear. Central Texas soil movement is planned for with base depth, compaction, and reinforcement strategy.',
    benefits: baseBenefits,
    process: baseProcess,
    finishes: ['Broom finish', 'Stamped detail accents', 'Smooth trowel finish', 'Exposed aggregate edges'],
    pricingGuide: {
      title: 'Concrete driveway cost in Waco',
      description: 'Cost ranges for standard and decorative sidewalk-driveway concrete projects.',
      href: '/guides/concrete-driveway-cost-waco-tx',
    },
    localNotes: [
      {
        title: 'Safe access planning',
        description: 'We plan transitions, joint spacing, and slope for dependable pedestrian and vehicle surfaces.',
      },
      {
        title: 'Soil movement handling',
        description: 'McLennan County clay shifts can affect long-term levelness; prep details are designed around that reality.',
      },
      {
        title: 'Neighborhood-ready cleanups',
        description: 'Work zones are kept clear so sidewalks and driveways match local neighborhood standards after project completion.',
      },
    ],
    costFactors: [
      'Sidewalk length and width',
      'Driveway footprint and truck access',
      'Existing concrete condition',
      'Drainage correction and grading',
      'Finishes and border upgrades',
    ],
    timeline:
      'Walkway timing depends on demolition, access, base correction, layout, inspections, placement, weather, cure criteria, and reopening requirements.',
    faq: [
      {
        question: 'Do you pour sidewalks from scratch or replace old concrete?',
        answer:
          'We offer both new sidewalk installs and full replacement when the old slab no longer performs safely.',
      },
      {
        question: 'Do you match sidewalk and driveway work on one estimate?',
        answer:
          'Yes. When practical, we coordinate both scopes together so transitions and finish details stay consistent.',
      },
      {
        question: 'How long does a sidewalk replacement last in Central Texas?',
        answer:
          'With proper base prep, drainage, and cure practices, sidewalk surfaces can stay stable for years. We still advise annual checks for sealant and joint movement.',
      },
      {
        question: 'Can you build wheelchair-safe concrete pathways?',
        answer:
          'Yes, we can plan accessible widths, transitions, and slopes while balancing local grading and drainage needs.',
      },
    ],
  },
  {
    slug: 'parking-lots',
    title: 'Parking Lots',
    heroTitle: 'Parking Lot Concrete in Waco, TX',
    heroSubtitle:
      'Heavy-use concrete surfaces with reinforced design for safer traffic flow and long-term load performance.',
    seoTitle: 'Parking Lot Concrete Waco TX | Concrete Contractor Waco TX',
    seoDescription:
      'Parking lot construction and repair in Waco, TX. Heavy-duty concrete surfaces for small and mid-size businesses, built for heat and traffic.',
    intro:
      'Our parking lot projects are built for traffic, heat, and wear, with base prep, reinforcement, and edge detailing tuned for dependable use.',
    benefits: [
      'Heavy-duty surfaces for vehicle and foot traffic',
      'Reinforced base structure to support high use',
      'Driveway and loading transition planning',
    ],
    process: baseProcess,
    finishes: ['Broom finish', 'Hard trowel finish', 'Slip-resistant mix options', 'Curb and expansion detailing'],
    pricingGuide: {
      title: 'Commercial concrete pricing guidance',
      description: 'Load zones, parking layout, and finish details that impact parking lot bids.',
      href: '/guides/concrete-driveway-cost-waco-tx',
    },
    localNotes: [
      {
        title: 'Traffic-first layout',
        description: 'We design traffic flow and turning radii to reduce edge chipping and early cracking.',
      },
      {
        title: 'Drainage and grading',
        description: 'Parking strips and swales are set so water drains correctly and does not pool near pavement edges.',
      },
      {
        title: 'Commercial scheduling',
        description: 'We coordinate staged execution to reduce disruption and keep operations moving.',
      },
    ],
    costFactors: [
      'Number of bays, strips, and turning radius requirements',
      'Concrete thickness and reinforcement spacing',
      'Grading and storm-water routing',
      'Curb, paint, and marking scope',
      'Site access and operating-hour constraints',
    ],
    timeline:
      'Most parking lot projects are completed with clear phase planning across prep, pour, and cure windows for operational safety.',
    faq: [
      {
        question: 'Can you build new parking lots for small businesses?',
        answer:
          'Yes. We handle smaller to mid-size parking surfaces and can coordinate with owner schedules and access windows.',
      },
      {
        question: 'Do you offer concrete parking lot repair?',
        answer:
          'Yes. We offer patching, resurfacing, and edge repairs where replacement would be too disruptive.',
      },
      {
        question: 'Do you handle parking-lot markings and edging?',
        answer:
          'We coordinate layout and preparation so markings and edge details are clean and durable after the slab cures.',
      },
      {
        question: 'How quickly can parking lot work reopen to traffic?',
        answer:
          'Traffic limits depend on load type and weather. We provide staged reopen guidance based on cure and safety milestones.',
      },
    ],
  },
  {
    slug: 'concrete-driveways',
    title: 'Concrete Driveways',
    heroTitle: 'Concrete Driveways in Waco, TX',
    heroSubtitle:
      'New installs, replacements, and extensions built for daily traffic and long-term durability.',
    seoTitle: 'Concrete Driveway Waco TX | Free Estimate (254) 230-3102',
    seoDescription:
      'Concrete driveway install & replacement in Waco. Built for Central Texas soil. Free estimate: (254) 230-3102.',
    intro:
      'For professional driveway installation, Waco residents know a well-built slab adds curb appeal and reduces maintenance for years. We design slope, drainage, and joint placement to protect your driveway through Central Texas summers.',
    benefits: baseBenefits,
    process: baseProcess,
    finishes: ['Broom finish', 'Light salt finish', 'Exposed aggregate accents', 'Decorative borders'],
    pricingGuide: {
      title: 'Concrete driveway cost in Waco',
      description: 'Typical price ranges, cost drivers, and what to expect on estimates.',
      href: '/guides/concrete-driveway-cost-waco-tx',
    },
    localNotes: [
      {
        title: 'Built for Waco soil',
        description: 'We plan base depth and reinforcement to handle McLennan County clay shifts.',
      },
      {
        title: 'Drainage-first layout',
        description: 'Proper slope and joint spacing keep water moving away from your slab.',
      },
      {
        title: 'Daily-traffic durability',
        description: 'Driveways are designed for vehicle loads and repeated heat cycles.',
      },
    ],
    costFactors: [
      'Square footage and thickness',
      'Base prep, grading, and drainage work',
      'Rebar or mesh reinforcement',
      'Removal of existing concrete',
      'Finish upgrades like borders or exposed aggregate',
    ],
    timeline:
      'Driveway timing and vehicle opening depend on removal, base work, size, access, placement sequence, concrete specification, weather, cure method, and project loads.',
    faq: [
      {
        question: 'How much does a concrete driveway cost in Waco?',
        answer:
          'Driveway pricing depends on measured area, demolition, base correction, drainage, thickness, reinforcement, access, finish, and the exact included scope. The current cost guide explains those factors without publishing an unsupported generic range.',
      },
      {
        question: 'How thick is a residential concrete driveway?',
        answer:
          'Thickness and reinforcement should follow actual vehicle loads, support conditions, edge details, plans, and the written project scope rather than one site-wide rule.',
      },
      {
        question: 'Do you remove old driveways in Waco?',
        answer:
          'Yes. We handle removal and disposal when replacement is the best long-term option.',
      },
      {
        question: 'When can I drive on my new driveway?',
        answer:
          'The project handoff should state the vehicle-opening criteria for the selected concrete, thickness, weather, cure method, and expected loads.',
      },
    ],
  },
  {
    slug: 'concrete-patios',
    title: 'Concrete Patios',
    heroTitle: 'Concrete Patios in Waco, TX',
    heroSubtitle:
      'Gathering spaces designed for shade structures, outdoor kitchens, and easy maintenance.',
    seoTitle: 'Concrete Patio Waco TX | Free Estimate (254) 230-3102',
    seoDescription:
      'Concrete patios in Waco with stamped, stained & exposed aggregate finishes. Free estimate: (254) 230-3102.',
    intro:
      'From cozy seating pads to large entertaining spaces, we pour patios that complement your home and landscape while staying cool underfoot.',
    benefits: baseBenefits,
    process: baseProcess,
    finishes: ['Light broom finish', 'Stamped stone patterns', 'Stained concrete', 'Exposed aggregate'],
    pricingGuide: {
      title: 'Concrete patio cost in Waco',
      description: 'Pricing ranges, finish upgrades, and layout choices that affect cost.',
      href: '/guides/concrete-patio-cost-waco-tx',
    },
    localNotes: [
      {
        title: 'Comfort in Texas heat',
        description: 'We plan finishes and shading layouts to keep patios usable in summer.',
      },
      {
        title: 'Clean transitions',
        description: 'Edges and steps are laid out to match doors, lawns, and landscape beds.',
      },
      {
        title: 'Entertaining ready',
        description: 'We plan thickness and reinforcement for outdoor kitchens or pergolas.',
      },
    ],
    costFactors: [
      'Patio size and shape complexity',
      'Finish type (broom, stamped, stained)',
      'Step-downs, borders, or seating walls',
      'Site access and prep requirements',
    ],
    timeline:
      'Patio timing depends on removal, base and grade work, access, layout, finish, weather, cure method, selected products, and use restrictions.',
    faq: [
      {
        question: 'How much does a concrete patio cost in Waco?',
        answer:
          'Patio pricing depends on measured area, door elevations, grade, drainage, access, removal, finish, cover or kitchen coordination, and the exact written scope. The current cost guide explains those factors without an unsupported generic range.',
      },
      {
        question: 'Can you do stamped concrete patios in Waco?',
        answer:
          'Yes. We offer multiple stamp patterns and color blends for patio upgrades.',
      },
      {
        question: 'Do patios need rebar?',
        answer:
          'We typically use reinforcement based on size, soil conditions, and load needs.',
      },
      {
        question: 'How do you keep water from pooling?',
        answer:
          'We set slope and drainage during layout so water flows away from your home.',
      },
    ],
  },
  {
    slug: 'stamped-concrete',
    title: 'Stamped Concrete',
    heroTitle: 'Stamped Concrete in Waco, TX',
    heroSubtitle:
      'Decorative patterns and color blends for driveways, patios, and walkways.',
    seoTitle: 'Stamped Concrete Waco TX | Free Estimate (254) 230-3102',
    seoDescription:
      'Stamped concrete driveways & patios in Waco. Stone, brick & slate patterns. Free estimate: (254) 230-3102.',
    intro:
      'Stamped concrete delivers the look of stone, slate, or brick without the maintenance. We plan joint placement and release patterns to keep the surface consistent.',
    benefits: [
      'Custom patterns and color combinations',
      'Durable surface with sealed protection',
      'Lower maintenance than pavers or stone',
    ],
    process: baseProcess,
    finishes: ['Ashlar slate', 'Cobblestone', 'Flagstone', 'Brick herringbone'],
    pricingGuide: {
      title: 'Stamped concrete pricing in Waco',
      description: 'Pattern options, sealing guidance, and cost ranges for stamped work.',
      href: '/guides/stamped-concrete-cost-waco-tx',
    },
    localNotes: [
      {
        title: 'Pattern planning',
        description: 'We map joints and stamp layout to reduce visible breaks and seams.',
      },
      {
        title: 'Color blending',
        description: 'Integral color and release powders create natural-looking variation.',
      },
      {
        title: 'Seal for longevity',
        description: 'Sealer protects against UV fade and keeps cleanup simple.',
      },
    ],
    costFactors: [
      'Pattern complexity and border work',
      'Color selection and stain blends',
      'Surface size and access',
      'Sealer choice and maintenance schedule',
    ],
    timeline:
      'Stamped-concrete timing depends on the base slab, pattern and color system, washing, sealing, weather, cure, access, and the actual use of the surface.',
    faq: [
      {
        question: 'How much does stamped concrete cost in Waco?',
        answer:
          'Stamped pricing depends on the base slab plus preparation, pattern, color system, borders, release, washing, sealing, access, and maintenance requirements. Compare the full written scope rather than a generic range.',
      },
      {
        question: 'How often should stamped concrete be sealed?',
        answer:
          'Inspection and resealing timing should follow the named sealer, exposure, traffic, cleaning, appearance, traction, and observed wear rather than one fixed interval.',
      },
      {
        question: 'Does stamped concrete get slippery?',
        answer:
          'We can add slip-resistant textures and choose sealers that balance grip and sheen.',
      },
      {
        question: 'Can you match an existing pattern?',
        answer:
          'We can often match nearby surfaces with the right stamp and color blend.',
      },
    ],
  },
  {
    slug: 'commercial-concrete',
    title: 'Commercial Concrete',
    heroTitle: 'Commercial Concrete in Waco, TX',
    heroSubtitle:
      'Slabs, pads, and site concrete for offices, retail, and light industrial spaces.',
    seoTitle: 'Commercial Concrete Contractor Waco TX | SLA Concrete Works LLC',
    seoDescription:
      'Commercial concrete slabs & pads in Waco. Free estimate: (254) 230-3102.',
    intro:
      'We coordinate with builders, property managers, and business owners to keep concrete timelines on track and sites clean.',
    benefits: [
      'Clear scheduling and site coordination',
      'Durable mixes for heavier traffic areas',
      'Finishes that meet commercial requirements',
    ],
    process: baseProcess,
    finishes: ['Broom finish', 'Hard trowel finish', 'Slip-resistant options'],
    localNotes: [
      {
        title: 'Spec-driven pours',
        description: 'We align mix, reinforcement, and finish to project requirements.',
      },
      {
        title: 'Site coordination',
        description: 'Clear schedules and jobsite communication keep trades aligned.',
      },
      {
        title: 'Durability focus',
        description: 'Finishes selected for traffic, equipment, and maintenance needs.',
      },
    ],
    costFactors: [
      'Square footage and slab thickness',
      'Engineering or design requirements',
      'Rebar schedules and vapor barrier needs',
      'Site access and staging constraints',
    ],
    timeline:
      'Commercial placement timing depends on the approved design, size, access, concrete supply, placement sequence, inspections, weather, finish, and cure requirements.',
    faq: [
      {
        question: 'How much do commercial concrete slabs cost in Waco?',
        answer:
          'Commercial slab pricing depends on measured quantities, design, excavation, base, thickness, reinforcement, concrete specification, embeds, access, placement sequence, finish, cure, inspections, and handoffs. It requires a project-specific scope.',
      },
      {
        question: 'Do you handle commercial pads and sidewalks?',
        answer:
          'Yes. We pour pads, walkways, and site concrete for light commercial projects.',
      },
      {
        question: 'Can you meet builder schedules?',
        answer:
          'We coordinate closely with builders and property managers to keep timelines on track.',
      },
      {
        question: 'Do you provide ADA-compliant finishes?',
        answer:
          'SLA can place and finish concrete to approved project documents. The responsible designer or inspector, not this website, determines and verifies accessibility compliance.',
      },
    ],
  },
  {
    slug: 'concrete-repair',
    title: 'Concrete Repair',
    heroTitle: 'Concrete Repair in Waco, TX',
    heroSubtitle:
      'Crack repair, spall fixes, and surface refreshes to extend the life of your concrete.',
    seoTitle: 'Concrete Repair Waco TX | Free Estimate (254) 230-3102',
    seoDescription:
      'Concrete repair, crack fix & resurfacing in Waco. Free estimate: (254) 230-3102.',
    intro:
      'When you need reliable concrete repair, Waco property owners trust us to evaluate the cause of cracking or surface damage before recommending patching, resurfacing, or replacement.',
    benefits: [
      'Stop water intrusion and further damage',
      'Refresh the look of aging surfaces',
      'Improve safety on walkways and steps',
    ],
    process: baseProcess,
    finishes: ['Concrete patch blends', 'Resurfacing overlays', 'Joint resealing'],
    localNotes: [
      {
        title: 'Cause-first inspection',
        description: 'We identify soil movement, drainage issues, or wear before repairs.',
      },
      {
        title: 'Surface renewal',
        description: 'Resurfacing restores appearance without a full replacement.',
      },
      {
        title: 'Safe walkways',
        description: 'Repairs improve trip hazards and surface integrity.',
      },
    ],
    costFactors: [
      'Crack size and underlying movement',
      'Surface area needing repair',
      'Resurfacing vs replacement needs',
      'Access and site conditions',
    ],
    timeline:
      'Repair and reopening timing depends on the failure, removal, support correction, selected repair or replacement system, weather, cure, loads, and manufacturer or designer requirements.',
    faq: [
      {
        question: 'How much does concrete repair cost in Waco?',
        answer:
          'Repair pricing depends on the cause, movement, affected area, access, removal, base correction, selected repair or replacement system, preparation, finish, and exclusions. A site-specific written scope is required.',
      },
      {
        question: 'When should concrete be repaired vs replaced?',
        answer:
          'We recommend replacement only when slabs have severe movement or widespread failure.',
      },
      {
        question: 'Can you fix sunken sections?',
        answer:
          'We evaluate settlement and recommend the most durable fix for the cause.',
      },
      {
        question: 'How long do repairs last?',
        answer:
          'With proper prep and sealing, repairs can last for years before needing touch-ups.',
      },
    ],
  },
  {
    slug: 'concrete-foundations',
    title: 'Concrete Foundations',
    heroTitle: 'Concrete Foundations in Waco, TX',
    heroSubtitle:
      'Slab-on-grade and structural concrete for residential and light commercial builds.',
    seoTitle: 'Concrete Foundation Waco TX | Free Estimate (254) 230-3102',
    seoDescription:
      'Concrete foundations & slabs in Waco. Reinforced for Central Texas soil. Free estimate: (254) 230-3102.',
    intro:
      'We follow local building requirements and reinforce slabs for long-term structural stability.',
    benefits: [
      'Reinforced slabs built for longevity',
      'Accurate elevations and layout',
      'Ready for framing and next trades',
    ],
    process: baseProcess,
    finishes: ['Structural slab pours', 'Equipment pads', 'Utility pads'],
    localNotes: [
      {
        title: 'Code-aligned builds',
        description: 'We follow local requirements for slab depth, steel, and layout.',
      },
      {
        title: 'Stable base prep',
        description: 'Compaction and moisture control reduce long-term movement.',
      },
      {
        title: 'Trade-ready finish',
        description: 'Clean edges and elevations for framing and plumbing teams.',
      },
    ],
    costFactors: [
      'Slab size and thickness requirements',
      'Engineering or inspection needs',
      'Rebar layout and vapor barriers',
      'Stub-outs and embedded items',
    ],
    timeline:
      'Foundation placement timing depends on approved plans, inspections, size, concrete supply, access, sequence, weather, finish, cure, and other-trade handoffs.',
    faq: [
      {
        question: 'How much does a concrete foundation or slab cost in Waco?',
        answer:
          'Foundation and slab pricing depends on the responsible design, measured quantities, excavation, support, thickness, reinforcement, concrete specification, access, placement, finish, inspections, and trade handoffs.',
      },
      {
        question: 'Do you pour slabs for additions or shops?',
        answer:
          'Yes. We handle slabs for home additions, detached garages, and workshops.',
      },
      {
        question: 'How soon can framing start after a pour?',
        answer:
          'Framing typically starts after initial cure; we coordinate timing with your builder.',
      },
      {
        question: 'Can you coordinate with inspections?',
        answer:
          'Yes. We plan schedules around required inspections and next-trade timelines.',
      },
    ],
  },
  {
    slug: 'concrete-slabs',
    title: 'Concrete Slabs',
    heroTitle: 'Concrete Slabs in Waco, TX',
    heroSubtitle:
      'Garage slabs, shop floors, equipment pads, and utility pads built for longevity.',
    seoTitle: 'Concrete Slab Waco TX | Garage & Shop Slabs (254) 230-3102',
    seoDescription:
      'Concrete slabs for garages, shops & pads in Waco. Proper base, reinforcement, and PSI for your project. Free estimate: (254) 230-3102.',
    intro:
      'We pour slabs for garages, workshops, equipment pads, and utility pads. Each project gets the right thickness, reinforcement, and finish for its use.',
    benefits: [
      'Correct thickness and PSI for your application',
      'Reinforcement planned for soil and load',
      'Clean finish ready for flooring or equipment',
    ],
    process: baseProcess,
    finishes: ['Broom finish', 'Smooth trowel', 'Light salt finish', 'Slip-resistant'],
    localNotes: [
      {
        title: 'McLennan County soil',
        description: 'We plan base depth and reinforcement for black clay expansion.',
      },
      {
        title: 'Load-specific design',
        description: 'Garage and shop slabs are sized for vehicle and equipment weight.',
      },
      {
        title: 'Moisture control',
        description: 'Vapor barriers and joint placement reduce moisture issues.',
      },
    ],
    costFactors: [
      'Square footage and thickness',
      'PSI and reinforcement requirements',
      'Base prep and vapor barrier',
      'Finish type and access',
    ],
    timeline:
      'Slab placement and heavy-use timing depend on design inputs, inspections, size, access, concrete supply, sequence, weather, cure, and expected loads.',
    faq: [
      {
        question: 'How much does a concrete slab cost in Waco?',
        answer:
          'Slab pricing depends on measured quantities, use, design source, excavation, base, thickness, reinforcement, concrete specification, access, finish, cure, inspections, and included handoffs.',
      },
      {
        question: 'What PSI do garage slabs need?',
        answer:
          'The responsible plans or written scope should identify the project concrete specification from actual use, loads, exposure, support, finish, and design inputs.',
      },
      {
        question: 'Do you pour slabs for detached garages?',
        answer:
          'Yes. We handle slabs for garages, workshops, and outbuildings throughout Central Texas.',
      },
    ],
  },
  {
    slug: 'stained-concrete',
    title: 'Stained Concrete',
    heroTitle: 'Stained Concrete in Waco, TX',
    heroSubtitle:
      'Acid and water-based stains for new and existing concrete — patios, walkways, and floors.',
    seoTitle: 'Stained Concrete Waco TX | Acid & Water-Based (254) 230-3102',
    seoDescription:
      'Stained concrete patios & floors in Waco. Acid & water-based options. Free estimate: (254) 230-3102.',
    intro:
      'Stained concrete adds color and depth without the cost of stone or tile. We offer acid-based and water-based stains for new pours and existing surfaces.',
    benefits: [
      'Rich, varied color that ages well',
      'Works on new and existing concrete',
      'Sealed for UV and stain resistance',
    ],
    process: baseProcess,
    finishes: ['Acid stain', 'Water-based stain', 'Multiple color washes', 'Decorative overlays'],
    localNotes: [
      {
        title: 'Heat-safe application',
        description: 'We schedule staining when conditions support proper curing and color development.',
      },
      {
        title: 'Surface preparation',
        description: 'Existing concrete is cleaned and prepared so stain adheres properly.',
      },
      {
        title: 'Sealing for longevity',
        description: 'Sealer protects color from UV fade and makes cleanup easy.',
      },
    ],
    costFactors: [
      'Surface condition and prep needs',
      'Stain type and color complexity',
      'Sealer choice and coverage',
      'Square footage and access',
    ],
    timeline:
      'Stain timing depends on slab condition, preparation, test work, selected stain and sealer, coat sequence, weather, cure, and use restrictions.',
    faq: [
      {
        question: 'How much does stained concrete cost in Waco?',
        answer:
          'Stained-concrete pricing depends on slab condition, previous coatings, test work, preparation, access, named stain and sealer, color detail, traction treatment, cure, and maintenance handoff.',
      },
      {
        question: 'Acid vs water-based stain — which is better?',
        answer:
          'Acid stains produce rich, varied tones that react with the concrete. Water-based stains offer more color control and are easier to apply. We can discuss which fits your project.',
      },
      {
        question: 'Can you stain existing concrete?',
        answer:
          'Yes. We evaluate surface condition, clean and prep, then apply stain. Results vary with concrete age and condition.',
      },
    ],
  },
  {
    slug: 'concrete-sealing',
    title: 'Concrete Sealing',
    heroTitle: 'Concrete Sealing in Waco, TX',
    heroSubtitle:
      'Protect driveways, patios, and stamped concrete from stains, UV, and moisture.',
    seoTitle: 'Concrete Sealing Waco TX | SLA Concrete Works LLC',
    seoDescription:
      'Concrete sealing in Waco. Protect driveways, patios & stamped concrete. Free estimate: (254) 230-3102.',
    intro:
      'Sealing extends the life and look of concrete. We apply penetrating and topical sealers to new and existing surfaces.',
    benefits: [
      'Reduces staining and moisture absorption',
      'Slows UV fade on colored or stamped concrete',
      'Easier cleaning and maintenance',
    ],
    process: [
      {
        title: 'Surface evaluation',
        description: 'We check condition, previous sealers, and surface type.',
      },
      {
        title: 'Cleaning + prep',
        description: 'Surfaces are cleaned and dried before sealing.',
      },
      {
        title: 'Sealer application',
        description: 'Penetrating or topical sealer applied for even coverage.',
      },
    ],
    finishes: ['Penetrating sealer', 'Acrylic topical', 'Wet-look sealer', 'Slip-resistant options'],
    localNotes: [
      {
        title: 'Texas sun protection',
        description: 'UV-resistant sealers help colored and stamped concrete hold its look.',
      },
      {
        title: 'Resealing schedule',
        description: 'Inspection and recoat timing should follow the named product, exposure, traffic, cleaning, and observed wear.',
      },
      {
        title: 'Stamped concrete care',
        description: 'Sealed stamped concrete lasts longer and stays easier to clean.',
      },
    ],
    costFactors: [
      'Square footage',
      'Surface condition and prep',
      'Sealer type and number of coats',
      'Access and obstacles',
    ],
    timeline:
      'Sealing and reopening timing depend on the surface, preparation, selected product, coats, temperature, moisture, weather, and manufacturer instructions.',
    faq: [
      {
        question: 'How much does concrete sealing cost in Waco?',
        answer:
          'Sealing pricing depends on surface and prior-product condition, preparation, test work, measured area, access, named product, coverage, coats, traction treatment, cure, and protection requirements.',
      },
      {
        question: 'How often should I reseal my driveway?',
        answer:
          'Use the named product guidance plus exposure, traffic, cleaning, appearance, traction, and a compatibility or recoat test to decide when another application is appropriate.',
      },
      {
        question: 'Can you seal stamped concrete?',
        answer:
          'Yes. We seal stamped concrete to protect color and make maintenance easier.',
      },
    ],
  },
  {
    slug: 'concrete-demolition',
    title: 'Concrete Demolition',
    heroTitle: 'Concrete Demolition in Waco, TX',
    heroSubtitle:
      'Controlled tear-out and haul-off for driveways, patios, slabs, and walkways that need to be removed cleanly.',
    seoTitle: 'Concrete Demolition Waco TX | SLA Concrete Works LLC',
    seoDescription:
      'Concrete demolition in Waco. Controlled tear-out, saw cutting, and haul-off for replacement and site prep. Free estimate: (254) 230-3102.',
    intro:
      'When a slab is beyond repair or needs to be cleared for new work, we remove it with a controlled plan that protects the surrounding area. We think through access, utilities, haul-off, and replacement prep before the first cut is made.',
    benefits: [
      'Controlled removal with less collateral damage',
      'Clear prep for replacement pours or site changes',
      'Site cleanup and haul-off handled in one scope',
    ],
    process: [
      {
        title: 'Mark and plan',
        description: 'We review the slab, confirm access, and map cut lines before equipment starts.',
      },
      {
        title: 'Controlled tear-out',
        description: 'Saw cutting and removal methods are used to break concrete out in a controlled way.',
      },
      {
        title: 'Haul-off and prep',
        description: 'Debris is removed, the base is cleaned up, and the site is prepared for the next phase.',
      },
    ],
    finishes: ['Full slab removal', 'Selective demolition', 'Haul-off and disposal', 'Base prep for rebuild'],
    localNotes: [
      {
        title: 'Access planning',
        description: 'Tight driveways and active job sites need a demolition plan that fits the space we have.',
      },
      {
        title: 'Utility awareness',
        description: 'We verify the cut layout around utilities, edges, and nearby finishes before work begins.',
      },
      {
        title: 'Rebuild ready',
        description: 'When demolition is part of a replacement, we leave the base prepared for the next pour.',
      },
    ],
    costFactors: [
      'Square footage and slab thickness',
      'Reinforcement, mesh, or rebar inside the slab',
      'Access for equipment, loading, and haul-off',
      'Saw cutting and utility protection needs',
      'Disposal distance and replacement prep',
    ],
    timeline:
      'Removal timing depends on slab size and thickness, reinforcement, access, utilities, scanning or locate requirements, equipment, containment, haul-off, disposal, cleanup, and replacement handoff.',
    faq: [
      {
        question: 'How much does concrete demolition cost in Waco?',
        answer:
          'Demolition cost depends on slab size, thickness, access, and haul-off requirements. We provide a clear estimate after a site review.',
      },
      {
        question: 'Can you remove just part of a slab?',
        answer:
          'Yes. Selective demolition is common when only a section needs to be removed for repair or replacement.',
      },
      {
        question: 'Do you handle haul-off after the tear-out?',
        answer:
          'Yes. We can remove debris and leave the site clean and ready for the next phase of work.',
      },
      {
        question: 'Will demolition damage nearby concrete?',
        answer:
          'We plan cut lines and removal methods to protect adjacent slabs and finishes as much as possible.',
      },
    ],
  },
  {
    slug: 'concrete-sawing',
    title: 'Concrete Sawing',
    heroTitle: 'Concrete Sawing in Waco, TX',
    heroSubtitle:
      'Precision saw cutting for openings, control joints, repair cuts, and clean demolition lines on residential and commercial concrete.',
    seoTitle: 'Concrete Sawing Waco TX | SLA Concrete Works LLC',
    seoDescription:
      'Concrete sawing in Waco. Precision cutting for demolition lines, slab openings, and repair prep. Free estimate: (254) 230-3102.',
    intro:
      'Clean saw cuts matter when you are opening a slab, isolating a repair, or setting up a demolition. We cut concrete with a focus on accuracy, dust control, and protecting the surfaces around the cut.',
    benefits: [
      'Straight, accurate cuts for clean results',
      'Less impact on the surrounding slab or finish',
      'Useful for repairs, openings, and tear-out prep',
    ],
    process: [
      {
        title: 'Measure and mark',
        description: 'We verify the layout, cut depth, and target area before we start cutting.',
      },
      {
        title: 'Controlled cutting',
        description: 'The right saw and cutting method are chosen for the slab, access, and dust control needs.',
      },
      {
        title: 'Cleanup and follow-through',
        description: 'Slurry, dust, and cut debris are cleaned up so the opening or next step is ready.',
      },
    ],
    finishes: ['Control joints', 'Utility openings', 'Selective cut lines', 'Demolition prep cuts'],
    localNotes: [
      {
        title: 'Existing slab accuracy',
        description: 'We cut with care so the finished opening or joint lands where the project needs it.',
      },
      {
        title: 'Dust and water control',
        description: 'Saw cutting is managed to keep the site cleaner and easier to work around.',
      },
      {
        title: 'Trade coordination',
        description: 'Sawing often supports plumbers, electricians, or demolition crews that follow behind us.',
      },
    ],
    costFactors: [
      'Linear feet of cutting needed',
      'Concrete thickness and reinforcement',
      'Access for saws and water management',
      'Wet cut vs dry cut requirements',
      'Cleanup and disposal needs',
    ],
    timeline:
      'Saw-cutting timing depends on layout, depth, reinforcement, access, utility or scan requirements, containment, cleanup, and whether a specialty cutting trade is needed.',
    faq: [
      {
        question: 'How much does concrete sawing cost in Waco?',
        answer:
          'Sawing is priced based on linear feet, thickness, access, and the kind of cut being made. We quote it clearly after reviewing the job.',
      },
      {
        question: 'Can you cut openings for utilities or plumbing?',
        answer:
          'Utility or plumbing openings require the responsible trade’s layout plus confirmed slab thickness, reinforcement, access, scan or locate responsibility, tool capacity, containment, and written cutting scope.',
      },
      {
        question: 'Do you handle control joints or repair cuts?',
        answer:
          'Yes. We can cut control joints and repair-related lines to support cleaner long-term slab performance.',
      },
      {
        question: 'Is sawing usually part of demolition?',
        answer:
          'Often it is. Controlled saw cutting helps define tear-out boundaries before the rest of the slab is removed.',
      },
    ],
  },
]

const serviceAuthenticityOverrides = {
  'concrete-slabs': {
    heroTitle: 'Concrete Slab Scope Planning in Waco, TX',
    heroSubtitle:
      'Define use, loads, design responsibility, base, thickness, reinforcement, finish, and cure requirements before treating a slab as a repeatable service package.',
    seoTitle: 'Concrete Slab Scope Planning Waco TX | SLA Concrete Works',
    seoDescription:
      'Plan a Waco garage, shop, equipment, or utility slab around use, loads, design source, base, thickness, reinforcement, finish, access, and cure.',
    intro:
      'A garage slab, shop floor, equipment pad, and utility pad are not interchangeable. SLA can review the concrete scope, but the approved estimate must identify the use, design source, dimensions, support, reinforcement, finish, and handoffs for the actual site.',
    evidenceNotice:
      'The current repository does not yet connect this page to one source-reviewed SLA slab case study with exact size, use, loads, base, thickness, reinforcement, concrete tickets, finish, and Stephen’s field decision. Generic shop-foundation photos are not presented as that proof.',
    proofRequirements: [
      'A privacy-safe garage, shop, equipment-pad, or utility-pad project identity and date',
      'Measured dimensions, intended use and loads, and the source of any slab design',
      'Base, vapor-control requirement, thickness, reinforcement, mix or tickets, joints, and finish',
      'Access, drainage, cure or opening guidance, trade handoffs, photos, and Stephen’s reviewed field note',
    ],
    benefits: [
      'Use and load assumptions written before slab details are selected',
      'Base, thickness, reinforcement, joints, finish, and exclusions stated in the estimate',
      'Designer, engineer, building supplier, owner, and concrete-trade roles separated clearly',
    ],
    process: [
      {
        title: 'Confirm use and design source',
        description:
          'Record the structure or equipment, loads, dimensions, elevations, and who supplies any required design or stamped plans.',
      },
      {
        title: 'Write the supporting scope',
        description:
          'State excavation, base, moisture control, thickness, reinforcement, joints, embeds, access, drainage, and exclusions.',
      },
      {
        title: 'Approve placement and handoff',
        description:
          'Confirm the project-specified mix, finish, cure restrictions, opening criteria, and next-trade responsibilities before work starts.',
      },
    ],
    finishes: ['Project-specified broom finish', 'Project-specified trowel finish', 'Documented texture', 'Written flooring handoff'],
    localNotes: [
      {
        title: 'Site-specific support',
        description:
          'Soil, drainage, fill, excavation, and compaction decisions require actual site and design inputs; this page does not prescribe a universal base.',
      },
      {
        title: 'Load and structure boundary',
        description:
          'Vehicle, lift, rack, machine, building, and point loads should come from the owner, supplier, or qualified designer rather than a generic web page.',
      },
      {
        title: 'Moisture and flooring handoff',
        description:
          'Any vapor-control, finish-tolerance, moisture-test, or floor-covering requirement belongs in the written project scope.',
      },
    ],
    costFactors: [
      'Measured footprint, elevations, thickness, and edge conditions',
      'Excavation, base, drainage, and access',
      'Reinforcement, embeds, joints, and project-specified concrete',
      'Finish, cure restrictions, inspections, and other-trade coordination',
    ],
    timeline:
      'The schedule is set only after design inputs, site preparation, access, inspections, placement sequence, weather, cure restrictions, and the next-trade handoff are known.',
    coverageNote:
      'Send the project city, use, dimensions, design source, access photos, and target timing. SLA will confirm whether the concrete scope and travel fit before representing the job as accepted work.',
    faq: [
      {
        question: 'Does this page specify one slab thickness or mix for every project?',
        answer:
          'No. Thickness, reinforcement, concrete specification, joints, vapor control, and support must follow the actual use, site, plans, and responsible design source.',
      },
      {
        question: 'Does the current gallery prove a source-reviewed SLA slab case study?',
        answer:
          'Not yet. A complete public source packet has not been connected to this page, so generic gallery photos are not treated as technical proof.',
      },
      {
        question: 'What should a slab estimate state?',
        answer:
          'Use, dimensions, design responsibility, excavation, base, moisture control, thickness, reinforcement, concrete specification, joints, embeds, finish, cure, access, inspections, exclusions, and handoffs.',
      },
    ],
  },
  'stained-concrete': {
    heroTitle: 'Stained Concrete Scope Review in Waco, TX',
    heroSubtitle:
      'Evaluate the slab, test area, preparation, named stain and sealer, color variation, traction, maintenance, and use restrictions before promising a finish.',
    seoTitle: 'Stained Concrete Scope Review Waco TX | SLA Concrete Works',
    seoDescription:
      'Review a Waco stained-concrete scope around slab condition, test area, preparation, named stain and sealer, color variation, traction, cure, and maintenance.',
    intro:
      'Stain results depend on the actual slab and selected product system. A written proposal should record existing coatings or contaminants, preparation, a test area, the named stain and sealer, expected color variation, traction, cure, maintenance, and who performs each step.',
    evidenceNotice:
      'No source-reviewed SLA stain project in the current repository documents before-and-after color, preparation, product names, test results, sealer, traction choice, maintenance, and Stephen’s field note. This page is therefore a scope checklist, not a finished-job claim.',
    proofRequirements: [
      'A real SLA stain project with privacy-safe location, date, use, area, and before/during/after photos',
      'Existing slab condition, contaminant or coating review, preparation, and test-area result',
      'Named stain, color, application method, named sealer, traction choice, cure, and use restrictions',
      'Maintenance guidance, SLA and other-trade roles, client permission, and Stephen’s reviewed observation',
    ],
    benefits: [
      'Existing slab and prior coating condition reviewed before a product is selected',
      'Test area, color variation, named stain, sealer, and traction choices written into scope',
      'Preparation, cure, maintenance, exclusions, and responsible trade made explicit',
    ],
    process: [
      {
        title: 'Inspect and test',
        description:
          'Document slab condition, prior products, contamination, moisture concerns, repairs, and a representative test area before approval.',
      },
      {
        title: 'Name the finish system',
        description:
          'Put stain, color, preparation, sealer, traction additive, application steps, and responsible trade in writing.',
      },
      {
        title: 'Set expectations and care',
        description:
          'Confirm natural variation, cure and reopening limits, cleaning, maintenance, recoat checks, and exclusions for the selected system.',
      },
    ],
    finishes: ['Named reactive stain after testing', 'Named water-based color system after testing', 'Documented sealer', 'Documented traction treatment'],
    localNotes: [
      {
        title: 'Color is substrate-dependent',
        description:
          'Existing pours, repairs, curing products, contamination, and previous coatings can change the result; a website swatch is not a promise.',
      },
      {
        title: 'Preparation is product-specific',
        description:
          'Cleaning and surface preparation should follow the selected manufacturer and the observed slab rather than a generic process.',
      },
      {
        title: 'Sealer and traction are separate decisions',
        description:
          'Sheen, wet exposure, traffic, cleaning, and maintenance should be reviewed before the sealer and any traction treatment are approved.',
      },
    ],
    costFactors: [
      'Slab condition, previous coatings, contamination, repairs, and test work',
      'Preparation method and access',
      'Named stain, colors, detail work, sealer, and traction treatment',
      'Cure restrictions, protection, maintenance handoff, and responsible trades',
    ],
    timeline:
      'Timing comes from the observed slab, selected product instructions, preparation, test area, weather, coat sequence, cure, and reopening requirements.',
    coverageNote:
      'Send the project location, wide and close photos, current surface history, approximate area, indoor or outdoor use, and desired look. Product and service availability must be confirmed in writing.',
    faq: [
      {
        question: 'Does this page prove an SLA stain system or completed stain case study?',
        answer:
          'No. Product names and a complete source-reviewed project have not yet been published, so this page is limited to the questions a proposal should answer.',
      },
      {
        question: 'Can a stain color be guaranteed from a website sample?',
        answer:
          'No. Existing concrete and the selected system affect color. A representative test area and written variation expectations should come first.',
      },
      {
        question: 'What should a stained-concrete proposal identify?',
        answer:
          'Slab condition, preparation, test area, named stain and sealer, color expectation, traction, coat sequence, cure, use restrictions, maintenance, exclusions, and responsible trade.',
      },
    ],
  },
  'concrete-sealing': {
    heroTitle: 'Concrete Sealing Scope Review in Waco, TX',
    heroSubtitle:
      'Confirm the surface, previous products, preparation, named sealer, coverage limits, traction, cure, maintenance, and recoat test before application.',
    seoTitle: 'Concrete Sealing Scope Review Waco TX | SLA Concrete Works',
    seoDescription:
      'Review a Waco concrete-sealing scope around surface condition, prior sealer, preparation, named product, coverage, traction, cure, maintenance, and recoat testing.',
    intro:
      'Penetrating and film-forming sealers are different systems, and an existing surface may already contain a product that affects compatibility. The estimate should name the sealer, observed condition, preparation, test method, coverage, traction, cure, maintenance, and exclusions.',
    evidenceNotice:
      'No source-reviewed SLA sealing case study in the repository currently records the surface, prior product, preparation, named sealer, coverage, traction choice, maintenance interval, and observed result. Universal protection or recoat promises have therefore been removed.',
    proofRequirements: [
      'A real SLA sealing project with privacy-safe identity, date, surface use, area, and before/after photos',
      'Surface condition, moisture or contamination observations, prior-product check, preparation, and test result',
      'Named sealer, product class, coverage, coats, traction choice, cure, weather limits, and reopening instructions',
      'Maintenance and recoat-test guidance, exclusions, trade roles, permission, and Stephen’s reviewed observation',
    ],
    benefits: [
      'Existing surface and prior product reviewed before compatibility is assumed',
      'Named sealer, preparation, coverage, coats, traction, and cure written into scope',
      'Maintenance, recoat testing, limits, exclusions, and responsible trade made explicit',
    ],
    process: [
      {
        title: 'Identify the surface and prior product',
        description:
          'Record concrete condition, use, moisture or contamination concerns, previous sealer, repairs, and exposure before product selection.',
      },
      {
        title: 'Test and write the system',
        description:
          'Confirm preparation, compatibility or test area, named product, coverage, coats, traction treatment, weather limits, and applicator role.',
      },
      {
        title: 'Document cure and maintenance',
        description:
          'Use the selected manufacturer instructions for cure, reopening, cleaning, inspections, and future recoat testing.',
      },
    ],
    finishes: ['Named penetrating product after review', 'Named film-forming product after review', 'Documented sheen', 'Documented traction treatment'],
    localNotes: [
      {
        title: 'Compatibility comes first',
        description:
          'An unknown existing product can affect adhesion or appearance. The surface history and a test may be needed before a new system is approved.',
      },
      {
        title: 'Traction must be written down',
        description:
          'Wet exposure, slope, traffic, sheen, and any traction treatment should be reviewed for the actual use rather than implied by “sealed concrete.”',
      },
      {
        title: 'Maintenance is not one fixed interval',
        description:
          'Exposure, traffic, cleaning, product class, and observed wear determine inspection and recoat timing; the selected product guidance controls.',
      },
    ],
    costFactors: [
      'Surface condition, previous product, contamination, repairs, and preparation',
      'Measured area, access, masking, protection, and weather window',
      'Named sealer, coverage, coats, sheen, and traction treatment',
      'Test work, cure restrictions, maintenance handoff, and exclusions',
    ],
    timeline:
      'Application and reopening timing must follow the selected product, surface condition, preparation, coat sequence, temperature, moisture, and manufacturer instructions.',
    coverageNote:
      'Send the project city, surface use, approximate area, wide and close photos, and any known previous products. SLA will confirm whether the sealing scope and selected system fit before quoting.',
    faq: [
      {
        question: 'Does this page recommend one sealer or maintenance interval for every surface?',
        answer:
          'No. Surface condition, prior products, exposure, traffic, traction needs, and manufacturer instructions determine the appropriate system and review interval.',
      },
      {
        question: 'Does the current repository prove a complete SLA sealing case study?',
        answer:
          'Not yet. A source-reviewed project with named product, preparation, coverage, traction, maintenance, and result has not been published.',
      },
      {
        question: 'What should a sealing proposal identify?',
        answer:
          'Surface and prior-product condition, preparation, test, named sealer, coverage and coats, sheen, traction, weather limits, cure, reopening, maintenance, exclusions, and responsible trade.',
      },
    ],
  },
}

export const servicePages = baseServicePages.map((page) => ({
  ...page,
  ...(serviceAuthenticityOverrides[page.slug] || {}),
}))
