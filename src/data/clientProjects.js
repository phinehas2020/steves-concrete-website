const imageSet = (slug, count) =>
  Array.from({ length: count }, (_, index) => `/jobs/${slug}-${index + 1}.webp`)

export const clientProjects = [
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
    featured: true,
    display_order: -20,
    images: imageSet('2026-client-retaining-wall', 6),
  },
  {
    id: 'client-sports-court-2026',
    title: 'Decorative Court Surfacing',
    slug: '2026-client-decorative-court-surfacing',
    category: 'Sports Courts',
    location: 'Central Texas',
    date: '2026-03-18',
    dateFormatted: 'March 2026',
    description:
      'Colorful court and play-area concrete with decorative layout, clean borders, and activity-ready surface finish.',
    featured: true,
    display_order: -10,
    images: imageSet('2026-client-sports-court', 6),
  },
]

export const servicePreviewImages = {
  'concrete-driveways-waco-tx': '/jobs/2026-client-driveway-slab-4.webp',
  'concrete-patios-waco-tx': '/jobs/2026-client-covered-patio-1.webp',
  'concrete-sidewalks-waco-tx': '/jobs/2026-client-sidewalk-entry-3.webp',
  'commercial-concrete-contractor-waco-tx': '/jobs/2026-client-commercial-pour-1.webp',
  'residential-concrete-contractor-waco-tx': '/jobs/2026-client-driveway-slab-1.webp',
  'concrete-repair-waco-tx': '/jobs/2026-client-retaining-wall-2.webp',
  'foundation-repair-waco-tx': '/jobs/2026-client-retaining-wall-5.webp',
  'concrete-demolition-waco-tx': '/jobs/2026-client-commercial-pour-5.webp',
  'stamped-concrete-waco-tx': '/jobs/2026-client-stamped-decorative-4.webp',
  'decorative-concrete-waco': '/jobs/2026-client-stamped-decorative-6.webp',
  'concrete-foundations-waco-tx': '/jobs/2026-client-shop-foundation-4.webp',
  'concrete-parking-lots-waco-tx': '/jobs/2026-client-commercial-pour-3.webp',
  'parking-lot-concrete-waco': '/jobs/2026-client-commercial-pour-6.webp',
  'retaining-walls-waco-tx': '/jobs/2026-client-retaining-wall-1.webp',
  'hardscaping-waco-tx': '/jobs/2026-client-stamped-decorative-5.webp',
  'concrete-deck-contractors': '/jobs/2026-client-covered-patio-4.webp',
  'contractors-in-waco-tx': '/jobs/2026-client-shop-foundation-5.webp',
  'general-contractor-waco-tx': '/jobs/2026-client-commercial-pour-2.webp',
  'concrete-resurfacing-waco-tx': '/jobs/2026-client-covered-patio-5.webp',
  'sports-court-coating-waco-tx': '/jobs/2026-client-sports-court-6.webp',
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
  'foundation-repair-waco-tx': ['client-retaining-wall-2026', 'client-shop-foundation-2026'],
  'concrete-demolition-waco-tx': ['client-commercial-pour-2026', 'client-shop-foundation-2026'],
  'concrete-sawing-waco-tx': ['client-commercial-pour-2026', 'client-sidewalk-entry-2026'],
  'retaining-walls-waco-tx': ['client-retaining-wall-2026', 'client-commercial-pour-2026'],
  'decorative-concrete-waco': ['client-stamped-decorative-2026', 'client-covered-patio-2026'],
  'hardscaping-waco-tx': ['client-stamped-decorative-2026', 'client-retaining-wall-2026'],
  'concrete-deck-contractors': ['client-covered-patio-2026', 'client-stamped-decorative-2026'],
  'contractors-in-waco-tx': ['client-shop-foundation-2026', 'client-commercial-pour-2026'],
  'concrete-resurfacing-waco-tx': ['client-covered-patio-2026', 'client-stamped-decorative-2026'],
  'sports-court-coating-waco-tx': ['client-sports-court-2026', 'client-stamped-decorative-2026'],
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
