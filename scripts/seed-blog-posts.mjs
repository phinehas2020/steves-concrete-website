#!/usr/bin/env node
/**
 * Seed blog posts into Supabase.
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
    title: 'How Much Does a Concrete Driveway Cost in Waco, TX? (2025 Guide)',
    excerpt:
      'A clear breakdown of concrete driveway pricing in Waco and Central Texas. Per-square-foot ranges, cost drivers, and how to plan your estimate.',
    content: `## What Drives Driveway Cost?

Concrete driveway cost in Waco depends on square footage, thickness, base prep, and finish. Standard broom-finished driveways typically run **$6–12 per square foot**. Stamped or decorative finishes run **$12–18 per square foot**.

### Typical Ranges

- **Standard broom finish:** $6–12 per sq ft  
- **Stamped or decorative:** $12–18 per sq ft  
- **Typical two-car driveway (600 sq ft):** $3,600–$10,800

### Cost Factors

1. **Square footage** — Larger driveways cost more overall but may have lower per-sq-ft rates.
2. **Base prep** — McLennan County black clay often needs deeper base work to handle expansion.
3. **Reinforcement** — Rebar or mesh adds cost but extends lifespan.
4. **Finish** — Broom is lowest; stamped, stained, or exposed aggregate cost more.
5. **Removal** — Replacing old concrete adds removal and disposal costs.

### Waco-Specific Notes

Our black clay soil expands when wet and shrinks when dry. We plan base depth, control joints, and reinforcement to minimize movement and cracking. Proper drainage and slope also affect long-term durability.

### Get a Free Estimate

Every project is different. [Request a free estimate](/contact) or call **(254) 230-3102** for a site-specific quote.

---
*Updated February 2026*`,
    status: 'published',
  },
  {
    slug: 'stamped-vs-stained-concrete-waco-patio',
    title: 'Stamped vs Stained Concrete: Which Is Right for Your Waco Patio?',
    excerpt:
      'Stamped and stained concrete both add style to patios. Here’s how they differ in look, cost, and maintenance for Central Texas homeowners.',
    content: `## Stamped vs Stained: What's the Difference?

**Stamped concrete** has patterns pressed into the surface while wet — replicating stone, brick, or slate. It’s done during the pour.

**Stained concrete** uses acid or water-based color applied to hardened concrete. It can be done on new or existing slabs.

### Stamped Concrete

- **Look:** 3D texture, stone/brick patterns  
- **Cost:** $12–18 per sq ft typically  
- **Best for:** Patios, walkways, pool decks  
- **Maintenance:** Reseal every 2–3 years  
- **Pro:** Dramatic look, lower cost than real stone  

### Stained Concrete

- **Look:** Rich, variegated color; subtle texture  
- **Cost:** $5–12 per sq ft (existing) or added to new pour  
- **Best for:** Patios, indoor floors, existing concrete  
- **Maintenance:** Reseal every 2–3 years  
- **Pro:** Works on existing slabs; many color options  

### Which Is Right for You?

- **New patio?** Either works. Stamped = more texture; stained = more color focus.
- **Existing concrete?** Staining is often the better fit.
- **Budget?** Stained on existing is usually lower cost than stamped new.
- **Texas heat?** Both need UV-resistant sealers in Central Texas.

### Get Advice

We’ve done both across Waco, Temple, and Killeen. [Contact us](/contact) or call **(254) 230-3102** for a free consultation.

---
*Updated February 2026*`,
    status: 'published',
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
    status: 'published',
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
