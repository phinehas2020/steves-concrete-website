const BLOG_SEO_TITLES = {
  'stamped-concrete-patio-ideas-central-texas':
    'Stamped Patio Ideas | Central Texas | SLA Concrete',
  'shop-foundation-burnet-texas-9600-ft-getting-ready-to-pour-tomorrow-morning-3-am-200-yards':
    '9,600 SF Shop Foundation | Burnet, TX | SLA Concrete',
  'river-walk-shotcrete-bank-stabilization-waco-tx':
    'Shotcrete Bank Stabilization | Waco, TX | SLA Concrete',
  'resurface-1600-ft-of-old-concrete-in-hubbard-texas':
    'Concrete Resurfacing | Hubbard, TX | SLA Concrete',
  'parking-lot-that-we-just-poured-at-melody-grove-housing-complex-waco-texas':
    'Melody Grove Parking Lot | Waco, TX | SLA Concrete',
  'mount-calm-tx-shop-foundation-concrete-prep':
    'Shop Foundation Prep | Mount Calm, TX | SLA Concrete',
  'mount-calm-morton-building-shop-foundation-2500-ft':
    '2,500 SF Morton Shop Foundation | Mount Calm, TX',
  'morton-building-barn-dominium-in-chappell-hill-texas':
    'Morton Barndominium Foundation | Chappell Hill, TX',
  'melody-grove-parking-area-sidewalk-concrete-waco-tx':
    'Melody Grove Parking & Sidewalks | Waco, TX',
  'melody-grove-handicap-parking-concrete-waco-tx':
    'Melody Grove Accessible Parking | Waco, TX',
  'jewett-tx-shop-slab-finish-new-morton-building':
    'Morton Shop Slab Finish | Jewett, TX | SLA Concrete',
  'hubbard-tx-concrete-resurfacing-shop-patio':
    'Shop & Patio Resurfacing | Hubbard, TX | SLA Concrete',
  'hillcrest-hospital-front-entrance-concrete-replacement-waco-tx':
    'Hillcrest Entrance Concrete | Waco, TX | SLA Concrete',
  'georgetown-tx-shop-foundation-concrete-retaining-wall':
    'Shop Foundation & Retaining Wall | Georgetown, TX',
  'concrete-retaining-walls-in-resiel-texas-for-oncor-power-transfer-station':
    'Oncor Concrete Retaining Walls | Riesel, TX',
  'commercial-concrete-pour-at-the-lacy-lake-view-valero':
    'Commercial Concrete Pour | Lacy Lakeview, TX',
  'commercial-canopy-concrete-slab-finish-central-texas':
    'Commercial Canopy Slab | Central Texas | SLA Concrete',
  'adding-handicap-parking-for-melody-grove-housing-in-waco':
    'Accessible Parking Concrete | Melody Grove Waco',
}

export function getBlogSeoTitle(post) {
  if (!post) return 'Concrete Tips & Project Ideas | SLA Concrete Works LLC'

  return (
    post.seo_title ||
    BLOG_SEO_TITLES[post.slug] ||
    `${post.title} | SLA Concrete Works LLC`
  )
}
