import fs from 'node:fs/promises'
import path from 'node:path'
import {
  servicePages as servicePageData,
  getCanonicalServicePath,
  isServicePageCanonicalized,
} from '../src/data/servicePages.js'
import { seoServicePages as seoServicePageData } from '../src/data/seoServicePages.js'
import { getServiceGalleryImages } from '../src/data/clientProjects.js'
import { guidePages as guidePageData } from '../src/data/guides.js'
import { sportsCourtAreaPages as sportsCourtAreaPageData } from '../src/data/sportsCourtAreaPages.js'
import { staticBlogPosts } from '../src/data/staticBlogPosts.js'
import { FAQ_ITEMS } from '../src/data/faqs.js'
import {
  fetchPublishedBlogPosts,
  mergePublishedBlogPosts,
} from '../api/_published-blog-posts.js'
import { loadLocalEnvFile } from './load-local-env.mjs'

const projectRoot = process.cwd()
const distDir = path.join(projectRoot, 'dist')
const indexPath = path.join(distDir, 'index.html')

const SITE_URL = 'https://www.concretewaco.com'
const SITE_NAME = 'SLA Concrete Works LLC'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`
const ORGANIZATION_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`
const SERVICE_AREA_ID = `${SITE_URL}/#mclennan-county-service-area`
const GOOGLE_BUSINESS_PROFILE_URL =
  'https://www.google.com/maps/place/SLA+Concrete+Works/@31.6637838,-97.1149261,17z/data=!3m1!4b1!4m6!3m5!1s0x864f83d5fc2728cf:0x92d8085e5a37fa64!8m2!3d31.6637793!4d-97.1123512!16s%2Fg%2F11gf0qs4j0'
const PHONE_DISPLAY = '(254) 230-3102'
const PHONE_HREF = 'tel:254-230-3102'
const PHONE_SCHEMA = '+1-254-230-3102'
const BUSINESS_ADDRESS = {
  streetAddress: '1045 W Elm Mott Ln',
  addressLocality: 'Elm Mott',
  addressRegion: 'TX',
  postalCode: '76640',
  addressCountry: 'US',
}
const BUSINESS_GEO = {
  latitude: 31.6637793,
  longitude: -97.1123512,
}
const OWNER_PERSON_SCHEMA = {
  '@type': 'Person',
  name: 'Stephen Alexander',
  jobTitle: 'Owner-Operator',
}
const MCLENNAN_COUNTY_POLYGON =
  '31.915 -97.575 31.914 -96.989 31.213 -96.994 31.210 -97.588 31.915 -97.575'

const homeMeta = {
  title: 'Concrete Contractors Waco TX | SLA Concrete Works LLC',
  description:
    "Waco's 5-star concrete company for driveways, patios, slabs, foundations, and repair. 500+ projects since 2005. Free estimates: (254) 230-3102.",
  canonical: `${SITE_URL}/`,
  h1: 'Concrete Contractor Waco TX',
}

await loadLocalEnvFile()
const remoteBlogPosts = await fetchPublishedBlogPosts()
const publishedBlogPosts = mergePublishedBlogPosts(staticBlogPosts, remoteBlogPosts)

const locationPages = [
  {
    city: 'Waco',
    slug: 'waco-tx-concrete-contractor',
    nearbyAreas: ['Woodway', 'Hewitt', 'Bellmead', 'Robinson', 'China Spring', 'Lorena'],
    intro:
      'We design concrete for black clay movement, summer heat, and the drainage issues common in McLennan County neighborhoods.',
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
  },
  {
    city: 'Temple',
    slug: 'temple-tx-concrete-contractor',
    seoTitle: 'Concrete Contractor Temple TX | Driveways, Patios & Repair',
    seoDescription:
      'Concrete contractor in Temple TX for driveways, patios, sidewalks, slabs, repairs, and small commercial concrete. Clear estimates and local planning.',
    nearbyAreas: ['Belton', "Morgan's Point", 'Little River-Academy', 'Salado', 'Troy'],
    intro:
      'We help Temple property owners plan concrete work that handles Central Texas heat, daily traffic, drainage, and soil shifts. Driveways, patios, sidewalks, and small commercial slabs all start with site access, slope, base prep, and finish expectations.',
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
  },
  {
    city: 'Killeen',
    slug: 'killeen-tx-concrete-contractor',
    seoTitle: 'Concrete Contractor Killeen TX | Driveways, Patios & Slabs',
    seoDescription:
      'Concrete contractor in Killeen TX for driveways, patios, slabs, sidewalks, concrete repair, and light commercial flatwork with clear estimates.',
    nearbyAreas: ['Harker Heights', 'Fort Cavazos', 'Nolanville', 'Copperas Cove', 'Belton'],
    intro:
      'From new driveways to backyard patios, shop pads, sidewalks, and repair work, we plan Killeen concrete around access, heat, drainage, and daily traffic. The goal is a clear scope before the crew arrives.',
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
  },
  {
    city: 'Hewitt',
    slug: 'hewitt-tx-concrete-contractor',
    seoTitle: 'Concrete Contractor Hewitt Texas | Driveways, Patios, Small Jobs',
    seoDescription:
      'Looking for a concrete contractor in Hewitt, Texas? SLA Concrete Works builds driveways, patios, stamped concrete, small slabs, and repairs for clay soil.',
    nearbyAreas: ['Woodway', 'Waco', 'Lorena', 'Robinson', 'Beverly Hills'],
    intro:
      'Hewitt homeowners typically choose decorative patio and driveway upgrades, with extra attention to clean transitions and curb appeal.',
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
        title: 'Small concrete jobs and near-me searches',
        paragraphs: [
          'Many Hewitt calls start as a simple search for a concrete contractor near me, small job concrete contractors near me, or concrete patio services. Those projects still need real planning because a short walkway, patio extension, or small equipment pad can crack early if the base, drainage, and tie-ins are rushed.',
          'We handle small slabs, entry walks, patio add-ons, driveway approach repairs, shed pads, and uneven concrete replacement when the site makes sense. The estimate confirms access, minimum-load realities, finish expectations, and whether the project should be bundled with nearby concrete work to control cost.',
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
  },
  {
    city: 'Woodway',
    slug: 'woodway-tx-concrete-contractor',
    seoTitle: 'Concrete Contractor Woodway Texas | Driveways, Patios, Stamped Concrete',
    seoDescription:
      'Need a concrete contractor in Woodway, Texas? SLA Concrete Works installs driveways, patios, stamped concrete, and repairs built for heat and clay soil.',
    nearbyAreas: ['Waco', 'Hewitt', 'Robinson', 'China Spring', 'Lorena'],
    intro:
      'SLA Concrete Works LLC delivers Woodway concrete projects with careful grading, reinforcement, and finishing detail. We account for black clay soil and summer heat expansion so your driveway, patio, or slab holds up and stays attractive.',
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
  },
  {
    city: 'Robinson',
    slug: 'robinson-tx-concrete-contractor',
    nearbyAreas: ['Waco', 'Hewitt', 'Woodway', 'Lorena', 'Bruceville-Eddy'],
    intro:
      'Robinson work often includes driveway replacements, slab repairs, and utility pads where strong base prep is critical.',
  },
  {
    city: 'Lorena',
    slug: 'lorena-tx-concrete-contractor',
    seoTitle: 'Concrete Contractor Lorena TX | Patios, Driveways & Hardscaping',
    seoDescription:
      'Concrete contractor in Lorena, TX for durable driveways, patios, hardscaping, stamped concrete, and concrete repairs. Free estimates for Lorena-area concrete work.',
    nearbyAreas: ['Waco', 'Hewitt', 'Robinson', 'Woodway', 'Golinda'],
    intro:
      'Lorena homeowners trust us for detailed prep, smooth finishes, drainage-aware hardscaping, and long-lasting concrete work that fits the property.',
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
          'During the estimate, we document demolition, base prep, reinforcement assumptions, finish, joint layout, access for trucks, and any permit-aware planning items. That gives you a clearer way to compare bids before the pour is scheduled.',
        ],
      },
    ],
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
        question: 'Do you handle hardscaping contractor work in Lorena?',
        answer:
          'Yes. We plan Lorena hardscaping projects such as patios, walkways, retaining wall tie-ins, steps, pads, and drainage transitions so the layout works with the property instead of creating low spots.',
      },
      {
        question: 'Can you build a driveway extension or shop pad in Lorena?',
        answer:
          'Yes. We review vehicle use, slab thickness, reinforcement, access, drainage, and cure timing before pricing driveway extensions, garage pads, shop slabs, and similar concrete work.',
      },
    ],
  },
  {
    city: 'McGregor',
    slug: 'mcgregor-tx-concrete-contractor',
    nearbyAreas: ['Waco', 'Moody', 'Gatesville', 'Woodway', 'Oglesby'],
    intro:
      'McGregor projects frequently involve shop slabs and driveways where load planning and reinforcement matter most.',
  },
]

