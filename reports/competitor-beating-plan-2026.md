# Competitor-Beating Plan: Outrank Waco Concrete & Waco Concrete Company

**Generated:** 2026-02-13 from competitor SERP and site analysis

**Competitors analyzed:** Waco Concrete Company (wacoconcretecompany.com), Waco Concrete (wacoconcrete.net), Waco Concrete Works (wacoconcreteworks.com), HomeGuide (homeguide.com)

---

## Competitor Snapshot

| Competitor | Strengths | Weaknesses |
|------------|-----------|------------|
| **Waco Concrete Company** | "#1" H1, testimonials w/ neighborhoods, phone-first, social links | Single-page focus, less service depth |
| **Waco Concrete** (.net) | 10+ service pages, 1.5K+ words each, cost FAQs, embedded Maps/YouTube | Older design, some thin internal links |
| **Waco Concrete Works** | Multiple ranking pages, 20+ directory citations | Less unique content, depends on aggregators |
| **HomeGuide** | Authority domain, listicles, FAQ blocks | We can't outrank them directly; we can rank within their list and capture branded queries |

---

## Prioritized Task List

### Priority 1: Content Depth (Weeks 1–4)

#### 1.1 Expand Service Pages
**Gap:** wacoconcrete.net has 10+ pages; we have 6. They target sub-services we don't.

| Add Page | Target Query | Est. Word Count | Content Angle |
|----------|--------------|-----------------|---------------|
| `/services/concrete-slabs` | concrete slabs, concrete slab waco | 800 | Slabs for garages, shops, pads; thickness, PSI, reinforcement |
| `/services/stained-concrete` | stained concrete waco | 600 | Acid vs water-based, colors, durability |
| `/services/concrete-sealing` | concrete sealer waco, seal concrete | 600 | When to seal, types, DIY vs pro |
| `/services/concrete-leveling` | concrete leveling waco, raise concrete driveway | 600 | Mudjacking, poly leveling, when it works |

**Implementation:** Add to `servicePages.js`, create route (already supports dynamic services). Each page needs:
- H1 with primary keyword + "Waco TX"
- 2–3 localNotes (McLennan County, black clay, etc.)
- 3–5 FAQ items with schema
- Internal links to related services and `/waco-tx-concrete-contractor`

#### 1.2 Add "Cost" FAQ Sections to Existing Service Pages
**Gap:** wacoconcrete.net answers "How much does a slab cost?" directly on homepage and service pages.

**Action:** Add a FAQ item to each service page:
- "How much does a [driveway/patio/slab] cost in Waco?"
- Answer: 2–3 sentences with a range (e.g., "Most residential driveways run $6–12 per sq ft depending on thickness and finish. Call (254) 230-3102 for a free site-specific estimate.")
- Link to the corresponding guide (`/guides/concrete-driveway-cost-waco-tx`, etc.)

**Files:** `src/data/servicePages.js` — add to each service's `faq` array.

---

### Priority 2: Reviews & Social Proof (Weeks 2–4)

#### 2.1 Collect Testimonials with Neighborhood Names
**Gap:** Waco Concrete Company uses "Burnett Ave, Waco TX", "Brook Oaks", "Sanger Heights" — strong local relevance.

**Action:**
1. Add a "Project location" or "Neighborhood" field to the testimonial data structure.
2. Update 3–5 testimonials with real Waco-area neighborhoods (Cameron Park, Baylor area, Hewitt, etc.).
3. Display neighborhood in testimonial card or subtitle.

**Example:**
```js
{
  quote: "Professional from start to finish. Our driveway looks great.",
  author: "Steve M.",
  location: "Sanger Heights, Waco",
  projectType: "Stamped driveway"
}
```

#### 2.2 Add Google Reviews Widget or Aggregate Rating Schema
**Gap:** Competitors show star ratings in SERPs.

**Action:**
- If you have Google reviews: Add `aggregateRating` to LocalBusiness schema.
- Display "X Google reviews" or star count in the hero/footer if appropriate.
- Ensure GBP (Google Business Profile) is fully optimized and reviewed regularly.

---

### Priority 3: Directory Presence (Weeks 3–6)

#### 3.1 Directory Submission Checklist
**Gap:** Waco Concrete Works has 20+ citations; we likely have fewer.

