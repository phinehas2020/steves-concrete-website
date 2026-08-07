const LAST_FACT_CHECK = '2026-08-07T18:00:00.000Z'

function makeRepairedPost({
  slug,
  publishedAt,
  title,
  seoTitle,
  excerpt,
  sourceSummary,
  intro,
  sections,
  photos,
  projectSeriesId = null,
  seriesPhase = null,
}) {
  const sectionContent = sections.flatMap((section) => [
    '## ' + section.heading,
    ...section.paragraphs,
  ])
  const photoContent = photos.flatMap((photo) => [
    '![' + photo.alt + '](' + photo.url + ')',
  ])

  return Object.freeze({
    id: 'repaired-' + slug,
    created_at: publishedAt,
    updated_at: LAST_FACT_CHECK,
    published_at: publishedAt,
    title,
    seo_title: seoTitle,
    slug,
    excerpt,
    status: 'published',
    seo_status: 'approved',
    author_name: 'SLA Concrete Works LLC',
    reviewed_at: LAST_FACT_CHECK,
    source_summary: sourceSummary,
    canonical_slug: null,
    project_series_id: projectSeriesId,
    series_phase: seriesPhase,
    cover_image_url: photos[0]?.url || null,
    content: [
      intro,
      ...sectionContent,
      '## Photos from this project phase',
      ...photoContent,
    ].join('\n\n'),
  })
}