const staticRoutes = [
  {
    path: '/blog',
    title: 'Concrete Tips & Project Ideas | SLA Concrete Works LLC',
    description:
      'Concrete tips, project ideas, and local insights from SLA Concrete Works LLC in Waco, TX.',
    h1: 'Concrete Tips & Project Ideas',
    renderContent: renderBlogIndexContent,
  },
  {
    path: '/jobs',
    title: 'Concrete Project Gallery | SLA Concrete Works LLC',
    description:
      'View recent concrete driveways, patios, stamped finishes, and commercial projects across Waco and Central Texas.',
    h1: 'Concrete Project Gallery',
    renderContent: renderJobsIndexContent,
  },
  {
    path: '/guides',
    title: 'Concrete Planning Guides in Waco, TX | SLA Concrete Works LLC',
    description:
      'Local planning guides for Waco concrete projects, including pricing, patios, driveways, stamped concrete, and slab permit questions.',
    h1: 'Concrete Planning Guides in Waco, TX',
    renderContent: renderGuidesIndexContent,
  },
  {
    path: '/about',
    title: 'About SLA Concrete Works | Owner-Run Waco Concrete Contractor',
    description:
      'Meet Steve Alexander, owner of SLA Concrete Works LLC. 20+ years of Waco concrete experience, 500+ projects, and a 5-star Google rating. Call (254) 230-3102.',
    h1: 'About SLA Concrete Works LLC',
    renderContent: renderAboutContent,
  },
  {
    path: '/reviews',
    title: 'Reviews | 5-Star Waco Concrete Contractor | SLA Concrete Works',
    description:
      'See why Waco homeowners rate SLA Concrete Works 5 stars on Google. Real reviews from driveway, patio, stamped concrete, and repair projects. Free estimates: (254) 230-3102.',
    h1: 'Customer Reviews',
    renderContent: renderReviewsContent,
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | SLA Concrete Works LLC',
    description:
      'Read how SLA Concrete Works LLC collects, uses, and protects personal information submitted through website lead forms and communications.',
    h1: 'Privacy Policy',
    renderContent: renderPrivacyPolicyContent,
  },
  {
    path: '/terms-and-conditions',
    title: 'Terms and Conditions | SLA Concrete Works LLC',
    description:
      'Review the terms for estimates, scheduling, communication, and service scope for SLA Concrete Works LLC.',
    h1: 'Terms and Conditions',
    renderContent: renderTermsAndConditionsContent,
  },
]

const serviceLinks = servicePageData.map((service) => ({
  label: service.title,
  href: getCanonicalServicePath(service.slug),
  description: service.heroSubtitle,
}))

const seoServiceLinks = seoServicePageData
  .filter((service) => !service.redirectTo)
  .map((service) => ({
  label: service.title,
  href: `/${service.slug}`,
  description: service.cardSummary || service.introParagraph,
}))

const guideLinks = guidePageData.map((guide) => ({
  label: guide.title,
  href: `/guides/${guide.slug}`,
  description: guide.heroSubtitle,
}))

const locationLinks = locationPages.map((location) => ({
  label: `${location.city} concrete contractor`,
  href: `/${location.slug}`,
  description: location.intro,
}))

const sportsCourtAreaLinks = sportsCourtAreaPageData.map((area) => ({
  label: `Sports court coating in ${area.areaName}`,
  href: `/sports-court-coating/${area.slug}`,
  description: area.heroSubtitle,
}))

function buildLocationFaq(location) {
  const defaultFaq = [
    {
      question: `Do you offer free estimates in ${location.city}?`,
      answer: `Yes. We schedule free, no-obligation estimates for ${location.city} projects and nearby communities.`,
    },
    {
      question: `What types of concrete projects do you handle in ${location.city}?`,
      answer:
        'Driveways, patios, stamped concrete, concrete repair, foundations, slabs, sealing, and leveling projects for residential and light commercial properties.',
    },
    {
      question: `How quickly can my ${location.city} project be scheduled?`,
      answer:
        'Timing depends on scope and weather, but we provide clear availability and sequence during estimate so there are no surprises.',
    },
  ]

  const customFaq = Array.isArray(location.faq) ? location.faq : []
  const merged = [...customFaq, ...defaultFaq]

  return merged.filter(
    (item, index, allItems) =>
      allItems.findIndex((candidate) => candidate.question === item.question) === index,
  )
}

const companyResourceLinks = [
  {
    label: 'About Steve and the company',
    href: '/about',
    description: 'Owner background, process, and what matters before the concrete is poured.',
  },
  {
    label: 'Customer reviews',
    href: '/reviews',
    description: 'Feedback from recent Waco-area clients and project types.',
  },
  {
    label: 'Concrete blog',
    href: '/blog',
    description: 'Local concrete planning tips and project updates.',
  },
  {
    label: 'Project gallery',
    href: '/jobs',
    description: 'Recent jobs with photos, scope notes, and timeline context.',
  },
  {
    label: 'Privacy policy',
    href: '/privacy-policy',
    description: 'How lead information is used and protected.',
  },
  {
    label: 'Terms and conditions',
    href: '/terms-and-conditions',
    description: 'Project, communication, and service terms.',
  },
]

const blogResourceLinks = [
  {
    label: 'Waco driveway cost factors',
    href: '/blog/waco-concrete-driveway-cost-factors',
    description: 'Budget drivers for Waco driveway work, including layout, base prep, finish, and access.',
  },
  {
    label: 'Stamped patio ideas for Central Texas',
    href: '/blog/stamped-concrete-patio-ideas-central-texas',
    description: 'Pattern, color, border, drainage, and sealing ideas for decorative patios.',
  },
]

const wacoHubResourceLinks = [
  {
    label: 'Waco concrete contractor hub',
    href: '/waco-tx-concrete-contractor',
    description: 'Local hub for Waco soil, drainage, pricing, permits, and concrete project planning.',
  },
  ...blogResourceLinks,
]

const featuredSpecialtyServiceLinks = [
  'retaining-walls-waco-tx',
  'decorative-concrete-waco',
  'hardscaping-waco-tx',
  'concrete-deck-contractors',
]
  .map((slug) => seoServicePageData.find((service) => service.slug === slug))
  .filter(Boolean)
  .map((service) => ({
    label: service.title,
    href: `/${service.slug}`,
    description: service.cardSummary || service.introParagraph,
  }))

