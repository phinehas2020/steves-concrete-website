const concreteAndSpecialistScopes = [
  {
    title: 'Concrete-base planning and construction',
    description:
      'SLA can evaluate and, when accepted in the proposal, quote site preparation, base, forming, reinforcement, slab placement, joints, drainage, concrete repair, or replacement.',
  },
  {
    title: 'Court-surface system and game lines',
    description:
      'A court-surface specialist should define coating compatibility, surface preparation, texture, colors, game-line layout, cure requirements, and play-surface acceptance.',
  },
  {
    title: 'Design and supporting trades',
    description:
      'The project team assigns surveying, engineering, permits, accessibility, fencing, lighting, electrical, net systems, equipment, shade, and other non-concrete work.',
  },
  {
    title: 'One coordinated scope sheet',
    description:
      'Before scheduling, the proposal should identify the controlling plans, accepted concrete work, owner responsibilities, specialist handoffs, exclusions, and travel terms.',
  },
]

const baseEstimateProcess = [
  {
    title: 'Choose the starting condition',
    description:
      'Tell us whether this is undeveloped ground, a new prepared site, or an existing slab. Existing concrete needs wide photos plus close views of cracks, joints, edges, patches, and low spots.',
  },
  {
    title: 'Send a usable site packet',
    description:
      'Include the address, intended sport and use, approximate footprint, access route, drainage concerns, target timing, photos, and any survey, layout, engineering, or surface-system requirements already available.',
  },
  {
    title: 'Resolve design and trade handoffs',
    description:
      'The court designer or surface specialist supplies the requirements that affect the slab. SLA then identifies the concrete work it can price and the information still needed from other parties.',
  },
  {
    title: 'Review a written concrete scope',
    description:
      'The estimate should state dimensions or plan references, preparation, concrete work, drainage responsibilities, finish and cure expectations, access, exclusions, travel, and the handoff to the surface specialist.',
  },
]

const sharedFaq = {
  coating: {
    question: 'Can SLA include coating and game-line striping in the concrete estimate?',
    answer:
      'Do not assume those items are included. SLA prices the accepted concrete scope. Coating, game-line layout, and play-surface approval should be assigned to a named court-surface specialist unless a written proposal explicitly states otherwise.',
  },
  estimate: {
    question: 'What is the fastest way to get a useful estimate review?',
    answer:
      'Send the address, intended sport, approximate dimensions, site or slab photos, access information, drainage concerns, target timing, and any plans or surface-system requirements. That is enough to identify the next missing decision without pretending photos are a final site assessment.',
  },
}

