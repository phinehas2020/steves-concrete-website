const imageSet = (slug, count) =>
  Array.from({ length: count }, (_, index) => `/jobs/${slug}-${index + 1}.webp`)

const baseClientProjects = [
  {
    id: 'client-commercial-pour-2026',
    title: 'Commercial Slab Pour',
    slug: '2026-client-commercial-slab-pour',
    category: 'Commercial',
    location: 'Central Texas',
    date: '2026-04-15',
    dateFormatted: 'April 2026',
    description:
      'Pump-truck placement, reinforced prep, and clean finish work for a high-traffic commercial slab.',
    highlights: [
      'Pump-truck placement for slab access and coverage',
      'Reinforced preparation before concrete placement',
      'Clean finish intended for high-traffic use',
    ],
    relatedLinks: [
      { label: 'Commercial concrete services', href: '/commercial-concrete-contractor-waco-tx' },
      { label: 'Concrete slab permit guide', href: '/guides/do-i-need-a-permit-to-pour-a-concrete-slab-waco-tx' },
    ],
    featured: true,
    display_order: -80,
    images: imageSet('2026-client-commercial-pour', 6),
  },
  {
    id: 'client-covered-patio-2026',
    title: 'Covered Patio Flatwork',
    slug: '2026-client-covered-patio-flatwork',
    category: 'Patios',
    location: 'Waco Area',
    date: '2026-03-18',
    dateFormatted: 'March 2026',
    description:
      'Covered patio and porch concrete finished to meet existing structures with clean transitions and durable edges.',
    highlights: [
      'Covered patio and porch flatwork',
      'Transitions aligned with existing structures',
      'Finished edges for durable outdoor use',
    ],
    relatedLinks: [
      { label: 'Concrete patio services', href: '/concrete-patios-waco-tx' },
      { label: 'Waco concrete patio cost guide', href: '/guides/concrete-patio-cost-waco-tx' },
    ],
    featured: true,
    display_order: -70,
    images: imageSet('2026-client-covered-patio', 6),
  },
  {
    id: 'client-driveway-slab-2026',
    title: 'Residential Driveway Slabs',
    slug: '2026-client-residential-driveway-slabs',
    category: 'Driveways',
    location: 'McLennan County, TX',
    date: '2026-03-05',
    dateFormatted: 'March 2026',
    description:
      'Residential driveway and approach pours with broad turning areas, planned slope, and smooth curb appeal.',
    highlights: [
      'Residential driveway and approach slabs',
      'Broad turning and parking layout',
      'Slope planned across the new concrete',
    ],
    relatedLinks: [
      { label: 'Concrete driveway services', href: '/concrete-driveways-waco-tx' },
      { label: 'Waco concrete driveway cost guide', href: '/guides/concrete-driveway-cost-waco-tx' },
    ],
    featured: true,
    display_order: -60,
    images: imageSet('2026-client-driveway-slab', 6),
  },
  {
    id: 'client-sidewalk-entry-2026',
    title: 'Sidewalks and Entry Walks',
    slug: '2026-client-sidewalk-entry-walks',
    category: 'Sidewalk Concrete Paving',
    location: 'Waco Area',
    date: '2026-02-27',
    dateFormatted: 'February 2026',
    description:
      'Straight and curved sidewalk work with tidy forms, accessible transitions, and finished pedestrian surfaces.',
    highlights: [
      'Straight and curved walkway layouts',
      'Accessible transition planning',
      'Finished pedestrian surfaces',
    ],
    relatedLinks: [
      { label: 'Concrete sidewalk services', href: '/concrete-sidewalks-waco-tx' },
      { label: 'Concrete slab permit guide', href: '/guides/do-i-need-a-permit-to-pour-a-concrete-slab-waco-tx' },
    ],
    featured: true,
    display_order: -50,
    images: imageSet('2026-client-sidewalk-entry', 6),
  },
  {
    id: 'client-stamped-decorative-2026',
    title: 'Stamped and Decorative Concrete',
    slug: '2026-client-stamped-decorative-concrete',
    category: 'Stamped',
    location: 'Central Texas',
    date: '2026-03-05',
    dateFormatted: 'March 2026',
    description:
      'Decorative patios and walkways with stamped texture, color contrast, and custom outdoor-living details.',
    highlights: [
      'Stamped texture across patios and walkways',
      'Color contrast and decorative details',
      'Outdoor-living finish examples',
    ],
    relatedLinks: [
      { label: 'Stamped concrete services', href: '/stamped-concrete-waco-tx' },
      { label: 'Waco stamped concrete cost guide', href: '/guides/stamped-concrete-cost-waco-tx' },
    ],
    featured: true,
    display_order: -40,
    images: imageSet('2026-client-stamped-decorative', 6),
  },
  {
    id: 'client-shop-foundation-2026',
    title: 'Shop Foundation and Interior Slab',
    slug: '2026-client-shop-foundation-interior-slab',
    category: 'Shop Foundations',
    location: 'Central Texas',
    date: '2026-03-18',
    dateFormatted: 'March 2026',
    description:
      'Shop and warehouse slab work with interior finishing, wide access bays, and heavy-use surface prep.',
    highlights: [
      'Foundation and interior slab concrete',
      'Wide access-bay layout',
      'Surface preparation for heavy use',
    ],
    relatedLinks: [
      { label: 'New foundation and slab services', href: '/concrete-foundations-waco-tx' },
      { label: 'Concrete slab permit guide', href: '/guides/do-i-need-a-permit-to-pour-a-concrete-slab-waco-tx' },
    ],
    featured: true,
    display_order: -30,
    images: imageSet('2026-client-shop-foundation', 6),
  },
  {
    id: 'client-retaining-wall-2026',
    title: 'Retaining Wall Concrete Work',
    slug: '2026-client-retaining-wall-concrete-work',
    category: 'Retaining Walls',
    location: 'Central Texas',
    date: '2026-03-18',
    dateFormatted: 'March 2026',
    description:
      'Retaining wall concrete with long clean runs, reinforced placement, and site grading around changing elevations.',
    highlights: [
      'Long, clean retaining-wall runs',
      'Reinforced concrete placement',
      'Site grading around elevation changes',
    ],
    relatedLinks: [
      { label: 'Concrete retaining wall services', href: '/retaining-walls-waco-tx' },
      { label: 'Waco hardscaping services', href: '/hardscaping-waco-tx' },
    ],
    featured: true,
    display_order: -20,
    images: imageSet('2026-client-retaining-wall', 6),
  },
  {
    id: 'client-sports-court-2026',
    title: 'Decorative Play-Area Surfacing',
    slug: '2026-client-decorative-court-surfacing',
    category: 'Decorative Concrete',
    location: 'Central Texas',
    date: '2026-03-18',
    dateFormatted: 'March 2026',
    description:
      'Geometric color fields across a shaded outdoor play area with curved paths, planters, and seating features. The available record does not document a regulation sports-court layout.',
    highlights: [
      'Decorative geometric color layout',
      'Outdoor play-area surface under shade structures',
      'No regulation game-line specification documented',
    ],
    scopeBoundary:
      'This gallery documents decorative play-area surfacing. It is not evidence of pickleball, tennis, or basketball court construction, regulation striping, an athletic coating system, installer certification, or sanctioned-play suitability.',
    proofStatus: 'scope_limited',
    proofNotice:
      'The photo set supports a decorative play-area classification. The exact city, project date, dimensions, products, trade roles, and field decisions still need Stephen’s source-packet review before they are presented as project facts.',
    relatedLinks: [
      { label: 'Decorative concrete services', href: '/decorative-concrete-waco' },
      { label: 'View all concrete projects', href: '/jobs' },
    ],
    featured: true,
    display_order: -10,
    images: imageSet('2026-client-sports-court', 6),
  },
]

