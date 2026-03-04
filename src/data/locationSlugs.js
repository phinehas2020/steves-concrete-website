// Lightweight slug+city list for route generation — keeps the full locationPages
// data module (with image references) out of the main entry chunk.
export const locationLinks = [
  { slug: 'waco-tx-concrete-contractor', city: 'Waco' },
  { slug: 'temple-tx-concrete-contractor', city: 'Temple' },
  { slug: 'killeen-tx-concrete-contractor', city: 'Killeen' },
  { slug: 'hewitt-tx-concrete-contractor', city: 'Hewitt' },
  { slug: 'woodway-tx-concrete-contractor', city: 'Woodway' },
  { slug: 'robinson-tx-concrete-contractor', city: 'Robinson' },
  { slug: 'lorena-tx-concrete-contractor', city: 'Lorena' },
  { slug: 'mcgregor-tx-concrete-contractor', city: 'McGregor' },
]

export const locationSlugs = locationLinks.map(l => l.slug)
