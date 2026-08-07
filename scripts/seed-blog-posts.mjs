#!/usr/bin/env node
/**
 * Seed legacy blog examples into Supabase as needs-facts drafts.
 * Run with: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-blog-posts.mjs
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const posts = [
  {
    slug: 'concrete-driveway-cost-waco-tx-2025',
    title: 'Concrete Driveway Estimate Factors in Waco, TX',
    excerpt:
      'A needs-facts draft covering the inputs that belong in a Waco driveway estimate. No planning range is approved until recent SLA scopes are reviewed.',
    content: `## What Drives Driveway Cost?

Concrete driveway pricing depends on the measured footprint and the work included in the written scope.

### Scope Items to Compare

- Existing-concrete removal and disposal
- Excavation, base correction, and drainage
- Thickness, reinforcement, joints, and edge details
- Access, placement, finish, cure, and cleanup

### Cost Factors

1. **Square footage** — Larger driveways cost more overall but may have lower per-sq-ft rates.
2. **Base prep** — Existing support, fill, moisture, drainage, and responsible design inputs can change the work.
3. **Reinforcement** — The estimate should state what is included and the design source.
4. **Finish** — Each finish adds different product, timing, traction, cleaning, and maintenance requirements.
5. **Removal** — Replacing old concrete adds removal and disposal costs.

### Waco-Specific Notes

Expansive clay, moisture changes, drainage, support, loads, joints, placement, and curing can affect performance. The actual project scope should state how those conditions are addressed without promising crack-free concrete.

### Get a Free Estimate

Every project is different. [Request a free estimate](/contact) or call **(254) 230-3102** for a site-specific quote.

---
*Needs source review before SEO approval*`,
    status: 'draft',
    seo_status: 'needs_facts',
  },
  {
    slug: 'stamped-vs-stained-concrete-waco-patio',
    title: 'Stamped vs Stained Concrete: Which Is Right for Your Waco Patio?',
    excerpt:
      'A needs-facts comparison checklist for pattern, color, slab condition, product, traction, and maintenance. Product and project claims require source review.',
    content: `## Stamped vs Stained: What's the Difference?

**Stamped concrete** has patterns pressed into the surface while wet — replicating stone, brick, or slate. It’s done during the pour.

**Stained concrete** uses a selected color system on a prepared slab. Existing condition and a test area affect whether the proposed system is suitable.

### Stamped Concrete

- **Look:** 3D texture, stone/brick patterns  
- **Scope:** Base slab, pattern, color, release, washing, sealer, traction, cure, and maintenance
- **Evidence needed:** Named products, a real SLA project, field photos, and reviewed results

### Stained Concrete

- **Look:** Rich, variegated color; subtle texture  
- **Scope:** Slab review, preparation, test area, named stain and sealer, traction, cure, and maintenance
- **Evidence needed:** Named products, a real SLA project, before-and-after photos, and reviewed results

### Which Is Right for You?

- **New slab?** Compare the entire slab and finish scope, not just the decorative layer.
- **Existing concrete?** Record condition, repairs, coatings, contamination, moisture, and test results first.
- **Wet exposure?** Put traction and cleaning requirements in writing.
- **Maintenance?** Follow the selected manufacturer and observed wear rather than one site-wide interval.

### Get Advice

This draft does not claim a completed stain or stamped project in a specific city. Add only source-reviewed SLA records, products, captions, and Stephen’s field note before approval.

---
*Needs source review before SEO approval*`,
    status: 'draft',
    seo_status: 'needs_facts',
  },
  {
    slug: 'black-clay-soil-concrete-foundations-waco',
    title: 'Black Clay Soil and Concrete Foundations: What Waco Homeowners Should Know',
    excerpt:
      'Central Texas black clay expands and contracts with moisture. Here’s how we design concrete for our soil and climate.',
    content: `## Why Waco Soil Is Tricky for Concrete

McLennan County sits on **black clay** (also called expansive clay). It expands when wet and shrinks when dry. That movement puts stress on concrete slabs — and it’s a main cause of cracking here.

### How We Compensate

1. **Deeper base** — More compacted fill under the slab to spread load.
2. **Control joints** — Cut at the right spacing so cracks occur in planned places.
3. **Reinforcement** — Rebar or mesh to hold the slab together under stress.
4. **Drainage** — Proper slope and drainage keep water away from the slab.
5. **Curing** — In summer, curing compounds slow rapid moisture loss.

### Foundations vs Flatwork

- **Foundations** — We follow local codes for depth, steel, and vapor barriers.
- **Driveways & patios** — We plan thickness, joints, and reinforcement for our soil.

### No Guarantee Against Cracks

No contractor can fully prevent cracks in expansive soil. We design to minimize them and place joints so any cracking looks intentional and stays manageable.

### Questions?

[Request a free estimate](/contact) or call **(254) 230-3102**. We’ll walk the site and explain exactly how we’d approach your project.

---
*Updated February 2026*`,
    status: 'draft',
    seo_status: 'needs_facts',
  },
]

async function run() {
  for (const post of posts) {
    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(
        {
          ...post,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select('id, slug, title')
      .single()

    if (error) {
      console.error(`Failed to upsert ${post.slug}:`, error.message)
    } else {
      console.log(`✓ ${post.slug}: ${post.title}`)
    }
  }
}

run()