const emptyProjectAuthenticity = {
  publicSafeIdentity: null,
  exactCity: null,
  projectDates: null,
  dimensions: null,
  measuredArea: null,
  intendedUseAndLoads: null,
  base: null,
  slabOrWallThickness: null,
  mixAndConcreteQuantity: null,
  reinforcement: null,
  jointsAndTransitions: null,
  drainage: null,
  finishAndProducts: null,
  challenge: null,
  stephenDecision: null,
  result: null,
  partnerRoles: null,
  permissionRecord: null,
}

const defaultProofRequirements = [
  'Public-safe project identity, exact city, and verified project dates',
  'Dimensions, measured area, intended use, and design or load source',
  'Base, thickness, mix or tickets, reinforcement, joints, drainage, and finish',
  'The site challenge, Stephen’s field decision, and the observed result',
  'SLA scope, designer or engineer role, other-trade handoffs, and permission record',
  'Useful, project-specific captions reviewed for every image',
]

export const clientProjects = baseClientProjects.map((project) => ({
  ...project,
  proofStatus: project.proofStatus || 'needs_source_packet',
  proofNotice:
    project.proofNotice ||
    'This repository gallery contains a project photo set, but its public source packet has not been completed. The broad labels below are not a substitute for verified dimensions, materials, trade roles, field decisions, or outcomes.',
  proofRequirements: project.proofRequirements || defaultProofRequirements,
  authenticity: {
    ...emptyProjectAuthenticity,
    ...(project.authenticity || {}),
  },
  imageCaptions: project.images.map((src) => ({
    src,
    caption: null,
    reviewed: false,
  })),
}))