**Submit to these (NAP must be identical everywhere):**
- [ ] HomeGuide (homeguide.com) – submit as contractor
- [ ] Yelp
- [ ] Angi (formerly Angie's List)
- [ ] BBB (Better Business Bureau)
- [ ] Houzz
- [ ] BuildZoom
- [ ] Thumbtack
- [ ] Google Business Profile (claim/optimize if not already)
- [ ] Bing Places
- [ ] Apple Maps
- [ ] Yellow Pages / Superpages
- [ ] Manta
- [ ] MerchantCircle
- [ ] HotFrog
- [ ] Tuugo

**NAP Format (use consistently):**
```
Concrete Works LLC
[full street address if public]
Waco, TX 767XX
(254) 230-3102
https://www.concretewaco.com
```

---

### Priority 4: On-Page Competitive Parity (Weeks 1–2)

#### 4.1 Strengthen H1 on Homepage
**Current:** "Concrete Contractor Waco TX"  
**Competitor:** "No. 1 Licensed & Insured Residential & Commercial Concrete Contractor in Waco, TX"

**Action:** Add trust language without "No. 1" (avoid unverifiable claims). Example:
- "Licensed Concrete Contractor Waco TX" or
- "Concrete Contractor Waco TX | Licensed & Insured | 20+ Years"

#### 4.2 Add Embedded Google Map to Footer or Contact
**Gap:** wacoconcrete.net embeds Google Maps; we have geo meta but no visible map.

**Action:** Add an embedded map (Concrete Works LLC address) to the Contact section or footer. Improves local relevance and UX.

#### 4.3 Add "How much does X cost?" Section to Homepage
**Gap:** wacoconcrete.net has cost FAQ blocks on homepage.

**Action:** Add a small FAQ or "Quick answers" block on homepage:
- "How much does a concrete driveway cost in Waco?" → Link to guide
- "How much does a patio cost?" → Link to guide
- "Do you offer free estimates?" → Yes, (254) 230-3102

---

### Priority 5: Content Gaps (Weeks 4–8)

#### 5.1 Blog Posts Targeting Informational Queries
**Gap:** Blog has 2 impressions; competitors don't focus on blog, but we can own informational intent.

**Suggested posts:**
1. "How Much Does a Concrete Driveway Cost in Waco, TX? (2025 Guide)"
2. "Stamped vs Stained Concrete: Which Is Right for Your Waco Patio?"
3. "Black Clay Soil and Concrete Foundations: What Waco Homeowners Should Know"
4. "When to Repair vs Replace Your Concrete Driveway"
5. "Best Concrete Finishes for Central Texas Heat"

**Format:** 800–1,200 words, H2s with keywords, FAQ schema, internal links to services.

#### 5.2 Expand Guide Content
**Gap:** Guides have 1 impression; wacoconcrete.net has cost content on service pages.

**Action:**
- Ensure guide pages are in sitemap and internally linked from service pages.
- Add "Last updated" date.
- Consider adding a second guide per topic: e.g., "Concrete Driveway Cost Waco" (quick) and "Complete Concrete Driveway Cost Guide for Waco Homeowners" (pillar).

---

### Priority 6: Technical & Off-Page (Ongoing)

#### 6.1 Backlink Opportunities
- Local chambers of commerce (Waco, Hewitt, etc.)
- Builder/contractor associations
- Material suppliers (if they have partner pages)
- Magnolia/Baylor/community event sponsorships (if applicable)
- Local news or "best of Waco" lists

#### 6.2 GBP (Google Business Profile) Optimization
- [ ] Verify business
- [ ] Add all services with descriptions
- [ ] Add 20+ photos (projects, team, equipment)
- [ ] Post weekly (project highlight, tip, offer)
- [ ] Respond to all reviews
- [ ] Add Q&A with common questions
- [ ] Use local keywords in business description

---

## Quick Wins (Do First)

| Task | Effort | Impact |
|------|--------|--------|
| Add "How much does X cost?" FAQ to 3 service pages | 30 min | High – captures cost intent |
| Add neighborhood to 3 testimonials | 15 min | Medium – local relevance |
| Submit to HomeGuide | 20 min | High – directory traffic |
| Add embedded map to Contact | 30 min | Medium – local signals |
| Add aggregateRating to schema (if we have reviews) | 15 min | Medium – stars in SERP |

---

## Success Metrics

| Metric | Current | 3-Mo Target | 6-Mo Target |
|--------|---------|-------------|-------------|
| Position "concrete contractor waco tx" | 5.5 | 3 | 1–2 |
| Position "concrete contractors waco tx" | 7.2 | 4 | 2–3 |
| Organic clicks (monthly) | ~2 | 15 | 50+ |
| Pages in top 10 | ~5 | 10 | 15 |
| Directory citations | TBD | 10+ | 20+ |

---

## Implementation Order

1. **Week 1:** Cost FAQ on service pages, H1 tweak, embedded map
2. **Week 2:** 2 new service pages (concrete-slabs, stained-concrete), testimonial neighborhoods
3. **Week 3:** Directory submissions (HomeGuide, Yelp, Angi, BBB), aggregateRating if applicable
4. **Week 4:** 2 more service pages (concrete-sealing, concrete-leveling), first blog post
5. **Weeks 5–8:** Remaining directories, 2–3 more blog posts, guide expansion
6. **Ongoing:** GBP posts, review requests, new testimonials