const routeMeta = [
  {
    path: '/',
    ...homeMeta,
    schemaKind: 'home',
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
    ],
    faq: FAQ_ITEMS,
    contentHtml: renderHomeContent(),
  },
  ...servicePageData.map((service) => {
    const canonicalPath = getCanonicalServicePath(service.slug)
    const canonical = `${SITE_URL}${canonicalPath}`
    return {
      path: `/services/${service.slug}`,
      title: service.seoTitle || `${service.title} Waco TX | ${SITE_NAME}`,
      description:
        service.seoDescription || `${service.title} in Waco, TX. Free estimate: ${PHONE_DISPLAY}.`,
      canonical,
      robots: isServicePageCanonicalized(service.slug) ? 'noindex, follow' : 'index, follow',
      h1: service.heroTitle,
      schemaKind: 'service',
      schemaName: service.title,
      schemaServiceType: service.title,
      schemaDescription: service.seoDescription || service.heroSubtitle || service.intro,
      faq: service.faq || [],
      breadcrumbs: [
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Services', url: `${SITE_URL}/#services` },
        { name: service.title, url: canonical },
      ],
      contentHtml: renderServiceContent(service),
    }
  }),
  ...seoServicePageData
    .filter((service) => !service.redirectTo)
    .map((service) => ({
    path: `/${service.slug}`,
    title: service.metaTitle || `${service.title} | ${SITE_NAME}`,
    description: service.metaDescription,
    canonical: `${SITE_URL}/${service.slug}`,
    h1: service.title,
    schemaKind: 'service',
    schemaName: service.title,
    schemaServiceType: service.title,
    schemaDescription: service.metaDescription || service.cardSummary || service.introParagraph,
    faq: service.faq || [],
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Service Pages', url: `${SITE_URL}/#services` },
      { name: service.title, url: `${SITE_URL}/${service.slug}` },
    ],
    contentHtml: renderSeoServiceContent(service),
  })),
  ...locationPages.map((location) => ({
    path: `/${location.slug}`,
    title: location.seoTitle || `${location.city} TX Concrete Contractor | ${SITE_NAME}`,
    description:
      location.seoDescription ||
      `${location.city} concrete contractor for driveways, patios, stamped concrete, and slab work. Free estimate: ${PHONE_DISPLAY}.`,
    canonical: `${SITE_URL}/${location.slug}`,
    h1: `${location.city}, TX Concrete Contractor`,
    schemaKind: 'location',
    schemaName: `${location.city}, TX Concrete Contractor`,
    schemaDescription: location.intro,
    faq: buildLocationFaq(location),
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Service Areas', url: `${SITE_URL}/#service-areas` },
      { name: `${location.city}, TX`, url: `${SITE_URL}/${location.slug}` },
    ],
    contentHtml: renderLocationContent(location),
  })),
  ...sportsCourtAreaPageData.map((area) => ({
    path: `/sports-court-coating/${area.slug}`,
    title: area.seoTitle || `${area.heroTitle} | ${SITE_NAME}`,
    description: area.seoDescription,
    canonical: `${SITE_URL}/sports-court-coating/${area.slug}`,
    h1: area.heroTitle,
    schemaKind: 'service',
    schemaName: area.heroTitle,
    schemaServiceType: 'Sports court coating',
    schemaDescription: area.seoDescription || area.heroSubtitle || area.intro,
    faq: area.faq || [],
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Sports Court Coating', url: `${SITE_URL}/sports-court-coating-waco-tx` },
      { name: area.areaName, url: `${SITE_URL}/sports-court-coating/${area.slug}` },
    ],
    contentHtml: renderSportsCourtAreaContent(area),
  })),
  ...guidePageData.map((guide) => ({
    path: `/guides/${guide.slug}`,
    title: guide.seoTitle || `${guide.title} | ${SITE_NAME}`,
    description: guide.seoDescription,
    canonical: `${SITE_URL}/guides/${guide.slug}`,
    h1: guide.heroTitle,
    schemaKind: 'guide',
    schemaName: guide.title,
    schemaDescription: guide.seoDescription || guide.summary,
    faq: guide.faq || [],
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Guides', url: `${SITE_URL}/guides` },
      { name: guide.title, url: `${SITE_URL}/guides/${guide.slug}` },
    ],
    contentHtml: renderGuideContent(guide),
  })),
  ...publishedBlogPosts.map((post) => ({
      path: `/blog/${post.slug}`,
      title: `${post.title} | ${SITE_NAME}`,
      description:
        post.excerpt ||
        'Concrete tips, project planning advice, and local Waco-area concrete updates from SLA Concrete Works LLC.',
      canonical: `${SITE_URL}/blog/${post.slug}`,
      h1: post.title,
      schemaKind: 'blog',
      schemaName: post.title,
      schemaDescription: post.excerpt,
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at || post.published_at || post.created_at,
      breadcrumbs: [
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Blog', url: `${SITE_URL}/blog` },
        { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
      ],
      contentHtml: renderStaticBlogPostContent(post),
    })),
  ...staticRoutes.map((route) => ({
    path: route.path,
    title: route.title,
    description: route.description,
    canonical: `${SITE_URL}${route.path}`,
    h1: route.h1,
    schemaKind: 'static',
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: route.h1, url: `${SITE_URL}${route.path}` },
    ],
    contentHtml: route.renderContent(),
  })),
]

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function normalizeCanonical(url) {
  const value = String(url || '').trim()
  if (!value) return `${SITE_URL}/`
  if (value === SITE_URL || value === `${SITE_URL}/`) return `${SITE_URL}/`
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function truncateSentence(value, maxLength = 150) {
  const clean = String(value || '').replace(/\s+/g, ' ').trim()
  if (!clean || clean.length <= maxLength) return clean
  return `${clean.slice(0, maxLength - 1).trim()}...`
}

function renderActionLinks(links) {
  if (!links || links.length === 0) return ''
  return `<p style="margin:20px 0 0;display:flex;flex-wrap:wrap;gap:10px;">${links
    .map(
      (link) =>
        `<a href="${escapeHtml(link.href)}" style="display:inline-block;padding:10px 14px;border:1px solid #d6d3d1;border-radius:10px;color:#1c1917;font-weight:600;text-decoration:none;">${escapeHtml(link.label)}</a>`,
    )
    .join('')}</p>`
}

function renderBulletList(items, ordered = false) {
  if (!items || items.length === 0) return ''
  const tag = ordered ? 'ol' : 'ul'
  const listStyle = ordered
    ? 'padding:0 0 0 22px;margin:0 0 12px;color:#44403c;'
    : 'padding:0 0 0 18px;margin:0 0 12px;color:#44403c;'

  return `<${tag} style="${listStyle}">${items
    .map((item) => `<li style="margin:0 0 8px;">${escapeHtml(item)}</li>`)
    .join('')}</${tag}>`
}

function renderLinkList(items) {
  if (!items || items.length === 0) return ''
  return `<ul style="list-style:none;padding:0;margin:0;display:grid;gap:10px;">${items
    .map(
      (item) =>
        `<li style="border:1px solid #e7e5e4;border-radius:12px;padding:12px 14px;background:#fff;"><a href="${escapeHtml(item.href)}" style="font-weight:700;color:#1c1917;text-decoration:none;">${escapeHtml(item.label)}</a>${
          item.description
            ? `<p style="margin:6px 0 0;color:#57534e;font-size:0.95rem;">${escapeHtml(
                truncateSentence(item.description, 170),
              )}</p>`
            : ''
        }</li>`,
    )
    .join('')}</ul>`
}

function renderInlineMarkdown(value) {
  return escapeHtml(value).replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, label, href) =>
      `<a href="${escapeHtml(href)}" style="color:#ea580c;font-weight:700;text-decoration:none;">${label}</a>`,
  )
}

function renderSimpleMarkdown(content = '') {
  const blocks = String(content)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return blocks
    .map((block, index) => {
      const imageMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
      if (imageMatch) {
        return `<figure style="margin:22px 0;border:1px solid #e7e5e4;border-radius:12px;overflow:hidden;background:#fff;"><img src="${escapeHtml(
          imageMatch[2],
        )}" alt="${escapeHtml(
          imageMatch[1],
        )}" loading="lazy" width="900" height="675" style="display:block;width:100%;height:auto;"><figcaption style="padding:10px 12px;color:#57534e;font-size:0.92rem;">${escapeHtml(
          imageMatch[1],
        )}</figcaption></figure>`
      }

      if (block.startsWith('# ')) {
        if (index === 0) return ''
        return `<h2 style="margin:28px 0 10px;font-size:1.55rem;line-height:1.25;color:#1c1917;">${escapeHtml(
          block.replace(/^#\s+/, ''),
        )}</h2>`
      }

      if (block.startsWith('## ')) {
        return `<h2 style="margin:28px 0 10px;font-size:1.35rem;line-height:1.3;color:#1c1917;">${escapeHtml(
          block.replace(/^##\s+/, ''),
        )}</h2>`
      }

      return `<p style="margin:0 0 14px;color:#57534e;">${renderInlineMarkdown(block)}</p>`
    })
    .join('')
}

function renderFaqList(items) {
  if (!items || items.length === 0) return ''
  return items
    .map(
      (item) =>
        `<article style="margin:0 0 14px;padding:12px 14px;border:1px solid #e7e5e4;border-radius:12px;background:#fff;"><h3 style="margin:0 0 8px;font-size:1.05rem;color:#1c1917;">${escapeHtml(
          item.question,
        )}</h3><p style="margin:0;color:#57534e;">${escapeHtml(item.answer)}</p></article>`,
    )
    .join('')
}