export const repairedBlogPosts = [
  makeRepairedPost({
    slug: 'morton-building-barn-dominium-in-chappell-hill-texas',
    publishedAt: '2026-04-03T14:36:05.815+00:00',
    title: 'Chappell Hill Barndominium Slab: Interior and Covered-Edge Finish',
    seoTitle: 'Chappell Hill Barndominium Slab Finish | SLA Concrete',
    excerpt:
      'A photo-backed field note on the interior slab, adjacent covered exterior section, final trowel passes, perimeter edges, and the transition the next trades inherit.',
    sourceSummary:
      'Rebuilt from SLA’s April 2026 Chappell Hill photo record. The record identifies a Morton Building barndominium, an interior slab, an adjacent covered exterior slab, visible final-pass marks, and finished edges; unpublished dimensions and specifications are not inferred.',
    intro:
      'This Chappell Hill record is useful because it captures the finish handoff between two connected surfaces: a smooth interior slab and the covered exterior concrete beside it. The original SLA photo note identifies both areas and shows the circular marks left by the final trowel passes. That is a narrower and more useful subject than a generic project recap.',
    sections: [
      {
        heading: 'What the dated photo record confirms',
        paragraphs: [
          'The images belong to a Morton Building barndominium project in Chappell Hill. They show finished concrete inside the building footprint, a covered exterior section next to it, clean perimeter lines, and a surface still early enough in the cure for the finishing pattern to remain visible.',
          'The album does not publish the square footage, slab thickness, reinforcement, mix, vapor-control detail, or drainage elevations. Those items cannot be read reliably from a finished surface, so this field note does not fill them in with a typical slab specification.',
        ],
      },
      {
        heading: 'Why the interior-to-exterior transition deserves its own check',
        paragraphs: [
          'An enclosed shop floor and an exterior covered slab may have different exposure, drainage, finish, and future-use needs even when they meet at one building. Before placement, the drawings and proposal should identify the elevation at the opening, the intended direction of water, edge details, and which finish belongs on each side.',
          'At handoff, the useful inspection is simple: follow the shared edge, look for abrupt height changes, confirm the exterior path does not direct water inward, and protect both surfaces from the next trades. The photographs document the visible finish; project documents still control the technical acceptance criteria.',
        ],
      },
      {
        heading: 'Questions for a similar barndominium slab',
        paragraphs: [
          'Ask the building supplier, designer, and concrete contractor to agree on door openings, embedded items, plumbing locations, interior use, exterior traffic, finish expectations, cure protection, and who verifies elevations before the truck arrives. Those decisions matter more than choosing a finish by looking at one completed photo.',
          'For the broader planning sequence, the site team should also resolve subgrade, base, reinforcement, vapor control where required, joints, concrete specification, access, weather, and the point at which framing or equipment may move onto the slab.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Finished interior and covered exterior concrete at the Chappell Hill barndominium',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-19/4a17b835-2331-491e-b807-10f7a79ccfc8-xwyhp2.jpg',
      },
      {
        alt: 'Final trowel-pass pattern on the Chappell Hill interior slab',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-19/3a47fdff-b4ec-44b5-8c25-5a3eac46e445-ftuaxw.jpg',
      },
    ],
    projectSeriesId: 'chappell-hill-barndominium-slab',
    seriesPhase: 3,
  }),
  makeRepairedPost({
    slug: 'finished-the-burnet-shop-foundation-9600-ft',
    publishedAt: '2026-04-02T17:11:24.075+00:00',
    title: 'Burnet 9,600-Square-Foot Shop Slab: Finish and Handoff',
    seoTitle: 'Burnet 9,600 SF Shop Slab Finish & Handoff | SLA',
    excerpt:
      'Part three of the Burnet shop-slab record, focused on the finished surface, visible joints, perimeter lines, cure protection, and handoff questions.',
    sourceSummary:
      'Rebuilt from SLA’s April 2026 Burnet finish album and the linked 9,600-square-foot master case study. The photographs verify the completed slab surface and visible joint and edge work; mix, steel, ticket, cure, and engineering details remain tied to project records.',
    intro:
      'This is the finish-and-handoff phase of the Burnet shop foundation series. SLA’s original record identifies the slab as approximately 9,600 square feet, and the photographs show the broad completed surface, visible joint lines, and clean perimeter. Keeping this phase separate lets an owner inspect what happens after placement without repeating the pre-pour story.',
    sections: [
      {
        heading: 'What is visible after the finishing pass',
        paragraphs: [
          'The photo set shows a large uninterrupted shop floor with a consistent finished appearance, straight outer edges, and joint lines dividing the field. Those are real visual observations. A photograph cannot confirm flatness tolerances, concrete strength, reinforcement, slab thickness, or whether every joint matches the plan.',
          'The useful closeout question is whether the surface and edges match the documented building use and finish requirement. A shop intended for vehicles, lifts, storage, machinery, coatings, or finished rooms may have different acceptance checks, and those checks should be written before placement.',
        ],
      },
      {
        heading: 'Cure and access are part of the handoff',
        paragraphs: [
          'Finishing is not the end of the concrete work. The site still needs a cure and protection plan, controlled access, attention to exposed edges, and coordination with crews that want to start framing or installing equipment. The record does not publish the Burnet cure method or opening schedule, so this page does not invent one.',
          'Before releasing a comparable slab, document who removes forms, when saw cuts or other joint work occur, how the surface stays protected, when construction traffic may enter, and which visible conditions require correction. The answer should come from the mix, weather, plans, and project team—not a universal number.',
        ],
      },
      {
        heading: 'How this phase connects to the full Burnet record',
        paragraphs: [
          'Read the [Burnet pre-pour field note](/blog/shop-foundation-burnet-texas-9600-ft-getting-ready-to-pour-tomorrow-morning-3-am-200-yards) for forms, panel layout, delivery planning, and the early-start source record. The [9,600-square-foot Burnet case study](/blog/burnet-9600-sf-shop-slab-case-study) puts the visible finish into the larger shop-slab planning context.',
          'Together the pages answer different questions: what had to be ready, what the placement produced, and what an owner should verify before the next trade takes control of the slab.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Finished surface and perimeter of the 9,600-square-foot Burnet shop slab',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-04-01/38b03cc4-1101-4f3c-bed9-c048b691f1be-8hxbk0.jpg',
      },
      {
        alt: 'Visible finished field and joint lines on the Burnet shop foundation',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-04-01/4d306076-19e7-4ecf-a0a4-11ac9198e927-11kem42.jpg',
      },
    ],
    projectSeriesId: 'burnet-9600-sf-shop-slab',
    seriesPhase: 3,
  }),
  makeRepairedPost({
    slug: 'for-concrete-or-circle-k-lacy-lake-view',
    publishedAt: '2026-04-02T17:10:42.663+00:00',
    title: 'Circle K Apron and Drive-Lane Placement in Lacy Lakeview',
    seoTitle: 'Circle K Apron Placement | Lacy Lakeview, TX | SLA',
    excerpt:
      'A placement-day field note showing fresh concrete, active floating, adjacent paving equipment, edge control, and the traffic-area questions that matter at a fuel site.',
    sourceSummary:
      'Rebuilt from SLA’s April 2026 Circle K photo record in Lacy Lakeview. The album identifies a concrete apron and drive area and shows active placement and finishing with compactors and paving equipment nearby; dimensions, mix, reinforcement, and reopening time are not asserted.',
    intro:
      'This Circle K page now has one job: document the apron and drive-lane placement phase. The original SLA album shows a fresh strip of concrete being floated while compactors and paving equipment remain nearby. That makes the page useful for understanding how concrete work fits into a larger fuel-site paving sequence.',
    sections: [
      {
        heading: 'What the placement photos establish',
        paragraphs: [
          'The images show active concrete placement in a traffic area at the Lacy Lakeview Circle K, crew members working the fresh surface, defined edges, and adjacent equipment for other paving work. The source note calls the work an apron and drive area rather than a sidewalk or decorative slab.',
          'The photographs do not establish section thickness, reinforcement, concrete strength, exact slopes, fuel-system clearances, inspection approvals, or traffic-opening time. Those details belong in the civil documents, site controls, delivery tickets, and closeout record.',
        ],
      },
      {
        heading: 'Coordinate concrete with an operating traffic plan',
        paragraphs: [
          'At a fuel or convenience site, the concrete crew is only one part of the sequence. The project team needs to define truck access, pump and utility protection, public separation, staging, paving tie-ins, drainage paths, and which lanes or pumps remain available. A clean surface is not enough if the work zone or transitions are unresolved.',
          'During placement, the crew must preserve the planned elevation and edge while keeping other equipment out of the finishing path. After placement, barriers and reopening controls should follow the project requirements so vehicles do not reach the slab or its edges too soon.',
        ],
      },
      {
        heading: 'Use the master article for the whole site story',
        paragraphs: [
          'The [Circle K concrete flatwork case study](/blog/circle-k-concrete-flatwork-lacy-lakeview-tx) shows the broader canopy and pump-lane context. This phase note stays focused on the fresh apron and drive area so the two URLs answer different questions instead of competing with duplicate summaries.',
          'When comparing a similar commercial bid, ask which party owns base preparation, concrete, asphalt or paving tie-ins, utility coordination, traffic control, testing, cure protection, cleanup, and final reopening. A line-item scope makes the handoffs visible before construction.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Crew floating fresh concrete in the Circle K apron and drive area',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-04-01/46c4b588-88df-4763-a45c-cb2740537b37-1w2owle.jpg',
      },
      {
        alt: 'Circle K fuel-site flatwork beside active paving equipment in Lacy Lakeview',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-04-01/a43f360c-8c37-4e38-9619-0409f1c9eda9-1n9idyd.jpg',
      },
    ],
    projectSeriesId: 'circle-k-lacy-lakeview-flatwork',
    seriesPhase: 2,
  }),
  makeRepairedPost({
    slug: 'shop-foundation-burnet-texas-9600-ft-getting-ready-to-pour-tomorrow-morning-3-am-200-yards',
    publishedAt: '2026-04-01T21:15:59.967+00:00',
    title: 'Burnet Shop Slab Pre-Pour Plan: 9,600 SF, Early Start, Large Delivery',
    seoTitle: 'Burnet 9,600 SF Shop Slab Pre-Pour Plan | SLA',
    excerpt:
      'Part one of the Burnet record: formed perimeter, nine-panel layout, compacted working surface, and the source-record plan for a 3 a.m. start and more than 200 cubic yards.',
    sourceSummary:
      'Rebuilt from SLA’s April 2026 pre-pour album. The first-party source record identifies a 9,600-square-foot Burnet shop foundation, a planned 3 a.m. start, and more than 200 cubic yards on order; the page labels those as source-record figures rather than independent ticket verification.',
    intro:
      'This is the pre-pour phase of the Burnet shop-slab series. SLA’s dated source record describes a 9,600-square-foot foundation, a planned 3 a.m. start, and more than 200 cubic yards on order. The drone photographs show the formed perimeter and a nine-panel layout before placement. Those are the facts this page can responsibly preserve.',
    sections: [
      {
        heading: 'Read the numbers as a delivery plan, not a finished ticket total',
        paragraphs: [
          '“More than 200 cubic yards” is the quantity named in the original pre-pour note. It describes what was reportedly on order before the pour; this page does not present it as a reconciled total from batch tickets. The final placed quantity, waste, returns, mix, and testing would need the actual delivery and project records.',
          'The planned 3 a.m. start is also meaningful because a large slab needs delivery capacity, crew coverage, lighting, access, and a weather window before heat and site traffic increase. The source does not state why that hour was chosen, so the page explains the coordination questions without inventing Stephen’s reason.',
        ],
      },
      {
        heading: 'What the aerial layout lets the team inspect',
        paragraphs: [
          'From above, the record shows a defined perimeter and nine primary slab panels or work areas across the building footprint. That view helps the team compare forms, diagonals, openings, elevations, and planned joints against the controlling documents before concrete hides the preparation.',
          'A photograph cannot verify compaction, reinforcement, embeds, vapor control, edge sections, plumbing, tolerances, or engineering approval. A real go-or-no-go review should assign each item to a plan, inspection, test, or named person and record unresolved issues before dispatch.',
        ],
      },
      {
        heading: 'A practical large-pour readiness list',
        paragraphs: [
          'Before a comparable placement, confirm approved dimensions and elevations, access for every truck, pump or chute position, batch-plant sequence, backup communication, crew roles, lights, weather monitoring, testing, washout, joints, cure materials, and protection from the next trade. The list should match the actual project rather than a generic slab recipe.',
          'Continue with the [Burnet finish and handoff note](/blog/finished-the-burnet-shop-foundation-9600-ft) and the [full Burnet case study](/blog/burnet-9600-sf-shop-slab-case-study) to see how the preparation connects to the completed surface.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Aerial view of the formed 9,600-square-foot Burnet shop foundation before placement',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-30/6faae80c-d30e-4944-8bd4-74cc5eaff052-6t3zf6.jpg',
      },
      {
        alt: 'Nine-panel pre-pour layout across the Burnet shop slab footprint',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-30/060587a7-e7eb-4809-b9d9-30c4621f3b34-29l53t.jpg',
      },
    ],
    projectSeriesId: 'burnet-9600-sf-shop-slab',
    seriesPhase: 1,
  }),
  makeRepairedPost({
    slug: 'mount-calm-morton-building-shop-foundation-2500-ft',
    publishedAt: '2026-04-01T21:15:31.464+00:00',
    title: 'Mount Calm 2,500-Square-Foot Shop Slab: Power-Trowel Finish',
    seoTitle: 'Mount Calm 2,500 SF Shop Slab Finish | SLA Concrete',
    excerpt:
      'A completion-phase record showing walk-behind power-trowel work, hand finishing along formed edges, and the checks needed before a shop slab moves to the building phase.',
    sourceSummary:
      'Rebuilt from SLA’s April 2026 Mount Calm photo album. The source identifies a 2,500-square-foot Morton Building shop foundation and shows walk-behind power-trowel finishing with hand work at formed edges; unshown slab specifications are not inferred.',
    intro:
      'This Mount Calm page covers the finishing phase of a 2,500-square-foot Morton Building shop foundation. The original photo record shows a walk-behind power trowel working the interior field while crew members handle the perimeter and formed edges. That division of work is the specific subject of this field note.',
    sections: [
      {
        heading: 'Machine work in the field, hand work at the edges',
        paragraphs: [
          'A power trowel can cover the broad interior efficiently, but it cannot replace the detail work where the slab meets forms, openings, corners, and other obstructions. The images show both parts of the sequence: machine passes across the open surface and attention around the perimeter.',
          'The photographs verify the visible finishing operation and the 2,500-square-foot figure stated in SLA’s source record. They do not verify base depth, reinforcement, thickness, mix design, floor tolerance, cure method, or the loads the future shop will carry.',
        ],
      },
      {
        heading: 'Finish requirements should follow the future use',
        paragraphs: [
          'A shop floor may need to support vehicles, equipment, storage, coatings, partitions, or a mix of finished and utility spaces. Those uses affect the plan long before the power trowel starts. The proposal should identify the required surface, edges, joints, embeds, and any area that needs a different texture or slope.',
          'During finishing, the crew works within the concrete’s changing set. Weather, building cover, wind, placement sequence, and mix behavior can change the timing. A useful project plan assigns crew and equipment to the actual placement instead of assuming one finishing schedule fits every slab.',
        ],
      },
      {
        heading: 'What to confirm before the building phase',
        paragraphs: [
          'Closeout should record visible finish, edge condition, planned joint work, cure and protection, form removal, and when the next trade may enter. If the building package has columns, doors, anchors, plumbing, or equipment interfaces, compare those locations with the plans before they are covered or loaded.',
          'The related [Mount Calm preparation note](/blog/mount-calm-tx-shop-foundation-concrete-prep) covers the phase before concrete. Reading the preparation and finish records together shows why a completed surface cannot be judged separately from the layout beneath it.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Walk-behind power trowel finishing the 2,500-square-foot Mount Calm shop slab',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-30/62863c29-7af6-48b1-b3a7-21ec9c69edff-1j736zw.jpg',
      },
      {
        alt: 'Hand finishing along the formed perimeter of the Mount Calm shop foundation',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-30/1e6c0fb6-2325-4047-86be-363e94100c85-uiu8fa.jpg',
      },
    ],
    projectSeriesId: 'mount-calm-shop-foundation',
    seriesPhase: 2,
  }),
  makeRepairedPost({
    slug: 'concrete-work-at-magnolia-rv-waco-texas-texas',
    publishedAt: '2026-03-24T14:23:23.443+00:00',
    title: 'Magnolia RV Pad Layout, Covered Bays, and Curved Curb Forms',
    seoTitle: 'Magnolia RV Pad Layout & Curb Forms | Waco, TX',
    excerpt:
      'A layout-phase field note on finished pads beneath metal covers, curved landscape-curb forms, surrounding grade, utilities, and the sequence between repeated bays.',
    sourceSummary:
      'Rebuilt from SLA’s March 2026 Magnolia RV photo record in Waco. The images show concrete pads beneath metal RV covers, curved wood forms for later curb work, surrounding grade, utilities, and repeated-bay sequencing; unrecorded dimensions and quantities are not added.',
    intro:
      'This Magnolia RV field note is about layout between repeated covered bays and the curved curb work beside them. SLA’s photos show completed pads beneath metal structures while wood forms outline a separate landscaped edge for a later placement. That relationship makes the page different from the pour-day and completion notes in the same series.',
    sections: [
      {
        heading: 'Fixed structures turn a repeated pad into a layout problem',
        paragraphs: [
          'The record shows metal cover columns, finished pad sections, open soil and gravel areas, utility elements, and curved forms. Every bay may look similar, but each concrete edge still has to meet the structure, access lane, surrounding grade, and next work area without creating an unsupported or awkward transition.',
          'The photographs do not supply pad dimensions, thickness, reinforcement, load design, concrete quantity, or the final landscape plan. Those requirements should come from the owner’s use, building layout, civil information, and written concrete scope.',
        ],
      },
      {
        heading: 'Curved curb work needs a separate control line',
        paragraphs: [
          'Curved forms establish a visible landscape edge and can also influence how water and vehicle movement interact with the pads. Before placement, the project team should confirm the curve, elevations, termination points, drainage path, soil or landscape backfill, and how the curb meets straight concrete.',
          'Keeping the curb phase distinct lets the crew protect finished RV pads while forming and placing the next element. It also lets an owner inspect the curve and grade before concrete makes the line permanent.',
        ],
      },
      {
        heading: 'How the Magnolia RV series is organized',
        paragraphs: [
          'The [Magnolia RV master case study](/blog/magnolia-rv-waco-concrete-pad-case-study) explains the full site context. The [pour-day note](/blog/we-re-pouring-some-rv-pads-today-at-magnolia-rv) covers delivery and finishing, while the [completion note](/blog/work-completed-today-at-magnolia-rv) focuses on protection and handoff.',
          'For a comparable covered-parking project, build one site packet showing every bay, column, utility, pad edge, access lane, drainage direction, and phase boundary. That packet makes repetitive work easier to price and much harder to misalign.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Concrete RV pads beneath metal covers with curved curb forms at Magnolia RV',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-19/640968e3-2023-493b-b30e-23593097b905-1xp15zi.jpg',
      },
      {
        alt: 'Magnolia RV pad layout around covered bays, open grade, and utilities',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-19/1a1af200-efb3-4665-a5fc-391c72edd749-9rfa26.jpg',
      },
    ],
    projectSeriesId: 'magnolia-rv-concrete-pads',
    seriesPhase: 1,
  }),
  makeRepairedPost({
    slug: 'pouring-sidewalk-city-of-waco',
    publishedAt: '2026-03-16T23:03:11.002+00:00',
    title: 'City of Waco Sidewalk Placement: Forms, Chute, and Straightedge Work',
    seoTitle: 'City of Waco Sidewalk Placement Field Note | SLA',
    excerpt:
      'A pour-day record showing wood forms, truck-chute placement, shovel distribution, straightedge work, and the public-walkway questions that plans and inspection must control.',
    sourceSummary:
      'Rebuilt from SLA’s March 2026 City of Waco sidewalk photo record. The album shows wood forms and concrete placed from a truck chute with shovel and straightedge work; it does not provide dimensions or an accessibility approval, so neither is invented.',
    intro:
      'This page documents the placement phase of a City of Waco sidewalk project. The original photographs show wood forms holding the walkway line, concrete arriving from the truck chute, and crew members distributing and striking the fresh material. The page does not turn those images into an unsupported code-compliance claim.',
    sections: [
      {
        heading: 'What happens between the chute and the finished walk',
        paragraphs: [
          'Concrete leaving the chute still has to be moved through the formed section, worked around edges and any fixed interfaces, consolidated as required by the project, and struck to the planned elevation. The photo set captures shovels and straightedge work during that active window.',
          'The record does not publish length, width, thickness, reinforcement, mix, cross slope, running slope, joint spacing, inspection result, or reopening time. Those details belong to the City plans, project specifications, field measurements, and approval record.',
        ],
      },
      {
        heading: 'Public-walkway work needs an access plan',
        paragraphs: [
          'A sidewalk project affects pedestrians before, during, and after the pour. The project team should define barriers, alternate routes, truck access, adjacent doors or drives, utility conflicts, tie-ins, cure protection, and when the route may reopen. Those responsibilities should be clear before work starts.',
          'Accessibility should be measured and reviewed against the applicable documents and authority; a smooth-looking photograph is not proof. The crew can build to the supplied lines and elevations, while the responsible designer, inspector, or owner verifies the required geometry.',
        ],
      },
      {
        heading: 'Use the phase record with the fuller article',
        paragraphs: [
          'The [City of Waco sidewalk project article](/blog/city-of-waco-sidewalk-concrete-pour) provides the broader planning context. This note stays on placement so a reader can see which tools and sequencing decisions occur while concrete is workable.',
          'When comparing a public-sidewalk proposal, look for demolition or excavation, base, forms, reinforcement, concrete specification, joints, finish, ramps or transitions, traffic and pedestrian control, inspection, cure, cleanup, and reopening responsibility as separate line items.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Concrete placed from a truck chute into City of Waco sidewalk forms',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-05/bd3fce5d-158e-4f58-a3a1-bef64ddf444a-14hw1sc.jpg',
      },
      {
        alt: 'Crew distributing and striking fresh concrete on the Waco sidewalk',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-05/c9e6bda2-ce77-42cc-b1f1-281da2f66c1d-nld0uc.jpg',
      },
    ],
    projectSeriesId: 'city-of-waco-sidewalk',
    seriesPhase: 2,
  }),
  makeRepairedPost({
    slug: 'concrete-pour-in-hewitt-texas',
    publishedAt: '2026-03-13T15:15:00.348+00:00',
    title: 'Hewitt Slab Finishing Sequence: Screed, Power Trowel, and Edges',
    seoTitle: 'Hewitt Concrete Slab Finishing Sequence | SLA',
    excerpt:
      'A photo-backed finishing note showing forms, screeding, power-trowel work, and perimeter finishing while keeping the unidentified slab use and unshown specifications explicit.',
    sourceSummary:
      'Rebuilt from SLA’s March 2026 Hewitt slab photo record. The album shows forming, screeding, power-trowel finishing, and perimeter work, but does not identify the property use or publish dimensions and specifications; the repaired page preserves that boundary.',
    intro:
      'SLA’s original Hewitt record shows a slab moving through several finishing steps, but it never identifies whether the concrete was for a shop, addition, patio, or another use. This page keeps that unknown honest and uses the photographs for what they can show well: the sequence from forms and strike-off to machine and edge finishing.',
    sections: [
      {
        heading: 'The visible sequence in the Hewitt album',
        paragraphs: [
          'The images show a formed slab, fresh concrete being brought to elevation, screed work, a power trowel on the open field, and hand attention around the perimeter. Those steps happen at different stages as the concrete loses workability and gains enough support for later finishing passes.',
          'The photos do not establish the slab’s use, dimensions, thickness, reinforcement, mix, drainage, load, joint plan, cure, or final acceptance. Rather than label it as a driveway, patio, or shop floor, the page leaves the project type unidentified until a source record can answer it.',
        ],
      },
      {
        heading: 'Why the intended use must be known before finishing',
        paragraphs: [
          'Finish choice follows function. An interior floor, covered work area, exterior walking surface, and vehicle slab can require different texture, slope, edge, joint, cure, and future-coating decisions. The crew should not have to guess those requirements while the concrete is setting.',
          'A useful pre-pour packet identifies the room or site use, controlling plans, transitions, drainage, embedded items, surface requirement, weather exposure, joint layout, cure method, and protection. That information turns a generic “smooth slab” request into a buildable finish plan.',
        ],
      },
      {
        heading: 'What a homeowner or builder can inspect',
        paragraphs: [
          'During a comparable placement, verify that the formed footprint and elevations match the documents before the truck arrives. During finishing, keep people and equipment outside the work area unless assigned. At handoff, document the visible surface, edges, joints, protection, and remaining closeout work.',
          'The [full Hewitt slab article](/blog/hewitt-tx-concrete-slab-pour-near-waco) supplies more context for the related photo set. This phase note remains useful on its own because it distinguishes a finishing sequence from claims a photograph cannot support.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Power-trowel finishing on the unidentified Hewitt concrete slab',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-05/570e0b01-242a-4f49-8eab-24604ba9a5b4-1qy2vjm.jpg',
      },
      {
        alt: 'Forms and perimeter finishing in the Hewitt slab photo record',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-05/e66f16f4-3832-4a34-b319-0f6ed706d1ca-1l1ibq4.jpg',
      },
    ],
    projectSeriesId: 'hewitt-slab-pour',
    seriesPhase: 2,
  }),
  makeRepairedPost({
    slug: 'concrete-pour-at-cameron-park-zoo',
    publishedAt: '2026-03-08T16:11:49.169+00:00',
    title: 'Cameron Park Zoo Walkway Placement: Joints, Posts, and Landscape Edges',
    seoTitle: 'Cameron Park Zoo Walkway Placement | Waco, TX',
    excerpt:
      'A focused walkway field note on the straight pedestrian run, visible joints, post and landscape interfaces, public access planning, and cure protection.',
    sourceSummary:
      'Rebuilt from SLA’s March 2026 Cameron Park Zoo photo record. The album identifies a pedestrian walkway and shows a straight concrete run, visible joints, finished edges, posts, and landscaping; dimensions, reopening approval, and accessibility compliance are not inferred.',
    intro:
      'This Cameron Park Zoo page now documents one clear phase: placing and finishing a pedestrian walkway around existing posts and landscape edges. The source photos show a straight concrete run with visible joints and defined sides. They support a useful discussion of interfaces and public access without claiming measurements the album does not contain.',
    sections: [
      {
        heading: 'Walkway details happen at the edges',
        paragraphs: [
          'The open center of a walkway is only part of the work. The photographs show posts and landscaped areas beside the concrete, which means the formed line, clearances, joints, and edge support all have to fit fixed site elements. Those interfaces are where layout conflicts often appear first.',
          'The record does not state the walkway length, width, thickness, reinforcement, slopes, concrete specification, inspection result, or opening time. It also cannot prove accessibility compliance from photographs. Those conditions require the applicable plans, measurements, and review.',
        ],
      },
      {
        heading: 'Plan around visitors, staff, and site operations',
        paragraphs: [
          'Work at a public attraction needs a route and separation plan before demolition, truck arrival, or placement. The owner and contractor should assign barriers, alternate pedestrian movement, delivery access, work hours, noise and cleanup controls, protection of landscaping, and the point when the route can reopen.',
          'The concrete scope should also identify how the new walk meets existing paths, posts, drains, curbs, soil, or planting areas. A consistent finish is valuable, but safe transitions and water movement depend on the planned elevations around it.',
        ],
      },
      {
        heading: 'A phase note, not a duplicate case study',
        paragraphs: [
          'The [full Cameron Park Zoo walkway article](/blog/cameron-park-zoo-concrete-pour-waco-tx) carries the broader project context. This page concentrates on joint, post, edge, and access questions during the placement phase so both URLs deserve to exist.',
          'For a similar public walkway bid, ask for lineal or square-foot limits, removal, base, forms, reinforcement, concrete, transitions, joints, finish, pedestrian control, inspection responsibility, cure protection, landscaping repair, and cleanup in writing.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Straight pedestrian walkway with visible joints at Cameron Park Zoo',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-05/d80ac1cf-acab-4fbe-bf0c-82e055789599-ixyh77.jpg',
      },
      {
        alt: 'Finished walkway edges beside posts and landscaping at Cameron Park Zoo',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-05/f11839a7-ab95-401b-9ddb-1074a8708a2e-hkw141.jpg',
      },
    ],
    projectSeriesId: 'cameron-park-zoo-walkway',
    seriesPhase: 2,
  }),
  makeRepairedPost({
    slug: 'parking-lot-that-we-just-poured-at-melody-grove-housing-complex-waco-texas',
    publishedAt: '2026-03-05T16:49:23.609+00:00',
    title: 'Melody Grove Parking Placement: Curbs, Bollards, and Building Edges',
    seoTitle: 'Melody Grove Parking Placement | Waco, TX | SLA',
    excerpt:
      'A placement-phase record focused on the finished parking field, curb lines, protected bollards, nearby buildings, traffic boundaries, and reopening coordination.',
    sourceSummary:
      'Rebuilt from SLA’s March 2026 Melody Grove parking photo record in Waco. The album shows a newly placed parking area, curb lines, protected bollards, adjacent buildings, and active-site cleanup; section design, quantities, approvals, and reopening times are not invented.',
    intro:
      'This Melody Grove page covers the parking-placement phase, not the whole housing project. SLA’s source photograph shows the newly finished parking field, curb geometry, wrapped or protected bollards, and nearby occupied-site edges. Those details make traffic control and interface planning the useful subject of this note.',
    sections: [
      {
        heading: 'What the completed placement photo shows',
        paragraphs: [
          'The record shows a broad finished concrete area with defined curb lines, bollards at the edge, existing buildings close to the work, and cleanup still associated with an active project. The concrete is one part of a site used by residents, visitors, deliveries, and maintenance traffic.',
          'The image cannot verify area, panel count, pavement thickness, reinforcement, concrete strength, drainage elevations, accessible-space geometry, inspection, or opening time. Those facts require plans, measurements, delivery records, and the responsible project review.',
        ],
      },
      {
        heading: 'Curbs and bollards control more than appearance',
        paragraphs: [
          'A curb sets an edge, directs vehicle movement, and can influence how water and adjacent landscaping behave. Bollards protect specific areas or equipment, but their locations and foundations should follow the project documents. The concrete crew needs those points established before placement.',
          'At a housing site, the sequence should also preserve emergency, resident, and construction access. Barriers, temporary routes, pour limits, cure protection, striping or signage handoffs, and reopening responsibility belong in the coordination plan rather than being decided after the surface is finished.',
        ],
      },
      {
        heading: 'Place this phase inside the Melody Grove series',
        paragraphs: [
          'The [Melody Grove master case study](/blog/melody-grove-waco-concrete-case-study) connects parking, sidewalks, curbs, and accessible flatwork. The [parking-lot article](/blog/melody-grove-parking-lot-concrete-pour-waco-tx) adds broader context, while this page stays with the final placement interfaces visible in the dated album.',
          'A useful commercial proposal separates base, reinforcement, paving panels, curbs, bollards, sidewalks, accessible work, drainage, testing, traffic control, cure, striping handoff, and cleanup. That separation helps an owner compare actual scope instead of total price alone.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Finished parking-area concrete with curb lines and protected bollards at Melody Grove',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-03-04/6087acf7-d92f-4bfe-9e5e-37b58e531594-1ath4dh.jpg',
      },
    ],
    projectSeriesId: 'melody-grove-concrete',
    seriesPhase: 2,
  }),
  makeRepairedPost({
    slug: 'resurface-1600-ft-of-old-concrete-in-hubbard-texas',
    publishedAt: '2026-03-02T03:35:43.164+00:00',
    title: 'Hubbard 1,600-Square-Foot Concrete Renewal: What the Record Shows',
    seoTitle: 'Hubbard 1,600 SF Concrete Renewal Field Note | SLA',
    excerpt:
      'A source-limited record of the renewed shop and carport surface, plus the substrate, repair-system, thickness, preparation, and cure questions that still define a resurfacing scope.',
    sourceSummary:
      'Rebuilt from SLA’s March 2026 Hubbard photo record. The source identifies 1,600 square feet of older concrete beneath a metal carport and beside a shop roll-up door and uses the word “resurfaced”; it does not name the repair system, product, thickness, or substrate test.',
    intro:
      'SLA’s original Hubbard note says 1,600 square feet of older concrete was “resurfaced” beneath a metal carport and beside a shop roll-up door. The completed photographs show a uniform troweled surface and defined edges. Because the source does not name the installed system, this repaired page treats “resurfaced” as the project-record wording rather than guessing whether the work was an overlay, bonded topping, replacement, or another method.',
    sections: [
      {
        heading: 'What the Hubbard photos confirm—and what they do not',
        paragraphs: [
          'The album confirms the stated Hubbard location, the 1,600-square-foot source figure, a shop and covered-carport setting, a finished concrete surface, perimeter lines, and access at a roll-up door. Those are useful site and outcome observations.',
          'The images do not reveal removal depth, substrate soundness, crack treatment, bond preparation, reinforcement, product, mix, placed thickness, moisture condition, cure, or warranty. Without those records, calling the work a specific overlay system would create a fact that the source never supplied.',
        ],
      },
      {
        heading: 'The system decision starts with the existing slab',
        paragraphs: [
          'Before choosing repair, overlay, partial replacement, or full replacement, document vertical movement, loose or delaminated areas, contamination, drainage, cracks, failed patches, edges, door elevations, and the loads the surface must carry. A cosmetic finish cannot correct an unstable base or ongoing slab movement.',
          'A useful proposal identifies the selected method, required preparation, removal and disposal, repairs, bond or interface treatment, material or concrete specification, thickness, transitions, cure, opening criteria, limits, and maintenance. If the substrate cannot support the proposed system, the estimate should say so before work begins.',
        ],
      },
      {
        heading: 'Use the fuller Hubbard article for project context',
        paragraphs: [
          'The [Hubbard shop and patio renewal article](/blog/hubbard-tx-concrete-resurfacing-shop-patio) preserves more of the connected project context. This page serves a different purpose: it shows exactly why a finished photo and the word “resurface” are not enough to compare repair systems.',
          'Owners reviewing a similar scope should ask each bidder to name what remains, what is removed, how the existing surface is tested and prepared, what is installed, where the system terminates, and which visible defects are excluded from the promised result.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Finished 1,600-square-foot concrete renewal beneath the Hubbard shop carport',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-27/2bcefc4d-7b57-4765-bf85-55cfbd1f2df9-q340ee.jpg',
      },
      {
        alt: 'Renewed concrete surface beside the Hubbard shop roll-up door',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-27/d2ded9c5-bc50-43b2-8c04-5b3def5de499-q5mjgj.jpg',
      },
    ],
    projectSeriesId: 'hubbard-concrete-renewal',
    seriesPhase: 2,
  }),
  makeRepairedPost({
    slug: 'project-update-2026-02-25',
    publishedAt: '2026-02-25T18:10:32.200+00:00',
    title: 'Finished Slab Photo Record: What Two Images Can and Cannot Confirm',
    seoTitle: 'How to Read a Finished Concrete Slab Photo Record | SLA',
    excerpt:
      'A transparent review of an unidentified two-photo slab record: visible finish and formed edges, missing project identity, and the documents needed before using photos as project proof.',
    sourceSummary:
      'Rebuilt from SLA’s February 25, 2026 post and two January 29 source images. The legacy record does not identify the job, location, use, dimensions, materials, or scope, so the repaired article is an evidence-reading guide rather than a fabricated case study.',
    intro:
      'This URL began as an unidentified project update with two slab photographs and a generic sales paragraph. The photographs are still real source material, but the record does not identify the property, city, slab use, dimensions, or construction specification. Instead of hiding the page or inventing a project, this article shows how to read finished-slab photos responsibly.',
    sections: [
      {
        heading: 'What is actually visible in the two images',
        paragraphs: [
          'The record shows a broad concrete surface, formed outer edges, and a finish that appears consistent across the photographed area. Those observations can describe the image. They do not establish level, drainage, strength, thickness, reinforcement, joint layout, base, cure, cracking performance, or long-term durability.',
          'The original text called the slab large and ready for daily use, but it supplied no scale, intended use, or handoff record. This repaired page therefore does not label it as a driveway, shop, patio, foundation, commercial slab, or code-approved installation.',
        ],
      },
      {
        heading: 'The minimum packet behind a credible project example',
        paragraphs: [
          'A useful project page should connect the photos to a privacy-safe identity, date, location, owner-approved description, actual SLA scope, dimensions, intended load or use, base and reinforcement information, concrete or material record, finish, joints, drainage, challenge, decision, result, and trade boundaries.',
          'Not every item has to be public, but the publisher should possess enough source material to verify the claims it does publish. Photo captions should say what the exact image shows rather than using numbered placeholders or borrowing a service claim from another project.',
        ],
      },
      {
        heading: 'How to use photos when comparing contractors',
        paragraphs: [
          'Ask for a wide view, preparation photos, reinforcement or embedded-item photos where relevant, placement views, finished edges and transitions, and a dated closeout image. Then ask the contractor to explain one field decision visible in the set. The explanation is often more informative than a gallery of polished final shots.',
          'Photos are evidence of a moment, not proof of every hidden requirement. Use them with a written scope, references, current insurance and business information, plans where needed, and direct questions about exclusions, change orders, inspection, cure, and who owns design decisions.',
        ],
      },
    ],
    photos: [
      {
        alt: 'First source image from the unidentified finished-slab record',
        url: 'https://db.phinehasadams.com/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-01-29/695c479d-bbff-465c-80f3-5d234f439319-pk4f0d.jpg',
      },
      {
        alt: 'Second source image showing the formed edge and finished concrete surface',
        url: 'https://db.phinehasadams.com/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-01-29/4086b13d-8069-43b9-ac73-3c099555ed73-1dob7yf.jpg',
      },
    ],
  }),
  makeRepairedPost({
    slug: 'shop-foundation-in-georgetown-texas',
    publishedAt: '2026-02-22T23:38:54.600+00:00',
    title: 'Georgetown Shop Foundation: Fresh Slab, Formed Edge, and Early Cure',
    seoTitle: 'Georgetown Shop Foundation Slab Finish | SLA Concrete',
    excerpt:
      'A finish-phase record showing the fresh shop slab, braced perimeter forms, troweled surface, early cure, and the handoff to the connected retaining-wall project.',
    sourceSummary:
      'Rebuilt from SLA’s February 2026 Georgetown shop-foundation photo record and linked multi-phase article. The source shows a fresh troweled slab with perimeter forms still in place; dimensions, steel, mix, engineering, and cure method are not inferred.',
    intro:
      'This Georgetown field note isolates the shop-slab finish phase from a larger property project that also included retaining-wall work. SLA’s source image shows fresh concrete, the building footprint held by braced forms, a troweled surface, and the slab at an early cure stage. The related master article supplies the wider job context.',
    sections: [
      {
        heading: 'Why forms still matter after the surface is finished',
        paragraphs: [
          'The photograph shows perimeter forms and bracing remaining beside the new slab. Until the concrete has reached the project’s required condition, those forms protect the edge and preserve the line established before placement. Removing or loading them is a planned step, not a visual guess.',
          'The image does not confirm shop dimensions, thickness, steel, vapor control, concrete strength, edge design, embedded items, flatness, or cure method. Those requirements belong to the building and project documents, not a caption written from the final surface.',
        ],
      },
      {
        heading: 'Coordinate the slab with retaining-wall and grade work',
        paragraphs: [
          'On a property where a shop slab and retaining wall share the construction sequence, the team should understand how building elevations, wall grade, drainage, access, and backfill relate. Each concrete element can be well finished and still create a site problem if the connecting elevations are unresolved.',
          'A written scope should identify who supplies the plans, who establishes elevations, whether work follows engineered details, which party handles excavation and backfill, how water is managed, and when later work may approach the new slab or wall.',
        ],
      },
      {
        heading: 'Follow the broader Georgetown project',
        paragraphs: [
          'The [Georgetown shop foundation and retaining-wall article](/blog/georgetown-tx-shop-foundation-concrete-retaining-wall) includes the connected slab and wall sequence. This phase note remains separate so readers can focus on finish, perimeter protection, early cure, and trade handoff.',
          'For a similar shop proposal, compare base and grade, forms, reinforcement, vapor control where specified, concrete, finish, joints, cure, building interfaces, retaining-wall responsibilities, drainage, protection, and closeout as explicit items.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Fresh Georgetown shop foundation with troweled surface and braced perimeter forms',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-13/7d3b1d9f-4feb-497b-b62f-2ed1928db297-1in5ayo.jpg',
      },
    ],
    projectSeriesId: 'georgetown-shop-and-retaining-wall',
    seriesPhase: 2,
  }),
  makeRepairedPost({
    slug: 'concrete-retaining-walls-in-resiel-texas-for-oncor-power-transfer-station',
    publishedAt: '2026-02-21T20:01:03.414+00:00',
    title: 'Riesel Retaining-Wall Progress: Footing Trenches to Finished Sections',
    seoTitle: 'Riesel Concrete Retaining-Wall Progress Record | SLA',
    excerpt:
      'A corrected Riesel field record following visible footing trenches, layout stakes, wall sections, grade, and site access while separating installation from design responsibility.',
    sourceSummary:
      'Rebuilt from SLA’s February 2026 album, whose legacy label places retaining-wall work at an electrical transfer-station site near Riesel. The photos show excavation, layout, and later wall sections; this page does not claim SLA designed the wall or publish an unverified client endorsement.',
    intro:
      'The legacy title misspelled Riesel and treated the site label as a sales claim. The repaired page uses the photo sequence for a more useful purpose: following retaining-wall work from straight footing trenches and layout stakes to later concrete wall sections. SLA’s source album labels the location as an electrical transfer-station site near Riesel; the page does not present SLA as the wall designer.',
    sections: [
      {
        heading: 'The early photos document excavation and layout',
        paragraphs: [
          'The first phase shows narrow, aligned trenches and visible layout stakes before the wall concrete is complete. That record can support the sequence and location of the footing work. It cannot verify soil bearing, footing dimensions, steel, survey, engineering, inspection, or utility clearance.',
          'At an infrastructure or utility-adjacent site, excavation limits, underground conflicts, access control, safety, plans, and inspection responsibilities should be assigned before digging. The concrete contractor installs the accepted scope; the qualified designer and owner-side team retain their stated responsibilities.',
        ],
      },
      {
        heading: 'Later images show wall progress, grade, and access',
        paragraphs: [
          'The album continues with longer concrete wall sections beside dirt grading, power-line corridors, and working access. Those images make the relationship between wall placement and the surrounding site visible, but they do not prove backfill, drainage, structural capacity, or final acceptance.',
          'Retaining-wall performance depends on the design and the completed system behind and around the concrete. A proposal should identify footing and wall plan references, steel, joints, drainage components, embeds, placement sequence, testing or inspection, backfill responsibility, protection, and limits of SLA’s work.',
        ],
      },
      {
        heading: 'Questions this sequence helps an owner ask',
        paragraphs: [
          'Before construction, ask who designed the wall, who establishes its line and elevation, who verifies excavation and steel, who supplies drainage details, who controls utility and electrical-site access, and who accepts each stage before it is covered. Those names should appear in project records.',
          'During closeout, photograph wall faces, tops, ends, joints, penetrations, adjacent grade, drainage outlets where applicable, and areas that will be hidden by backfill. A chronological photo record is most useful when it is tied to the actual plan and inspection sequence.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Straight retaining-wall footing trenches and layout stakes at the Riesel-area site',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-13/b4bf0102-6288-49e7-b454-0524aeeec62e-fon6x8.jpg',
      },
      {
        alt: 'Concrete retaining-wall section later in the Riesel-area project sequence',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-13/b6e9111a-308d-4039-a871-d2ab3bbcc3eb-a94p0o.jpg',
      },
    ],
    projectSeriesId: 'riesel-retaining-wall',
    seriesPhase: 1,
  }),
  makeRepairedPost({
    slug: 'we-re-pouring-some-rv-pads-today-at-magnolia-rv',
    publishedAt: '2026-02-21T00:49:52.291+00:00',
    title: 'Magnolia RV Pour Day: Delivery, Floating, and Pad-by-Pad Sequence',
    seoTitle: 'Magnolia RV Concrete Pad Pour Day | Waco, TX',
    excerpt:
      'A pour-day record showing the ready-mix truck, formed pad edges, hand and bull floating, active placement, and the sequencing needed across repeated RV bays.',
    sourceSummary:
      'Rebuilt from SLA’s February 2026 Magnolia RV pour-day album. The images show a concrete truck, formed pad sections, hand and bull-float work, and multiple active site areas; the record does not publish the pad count, cubic yards, mix, or opening schedule.',
    intro:
      'This Magnolia RV entry is the placement-day part of the project series. The source album shows a ready-mix truck on site, wood forms defining pad edges, crew members distributing and floating concrete, and multiple bays at different stages. It does not need a generic service pitch because the sequence itself is useful.',
    sections: [
      {
        heading: 'A repeated-pad project still needs a placement plan',
        paragraphs: [
          'The images show hand tools and a bull float working fresh concrete while nearby sections remain formed or at a different stage. Repeating the same pad shape can improve rhythm, but access, truck position, crew movement, posts, utilities, grade, and protection still need to be resolved for each placement.',
          'The source does not give the number of pads poured that day, concrete quantity, thickness, reinforcement, mix, slope, joint layout, or weather. Those facts should come from tickets, plans, measurements, and the daily report rather than a count guessed from photographs.',
        ],
      },
      {
        heading: 'Record what changes during the pour',
        paragraphs: [
          'A useful daily log notes truck sequence, start and finish times, weather, test or inspection activity, actual placement limits, delays, field changes, finish, joints, cure protection, and the area closed to traffic. That record helps the next phase begin from facts instead of memory.',
          'For vehicle pads, the owner should also know how edges meet gravel or drives, where water leaves, which loads the design addresses, and who protects the surface until opening. Those requirements are part of the site and structural plan, not something a finishing photo can certify.',
        ],
      },
      {
        heading: 'Move through the Magnolia RV series',
        paragraphs: [
          'Start with the [layout and curved-curb note](/blog/concrete-work-at-magnolia-rv-waco-texas-texas), use the [Magnolia RV master case study](/blog/magnolia-rv-waco-concrete-pad-case-study) for site context, and continue to the [completion and handoff note](/blog/work-completed-today-at-magnolia-rv).',
          'The pages now function as a real sequence: layout and interfaces, placement-day operations, then cure, protection, and handoff. Each phase answers a different planning question.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Ready-mix delivery and active RV-pad placement at Magnolia RV',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-18/7981efb0-ad70-4128-8be8-41b3d323127e-1756zlp.jpg',
      },
      {
        alt: 'Hand and bull-float work inside a formed Magnolia RV pad',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-18/0cbe23a4-c406-4df5-99b0-dd8a2e59295b-r61c0e.jpg',
      },
    ],
    projectSeriesId: 'magnolia-rv-concrete-pads',
    seriesPhase: 2,
  }),
  makeRepairedPost({
    slug: 'installing-400-feet-of-drainage-channel-in-temple',
    publishedAt: '2026-02-21T00:34:13.156+00:00',
    title: 'Temple 400-Foot Drainage Channel: Form, Steel, and Flow-Path Checks',
    seoTitle: 'Temple 400-Foot Concrete Drainage Channel | SLA',
    excerpt:
      'A focused drainage phase record showing a long narrow run, fence-line access, forms, reinforcement, adjacent slab steel, and the checks that establish a real flow path.',
    sourceSummary:
      'Rebuilt from SLA’s February 2026 Temple drainage album and linked master article. The first-party record identifies 400 feet of channel and shows forms, concrete work, a fence-line corridor, and adjacent reinforcement; slope, outlet, dimensions, and design responsibility are not inferred.',
    intro:
      'SLA’s source record identifies this Temple installation as 400 feet of drainage channel. The photographs show a long narrow work area beside a fence, channel forms and concrete, and reinforcement for adjacent slab work. That combination gives the page a real purpose: documenting how a drainage run is controlled through a constrained corridor.',
    sections: [
      {
        heading: 'Length is only one part of drainage performance',
        paragraphs: [
          'The 400-foot figure comes from the original project note. For a channel to move water, the project also needs a defined inlet, outlet, cross-section, continuous fall, transitions, capacity, adjacent grade, and maintenance access. None of those values can be verified from the published photos alone.',
          'The image record does show forms holding the channel line, reinforcement at nearby concrete, tight access beside fencing, and crew work distributed along the run. Those visible constraints affect sequence, material movement, and the points available for checking elevation.',
        ],
      },
      {
        heading: 'Use hold points before each section is covered',
        paragraphs: [
          'A practical inspection sequence can verify excavation and subgrade, form line and elevation, steel or embedded items where specified, connections, concrete placement, finish, joints, cure, and the final unobstructed path. The responsible designer or inspector should define the acceptance criteria.',
          'Long runs magnify small elevation errors, so the crew and project team need reliable control rather than judging flow by appearance. The page does not claim SLA designed the drainage system; it documents concrete work that should follow the controlling plans and project responsibilities.',
        ],
      },
      {
        heading: 'Connect the phase note to the complete Temple article',
        paragraphs: [
          'The [Temple drainage-channel article](/blog/temple-tx-concrete-drainage-channel-work) carries the broader field context. This page preserves the 400-foot source fact and turns it into a practical checklist for form, steel, access, and flow-path review.',
          'When comparing a similar scope, ask for surveyed or designed elevations, channel dimensions, excavation, base, forms, reinforcement, inlets and outlet, adjacent concrete, joints, finish, cure, inspection, erosion protection, cleanup, and maintenance handoff in writing.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Concrete drainage-channel work along the narrow Temple fence-line corridor',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-18/10bf6f17-bb3c-4505-adaa-8a16fc30e5cd-wir26n.jpg',
      },
      {
        alt: 'Forms and adjacent reinforcement in the 400-foot Temple drainage project',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-18/392fac0d-4c5f-49f7-a09d-7575eba39cba-16m603e.jpg',
      },
    ],
    projectSeriesId: 'temple-drainage-channel',
    seriesPhase: 2,
  }),
  makeRepairedPost({
    slug: 'poured-another-rv-pad-today-in-china-springs',
    publishedAt: '2026-02-21T00:33:55.170+00:00',
    title: 'China Spring RV Pad: Finished Surface, Perimeter, and Gravel Transition',
    seoTitle: 'China Spring RV Pad Finish & Edge Detail | SLA',
    excerpt:
      'A one-pad field note showing the power-troweled surface, hand-finished perimeter, visible gravel around the slab, and the edge and drainage questions a final photo cannot answer.',
    sourceSummary:
      'Rebuilt from SLA’s February 2026 China Spring RV-pad album. The source identifies one RV pad and shows a power-troweled surface, straight perimeter, hand-finished edges, and surrounding gravel; dimensions, loads, section design, and opening time are not added.',
    intro:
      'This China Spring record stays intentionally specific: one completed RV pad, a smooth power-troweled field, hand-finished perimeter lines, and gravel visible around the slab. Those photographs support a useful edge-and-transition review without turning a single pad into claims about every RV or equipment slab.',
    sections: [
      {
        heading: 'What the finished pad photograph establishes',
        paragraphs: [
          'The image shows the slab footprint, a consistent finished field, straight outer edges, and the meeting point between concrete and surrounding gravel. The source identifies the pad for RV use. That is enough to document the visible completion phase.',
          'The record does not provide length, width, thickness, reinforcement, base depth, concrete quantity, strength, slope, joint plan, vehicle weight, cure, or opening date. Those details should be selected for the actual RV, site, soil, drainage, and project documents.',
        ],
      },
      {
        heading: 'The perimeter needs support and a water plan',
        paragraphs: [
          'An RV’s tires often approach or cross the slab edge, so the transition beside the concrete matters. The project team should define compacted support, adjacent gravel or paving elevation, drainage direction, turn path, door or utility clearances, and how erosion at the edge will be controlled.',
          'A smooth field can still perform poorly if water ponds, runoff undermines an edge, or vehicle movement repeatedly loads an unsupported corner. Those risks are evaluated through site grade, base, use, and design—not by assuming the visible finish tells the whole story.',
        ],
      },
      {
        heading: 'Use the project overview for the wider planning decision',
        paragraphs: [
          'The [China Spring RV-pad project article](/blog/china-spring-rv-pad-concrete-pour-waco-tx) gives the related overview. This page remains focused on the finished surface and gravel transition so the two records do not repeat the same generic paragraph.',
          'For a comparable estimate, provide the RV or trailer use, dimensions, approach and turn path, utilities, desired pad limits, site photos, access, drainage, and any cover or building plan. Ask the proposal to state the base, concrete section, reinforcement, finish, joints, cure, edge transition, and exclusions.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Finished China Spring RV pad with a smooth field and straight perimeter',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-18/2e1939ae-4e95-4360-83bf-e85e8224c6ef-bkvl2l.jpg',
      },
      {
        alt: 'Hand-finished concrete edge meeting the surrounding gravel at the RV pad',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-18/cad3e513-acc5-497f-bb53-7e1fe59db827-1kbba8i.jpg',
      },
    ],
    projectSeriesId: 'china-spring-rv-pad',
    seriesPhase: 2,
  }),
  makeRepairedPost({
    slug: 'work-completed-today-at-magnolia-rv',
    publishedAt: '2026-02-21T00:33:53.463+00:00',
    title: 'Magnolia RV Pad Completion: Cure, Protection, and Handoff',
    seoTitle: 'Magnolia RV Pad Completion & Handoff | Waco, TX',
    excerpt:
      'The final phase of the Magnolia RV sequence, using the finished pad, trowel passes, fence and outbuilding edges to explain cure protection and owner handoff.',
    sourceSummary:
      'Rebuilt from SLA’s February 2026 Magnolia RV completion album. The images show a finished troweled pad beside a fence and outbuilding with visible perimeter work; the record does not publish final pad count, cure method, opening date, punch list, or owner acceptance.',
    intro:
      'This is the completion-and-handoff phase of the Magnolia RV pad series. The source photographs show a finished troweled surface, perimeter lines, and the pad beside a fence and outbuilding. Rather than repeating the pour-day description, this page focuses on what still has to happen after the finishing equipment leaves.',
    sections: [
      {
        heading: 'A finished appearance is not the same as an open pad',
        paragraphs: [
          'The album establishes that the visible placement reached the finishing stage. It does not state the cure method, temperature and weather record, form-removal plan, opening time, final pad count, inspection, or owner acceptance. Those closeout facts should be documented separately.',
          'Until the project’s opening criteria are met, barriers and site communication should protect the surface and edges from RVs, construction vehicles, foot traffic, stored materials, wash water, and later trades. The appropriate timing follows the concrete and project requirements, not a generic calendar promise.',
        ],
      },
      {
        heading: 'A practical handoff walk around the pad',
        paragraphs: [
          'Walk the perimeter and transitions, note visible surface and edge conditions, confirm planned joints and remaining work, check that water has a defined route, and identify any area still exposed to grading or utility work. Photograph the condition before vehicles or other crews enter.',
          'The owner and contractor should also reconcile the placed limits with the proposal, list exclusions and punch items, identify who removes forms and restores surrounding material, and provide any cure, opening, cleaning, or maintenance instructions that apply to the actual work.',
        ],
      },
      {
        heading: 'Complete the Magnolia RV sequence',
        paragraphs: [
          'Review the [layout and curved-curb note](/blog/concrete-work-at-magnolia-rv-waco-texas-texas), the [pour-day record](/blog/we-re-pouring-some-rv-pads-today-at-magnolia-rv), and the [Magnolia RV master case study](/blog/magnolia-rv-waco-concrete-pad-case-study) for the connected site story.',
          'Those pages now separate three real user questions: how the pads fit the covered bays, how placement moved through the site, and how finished concrete is protected and handed back for use.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Finished troweled Magnolia RV pad beside the fence and outbuilding',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-18/d0d1daee-67d9-4a0f-8347-c5d3252c088d-19drx9u.jpg',
      },
      {
        alt: 'Perimeter and surface condition in the Magnolia RV completion record',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-18/09c8f595-ab3f-4879-9d3b-8bd1addaaf39-14b9567.jpg',
      },
    ],
    projectSeriesId: 'magnolia-rv-concrete-pads',
    seriesPhase: 3,
  }),
  makeRepairedPost({
    slug: 'adding-handicap-parking-for-melody-grove-housing-in-waco',
    publishedAt: '2026-02-21T00:33:30.546+00:00',
    title: 'Accessible Parking Prep at Melody Grove: Forms, Base, and Rebar',
    seoTitle: 'Melody Grove Accessible Parking Prep | Waco, TX',
    excerpt:
      'A preparation-phase record showing straight wood forms, aggregate base, reinforcement, corners, tools, and the difference between concrete installation and accessibility approval.',
    sourceSummary:
      'Rebuilt from SLA’s February 2026 Melody Grove parking-prep album in Waco. The images show forms, aggregate base, reinforcement, corners, and staged tools for an area identified by the source as accessible parking; dimensions, slopes, route geometry, and compliance approval are not inferred.',
    intro:
      'The original Melody Grove note used outdated wording and implied more than the photographs could prove. This repaired page uses “accessible parking” and stays with the preparation phase: wood forms, aggregate base, reinforcement, defined corners, and tools staged before placement. It does not label the work ADA compliant without the controlling dimensions and review.',
    sections: [
      {
        heading: 'What the preparation photos verify',
        paragraphs: [
          'The album shows an area at the Melody Grove housing project being prepared for accessible parking concrete. Straight forms establish the visible limits, aggregate base fills the formed area, reinforcement is present, and corners and adjacent site features shape the layout.',
          'The images do not supply stall width, access-aisle width, slopes, curb-ramp geometry, signs, route connection, concrete thickness, steel schedule, plan approval, inspection, or final compliance. Those requirements must be measured against the applicable project documents and authority.',
        ],
      },
      {
        heading: 'Concrete scope and accessibility review are different jobs',
        paragraphs: [
          'The concrete crew can build the accepted forms, base, reinforcement, elevations, and finish shown in its proposal. The owner, designer, surveyor, inspector, or other responsible professional must supply and verify the layout and accessibility requirements for the actual site.',
          'Before placement, confirm the stall and aisle geometry, route to the building, slopes, drainage, transitions, curbs or ramps, signs and markings by others, bollards or obstructions, inspection points, and who may authorize a change. A photo of straight forms is not a substitute for those checks.',
        ],
      },
      {
        heading: 'Connect prep to the finished Melody Grove work',
        paragraphs: [
          'The [full accessible-parking article](/blog/melody-grove-handicap-parking-concrete-waco-tx) and [Melody Grove master case study](/blog/melody-grove-waco-concrete-case-study) place this preparation area inside the larger parking, sidewalk, and curb project. This page remains the before-the-pour inspection record.',
          'A comparable proposal should separate demolition or excavation, base, forms, reinforcement, concrete, finish, curb or ramp work, survey or layout, inspection, signs and striping, route tie-ins, cure, protection, cleanup, and the parties responsible for accessibility acceptance.',
        ],
      },
    ],
    photos: [
      {
        alt: 'Wood forms, aggregate base, and reinforcement for accessible parking at Melody Grove',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-20/410ab6b1-7da4-47ef-8cb6-f67dc461dfdd-1o2idy1.jpg',
      },
      {
        alt: 'Defined corners and staged prep work in the Melody Grove accessible-parking area',
        url: 'https://auyombraozsdfckobnzx.supabase.co/storage/v1/object/public/blog-images/icloud-sync/3e9943e8-1cfc-4740-be89-6037add51b69/2026-02-20/83e78be1-2251-445c-a2b6-017cb606b889-1komtwo.jpg',
      },
    ],
    projectSeriesId: 'melody-grove-concrete',
    seriesPhase: 1,
  }),
]
