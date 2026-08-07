import { getCanonicalServicePath } from './servicePages.js'

export const guidePages = [
  {
    slug: 'concrete-driveway-cost-waco-tx',
    title: 'Concrete Driveway Cost Factors in Waco, TX',
    heroTitle: 'What Changes a Concrete Driveway Estimate in Waco?',
    heroSubtitle:
      'A clear, local guide to driveway pricing, options, and what actually drives your estimate.',
    seoTitle: 'Waco Concrete Driveway Cost Factors | SLA Concrete Works',
    seoDescription:
      'Plan a Waco concrete driveway estimate by comparing demolition, base, thickness, reinforcement, access, drainage, and finish. Reviewed August 2026.',
    summary:
      'Driveway pricing depends on measured area, demolition, base correction, thickness, reinforcement, access, drainage, and finish. SLA is reviewing recent estimate records before publishing a local price range; a site-specific written estimate is the current source of truth.',
    lastReviewed: '2026-08-07',
    reviewedBy: 'SLA Concrete Works editorial review',
    evidenceNotice:
      'The earlier generic per-square-foot range was removed because it was not tied to three current SLA estimates. Exact planning ranges will return after recent scopes are anonymized and reviewed.',
    notQuote:
      'This guide explains scope and cost drivers. It is not a quote, and no price applies until the site, measurements, access, and included work are confirmed in writing.',
    quickStats: [
      { label: 'Start with', value: 'Measured area' },
      { label: 'Largest variables', value: 'Removal + base' },
      { label: 'Compare bids by', value: 'Included scope' },
      { label: 'Current price source', value: 'Written estimate' },
    ],
    costRanges: [],
    factors: [
      'Square footage and slab thickness',
      'Base prep, grading, and drainage corrections',
      'Rebar or mesh reinforcement requirements',
      'Removal and disposal of existing concrete',
      'Access challenges for equipment and trucks',
      'Decorative borders, stains, or stamped patterns',
    ],
    localNotes: [
      {
        title: 'Waco soil movement',
        description:
          'Black clay expands and contracts, so we often recommend deeper base prep and control joints.',
      },
      {
        title: 'Texas heat timing',
        description:
          'Hot-weather pours can require curing compounds and timing adjustments for a clean finish.',
      },
      {
        title: 'Drainage planning',
        description:
          'Slopes and joint placement are set to move water away from the slab and home.',
      },
    ],
    checklist: [
      'Measure the driveway footprint (length x width).',
      'Note any drainage issues or pooling water.',
      'Decide on standard vs. decorative finish.',
      'Identify access points for trucks and equipment.',
      'List any removal or demolition needed.',
    ],
    relatedServices: [
      {
        label: 'Concrete Driveways',
        href: getCanonicalServicePath('concrete-driveways'),
      },
      {
        label: 'Stamped Concrete',
        href: getCanonicalServicePath('stamped-concrete'),
      },
      {
        label: 'Concrete Repair',
        href: getCanonicalServicePath('concrete-repair'),
      },
    ],
    faq: [
      {
        question: 'How thick should a driveway be in Waco?',
        answer:
          'Thickness and reinforcement should follow the actual vehicle loads, support conditions, edge details, plans, and written project scope rather than one site-wide rule.',
      },
      {
        question: 'Can you pour over an old driveway?',
        answer:
          'We usually recommend removal if the base is compromised. Overlays can work only when the slab is sound.',
      },
      {
        question: 'When can I drive on new concrete?',
        answer:
          'Vehicle-opening guidance should come from the project concrete, thickness, weather, cure method, loads, and any designer or supplier requirements stated at handoff.',
      },
    ],
  },
  {
    slug: 'stamped-concrete-cost-waco-tx',
    title: 'Stamped Concrete Cost Factors in Waco, TX',
    heroTitle: 'What Changes a Stamped Concrete Estimate in Waco?',
    heroSubtitle:
      'Patterns, color blends, and what drives the price of stamped concrete in Central Texas.',
    seoTitle: 'Waco Stamped Concrete Cost Factors | SLA Concrete Works',
    seoDescription:
      'Compare the pattern, color, border, access, preparation, and sealer choices that affect a Waco stamped concrete estimate. Reviewed August 2026.',
    summary:
      'Stamped concrete adds pattern timing, coloring, borders, release, washing, and sealing to the base concrete scope. SLA is reviewing recent job records before publishing a local price range; the written scope and estimate remain the current source of truth.',
    lastReviewed: '2026-08-07',
    reviewedBy: 'SLA Concrete Works editorial review',
    evidenceNotice:
      'The earlier generic per-square-foot range was removed because it was not connected to named recent SLA scopes, product choices, and access conditions.',
    notQuote:
      'This guide is a planning checklist, not a quote. Pattern, color system, slab preparation, access, and sealing must be confirmed for the actual project.',
    quickStats: [
      { label: 'Start with', value: 'Plain concrete scope' },
      { label: 'Added variables', value: 'Pattern + color' },
      { label: 'Maintenance', value: 'Product-specific' },
      { label: 'Current price source', value: 'Written estimate' },
    ],
    costRanges: [],
    factors: [
      'Pattern complexity and border work',
      'Color blends, integral color, and release powder',
      'Slab size and layout (curves cost more)',
      'Sealer type and finish sheen',
      'Existing slab removal or overlay prep',
    ],
    localNotes: [
      {
        title: 'Heat-safe timing',
        description:
          'Stamped work is time sensitive, so we schedule pours to avoid rapid curing in peak heat.',
      },
      {
        title: 'Slip resistance',
        description:
          'We can add texture and choose sealers that balance grip and appearance.',
      },
      {
        title: 'Long-term protection',
        description:
          'Sealing keeps color rich and protects against stains in outdoor spaces.',
      },
    ],
    checklist: [
      'Pick a pattern and border style.',
      'Choose a base color and accent blend.',
      'Decide where stamped concrete will be used.',
      'Confirm drainage and slope needs.',
      'Ask for the selected sealer product and its maintenance instructions.',
    ],
    relatedServices: [
      {
        label: 'Stamped Concrete',
        href: getCanonicalServicePath('stamped-concrete'),
      },
      { label: 'Concrete Patios', href: getCanonicalServicePath('concrete-patios') },
      {
        label: 'Concrete Driveways',
        href: getCanonicalServicePath('concrete-driveways'),
      },
    ],
    faq: [
      {
        question: 'Is stamped concrete slippery?',
        answer:
          'It can be if sealed too glossy. We offer slip-resistant options to improve traction.',
      },
      {
        question: 'How long does stamped concrete last?',
        answer:
          'Service life depends on the slab, traffic, exposure, coating products, and maintenance. The estimate should identify the selected system rather than promise a universal lifespan.',
      },
      {
        question: 'Can you match existing stamped concrete?',
        answer:
          'We can often match patterns and colors, especially if we can see a sealed sample.',
      },
    ],
  },
  {
    slug: 'concrete-patio-cost-waco-tx',
    title: 'Concrete Patio Cost Factors in Waco, TX',
    heroTitle: 'What Changes a Concrete Patio Estimate in Waco?',
    heroSubtitle:
      'Pricing guidance for patios, finish upgrades, and layout choices that affect your estimate.',
    seoTitle: 'Waco Concrete Patio Cost Factors | SLA Concrete Works',
    seoDescription:
      'Plan a Waco concrete patio estimate around access, grade, drainage, door elevations, finish, cover, and outdoor-kitchen coordination. Reviewed August 2026.',
    summary:
      'Patio pricing depends on measured area, access, demolition, grade, drainage, door elevations, finish, and coordination with covers or outdoor kitchens. SLA is reviewing recent estimate records before publishing a local price range.',
    lastReviewed: '2026-08-07',
    reviewedBy: 'SLA Concrete Works editorial review',
    evidenceNotice:
      'The earlier generic price range was removed because it was not supported by three recent, anonymized SLA patio scopes with inclusions and exclusions.',
    notQuote:
      'This guide helps define the scope. It is not a quote; the final price depends on the measured site and the work included in the written estimate.',
    quickStats: [
      { label: 'Start with', value: 'Doors + drainage' },
      { label: 'Largest variables', value: 'Access + finish' },
      { label: 'Coordinate', value: 'Cover + kitchen' },
      { label: 'Current price source', value: 'Written estimate' },
    ],
    costRanges: [],
    factors: [
      'Patio size and shape complexity',
      'Finish selection and color blends',
      'Step-downs, borders, or built-in seating',
      'Site access and haul-off distance',
      'Drainage and grading corrections',
    ],
    localNotes: [
      {
        title: 'Shade and layout',
        description:
          'We plan slab size and orientation for pergolas, outdoor kitchens, and shade structures.',
      },
      {
        title: 'Surface temperature',
        description:
          'Finish choices impact how hot a patio feels in direct sun.',
      },
      {
        title: 'Drainage planning',
        description:
          'Proper slope prevents water from pooling near the home.',
      },
    ],
    checklist: [
      'Measure desired patio footprint.',
      'Decide on finish and color.',
      'List any steps or grade changes.',
      'Identify access for equipment.',
      'Plan furniture, grills, or structures.',
    ],
    relatedServices: [
      { label: 'Concrete Patios', href: getCanonicalServicePath('concrete-patios') },
      { label: 'Stamped Concrete', href: getCanonicalServicePath('stamped-concrete') },
      { label: 'Concrete Repair', href: getCanonicalServicePath('concrete-repair') },
    ],
    faq: [
      {
        question: 'How long before I can use a new patio?',
        answer:
          'Foot traffic, furniture, and other use should wait for the project-specific opening guidance based on the concrete, weather, cure method, finish, loads, and selected product requirements.',
      },
      {
        question: 'Do patios need control joints?',
        answer:
          'Yes. Control joints manage cracking and are placed during layout.',
      },
      {
        question: 'Can you add a patio extension later?',
        answer:
          'Yes. We can plan joints and finishes so additions look intentional.',
      },
    ],
  },
  {
    slug: 'do-i-need-a-permit-to-pour-a-concrete-slab-waco-tx',
    title: 'Do I Need a Permit to Pour a Concrete Slab in Waco, TX?',
    heroTitle: 'Do I Need a Permit to Pour a Concrete Slab in Waco, TX?',
    heroSubtitle:
      'A practical planning guide for patios, driveway extensions, shop pads, sidewalks, and concrete slabs before you pour.',
    seoTitle: 'Do I Need a Permit to Pour a Concrete Slab? Waco TX Guide',
    seoDescription:
      'Do you need a permit to pour a concrete slab in Waco, TX? Learn which concrete projects may need review before patios, driveways, approaches, sidewalks, and shop pads.',
    badgeLabel: 'Planning Guide',
    primaryCtaLabel: 'Review Planning Factors',
    factorEyebrow: 'Permit planning',
    factorTitle: 'Project details that can change permit needs',
    factorIntro:
      'Permit needs depend on where the slab sits, what it touches, how water moves, and whether the work affects public access or a structure.',
    localEyebrow: 'Waco area checks',
    localTitle: 'Why local concrete projects should be checked first',
    localIntro:
      'Waco, nearby cities, county areas, HOAs, and utility easements can all treat similar concrete projects differently.',
    faqIntro:
      'General planning answers for homeowners comparing concrete slab, driveway, patio, and pad projects.',
    summary:
      'A small backyard slab may be simple, but concrete work can need extra review when it touches a curb, driveway approach, sidewalk, drainage path, right-of-way, commercial property, utility area, or structural foundation. The safest move is to check the project scope before demolition or forming begins.',
    lastReviewed: '2026-08-07',
    reviewedBy: 'SLA Concrete Works editorial review',
    evidenceNotice:
      'City of Waco guidance distinguishes private-property flatwork from concrete in the public right-of-way. Project details and rules can change, so confirm the current requirement with the City before work begins.',
    notQuote:
      'This page is a planning guide, not a permit determination, engineering review, or legal opinion.',
    sources: [
      {
        label: 'City of Waco: Do I Need a Permit?',
        href: 'https://www.waco-texas.com/Departments/Development-Services/Inspection-Services/Residential-Construction-Permits/Do-I-Need-a-Permit?lang_update=639186725957951487',
      },
      {
        label: 'City of Waco: Working within the Right-of-Way',
        href: 'https://www.waco-texas.com/Departments/Engineering/Working-within-the-Right-of-Way',
      },
    ],
    quickStats: [
      { label: 'Highest-risk areas', value: 'Curbs, aprons, sidewalks' },
      { label: 'Drainage impact', value: 'Always review' },
      { label: 'Commercial work', value: 'Stricter review' },
      { label: 'Best next step', value: 'Scope check first' },
    ],
    factors: [
      'Whether the slab touches a curb, sidewalk, driveway apron, street edge, or public right-of-way',
      'Whether the project changes drainage, slope, runoff, or where water leaves the property',
      'Whether the concrete supports a building, garage, shop, carport, equipment pad, or heavy vehicle use',
      'Whether the work is residential, commercial, rental, public-facing, or part of a larger construction project',
      'Whether utilities, easements, septic areas, gas lines, irrigation, trees, fences, or retaining walls are nearby',
      'Whether an HOA, subdivision rule, landlord, insurer, or lender requires approval before exterior work',
    ],
    localNotes: [
      {
        title: 'City vs. county rules',
        description:
          'A slab inside Waco city limits may be reviewed differently from a similar slab outside the city or in a nearby community such as Hewitt, Woodway, Robinson, or Lorena.',
      },
      {
        title: 'Driveway approaches',
        description:
          'Projects that affect the curb, apron, sidewalk, street edge, or public access deserve extra attention before concrete is removed or poured.',
      },
      {
        title: 'Drainage and clay soil',
        description:
          'Even when a permit is not the main issue, changing the slope can push water toward a house, neighbor, slab edge, or soft clay pocket.',
      },
    ],
    checklist: [
      'Write down the project address and whether it is inside city limits.',
      'Measure the planned slab, driveway extension, patio, or pad area.',
      'Take photos from the street, from each corner of the work area, and from any low spots where water collects.',
      'Note whether the project touches a curb, sidewalk, driveway approach, drainage path, fence, utility area, or structure.',
      'Check HOA, landlord, builder, or property-manager requirements before scheduling the pour.',
      'Confirm permit or review requirements with the appropriate city, county, right-of-way, HOA, landlord, or project authority before work begins.',
    ],
    relatedServices: [
      {
        label: 'Concrete Foundations',
        href: getCanonicalServicePath('concrete-foundations'),
      },
      {
        label: 'Concrete Driveways',
        href: getCanonicalServicePath('concrete-driveways'),
      },
      { label: 'Concrete Patios', href: getCanonicalServicePath('concrete-patios') },
      {
        label: 'Concrete Demolition',
        href: getCanonicalServicePath('concrete-demolition'),
      },
      {
        label: 'Concrete Contractors',
        href: getCanonicalServicePath('concrete-contractors'),
      },
    ],
    faq: [
      {
        question: 'Do I need a permit to pour a concrete slab in Waco?',
        answer:
          'It depends on the property, slab purpose, and whether the work affects right-of-way, drainage, sidewalks, approaches, utilities, commercial use, or structural support. Before pouring, confirm the scope with the proper city, county, HOA, or project authority.',
      },
      {
        question: 'Does a small backyard patio usually need a permit?',
        answer:
          'Some small detached patios are simple, but you should still check if the patio changes drainage, sits near utilities, ties into a structure, affects setbacks, or is controlled by an HOA or property manager.',
      },
      {
        question: 'Which concrete projects are more likely to need review?',
        answer:
          'Driveway approaches, curb work, sidewalk changes, commercial slabs, building foundations, shop pads, carports, drainage changes, and work near public access are more likely to need extra review before construction.',
      },
      {
        question: 'Will SLA Concrete Works tell me if my project needs a permit?',
        answer:
          'SLA can flag scope questions that may need review, but the appropriate city, county, right-of-way, HOA, landlord, designer, or project authority determines the requirement. Confirm it with that authority before work starts.',
      },
      {
        question: 'Should I pour concrete before checking permit requirements?',
        answer:
          'No. If a project needs approval and you pour first, the fix can cost more than checking upfront. It is better to confirm the project path before forms, demolition, or concrete delivery.',
      },
      {
        question: 'Is this guide legal advice?',
        answer:
          'No. This is general planning guidance for Waco-area concrete projects. Permit rules can change and depend on the property, so confirm requirements with the appropriate local authority before construction.',
      },
    ],
  },
]

export const guideLinks = guidePages.map((guide) => ({
  label: guide.title,
  href: `/guides/${guide.slug}`,
}))
