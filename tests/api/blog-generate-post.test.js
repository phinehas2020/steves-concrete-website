import test from 'node:test'
import assert from 'node:assert/strict'

import {
  DEFAULT_BLOG_SYSTEM_PROMPT,
  buildGeneratedContent,
  containsLegacyBlogFormulaPrompt,
  evaluateBlogGenerationEvidence,
  generateBlogPostFromPhotoSelection,
  sanitizeAiParagraph,
} from '../../api/blog-generate-post.js'
import { renderBlogMarkdown } from '../../src/lib/blogMarkdown.js'

test('sanitizeAiParagraph coerces AI output to plain text', () => {
  const paragraph = sanitizeAiParagraph(
    'A clean <img src=x onerror=alert(1)> [driveway](javascript:alert(1)) update for #Waco -- homeowners'
  )

  assert.equal(paragraph, 'A clean driveway update for Waco homeowners.')
})

test('buildGeneratedContent strips unsafe markdown inputs before storing', () => {
  const content = buildGeneratedContent({
    title: 'Driveway update',
    introParagraph: '<script>alert(1)</script> Fresh patio work in Waco',
    photos: [
      {
        image_url: 'javascript:alert(1)',
        alt_text: 'Bad one',
        source_caption: '',
      },
      {
        image_url: 'https://example.com/photo(1).jpg',
        alt_text: 'Before [after](javascript:alert(1))',
        source_caption: '',
      },
    ],
  })

  assert.equal(
    content,
    'Fresh patio work in Waco.\n\n![Before after](https://example.com/photo%281%29.jpg)'
  )
})

test('evidence prompt has no fixed word count, exact-match phrase, or free-estimate instruction', () => {
  assert.equal(containsLegacyBlogFormulaPrompt(DEFAULT_BLOG_SYSTEM_PROMPT), false)
  assert.equal(
    containsLegacyBlogFormulaPrompt(
      'Return exactly one paragraph between 90 and 130 words and include concrete contractor Waco TX plus a free estimate.'
    ),
    true
  )
})

test('review status requires a source packet, Stephen observation, three facts, and real captions', () => {
  const missingEvidence = evaluateBlogGenerationEvidence({
    title: 'Project Update 2026-08-07',
    body: { seoStatus: 'approved' },
    photos: [{ alt_text: 'Project photo 1' }],
  })

  assert.equal(missingEvidence.seoStatus, 'needs_facts')
  assert.deepEqual(missingEvidence.missingReviewEvidence, [
    'job/source packet ID',
    "Stephen's first-hand observation",
    'three verified facts unique to this job',
    'a useful job-specific caption for every selected photo',
    'a job-specific title',
  ])

  const reviewEvidence = evaluateBlogGenerationEvidence({
    title: 'Burnet shop foundation pre-pour setup',
    body: {
      prompt: JSON.stringify({
        schema: 'sla_blog_source_packet_v1',
        requestedSeoStatus: 'review',
        sourcePacketId: 'JOB-204 / tickets 18-21',
        stephenObservation: 'Stephen moved the first truck window earlier to keep the placement continuous.',
        uniqueFacts: [
          'The field record dates the prep photos to June 18.',
          'The pour tickets list four placements.',
          'The plan set identifies the pictured area as the shop slab.',
        ],
      }),
    },
    photos: [
      { source_caption: 'Crew checking embed locations against the shop plan before the pour' },
      { alt_text: 'Reinforcement and forms at the east slab edge before concrete placement' },
    ],
  })

  assert.equal(reviewEvidence.seoStatus, 'review')
  assert.deepEqual(reviewEvidence.missingReviewEvidence, [])
  assert.match(reviewEvidence.sourceNotes, /JOB-204/)
  assert.match(reviewEvidence.sourceNotes, /Stephen field observation/)
})

test('uncaptioned draft images are marked as needing context, not generic project proof', () => {
  const content = buildGeneratedContent({
    title: 'Untitled field draft',
    introParagraph: 'Draft needs field verification.',
    photos: [{ image_url: 'https://example.com/uncaptioned.jpg' }],
  })

  assert.match(content, /Uncaptioned field photo - add job-specific context before review/)
  assert.doesNotMatch(content, /Project photo \d+/i)
})

test('generated blog records stay draft and cannot accept an approved SEO state', async () => {
  const photos = [
    {
      id: 'photo-1',
      image_url: 'https://example.com/shop-slab.jpg',
      source_caption: 'Forms and reinforcement at the east edge of the Burnet shop slab',
      alt_text: '',
      source_taken_at: '2026-06-18T12:00:00.000Z',
      source_batch_key: 'burnet-shop',
    },
  ]
  let insertedPost = null
  let insertedPhotoLinks = null

  const supabase = {
    from(table) {
      if (table === 'blog_photos') {
        return {
          select() {
            return this
          },
          async in() {
            return { data: photos, error: null }
          },
        }
      }

      if (table === 'blog_posts') {
        return {
          select() {
            return {
              eq() {
                return {
                  async maybeSingle() {
                    return { data: null, error: null }
                  },
                }
              },
            }
          },
          insert(payload) {
            insertedPost = payload
            return {
              select() {
                return {
                  async single() {
                    return { data: { id: 'post-1', ...payload }, error: null }
                  },
                }
              },
            }
          },
        }
      }

      if (table === 'blog_post_photos') {
        return {
          async insert(payload) {
            insertedPhotoLinks = payload
            return { error: null }
          },
        }
      }

      throw new Error(`Unexpected table in test: ${table}`)
    },
  }

  const result = await generateBlogPostFromPhotoSelection({
    supabase,
    adminEmail: 'admin@example.com',
    body: {
      photoIds: ['photo-1'],
      title: 'Burnet shop slab pre-pour setup',
      status: 'published',
      seoStatus: 'approved',
      sourcePacketId: 'JOB-204',
      stephenObservation: 'Stephen changed the truck sequence after checking site access.',
      uniqueFacts: ['Fact one', 'Fact two', 'Fact three'],
      useAiParagraph: false,
    },
  })

  assert.equal(insertedPost.status, 'draft')
  assert.equal(insertedPost.seo_status, 'needs_facts')
  assert.equal(insertedPost.published_at, null)
  assert.equal(insertedPost.authenticity_data.generator_source_packet_id, 'JOB-204')
  assert.equal(result.editorial.seoStatus, 'needs_facts')
  assert.equal(insertedPhotoLinks[0].caption, photos[0].source_caption)
  assert.doesNotMatch(insertedPost.title, /^Project Update/i)
})

test('sanitizer removes retired search and sales formulas from model output', () => {
  const paragraph = sanitizeAiParagraph(
    'The ticket record lists three placements. Call today for a free estimate. concrete contractor Waco TX'
  )

  assert.equal(paragraph, 'The ticket record lists three placements.')
})

test('renderBlogMarkdown drops raw HTML and unsafe markdown URLs', () => {
  const html = renderBlogMarkdown([
    'Safe [estimate](https://example.com)',
    '',
    'Bad [link](javascript:alert(1))',
    '',
    '<script>alert(1)</script>',
    '',
    '![photo](javascript:alert(1))',
  ].join('\n'))

  assert.match(html, /<a href="https:\/\/example\.com" rel="noreferrer noopener">estimate<\/a>/)
  assert.doesNotMatch(html, /javascript:/i)
  assert.doesNotMatch(html, /<script/i)
  assert.doesNotMatch(html, /alert\(1\)/i)
})