export const sportsCourtAreaPages = [
  {
    slug: 'texas',
    areaName: 'Texas',
    indexable: true,
    evidenceStatus: 'indexable_planning_resource',
    pagePurpose: 'texas_coverage_logistics_and_travel_decision_guide',
    badge: 'Texas coverage & logistics guide',
    heroTitle: 'Texas Sports-Court Concrete Planning & Travel Review',
    heroSubtitle:
      'Use this guide to decide whether a Waco-based concrete crew, a local concrete contractor, and a separate court-surface specialist make sense for your site.',
    seoTitle: 'Texas Sports-Court Concrete Planning & Travel Guide | SLA',
    seoDescription:
      'Plan a Texas sports-court concrete base: compare travel fit, site access, slab requirements, specialist handoffs, permit inputs, and the details needed for a usable estimate.',
    intro:
      'SLA Concrete Works is based in Waco and reviews out-of-area concrete projects case by case. The useful first decision is not simply “Do you travel?” It is whether the footprint, access, schedule, design readiness, and concrete scope support a coordinated placement from this distance.',
    scopeTitle: 'Build the project team around the slab requirements',
    scopeIntro:
      'A durable court starts with a clear division of responsibility. The court designer or surface specialist defines what the finished playing system needs; the concrete proposal translates those requirements into an accepted base scope.',
    services: concreteAndSpecialistScopes,
    process: baseEstimateProcess,
    availability: {
      title: 'How SLA screens a Texas travel request',
      paragraphs: [
        'Projects farther from Waco need enough defined scope to evaluate crew travel, concrete-placement timing, equipment, lodging if applicable, site access, and coordination with local trades. A clear plan makes that decision faster.',
        'If mobilizing SLA is not practical, this checklist is still useful: it can help an owner compare a local concrete quote against the surface specialist’s actual slab requirements.',
      ],
    },
    coverageTitle: 'Texas travel go/no-go questions',
    coverageIntro:
      'Answer these before comparing bids. They reveal whether the project is ready to price and whether travel is likely to add value.',
    coveragePoints: [
      'Is the site address, intended sport, approximate footprint, and new-versus-existing condition known?',
      'Can concrete trucks, pumps if needed, finishing equipment, and crew vehicles reach and stage at the work area?',
      'Has a court designer or surface specialist supplied slope, finish, cure, joint, moisture, and coating-acceptance requirements?',
      'Are permits, accessibility review, utilities, drainage design, fencing, lighting, and equipment assigned to specific parties?',
      'Is the concrete scope large and defined enough to compare local pricing with Waco-based mobilization?',
    ],
    localFocus: [
      {
        title: 'New base or existing slab?',
        description:
          'New construction starts with layout, grade, drainage, base, and placement requirements. An existing slab starts with movement, ponding, patch, joint, and surface-condition questions before any coating handoff.',
      },
      {
        title: 'Local support still matters',
        description:
          'Long-distance concrete work may require local material coordination, testing, inspections, specialty trades, or follow-up. Assign those responsibilities before treating a travel quote as complete.',
      },
      {
        title: 'Public and commercial sites need an owner-side plan',
        description:
          'The owner or designer should confirm local permits and Texas accessibility obligations for the actual facility and scope. Concrete pricing does not replace that review.',
      },
    ],
    decisionGuide: {
      title: 'Choose the right delivery model',
      intro:
        'There are three workable ways to organize a Texas court base. Pick the one that keeps design authority and field responsibility clear.',
      items: [
        {
          title: 'Waco-area project',
          description:
            'Start with SLA’s concrete feasibility review, then connect the accepted slab scope to the owner’s court designer or surface specialist.',
        },
        {
          title: 'Out-of-area project with a defined concrete package',
          description:
            'Send the plan set, specifications, footprint, access, schedule, and local coordination plan so SLA can make a case-by-case travel decision.',
        },
        {
          title: 'Out-of-area project still in concept stage',
          description:
            'Select the court designer or surface specialist first, establish the base requirements, then compare a qualified local concrete contractor with the cost and logistics of travel.',
        },
      ],
    },
    checklistTitle: 'Texas estimate-readiness checklist',
    checklistIntro: 'A useful concrete review starts when these items are known or deliberately assigned.',
    decisionChecklist: [
      'Project address and owner contact',
      'Sport, level of play, and approximate outside dimensions',
      'New construction, replacement, repair, or uncertain condition',
      'Photos of the site, access route, drainage path, and existing defects',
      'Court-surface system requirements or the specialist responsible for providing them',
      'Survey, civil, structural, accessibility, permit, and inspection responsibilities',
      'Target construction window and constraints on deliveries, noise, or facility access',
    ],
    officialResources: [
      {
        label: 'Texas Architectural Barriers program',
        href: 'https://www.tdlr.texas.gov/AB/index.htm',
        description:
          'Official TDLR information for owners and designers evaluating Texas accessibility requirements.',
      },
    ],
    faq: [
      {
        question: 'Does SLA automatically travel anywhere in Texas?',
        answer:
          'No blanket radius is promised. Out-of-area work is reviewed using the location, concrete scope, footprint, access, schedule, placement logistics, and specialist coordination. Those details determine whether travel is practical.',
      },
      sharedFaq.coating,
      sharedFaq.estimate,
    ],
  },
  {
    slug: 'dallas-tx',
    areaName: 'Dallas, TX',
    indexable: true,
    evidenceStatus: 'indexable_planning_resource',
    pagePurpose: 'dallas_urban_access_mobilization_and_permit_readiness',
    badge: 'Dallas site-readiness guide',
    heroTitle: 'Dallas Sports-Court Concrete Base Planning',
    heroSubtitle:
      'Turn a Dallas court concept into a bid-ready concrete package by resolving access, staging, design, drainage, permits, and the surface-specialist handoff before mobilization.',
    seoTitle: 'Dallas Sports-Court Concrete Base Planning | SLA Concrete Works',
    seoDescription:
      'Plan a Dallas sports-court concrete base with a practical checklist for site access, staging, slab specifications, permit inputs, specialist handoffs, and travel review.',
    intro:
      'For a Dallas inquiry, the biggest early risk is often not the final color—it is whether the site can support demolition or grading, concrete deliveries, equipment, finishing access, drainage work, and a clean handoff to the court-surface crew. SLA reviews the concrete portion from Waco when the project facts support a useful estimate.',
    scopeTitle: 'Create a bid package that survives mobilization day',
    scopeIntro:
      'The concrete crew needs buildable site information, while the court specialist needs a base that matches its system. Connecting those two scopes before pricing avoids gaps that become expensive after trucks and crews are scheduled.',
    services: concreteAndSpecialistScopes,
    process: [
      {
        title: 'Map the footprint and delivery path',
        description:
          'Show the proposed court, property lines if available, gates, overhead conflicts, truck route, pump or buggy path, staging area, washout plan, and areas that must remain open.',
      },
      {
        title: 'Resolve owner-side reviews',
        description:
          'The owner or design team confirms zoning, permits, accessibility, drainage, utilities, neighborhood or facility restrictions, and any required construction documents with the applicable authorities.',
      },
      {
        title: 'Lock the slab acceptance criteria',
        description:
          'Have the court designer or surface specialist identify the required dimensions, slope, drainage, finish profile, joints, cure, moisture limits, and time before surface work.',
      },
      {
        title: 'Price concrete and travel as one mobilization plan',
        description:
          'SLA reviews the accepted concrete work, crew and equipment access, placement sequence, schedule, local coordination, travel terms, and exclusions in writing.',
      },
    ],
    availability: {
      title: 'What makes a Dallas inquiry quotable',
      paragraphs: [
        'A street address, aerial or site plan, approximate footprint, access photos, intended use, target timing, and selected surface specialist usually reveal the next step quickly.',
        'A Waco-based crew is considered case by case. Project size alone does not decide fit; constrained access, multiple mobilizations, uncertain design, and incomplete handoffs can matter just as much.',
      ],
    },
    coverageTitle: 'Dallas mobilization worksheet',
    coverageIntro:
      'Walk the site with these questions before requesting a concrete number. Each unresolved item can change equipment, sequence, labor, or the usable placement window.',
    coveragePoints: [
      'Where can concrete trucks queue without blocking required access, and is a pump or buggy path needed?',
      'What must be removed, relocated, protected, or kept operational during demolition and placement?',
      'Where does water leave the finished slab, and who owns drainage design beyond the concrete edge?',
      'Are the court footprint, surface-system requirements, utilities, permits, and inspection points documented?',
      'Can the slab be placed in the planned sequence while preserving the specialist’s slope, joint, finish, and cure requirements?',
    ],
    localFocus: [
      {
        title: 'Access is a pricing input',
        description:
          'Gate width, overhead clearance, truck staging, pump reach, haul-off route, washout, and facility operating hours affect the placement plan. Show them in the first site packet.',
      },
      {
        title: 'Existing paving changes the sequence',
        description:
          'Identify demolition limits, buried utilities, tie-ins, curb or drive-approach impacts, and the route for debris and replacement materials before asking for a firm schedule.',
      },
      {
        title: 'Design review belongs ahead of the pour',
        description:
          'Commercial, school, HOA, park, and shared-use facilities may have owner, city, accessibility, or consultant requirements. The responsible design team should resolve them before concrete dimensions are frozen.',
      },
    ],
    decisionGuide: {
      title: 'Is the Dallas site ready for a concrete visit?',
      intro: 'Use these three gates. If one is missing, the next call should solve that gap rather than force a premature bid.',
      items: [
        {
          title: 'Site gate',
          description:
            'The work area, truck route, staging, demolition, utilities, drainage path, and facility constraints are visible in photos or a plan.',
        },
        {
          title: 'Design gate',
          description:
            'The intended sport, footprint, base requirements, surface system, permits, and accessibility responsibilities have named decision-makers.',
        },
        {
          title: 'Mobilization gate',
          description:
            'The concrete scope, placement sequence, target window, local coordination, travel terms, and exclusions are specific enough to price in writing.',
        },
      ],
    },
    checklistTitle: 'Dallas pre-estimate site packet',
    checklistIntro: 'Send one organized packet instead of a trail of disconnected photos and text messages.',
    decisionChecklist: [
      'Address, site contact, and best access point',
      'Aerial or plan with footprint and approximate dimensions marked',
      'Gate, drive, staging, overhead-clearance, and work-area photos',
      'Existing slab, pavement, structures, drainage, and demolition limits',
      'Surface specialist’s slab and cure requirements',
      'Known permit, zoning, accessibility, inspection, HOA, school, or facility approvals',
      'Target work window and areas that must remain open',
    ],
    officialResources: [
      {
        label: 'City of Dallas Permit Center',
        href: 'https://dallascityhall.com/departments/sustainabledevelopment/strategic_business_unit/Pages/permit-center.aspx',
        description:
          'Official Dallas starting point for permit, plan-review, zoning, and development questions.',
      },
      {
        label: 'Texas Architectural Barriers program',
        href: 'https://www.tdlr.texas.gov/AB/index.htm',
        description:
          'Official state information for owners and designers evaluating Texas accessibility requirements.',
      },
    ],
    faq: [
      {
        question: 'Will SLA review a Dallas project before the court design is complete?',
        answer:
          'Yes, as a feasibility conversation. A firm concrete proposal needs the decisions that control the slab: footprint, access, drainage responsibility, base requirements, finish, joints, cure, and specialist handoff.',
      },
      {
        question: 'Who determines whether a Dallas permit or accessibility review is required?',
        answer:
          'The property owner and design team should confirm requirements for the actual address, use, ownership, funding, and scope with the City of Dallas and applicable state authorities. SLA’s concrete estimate does not replace that determination.',
      },
      sharedFaq.coating,
      sharedFaq.estimate,
    ],
  },
  {
    slug: 'fort-worth-tx',
    areaName: 'Fort Worth, TX',
    indexable: true,
    evidenceStatus: 'indexable_planning_resource',
    pagePurpose: 'fort_worth_existing_slab_repair_replacement_and_drainage_planning',
    badge: 'Fort Worth slab decision guide',
    heroTitle: 'Fort Worth Court Slab Evaluation & Concrete-Base Planning',
    heroSubtitle:
      'Decide whether an existing slab needs repair, replacement, drainage correction, or specialist testing—and organize a buildable plan for new concrete when replacement is the better path.',
    seoTitle: 'Fort Worth Court Slab & Concrete-Base Planning | SLA',
    seoDescription:
      'Evaluate a Fort Worth sports-court slab for repair, replacement, drainage, or a new concrete base, with clear court-specialist and travel handoffs.',
    intro:
      'Existing-court projects fail when a cosmetic scope is chosen before the slab problem is understood. For Fort Worth inquiries, SLA starts the concrete conversation with movement, ponding, patches, joints, edges, drainage, access, and demolition—not with a promise that every slab can be coated.',
    scopeTitle: 'Separate the concrete condition from the finish decision',
    scopeIntro:
      'SLA evaluates potential concrete repair, replacement, or new-base work. The court-surface specialist determines whether the resulting substrate can accept its system and what preparation, testing, cure, and opening criteria apply.',
    services: concreteAndSpecialistScopes,
    process: [
      {
        title: 'Document the entire slab',
        description:
          'Send wide views in both directions, then close photos of cracks, joints, patches, edges, drains, low spots, transitions, and areas where water or debris collects.',
      },
      {
        title: 'Sort defects by likely decision',
        description:
          'Stable isolated damage may support a repair discussion. Repeated movement, broad settlement, heaving, failed patches, weak edges, or persistent drainage problems can move the conversation toward replacement or professional evaluation.',
      },
      {
        title: 'Get surface-system acceptance criteria',
        description:
          'Before finalizing concrete work, the court specialist should state its requirements for crack treatment, flatness or slope, finish profile, joints, moisture, cure, and time before coating.',
      },
      {
        title: 'Plan access, removal, drainage, and travel',
        description:
          'The written scope identifies demolition and haul-off, site access, base and concrete work, drainage responsibility, inspections, surface handoff, mobilization, travel, and exclusions.',
      },
    ],
    availability: {
      title: 'How Fort Worth project review works',
      paragraphs: [
        'Start remotely with an address, marked dimensions, a full photo set, defect history if known, access, drainage behavior, intended sport, target timing, and any surface-system documents.',
        'SLA is based in Waco, so a Fort Worth visit or concrete proposal is confirmed case by case after the information shows what field decision is needed and whether the concrete scope supports travel.',
      ],
    },
    coverageTitle: 'Repair, replace, or build new?',
    coverageIntro:
      'This is a screening tool, not a remote diagnosis. It helps send the project to the right next step before money is committed to cosmetic work.',
    coveragePoints: [
      'Repair conversation: isolated damage, limited movement indicators, workable drainage, and a surface specialist willing to evaluate the repaired substrate.',
      'Replacement conversation: widespread displacement, recurring failed patches, extensive edge failure, base loss, or geometry that cannot support the intended layout.',
      'Drainage-first conversation: standing water, runoff crossing the slab, erosion at edges, or surrounding grades that keep reintroducing moisture and support problems.',
      'Specialist-testing conversation: concrete appears stable but coating compatibility, moisture, profile, crack treatment, or existing product layers remain uncertain.',
      'New-base conversation: the site and layout are changing enough that grade, drainage, access, base, and the complete slab package should be planned together.',
    ],
    localFocus: [
      {
        title: 'Photos show symptoms, not hidden support',
        description:
          'A remote review can identify questions and obvious defects. It cannot verify subsurface support, active movement, moisture, or coating compatibility without the field review or testing appropriate to the decision.',
      },
      {
        title: 'Drainage can control the repair decision',
        description:
          'Map where water enters, crosses, ponds beside, and leaves the slab. A repair plan that ignores the surrounding water path can leave the same stress in place.',
      },
      {
        title: 'Right-of-way impacts are a separate workstream',
        description:
          'If access or construction affects sidewalks, curb ramps, drive approaches, curb and gutter, alleys, or temporary lane use, the owner or design team should check Fort Worth’s current requirements before scheduling.',
      },
    ],
    decisionGuide: {
      title: 'Match the symptom to the next investigation',
      intro: 'Use the pattern—not a single crack—to decide who needs to look next.',
      items: [
        {
          title: 'Movement pattern',
          description:
            'Record crack width changes if known, vertical displacement, rocking panels, heaving, settlement, and whether prior patches have reopened.',
        },
        {
          title: 'Water pattern',
          description:
            'Photograph the slab after rain when safe, mark ponding and runoff, and show drains, downspouts, surrounding grade, eroded edges, and discharge paths.',
        },
        {
          title: 'Surface-system pattern',
          description:
            'Identify existing coatings or repairs and ask the selected court specialist what testing, removal, repair, profile, moisture, and cure conditions it will accept.',
        },
      ],
    },
    checklistTitle: 'Fort Worth slab-evaluation packet',
    checklistIntro: 'A consistent photo and fact set makes repair-versus-replacement conversations more useful.',
    decisionChecklist: [
      'Address, approximate slab age if known, intended sport, and use level',
      'Overall dimensions and wide photos from every side',
      'Close photos with scale at cracks, vertical offsets, patches, joints, edges, and drains',
      'Notes on ponding, runoff, erosion, prior repairs, and whether defects appear to change',
      'Access route, demolition path, staging area, overhead limits, and areas that must remain open',
      'Existing coating information and the selected specialist’s acceptance requirements',
      'Known permit, inspection, accessibility, right-of-way, or facility approvals',
    ],
    officialResources: [
      {
        label: 'Fort Worth Development Services',
        href: 'https://www.fortworthtexas.gov/departments/development-services',
        description:
          'Official permit-assist, zoning, development, inspection, and application resources for project-specific review.',
      },
      {
        label: 'Fort Worth Infrastructure and parkway guidance',
        href: 'https://www.fortworthtexas.gov/departments/development-services/infrastructure-division',
        description:
          'Official guidance for work that may affect sidewalks, curbs, drive approaches, alleys, or other parkway areas.',
      },
    ],
    faq: [
      {
        question: 'Can photos determine whether my Fort Worth slab should be repaired or replaced?',
        answer:
          'Photos can organize the first review and reveal visible patterns, but they do not prove subsurface support, active movement, moisture, or coating compatibility. The next step may be an SLA site review, court-specialist testing, engineering input, or a written repair or replacement scope depending on the symptoms.',
      },
      {
        question: 'Should I hire the coating specialist before repairing the slab?',
        answer:
          'It is useful to identify the specialist and its substrate requirements before finalizing repairs. That lets the concrete scope address the defects it can reasonably correct while the specialist retains responsibility for accepting the substrate and installing the surface system.',
      },
      sharedFaq.coating,
      sharedFaq.estimate,
    ],
  },
]

export const sportsCourtAreaLinks = sportsCourtAreaPages.map((page) => ({
  slug: page.slug,
  areaName: page.areaName,
  href: `/sports-court-coating/${page.slug}`,
  label: `${page.areaName} sports-court planning guide`,
}))
