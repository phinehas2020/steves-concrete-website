import test from 'node:test'
import assert from 'node:assert/strict'

import { getRouteIndexingState } from '../../src/data/indexingControls.js'
import { applyBlogContentReviewGate } from '../../api/blog-post.js'

test('blog API content mutations cannot preserve an existing SEO approval', () => {
  const approvedPost = {
    slug: 'previously-approved-project',
    status: 'published',
    seo_status: 'approved',
    published_at: '2026-08-01T12:00:00.000Z',
    reviewed_by: 'Stephen Alexander',
    reviewed_at: '2026-08-01T12:00:00.000Z',
  }
  const mutation = applyBlogContentReviewGate({
    ...approvedPost,
    title: 'Replacement automation payload',
    content: 'Fresh content that has not completed review.',
  })

  assert.equal(mutation.status, 'draft')
  assert.equal(mutation.seo_status, 'needs_facts')
  assert.equal(mutation.published_at, null)
  assert.equal(mutation.reviewed_by, null)
  assert.equal(mutation.reviewed_at, null)
  assert.equal(
    getRouteIndexingState(`/blog/${approvedPost.slug}`, mutation).indexable,
    false,
  )
})
