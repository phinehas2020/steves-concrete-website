import test from 'node:test'
import assert from 'node:assert/strict'

import { sanitizeAiParagraph, buildGeneratedContent } from './blog-generate-post.js'
import { renderBlogMarkdown } from '../src/lib/blogMarkdown.js'

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