function renderSection({
  title,
  paragraphs = [],
  bullets = [],
  orderedBullets = false,
  links = [],
  images = [],
  faq = [],
}) {
  const paragraphHtml = paragraphs
    .filter(Boolean)
    .map((paragraph) => `<p style="margin:0 0 12px;color:#57534e;">${escapeHtml(paragraph)}</p>`)
    .join('')

  return `<section style="margin-top:28px;">${
    title
      ? `<h2 style="margin:0 0 10px;font-size:1.45rem;line-height:1.3;color:#1c1917;">${escapeHtml(
          title,
        )}</h2>`
      : ''
  }${paragraphHtml}${renderBulletList(bullets, orderedBullets)}${renderLinkList(links)}${renderFaqList(
    faq,
  )}${renderImageGrid(images)}</section>`
}

function renderImageGrid(images) {
  if (!images || images.length === 0) return ''
  return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:16px;">${images
    .map(
      (image) =>
        `<figure style="margin:0;border:1px solid #e7e5e4;border-radius:8px;overflow:hidden;background:#fff;"><img src="${escapeHtml(
          image.src,
        )}" alt="${escapeHtml(
          image.alt,
        )}" loading="lazy" width="480" height="360" style="display:block;width:100%;aspect-ratio:4/3;object-fit:cover;"><figcaption style="padding:10px 12px;color:#57534e;font-size:0.92rem;"><strong style="display:block;color:#1c1917;">${escapeHtml(
          image.title,
        )}</strong>${escapeHtml(image.location || '')}</figcaption></figure>`,
    )
    .join('')}</div>`
}

function renderPage({
  eyebrow,
  title,
  subtitle,
  introParagraphs = [],
  sections = [],
  actionLinks = [],
  includeCompanyResourceLinks = true,
}) {
  const introHtml = introParagraphs
    .filter(Boolean)
    .map((paragraph) => `<p style="margin:0 0 14px;color:#57534e;">${escapeHtml(paragraph)}</p>`)
    .join('')

  const pageSections = includeCompanyResourceLinks
    ? [
        ...sections,
        {
          title: 'Company pages and customer resources',
          links: companyResourceLinks,
        },
        {
          title: 'Featured specialty concrete services',
          links: featuredSpecialtyServiceLinks,
        },
      ]
    : sections

  return `<main data-prerender-content="true" style="max-width:980px;margin:0 auto;padding:96px 20px 64px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.65;background:#fafaf9;color:#1c1917;"><p style="margin:0 0 8px;font-size:0.82rem;letter-spacing:0.08em;text-transform:uppercase;color:#ea580c;font-weight:700;">${escapeHtml(
    eyebrow,
  )}</p><h1 style="margin:0 0 14px;font-size:clamp(2rem,3.5vw,3rem);line-height:1.15;color:#1c1917;">${escapeHtml(
    title,
  )}</h1><p style="margin:0 0 16px;color:#44403c;font-size:1.05rem;">${escapeHtml(
    subtitle,
  )}</p>${introHtml}${renderActionLinks(actionLinks)}${pageSections.map((section) => renderSection(section)).join('')}</main>`
}

function renderHomeContent() {
  return renderPage({
    eyebrow: 'Waco Concrete Contractor',
    title: 'Concrete Contractor Waco TX',
    subtitle:
      'Permit-aware concrete contractor serving Waco and surrounding Central Texas communities since 2005.',
    introParagraphs: [
      `${SITE_NAME} builds driveways, patios, stamped concrete, foundations, and repair projects across Waco, Texas designed for black clay soil movement, heavy heat cycles, and daily traffic.`,
      `When people compare concrete companies in Waco TX, they usually need clear pricing, honest timelines, and work that stays level after the first summer. As an owner-run Waco concrete contractor, we start every project with site prep, slope planning, reinforcement, and realistic cure guidance so the finished slab performs for years.`,
      `Call ${PHONE_DISPLAY} for a free estimate. Most leads get a same-day response and a clear next-step plan for site visit, scope, and scheduling.`,
    ],
    includeCompanyResourceLinks: false,
    actionLinks: [
      { href: '/#contact', label: 'Request free estimate' },
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
      { href: '/guides', label: 'View local planning guides' },
    ],
    sections: [
      {
        title: 'Our most requested concrete services in Waco',
        paragraphs: [
          'Each service page includes local planning notes, cost factors, and the exact process we use from estimate through finish.',
        ],
        links: serviceLinks,
      },
      {
        title: 'Dedicated local service pages',
        paragraphs: [
          'These pages target high-intent searches such as foundation repair, house leveling, parking lot concrete, and decorative concrete in Waco.',
        ],
        links: seoServiceLinks,
      },
      {
        title: 'Company pages and customer resources',
        links: companyResourceLinks,
      },
      {
        title: 'What keeps concrete projects stable in Central Texas',
        bullets: [
          'Compaction and base prep designed for expansion and contraction in McLennan County clay soil.',
          'Drainage-first layout so water moves away from slabs, foundations, and home entries.',
          'Joint planning and reinforcement that reduce random cracking and long-term movement risk.',
          'Cure timing guidance tailored to current weather so new concrete is protected early.',
        ],
      },
      {
        title: 'Waco concrete planning guides',
        paragraphs: [
          'These guides explain common price ranges, permit questions, cost drivers, and planning checklists so you can prepare before requesting a quote.',
        ],
        links: guideLinks,
      },
      {
        title: 'Service areas across Central Texas',
        paragraphs: [
          'We routinely work in Waco, Temple, Killeen, Hewitt, Woodway, Robinson, Lorena, and McGregor.',
        ],
        links: locationLinks,
      },
      {
        title: 'Sports court coating target areas',
        paragraphs: [
          'We are expanding sports-court resurfacing coverage with location pages for high-demand Texas markets and nearby metro areas.',
        ],
        links: sportsCourtAreaLinks,
      },
      {
        title: 'Common questions from homeowners and property managers',
        faq: FAQ_ITEMS,
      },
      {
        title: 'What happens after you contact us',
        bullets: [
          'We review project details, location, and timeline goals during the first call.',
          'A site visit confirms access, drainage, measurements, and finish options.',
          'You receive a detailed estimate with clear scope, timeline, and pricing assumptions.',
          'Once approved, we schedule prep, pour, finishing, and cure milestones with updates.',
        ],
        orderedBullets: true,
      },
    ],
  })
}

function renderServiceContent(service) {
  const relatedServiceLinks = servicePageData
    .filter((item) => item.slug !== service.slug)
    .slice(0, 6)
    .map((item) => ({
      label: item.title,
      href: getCanonicalServicePath(item.slug),
      description: item.heroSubtitle,
    }))

  const localizedGuideLinks = service.pricingGuide
    ? [
        {
          label: service.pricingGuide.title,
          href: service.pricingGuide.href,
          description: service.pricingGuide.description,
        },
      ]
    : guideLinks.slice(0, 3)

  const processSteps = (service.process || []).map(
    (step, index) => `Step ${index + 1}: ${step.title} - ${step.description}`,
  )

  const localNotes = (service.localNotes || []).map(
    (note) => `${note.title}: ${note.description}`,
  )

  return renderPage({
    eyebrow: 'Service Detail',
    title: service.heroTitle,
    subtitle: service.heroSubtitle,
    introParagraphs: [
      service.intro,
      `Our ${service.title.toLowerCase()} work is scoped for Central Texas conditions and backed by clear communication from estimate through final walkthrough.`,
    ],
    actionLinks: [
      { href: '/#contact', label: 'Request estimate' },
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
      { href: '/guides', label: 'View all planning guides' },
      ...(service.pricingGuide ? [{ href: service.pricingGuide.href, label: 'View pricing guide' }] : []),
    ],
    sections: [
      {
        title: `What is included in ${service.title.toLowerCase()}`,
        bullets: service.benefits || [],
      },
      {
        title: `How we deliver ${service.title.toLowerCase()} projects`,
        bullets: processSteps,
        orderedBullets: true,
      },
      {
        title: 'Local planning details for Waco and nearby cities',
        bullets: localNotes,
      },
      {
        title: 'Cost factors and scheduling expectations',
        paragraphs: [
          'Final pricing depends on access, base prep, drainage correction, slab thickness, and finish complexity.',
          service.timeline || 'Most projects include prep day, pour/finish day, and cure guidance before use.',
        ],
        bullets: service.costFactors || [],
      },
      {
        title: 'Related pricing resources',
        links: localizedGuideLinks,
      },
      {
        title: 'Waco contractor hub and blog resources',
        links: wacoHubResourceLinks,
      },
      {
        title: 'Other concrete services you may need',
        links: relatedServiceLinks,
      },
      {
        title: 'Service locations',
        links: locationLinks,
      },
      {
        title: `${service.title} FAQs`,
        faq: service.faq || [],
      },
    ],
  })
}

function renderSeoServiceContent(service) {
  const serviceSections = (service.sections || []).map((section) => ({
    title: section.heading,
    paragraphs: section.paragraphs || [],
  }))
  const galleryImages = getServiceGalleryImages(service.slug, service.title)

  // Rotate the related list around the current page so every page links to a
  // distinct set of neighbors instead of the same first eight entries.
  const nonRedirectPages = seoServicePageData.filter((item) => !item.redirectTo)
  const currentIndex = nonRedirectPages.findIndex((item) => item.slug === service.slug)
  const orderedPages =
    currentIndex === -1
      ? nonRedirectPages.filter((item) => item.slug !== service.slug)
      : [...nonRedirectPages.slice(currentIndex + 1), ...nonRedirectPages.slice(0, currentIndex)]
  const relatedPages = orderedPages.slice(0, 8).map((item) => ({
    label: item.title,
    href: `/${item.slug}`,
    description: item.cardSummary || item.introParagraph,
  }))

  return renderPage({
    eyebrow: 'Service Detail',
    title: service.title,
    subtitle: service.cardSummary || service.metaDescription,
    introParagraphs: [
      service.introParagraph,
      `Need local help now? Call ${PHONE_DISPLAY} for a free estimate and a clear project plan.`,
    ],
    actionLinks: [
      { href: '/#contact', label: 'Request estimate' },
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
      { href: '/guides', label: 'View all planning guides' },
      { href: '/jobs', label: 'View recent projects' },
    ],
    sections: [
      {
        title: `What to expect with ${service.title.toLowerCase()}`,
        paragraphs: [
          `${SITE_NAME} plans each ${service.title.toLowerCase()} project around site access, drainage, soil movement, finish expectations, and the way the slab will be used after installation.`,
        ],
      },
      ...serviceSections,
      {
        title: 'Recent project photos for planning',
        paragraphs: [
          'These project photos show the type of prep, forming, finish, access, and cleanup details customers often compare before requesting an estimate.',
        ],
        images: galleryImages,
      },
      {
        title: 'Related service pages',
        links: relatedPages,
      },
      {
        title: 'Waco contractor hub and blog resources',
        links: wacoHubResourceLinks,
      },
      {
        title: 'Waco and nearby service coverage',
        links: locationLinks,
      },
      {
        title: `${service.title} FAQs`,
        faq: service.faq || [],
      },
    ],
  })
}

function renderLocationContent(location) {
  const cityServiceLinks = serviceLinks.slice(0, 8)
  const nearby = (location.nearbyAreas || []).map((area) => `${area}, TX`)
  const locationFaq = buildLocationFaq(location)
  const localSearchSections = (location.localSearchLinks || []).length
    ? [
        {
          title: `More ${location.city} planning paths`,
          links: location.localSearchLinks,
        },
      ]
    : []

  return renderPage({
    eyebrow: `${location.city} Service Area`,
    title: `${location.city}, TX Concrete Contractor`,
    subtitle: `Concrete driveways, patios, stamped finishes, repairs, and slab work in ${location.city} and surrounding areas.`,
    introParagraphs: [
      location.intro,
      `If you are comparing concrete contractors in ${location.city}, focus on site prep, drainage planning, joint layout, and documented cure guidance. Those details determine how the slab performs long after the project is finished.`,
      `Most ${location.city} jobs combine performance goals with curb-appeal upgrades, so we confirm access, grade transitions, and finish priorities before work begins.`,
    ],
    actionLinks: [
      { href: '/#contact', label: `Request ${location.city} estimate` },
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
    ],
    sections: [
      ...(location.planningSections || []).map((section) => ({
        title: section.title,
        paragraphs: section.paragraphs,
      })),
      ...localSearchSections,
      {
        title: `Concrete services available in ${location.city}`,
        links: cityServiceLinks,
      },
      {
        title: `Nearby areas around ${location.city}`,
        bullets: nearby,
      },
      {
        title: `Project planning checklist for ${location.city}`,
        bullets: [
          'Measure project footprint and note any drainage or pooling concerns.',
          'Choose finish goals: broom, exposed aggregate, stamped, or stained concrete.',
          'Identify demolition or haul-off needs if older concrete is being replaced.',
          'Confirm truck and crew access paths to avoid schedule delays.',
          'Set target timing for estimate, prep, pour, and cure milestones.',
        ],
      },
      {
        title: 'Pricing and planning resources',
        links: guideLinks,
      },
      {
        title: `${location.city} concrete FAQs`,
        faq: locationFaq,
      },
    ],
  })
}

function renderSportsCourtAreaContent(area) {
  const relatedAreaLinks = sportsCourtAreaLinks
    .filter((item) => item.href !== `/sports-court-coating/${area.slug}`)
    .slice(0, 6)

  const serviceBullets = (area.services || []).map(
    (service) => `${service.title}: ${service.description}`,
  )
  const processBullets = (area.process || []).map(
    (step, index) => `Step ${index + 1}: ${step.title} - ${step.description}`,
  )
  const localFocusBullets = (area.localFocus || []).map(
    (item) => `${item.title}: ${item.description}`,
  )
  const nearbyAreaBullets = (area.nearbyAreas || []).map((nearby) => `${nearby}, service coverage available`)

  return renderPage({
    eyebrow: 'Sports Court Coating Area',
    title: area.heroTitle,
    subtitle: area.heroSubtitle,
    introParagraphs: [
      area.intro,
      `Property owners in ${area.areaName} often prioritize traction, line clarity, and coating longevity. Our resurfacing process is structured around those outcomes.`,
    ],
    actionLinks: [
      { href: '/#contact', label: `Request ${area.areaName} quote` },
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
      { href: '/jobs', label: 'View project gallery' },
    ],
    sections: [
      {
        title: `Sports court services in ${area.areaName}`,
        bullets: serviceBullets,
      },
      {
        title: 'How the resurfacing process works',
        bullets: processBullets,
        orderedBullets: true,
      },
      {
        title: `${area.areaName} planning considerations`,
        bullets: localFocusBullets,
      },
      {
        title: `Search trends we are targeting in ${area.areaName}`,
        bullets: area.targetKeywords || [],
      },
      {
        title: `Nearby communities around ${area.areaName}`,
        bullets: nearbyAreaBullets,
      },
      {
        title: 'More sports court coating areas',
        links: relatedAreaLinks,
      },
      {
        title: 'Waco contractor hub and blog resources',
        links: wacoHubResourceLinks,
      },
      {
        title: `${area.areaName} sports-court FAQs`,
        faq: area.faq || [],
      },
    ],
  })
}

function renderGuidesIndexContent() {
  return renderPage({
    eyebrow: 'Planning Guides',
    title: 'Waco concrete planning, without guesswork',
    subtitle:
      'Local guides for concrete pricing, slab permit questions, driveways, patios, and stamped concrete based on Central Texas project conditions.',
    introParagraphs: [
      'Every guide includes practical project factors, what drives cost or approval needs, and what to prepare before requesting an estimate.',
      `If you need a scope-specific number, call ${PHONE_DISPLAY} and we will walk your site and provide a detailed estimate.`,
    ],
    actionLinks: [
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
      { href: '/#contact', label: 'Request estimate' },
    ],
    sections: [
      {
        title: 'Concrete planning guides for Waco projects',
        links: guideLinks,
      },
      {
        title: 'Most common cost drivers',
        bullets: [
          'Square footage and slab thickness requirements.',
          'Base prep, grading correction, and drainage improvements.',
          'Reinforcement, mix PSI, and finish selections.',
          'Removal and disposal of existing concrete.',
          'Site access constraints for trucks and finishing equipment.',
        ],
      },
      {
        title: 'Services these guides support',
        links: serviceLinks,
      },
    ],
  })
}

function renderAboutContent() {
  return renderPage({
    eyebrow: 'Meet Steve',
    title: 'Meet Steve, the owner behind SLA Concrete Works LLC',
    subtitle:
      'The person answering the call, walking the site, and staying involved through the job.',
    introParagraphs: [
      'If you call SLA Concrete Works LLC, you are usually talking to Steve. He is the one asking what is wrong, what you want built, and what the site looks like before he starts talking price.',
      'He has been pouring concrete around Waco for more than 20 years. People like that he is direct, stays involved, and does not try to dress every job up like a sales pitch.',
    ],
    includeCompanyResourceLinks: false,
    actionLinks: [
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
      { href: '/#contact', label: 'Request estimate' },
      { href: '/reviews', label: 'Read customer reviews' },
    ],
    sections: [
      {
        title: 'What people like about working with Steve',
        bullets: [
          'They deal with the owner, not a separate sales team.',
          'He pays attention to site prep, drainage, and the stuff under the slab that people do not usually see.',
          'He is plain about scope, timing, and whether the job needs more work or less work.',
          'He stays involved instead of disappearing after the estimate.',
        ],
      },
      {
        title: 'How he got into the work',
        paragraphs: [
          'Steve got into concrete after seeing too many slabs fail early because the prep was rushed or ignored. Most of the time the concrete got blamed for problems that really started with the base, the drainage, or the soil underneath.',
          'That is still how he looks at jobs now. Around Waco, black clay and water movement can ruin a good-looking slab if the groundwork is sloppy.',
        ],
      },
      {
        title: 'How he runs a job',
        bullets: [
          'Step 1: Ask the right questions and walk the site before guessing at a price.',
          'Step 2: Figure out access, drainage, grade, and whether old concrete needs to come out.',
          'Step 3: Prep the base and forms so the slab starts right, not just looks good on pour day.',
          'Step 4: Finish the job, explain cure timing, and make sure the customer knows what comes next.',
        ],
        orderedBullets: true,
      },
      {
        title: 'Pages worth reviewing before you hire',
        links: companyResourceLinks.filter((item) => item.href !== '/about'),
      },
      {
        title: 'Core concrete services',
        links: serviceLinks.slice(0, 8),
      },
    ],
  })
}

function renderReviewsContent() {
  return renderPage({
    eyebrow: 'Testimonials',
    title: 'Customer Reviews',
    subtitle:
      'Recent feedback from homeowners and property managers across Waco and nearby communities.',
    introParagraphs: [
      'These reviews cover driveways, patios, decorative concrete, and repair work completed in Central Texas.',
      `Need a quote for your project? Call ${PHONE_DISPLAY} or request an estimate online.`,
    ],
    actionLinks: [
      { href: '/#contact', label: 'Request estimate' },
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
      {
        href: 'https://www.google.com/maps/place/SLA+Concrete+Works/@31.6637838,-97.1149261,17z/data=!3m1!4b1!4m6!3m5!1s0x864f83d5fc2728cf:0x92d8085e5a37fa64!8m2!3d31.6637793!4d-97.1123512!16s%2Fg%2F11gf0qs4j0?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D',
        label: 'Read Google reviews',
      },
    ],
    sections: [
      {
        title: 'Related planning resources',
        links: [
          { label: 'Concrete blog', href: '/blog', description: 'Project tips and local concrete guidance.' },
          { label: 'Pricing guides', href: '/guides', description: 'Cost ranges and planning checklists for Waco projects.' },
          { label: 'Project gallery', href: '/jobs', description: 'Recent concrete jobs and finish examples.' },
        ],
      },
      {
        title: 'Most reviewed service categories',
        links: serviceLinks.slice(0, 8),
      },
      {
        title: 'Service locations',
        links: locationLinks,
      },
    ],
  })
}

function renderPrivacyPolicyContent() {
  return renderPage({
    eyebrow: 'Privacy',
    title: 'Privacy Policy',
    subtitle:
      'SLA Concrete Works LLC values clear and practical privacy practices for leads and communication.',
    introParagraphs: [
      'Our goal is straightforward: only collect what helps us communicate and deliver projects safely and effectively.',
      'By submitting a request on our site, you are allowing us to process your contact details for estimates and project follow-up.',
    ],
    sections: [
      {
        title: 'Information We Collect',
        bullets: [
          'Name, phone number, email, project service, and message details from our contact form.',
          'IP address, user agent, and submitted page metadata for lead validation and support.',
          'Communication details you provide directly during calls or text follow-up.',
        ],
      },
      {
        title: 'How We Use Your Information',
        bullets: [
          'To process and prioritize incoming leads.',
          'To respond with estimate follow-up and scheduling communication.',
          'To send internal email and SMS notifications to our team.',
          'To improve lead workflow and client response quality.',
        ],
      },
      {
        title: 'Communications',
        bullets: [
          'If SMS is used, messaging may include lead details necessary for internal team follow-up.',
          'You can opt out of non-essential follow-up messaging at any time by replying STOP or contacting us.',
          'We do not sell lead data to advertising networks or unrelated third parties.',
        ],
      },
      {
        title: 'Third-Party Services',
        bullets: [
          'Supabase: lead storage and admin dashboard authentication.',
          'Vercel: hosting and serverless API execution.',
          'Twilio: SMS delivery.',
          'Resend: outbound email notifications.',
        ],
      },
      {
        title: 'Data Retention and Your Requests',
        bullets: [
          'Lead records are retained only for legitimate business follow-up and operations.',
          'You may request correction, access, or deletion by contacting us directly.',
          'This policy is updated as our systems evolve to stay accurate.',
        ],
      },
    ],
  })
}

function renderTermsAndConditionsContent() {
  return renderPage({
    eyebrow: 'Legal',
    title: 'Terms and Conditions',
    subtitle: 'Service terms for clients and prospective clients of SLA Concrete Works LLC.',
    introParagraphs: [
      'By using this site or contacting our team, you agree to the terms described on this page.',
      'These terms clarify expectations before work starts, including estimates, scheduling, and communication.',
    ],
    sections: [
      {
        title: 'Acceptance of Terms',
        bullets: [
          'You agree to these terms when submitting an estimate request or using our services.',
          'If you do not agree, please contact us instead of submitting project details.',
        ],
      },
      {
        title: 'Estimates and Scope',
        bullets: [
          'Quoted pricing is based on the information provided and visible site conditions at the time of estimate.',
          'Project scope, mix, finish, and timeline are confirmed in writing before final scheduling.',
          'Hidden issues found during the job may change scope and pricing.',
        ],
      },
      {
        title: 'Client Responsibilities',
        bullets: [
          'Provide clear property access and accurate measurements.',
          'Inform us of site constraints, utility conflicts, and drainage concerns.',
          'Protect nearby surfaces and coordinate pets, vehicles, and occupied areas during active work.',
        ],
      },
      {
        title: 'Scheduling and Weather',
        bullets: [
          'Weather, permitting, and material availability may change planned delivery windows.',
          'We will promptly communicate delays and suggest practical alternatives.',
        ],
      },
      {
        title: 'Communication and SMS',
        bullets: [
          'You agree to receive email or text updates connected to your estimate or service request.',
          'Message frequency is based on project need, with standard carrier messaging rates and limits.',
          'If you reply STOP to any business text, we will stop non-essential outbound messages.',
        ],
      },
      {
        title: 'Liability and Limits',
        bullets: [
          'Insurance, liability, and site-risk questions should be reviewed during the estimate so expectations are clear before work begins.',
          'Long-term concrete performance depends on soil movement, load patterns, and ongoing maintenance practices.',
          'All workmanship concerns should be reported promptly so we can review the issue in context.',
        ],
      },
      {
        title: 'Dispute Process',
        bullets: [
          'Contact us first with any concern so we can resolve it quickly.',
          'If unresolved, disputes may proceed under Texas law and in the courts of McLennan County.',
          'You should keep communication records and photos for review.',
        ],
      },
      {
        title: 'Updates',
        bullets: [
          'We may update these terms from time to time.',
          'Updated terms apply after the posting date shown on this page.',
        ],
      },
    ],
  })
}

function renderGuideContent(guide) {
  const ranges = (guide.costRanges || []).map(
    (range) => `${range.label}: ${range.range} - ${range.detail}`,
  )
  const notes = (guide.localNotes || []).map((note) => `${note.title}: ${note.description}`)
  const isPricingGuide = ranges.length > 0
  const sections = [
    {
      title: isPricingGuide ? 'Quick pricing stats' : 'Quick planning checkpoints',
      bullets: (guide.quickStats || []).map((stat) => `${stat.label}: ${stat.value}`),
    },
    ranges.length > 0
      ? {
          title: 'Typical Waco pricing ranges',
          bullets: ranges,
        }
      : null,
    {
      title: guide.factorTitle || 'Factors that affect final cost',
      bullets: guide.factors || [],
    },
    {
      title: guide.localTitle || 'Local project considerations',
      bullets: notes,
    },
    {
      title: 'Pre-estimate checklist',
      bullets: guide.checklist || [],
      orderedBullets: true,
    },
    {
      title: 'Related services',
      links: (guide.relatedServices || []).map((service) => ({
        ...service,
        description: 'Compare scope details, process, and service-specific FAQs.',
      })),
    },
    {
      title: 'Guide FAQs',
      faq: guide.faq || [],
    },
  ].filter(
    (section) =>
      section &&
      [
        section.paragraphs,
        section.bullets,
        section.links,
        section.images,
        section.faq,
      ].some((items) => Array.isArray(items) && items.length > 0),
  )

  return renderPage({
    eyebrow: guide.badgeLabel || 'Pricing Guide',
    title: guide.heroTitle,
    subtitle: guide.heroSubtitle,
    introParagraphs: [
      guide.summary,
      isPricingGuide
        ? 'Use this guide to set a realistic budget range before requesting a formal estimate. Final pricing depends on your site prep, access, and finish details.'
        : 'Use this guide to prepare better project questions before requesting a formal estimate. Final requirements depend on your property, scope, and local review path.',
    ],
    actionLinks: [
      { href: '/#contact', label: 'Request project estimate' },
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
    ],
    sections,
  })
}

function renderBlogIndexContent() {
  return renderPage({
    eyebrow: 'Blog',
    title: 'Concrete tips and project ideas for Central Texas',
    subtitle:
      'Maintenance checklists, design options, and planning guides from the SLA Concrete Works LLC team.',
    introParagraphs: [
      'Blog posts are loaded dynamically so we can publish new articles quickly. Use the links below to access our highest-value evergreen resources while new posts load.',
      'Most customers use the blog to compare finish options, understand cracking causes, and plan realistic budgets before requesting a quote.',
    ],
    actionLinks: [
      { href: '/#contact', label: 'Request estimate' },
      { href: '/guides', label: 'Explore planning guides' },
    ],
    sections: [
      {
        title: 'Start with these local planning resources',
        links: guideLinks,
      },
      {
        title: 'Popular service pages',
        links: serviceLinks.slice(0, 6),
      },
      {
        title: 'Local markets we serve',
        links: locationLinks,
      },
    ],
  })
}

function renderJobsIndexContent() {
  return renderPage({
    eyebrow: 'Project Gallery',
    title: 'Concrete projects across Waco and Central Texas',
    subtitle:
      'Driveways, patios, stamped concrete, slabs, and repair jobs with location-specific notes and finish details.',
    introParagraphs: [
      'Project photos and details are loaded dynamically from our jobs database so new work can be published quickly.',
      'For planning and pricing, review the linked service and guide pages below while gallery content loads.',
    ],
    actionLinks: [
      { href: '/#contact', label: 'Request project quote' },
      { href: PHONE_HREF, label: `Call ${PHONE_DISPLAY}` },
    ],
    sections: [
      {
        title: 'Service pages referenced in recent projects',
        links: serviceLinks,
      },
      {
        title: 'Budget planning guides',
        links: guideLinks,
      },
      {
        title: 'Cities where we complete projects',
        links: locationLinks,
      },
    ],
  })
}

function renderStaticBlogPostContent(post) {
  return `<main data-prerender-content="true" style="max-width:860px;margin:0 auto;padding:96px 20px 64px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.65;background:#fafaf9;color:#1c1917;"><p style="margin:0 0 8px;font-size:0.82rem;letter-spacing:0.08em;text-transform:uppercase;color:#ea580c;font-weight:700;">Concrete Blog</p><h1 style="margin:0 0 14px;font-size:clamp(2rem,3.5vw,3rem);line-height:1.15;color:#1c1917;">${escapeHtml(
    post.title,
  )}</h1><p style="margin:0 0 20px;color:#44403c;font-size:1.05rem;">${escapeHtml(
    post.excerpt || 'Concrete planning advice from SLA Concrete Works LLC.',
  )}</p><article style="background:#fff;border:1px solid #e7e5e4;border-radius:16px;padding:24px;">${renderSimpleMarkdown(
    post.content,
  )}</article>${renderSection({
    title: 'Keep planning your concrete project',
    links: [
      { label: 'Request a free estimate', href: '/#contact' },
      { label: 'Hewitt concrete contractor page', href: '/hewitt-tx-concrete-contractor' },
      { label: 'Waco concrete contractor hub', href: '/waco-tx-concrete-contractor' },
      { label: 'Project gallery', href: '/jobs' },
    ],
  })}</main>`
}

function renderNotFoundContent() {
  return renderPage({
    eyebrow: '404',
    title: 'Page Not Found',
    subtitle: 'The page you requested is not available.',
    introParagraphs: [
      'Use the links below to return to high-priority sections of the site.',
    ],
    actionLinks: [
      { href: '/', label: 'Back to homepage' },
      { href: getCanonicalServicePath('concrete-driveways'), label: 'View services' },
      { href: '/guides', label: 'View planning guides' },
    ],
  })
}

function upsertTitle(html, title) {
  if (/<title[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title[\s\S]*?<\/title>/i, () => `<title>${escapeHtml(title)}</title>`)
  }
  return html.replace('</head>', () => `<title>${escapeHtml(title)}</title>\n</head>`)
}

function removeMetaTag(html, key) {
  const regexName = new RegExp(`<meta[^>]*name=["']${key}["'][^>]*>\\s*`, 'gi')
  const regexProperty = new RegExp(`<meta[^>]*property=["']${key}["'][^>]*>\\s*`, 'gi')
  return html.replace(regexName, '').replace(regexProperty, '')
}

