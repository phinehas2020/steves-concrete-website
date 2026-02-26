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

export const servicePages = [
  {
    slug: 'concrete-contractors',
    title: 'Concrete Contractors',
    heroTitle: 'Concrete Contractors in Waco, TX',
    heroSubtitle:
      'One team for residential, decorative, and commercial concrete projects across Waco and nearby communities.',
    seoTitle: 'Concrete Contractors Waco TX | Concrete Companies Waco TX | Concrete Works LLC',
    seoDescription:
      'Need a concrete contractor in Waco TX? We handle concrete driveways, patios, stamped concrete, commercial pours, and repairs. Free estimate: (254) 230-3102.',
    intro:
      'Looking for a concrete contractor near me in Waco? We provide full-service concrete installs, replacements, and repairs with clear pricing for each phase of your project.',
    benefits: baseBenefits,
    process: baseProcess,
    finishes: ['Broom finish', 'Stamped patterns', 'Sealed concrete', 'Slip-resistant options'],
    pricingGuide: {
      title: 'Concrete contractor pricing in Waco',
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
        title: 'Same-day lead response',
        description: 'Most leads are reviewed quickly so estimates and site visits move forward without delay.',
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
        question: 'Do you handle concrete projects for both homes and businesses?',
        answer:
          'Yes. We handle concrete work for residences and light commercial properties, including walkways, parking areas, slabs, and decorative upgrades.',
      },
      {
        question: 'What does the first estimate process include?',
        answer:
          'We confirm measurements, access, drainage, and base condition, then provide a clear cost range and timeline before scheduling.',
      },
      {
        question: 'Can you handle concrete installation and repair?',
        answer:
          'Yes. We offer full-service concrete installs, replacements, and repair packages so most projects stay with one team.',
      },
      {
        question: 'How do you handle heavy summer heat in Waco?',
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
    seoTitle: 'Sidewalk and Driveway Concrete Waco TX | Concrete Contractor Waco TX',
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
      'Walkway-focused jobs often finish in 1-2 days with light use after cure milestones are met.',
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
      'A well-built driveway adds curb appeal and reduces maintenance for years. We design slope, drainage, and joint placement to protect your driveway through Central Texas summers.',
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
      'Most driveway projects take 2-3 days on site, then 7 days before vehicle traffic (full cure at 28 days).',
    faq: [
      {
        question: 'How much does a concrete driveway cost in Waco?',
        answer:
          'Standard driveways typically run $6–12 per square foot; stamped or decorative finishes run $12–18 per square foot. A typical two-car driveway (600 sq ft) often lands between $3,600 and $10,800. See our concrete driveway cost guide or call (254) 230-3102 for a free site-specific estimate.',
      },
      {
        question: 'How thick is a residential concrete driveway?',
        answer:
          'Most residential driveways are poured 4-5 inches thick with reinforcement where needed.',
      },
      {
        question: 'Do you remove old driveways in Waco?',
        answer:
          'Yes. We handle removal and disposal when replacement is the best long-term option.',
      },
      {
        question: 'When can I drive on my new driveway?',
        answer:
          'Plan on 7 days before vehicle traffic and 28 days for full cure strength.',
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
      'Most patios take 1-2 days on site, then 2-3 days before light foot traffic.',
    faq: [
      {
        question: 'How much does a concrete patio cost in Waco?',
        answer:
          'Standard patios typically run $6–12 per square foot; stamped or stained finishes run $12–18 per square foot. See our patio cost guide or call (254) 230-3102 for a free estimate.',
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
      'Stamped concrete usually takes 2-3 days on site plus 7 days before vehicle traffic.',
    faq: [
      {
        question: 'How much does stamped concrete cost in Waco?',
        answer:
          'Stamped concrete typically runs $12–18 per square foot depending on pattern, color blends, and site prep. See our stamped concrete cost guide or call (254) 230-3102 for a free estimate.',
      },
      {
        question: 'How often should stamped concrete be sealed?',
        answer:
          'Most stamped concrete is resealed every 2-3 years depending on sun exposure and wear.',
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
    seoTitle: 'Commercial Concrete Contractor Waco TX | Free Estimate (254) 230-3102',
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
      'Commercial slabs typically pour in 1 day once forms and rebar are ready.',
    faq: [
      {
        question: 'How much do commercial concrete slabs cost in Waco?',
        answer:
          'Commercial slab pricing depends on thickness, reinforcement, and finish. Typical ranges run $6–14 per square foot. Call (254) 230-3102 for a free estimate tailored to your project.',
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
          'We can finish surfaces to meet slip and slope requirements when specified.',
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
      'We evaluate the cause of cracking or surface damage before recommending patching, resurfacing, or replacement.',
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
      'Most repairs take 1 day on site with light use after 24-48 hours.',
    faq: [
      {
        question: 'How much does concrete repair cost in Waco?',
        answer:
          'Repair costs vary by size and cause. Simple crack repairs often start around $200–500; resurfacing runs $3–7 per square foot. Call (254) 230-3102 for a free assessment and quote.',
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
      'Foundation pours are typically completed in 1 day once forms and steel are ready.',
    faq: [
      {
        question: 'How much does a concrete foundation or slab cost in Waco?',
        answer:
          'Foundation and slab pricing depends on size, thickness, and reinforcement. Residential slabs often run $5–10 per square foot. Call (254) 230-3102 for a free estimate.',
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
      'Most slab pours take 1 day on site; cure time before heavy use depends on thickness and mix.',
    faq: [
      {
        question: 'How much does a concrete slab cost in Waco?',
        answer:
          'Residential slabs typically run $5–10 per square foot depending on thickness, reinforcement, and site prep. Call (254) 230-3102 for a free estimate.',
      },
      {
        question: 'What PSI do garage slabs need?',
        answer:
          'Most residential garage slabs use 3000–4000 PSI. We choose mix based on your use and soil conditions.',
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
      'Staining usually takes 1–2 days on site; curing and sealing add a few days before use.',
    faq: [
      {
        question: 'How much does stained concrete cost in Waco?',
        answer:
          'Stained concrete typically runs $5–12 per square foot depending on prep, stain type, and sealing. Call (254) 230-3102 for a free estimate.',
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
    seoTitle: 'Concrete Sealing Waco TX | Driveway & Patio Sealer (254) 230-3102',
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
        description: 'Most outdoor concrete needs resealing every 2–3 years in Central Texas.',
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
      'Sealing typically takes 1 day; surfaces need 24–48 hours to cure before use.',
    faq: [
      {
        question: 'How much does concrete sealing cost in Waco?',
        answer:
          'Sealing typically runs $1–4 per square foot depending on surface type, prep, and sealer choice. Call (254) 230-3102 for a free estimate.',
      },
      {
        question: 'How often should I reseal my driveway?',
        answer:
          'Most driveways benefit from resealing every 2–3 years. High-traffic or heavy sun exposure may need more frequent resealing.',
      },
      {
        question: 'Can you seal stamped concrete?',
        answer:
          'Yes. We seal stamped concrete to protect color and make maintenance easier.',
      },
    ],
  },
  {
    slug: 'concrete-leveling',
    title: 'Concrete Leveling',
    heroTitle: 'Concrete Leveling in Waco, TX',
    heroSubtitle:
      'Mudjacking and poly leveling to raise sunken slabs and restore flat surfaces.',
    seoTitle: 'Concrete Leveling Waco TX | Mudjacking & Polyjacking (254) 230-3102',
    seoDescription:
      'Concrete leveling in Waco. Raise sunken driveways & sidewalks. Mudjacking & poly foam. Free estimate: (254) 230-3102.',
    intro:
      'Sunken driveways and sidewalks are often caused by soil settlement. We evaluate the cause and offer mudjacking or poly foam leveling when appropriate.',
    benefits: [
      'Restore flat surfaces without full replacement',
      'Quick turnaround and minimal disruption',
      'Address trip hazards and drainage',
    ],
    process: [
      {
        title: 'Inspection',
        description: 'We check the slab and underlying soil to recommend the best approach.',
      },
      {
        title: 'Drill and inject',
        description: 'Holes are drilled and grout or poly foam is injected under the slab.',
      },
      {
        title: 'Patch and finish',
        description: 'Holes are patched and the surface is left ready for use.',
      },
    ],
    finishes: ['Mudjacking (cement grout)', 'Polyurethane foam leveling', 'Surface patch blend'],
    localNotes: [
      {
        title: 'Black clay settlement',
        description: 'Central Texas soil movement often causes slabs to settle. We assess whether leveling or replacement is best.',
      },
      {
        title: 'When leveling works',
        description: 'Leveling is ideal when slabs have settled but not cracked severely.',
      },
      {
        title: 'Drainage improvement',
        description: 'Leveling can restore slope and improve water runoff.',
      },
    ],
    costFactors: [
      'Square footage and number of slabs',
      'Settlement depth and access',
      'Method (mudjacking vs poly)',
      'Underlying cause and soil condition',
    ],
    timeline:
      'Most leveling projects take 1 day; surfaces are usable within 24–48 hours.',
    faq: [
      {
        question: 'How much does concrete leveling cost in Waco?',
        answer:
          'Leveling typically runs $3–8 per square foot depending on method and depth. Call (254) 230-3102 for a free assessment and quote.',
      },
      {
        question: 'Mudjacking vs poly leveling — which is better?',
        answer:
          'Mudjacking uses cement grout and is cost-effective. Poly foam is lighter, cures faster, and works in tighter spaces. We recommend based on your situation.',
      },
      {
        question: 'Can you level a sunken driveway?',
        answer:
          'Yes. We evaluate settlement and drainage, then recommend leveling or replacement. Many sunken driveways can be raised successfully.',
      },
    ],
  },
]
