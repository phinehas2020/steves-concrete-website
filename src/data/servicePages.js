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
    slug: 'concrete-driveways',
    title: 'Concrete Driveways',
    heroTitle: 'Concrete Driveways in Waco & Central Texas',
    heroSubtitle:
      'New installs, replacements, and extensions built for daily traffic and long-term durability.',
    intro:
      'A well-built driveway adds curb appeal and reduces maintenance for years. We design slope, drainage, and joint placement to protect your driveway through Central Texas summers.',
    benefits: baseBenefits,
    process: baseProcess,
    finishes: ['Broom finish', 'Light salt finish', 'Exposed aggregate accents', 'Decorative borders'],
  },
  {
    slug: 'concrete-patios',
    title: 'Concrete Patios',
    heroTitle: 'Concrete Patios for Central Texas Backyards',
    heroSubtitle:
      'Gathering spaces designed for shade structures, outdoor kitchens, and easy maintenance.',
    intro:
      'From cozy seating pads to large entertaining spaces, we pour patios that complement your home and landscape while staying cool underfoot.',
    benefits: baseBenefits,
    process: baseProcess,
    finishes: ['Light broom finish', 'Stamped stone patterns', 'Stained concrete', 'Exposed aggregate'],
  },
  {
    slug: 'stamped-concrete',
    title: 'Stamped Concrete',
    heroTitle: 'Stamped Concrete That Looks Like Stone',
    heroSubtitle:
      'Decorative patterns and color blends for driveways, patios, and walkways.',
    intro:
      'Stamped concrete delivers the look of stone, slate, or brick without the maintenance. We plan joint placement and release patterns to keep the surface consistent.',
    benefits: [
      'Custom patterns and color combinations',
      'Durable surface with sealed protection',
      'Lower maintenance than pavers or stone',
    ],
    process: baseProcess,
    finishes: ['Ashlar slate', 'Cobblestone', 'Flagstone', 'Brick herringbone'],
  },
  {
    slug: 'commercial-concrete',
    title: 'Commercial Concrete',
    heroTitle: 'Commercial Concrete Services',
    heroSubtitle:
      'Slabs, pads, and site concrete for offices, retail, and light industrial spaces.',
    intro:
      'We coordinate with builders, property managers, and business owners to keep concrete timelines on track and sites clean.',
    benefits: [
      'Clear scheduling and site coordination',
      'Durable mixes for heavier traffic areas',
      'Finishes that meet commercial requirements',
    ],
    process: baseProcess,
    finishes: ['Broom finish', 'Hard trowel finish', 'Slip-resistant options'],
  },
  {
    slug: 'concrete-repair',
    title: 'Concrete Repair',
    heroTitle: 'Concrete Repair & Resurfacing',
    heroSubtitle:
      'Crack repair, spall fixes, and surface refreshes to extend the life of your concrete.',
    intro:
      'We evaluate the cause of cracking or surface damage before recommending patching, resurfacing, or replacement.',
    benefits: [
      'Stop water intrusion and further damage',
      'Refresh the look of aging surfaces',
      'Improve safety on walkways and steps',
    ],
    process: baseProcess,
    finishes: ['Concrete patch blends', 'Resurfacing overlays', 'Joint resealing'],
  },
  {
    slug: 'concrete-foundations',
    title: 'Concrete Foundations',
    heroTitle: 'Concrete Foundations & Slab Work',
    heroSubtitle:
      'Slab-on-grade and structural concrete for residential and light commercial builds.',
    intro:
      'We follow local building requirements and reinforce slabs for long-term structural stability.',
    benefits: [
      'Reinforced slabs built for longevity',
      'Accurate elevations and layout',
      'Ready for framing and next trades',
    ],
    process: baseProcess,
    finishes: ['Structural slab pours', 'Equipment pads', 'Utility pads'],
  },
]