function upsertMetaTag(html, key, value) {
  const content = escapeHtml(value)
  const selector = key.startsWith('og:') || key.startsWith('article:') ? 'property' : 'name'
  const regex = new RegExp(`<meta[^>]*${selector}=["']${key}["'][^>]*>`, 'i')
  const tag = `<meta ${selector}="${key}" content="${content}" />`
  if (regex.test(html)) return html.replace(regex, () => tag)
  return html.replace('</head>', () => `${tag}\n</head>`)
}

function upsertCanonical(html, canonical) {
  const href = escapeHtml(canonical)
  const regex = /<link[^>]*rel=["']canonical["'][^>]*>/i
  const tag = `<link rel="canonical" href="${href}" />`
  if (regex.test(html)) return html.replace(regex, () => tag)
  return html.replace('</head>', () => `${tag}\n</head>`)
}

function cityArea(name) {
  return {
    '@type': 'City',
    name,
    addressRegion: 'TX',
    addressCountry: 'US',
  }
}

function serviceAreaPlaceSchema() {
  return {
    '@type': 'Place',
    '@id': SERVICE_AREA_ID,
    name: 'McLennan County concrete service area',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoShape',
      polygon: MCLENNAN_COUNTY_POLYGON,
    },
  }
}

function localBusinessSchema({ includeOfferCatalog = false } = {}) {
  const schema = {
    '@type': 'LocalBusiness',
    '@id': ORGANIZATION_ID,
    additionalType: 'https://schema.org/ConcreteContractor',
    name: SITE_NAME,
    alternateName: 'SLA Concrete Works LLC of Waco',
    description:
      'Concrete contractor serving Waco, McLennan County, and nearby Central Texas communities with driveways, patios, stamped concrete, slabs, repairs, and commercial concrete work.',
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.png`,
    image: DEFAULT_IMAGE,
    telephone: PHONE_SCHEMA,
    email: 'slaconcrete@gmail.com',
    foundingDate: '2005',
    priceRange: '$$',
    founder: OWNER_PERSON_SCHEMA,
    sameAs: [GOOGLE_BUSINESS_PROFILE_URL],
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS_ADDRESS,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_GEO.latitude,
      longitude: BUSINESS_GEO.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '08:00',
        closes: '16:00',
      },
    ],
    areaServed: [
      { '@id': SERVICE_AREA_ID },
      ...locationPages.map((location) => cityArea(location.city)),
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1',
    },
  }

  if (includeOfferCatalog) {
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Concrete services',
      itemListElement: serviceLinks.map((service, index) => ({
        '@type': 'Offer',
        position: index + 1,
        url: `${SITE_URL}${service.href}`,
        itemOffered: {
          '@type': 'Service',
          name: service.label,
          description: service.description,
          provider: {
            '@id': ORGANIZATION_ID,
          },
          areaServed: {
            '@id': SERVICE_AREA_ID,
          },
        },
      })),
    }
  }

  return schema
}

function webSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: {
      '@id': ORGANIZATION_ID,
    },
  }
}

function webPageSchema(canonical, title, description) {
  return {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    isPartOf: {
      '@id': WEBSITE_ID,
    },
    about: {
      '@id': ORGANIZATION_ID,
    },
  }
}

function breadcrumbSchema(items = []) {
  if (!items.length) return null
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

function faqPageSchema(items = []) {
  if (!items.length) return null
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

function serviceSchema(meta, canonical) {
  if (meta.schemaKind !== 'service' && meta.schemaKind !== 'location') return null
  return {
    '@type': 'Service',
    '@id': `${canonical}#service`,
    name: meta.schemaName || meta.h1 || meta.title,
    serviceType: meta.schemaServiceType || (meta.schemaKind === 'location' ? 'Concrete contractor' : meta.schemaName || meta.h1 || meta.title),
    description: meta.schemaDescription || meta.description,
    url: canonical,
    provider: {
      '@id': ORGANIZATION_ID,
    },
    areaServed: {
      '@id': SERVICE_AREA_ID,
    },
    offers: {
      '@type': 'Offer',
      url: canonical,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@id': ORGANIZATION_ID,
      },
    },
  }
}