export const servicePreviewImages = {
  'concrete-driveways-waco-tx': '/jobs/2026-client-driveway-slab-4.webp',
  'concrete-patios-waco-tx': '/jobs/2026-client-covered-patio-1.webp',
  'concrete-sidewalks-waco-tx': '/jobs/2026-client-sidewalk-entry-3.webp',
  'commercial-concrete-contractor-waco-tx': '/jobs/2026-client-commercial-pour-1.webp',
  'residential-concrete-contractor-waco-tx': '/jobs/2026-client-driveway-slab-1.webp',
  'stamped-concrete-waco-tx': '/jobs/2026-client-stamped-decorative-4.webp',
  'decorative-concrete-waco': '/jobs/2026-client-stamped-decorative-6.webp',
  'concrete-foundations-waco-tx': '/jobs/2026-client-shop-foundation-4.webp',
  'concrete-parking-lots-waco-tx': '/jobs/2026-client-commercial-pour-3.webp',
  'parking-lot-concrete-waco': '/jobs/2026-client-commercial-pour-6.webp',
  'retaining-walls-waco-tx': '/jobs/2026-client-retaining-wall-1.webp',
  'contractors-in-waco-tx': '/jobs/2026-client-shop-foundation-5.webp',
  'general-contractor-waco-tx': '/jobs/2026-client-commercial-pour-2.webp',
  'sidewalks-driveways': '/jobs/2026-client-sidewalk-entry-5.webp',
  'parking-lots': '/jobs/2026-client-commercial-pour-3.webp',
  'stamped-concrete': '/jobs/2026-client-stamped-decorative-2.webp',
  'commercial-concrete': '/jobs/2026-client-shop-foundation-5.webp',
  'concrete-foundations': '/jobs/2026-client-shop-foundation-4.webp',
}

export const serviceHeroImages = {
  ...servicePreviewImages,
  'concrete-driveways': servicePreviewImages['concrete-driveways-waco-tx'],
  'concrete-patios': servicePreviewImages['concrete-patios-waco-tx'],
  'concrete-contractors': servicePreviewImages['contractors-in-waco-tx'],
}

const defaultGalleryProjectIds = [
  'client-driveway-slab-2026',
  'client-covered-patio-2026',
  'client-commercial-pour-2026',
  'client-stamped-decorative-2026',
  'client-shop-foundation-2026',
  'client-sidewalk-entry-2026',
  'client-retaining-wall-2026',
  'client-sports-court-2026',
]

const serviceGalleryProjectIds = {
  'concrete-driveways-waco-tx': ['client-driveway-slab-2026', 'client-sidewalk-entry-2026'],
  'concrete-patios-waco-tx': ['client-covered-patio-2026', 'client-stamped-decorative-2026'],
  'concrete-sidewalks-waco-tx': ['client-sidewalk-entry-2026', 'client-driveway-slab-2026'],
  'commercial-concrete-contractor-waco-tx': ['client-commercial-pour-2026', 'client-shop-foundation-2026'],
  'residential-concrete-contractor-waco-tx': ['client-driveway-slab-2026', 'client-covered-patio-2026'],
  'stamped-concrete-waco-tx': ['client-stamped-decorative-2026', 'client-covered-patio-2026'],
  'concrete-foundations-waco-tx': ['client-shop-foundation-2026', 'client-commercial-pour-2026'],
  'parking-lot-concrete-waco': ['client-commercial-pour-2026', 'client-shop-foundation-2026'],
  'retaining-walls-waco-tx': ['client-retaining-wall-2026', 'client-commercial-pour-2026'],
  'decorative-concrete-waco': ['client-stamped-decorative-2026', 'client-covered-patio-2026'],
  'contractors-in-waco-tx': ['client-shop-foundation-2026', 'client-commercial-pour-2026'],
}

const projectById = new Map(clientProjects.map((project) => [project.id, project]))

function imageAlt(serviceTitle, project, index) {
  return `${serviceTitle} photo ${index + 1}: ${project.title} in ${project.location}`
}

export function getServiceGalleryImages(slug, serviceTitle = 'Concrete project') {
  const projectIds = [...(serviceGalleryProjectIds[slug] || []), ...defaultGalleryProjectIds]
  const seen = new Set()
  const images = []

  for (const projectId of projectIds) {
    const project = projectById.get(projectId)
    if (!project) continue

    project.images.forEach((src) => {
      if (seen.has(src) || images.length >= 8) return
      seen.add(src)
      images.push({
        src,
        alt: imageAlt(serviceTitle, project, images.length),
        title: project.title,
        location: project.location,
      })
    })

    if (images.length >= 8) break
  }

  return images
}

export function getServicePreviewImage(slug) {
  return servicePreviewImages[slug] || serviceHeroImages[slug] || null
}