function locationPlaceSchema(meta, canonical) {
  if (meta.schemaKind !== 'location') return null
  return {
    '@type': 'Place',
    '@id': `${canonical}#place`,
    name: meta.schemaName || meta.h1 || meta.title,
    description: meta.schemaDescription || meta.description,
    url: canonical,
    containedInPlace: {
      '@id': SERVICE_AREA_ID,
    },
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
  }
}

function articleSchema(meta, canonical) {
  if (meta.schemaKind === 'blog') {
    return {
      '@type': 'BlogPosting',
      '@id': `${canonical}#article`,
      headline: meta.schemaName || meta.h1 || meta.title,
      description: meta.schemaDescription || meta.description,
      datePublished: meta.publishedTime,
      dateModified: meta.modifiedTime || meta.publishedTime,
      mainEntityOfPage: {
        '@id': `${canonical}#webpage`,
      },
      author: {
        '@id': ORGANIZATION_ID,
      },
      publisher: {
        '@id': ORGANIZATION_ID,
      },
    }
  }

  if (meta.schemaKind !== 'guide') return null
  return {
    '@type': 'Article',
    '@id': `${canonical}#article`,
    headline: meta.schemaName || meta.h1 || meta.title,
    description: meta.schemaDescription || meta.description,
    mainEntityOfPage: {
      '@id': `${canonical}#webpage`,
    },
    author: {
      '@id': ORGANIZATION_ID,
    },
    publisher: {
      '@id': ORGANIZATION_ID,
    },
  }
}

function buildRouteJsonLd(meta, canonical) {
  const nodes = [
    webSiteSchema(),
    webPageSchema(canonical, meta.title, meta.description),
    breadcrumbSchema(meta.breadcrumbs || []),
    faqPageSchema(meta.faq || []),
    serviceAreaPlaceSchema(),
    serviceSchema(meta, canonical),
    locationPlaceSchema(meta, canonical),
    articleSchema(meta, canonical),
  ]

  if (meta.schemaKind === 'home') {
    nodes.push(localBusinessSchema({ includeOfferCatalog: true }))
  } else {
    nodes.push(localBusinessSchema())
  }

  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  }
}

function removeExistingJsonLd(html) {
  return html.replace(/<script\b(?=[^>]*type=["']application\/ld\+json["'])[\s\S]*?<\/script>\s*/gi, '')
}

function upsertJsonLd(html, meta, canonical) {
  const json = {
    ...buildRouteJsonLd(meta, canonical),
  }
  const tag = `<script type="application/ld+json" data-prerender="route" data-page-url="${escapeHtml(
    canonical,
  )}">${JSON.stringify(json)}</script>`
  return removeExistingJsonLd(html).replace('</head>', () => `${tag}\n</head>`)
}

function upsertPrerenderContent(html, contentHtml) {
  const cleanHtml = html.replace(/<h1[^>]*data-prerender-route-h1[^>]*>[\s\S]*?<\/h1>\s*/gi, '')
  const replacement = `<div id="root">\n${contentHtml}\n</div>`

  if (/<div id="root"><\/div>/i.test(cleanHtml)) {
    return cleanHtml.replace(/<div id="root"><\/div>/i, () => replacement)
  }

  return cleanHtml.replace(/<div id="root">[\s\S]*?<\/div>/i, () => replacement)
}

function applyMeta(html, meta) {
  const canonical = normalizeCanonical(meta.canonical || `${SITE_URL}${meta.path === '/' ? '/' : meta.path}`)
  const ogType = meta.schemaKind === 'blog' ? 'article' : 'website'
  let updated = html
  updated = upsertTitle(updated, meta.title)
  updated = upsertMetaTag(updated, 'description', meta.description)
  updated = upsertMetaTag(updated, 'robots', 'index, follow')
  updated = upsertCanonical(updated, canonical)
  updated = upsertMetaTag(updated, 'og:title', meta.title)
  updated = upsertMetaTag(updated, 'og:description', meta.description)
  updated = upsertMetaTag(updated, 'og:type', ogType)
  updated = upsertMetaTag(updated, 'og:site_name', SITE_NAME)
  updated = upsertMetaTag(updated, 'og:locale', 'en_US')
  updated = upsertMetaTag(updated, 'og:url', canonical)
  updated = upsertMetaTag(updated, 'og:image', DEFAULT_IMAGE)
  updated = upsertMetaTag(updated, 'og:image:alt', `${SITE_NAME} in Waco, Texas`)
  updated = upsertMetaTag(updated, 'twitter:card', 'summary_large_image')
  updated = upsertMetaTag(updated, 'twitter:title', meta.title)
  updated = upsertMetaTag(updated, 'twitter:description', meta.description)
  updated = upsertMetaTag(updated, 'twitter:image', DEFAULT_IMAGE)
  if (meta.publishedTime) {
    updated = upsertMetaTag(updated, 'article:published_time', meta.publishedTime)
  }
  if (meta.modifiedTime) {
    updated = upsertMetaTag(updated, 'article:modified_time', meta.modifiedTime)
  }
  updated = upsertJsonLd(updated, meta, canonical)
  updated = upsertPrerenderContent(updated, meta.contentHtml || renderNotFoundContent())
  if (meta.robots && meta.robots !== 'index, follow') {
    updated = upsertMetaTag(updated, 'robots', meta.robots)
  }
  return updated
}

async function ensureRouteFile(routePath, htmlTemplate, meta) {
  const relativePath = routePath === '/' ? 'index.html' : `${routePath.replace(/^\//, '')}/index.html`
  const filePath = path.join(distDir, relativePath)
  const parentDir = path.dirname(filePath)
  await fs.mkdir(parentDir, { recursive: true })
  const html = applyMeta(htmlTemplate, meta)
  await fs.writeFile(filePath, html, 'utf8')
}

async function main() {
  const htmlTemplate = await fs.readFile(indexPath, 'utf8')

  for (const route of routeMeta) {
    await ensureRouteFile(route.path, htmlTemplate, route)
  }

  const notFoundPath = path.join(distDir, '404.html')
  let notFoundHtml = applyMeta(htmlTemplate, {
    path: '/404',
    title: 'Page Not Found | SLA Concrete Works LLC',
    description: 'The page you requested could not be found on SLA Concrete Works LLC.',
    canonical: `${SITE_URL}/404`,
    h1: 'Page Not Found',
    robots: 'noindex, nofollow',
    contentHtml: renderNotFoundContent(),
  })
  notFoundHtml = removeMetaTag(notFoundHtml, 'article:published_time')
  notFoundHtml = removeMetaTag(notFoundHtml, 'article:modified_time')
  await fs.writeFile(notFoundPath, notFoundHtml, 'utf8')
}

main().catch((error) => {
  console.error('prerender-routes failed:', error)
  process.exitCode = 1
})
