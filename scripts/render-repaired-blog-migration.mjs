import fs from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { REPAIRED_BLOG_SLUGS } from '../src/data/indexingControls.js'
import { repairedBlogPosts } from '../src/data/repairedBlogPosts.js'

export const REPAIRED_BLOG_MIGRATION_COLUMNS = Object.freeze([
  'slug',
  'title',
  'excerpt',
  'content',
  'cover_image_url',
  'created_at',
  'updated_at',
  'published_at',
  'status',
  'seo_status',
  'author_name',
  'reviewed_by',
  'reviewed_at',
  'source_summary',
  'canonical_slug',
  'project_series_id',
  'series_phase',
])

function sqlText(value) {
  if (value === null || value === undefined) return 'null'
  const text = String(value)
  if (text.includes('\0')) throw new Error('Migration text cannot contain NUL bytes')
  return `'${text.replaceAll("'", "''")}'`
}

function sqlTimestamp(value) {
  return value === null || value === undefined ? 'null' : `${sqlText(value)}::timestamptz`
}

function sqlInteger(value) {
  if (value === null || value === undefined || value === '') return 'null'
  if (!Number.isSafeInteger(value)) throw new Error(`Invalid migration integer: ${value}`)
  return String(value)
}

function orderedRepairedPosts(posts) {
  const bySlug = new Map(posts.map((post) => [post.slug, post]))
  const expected = new Set(REPAIRED_BLOG_SLUGS)
  const unexpected = posts.filter((post) => !expected.has(post.slug)).map((post) => post.slug)
  const missing = REPAIRED_BLOG_SLUGS.filter((slug) => !bySlug.has(slug))

  if (posts.length !== REPAIRED_BLOG_SLUGS.length || bySlug.size !== posts.length) {
    throw new Error(
      `Expected ${REPAIRED_BLOG_SLUGS.length} unique repaired posts, received ${posts.length}`,
    )
  }
  if (missing.length || unexpected.length) {
    throw new Error(
      `Repaired migration slug mismatch. Missing: ${missing.join(', ') || 'none'}. Unexpected: ${unexpected.join(', ') || 'none'}.`,
    )
  }

  return REPAIRED_BLOG_SLUGS.map((slug) => bySlug.get(slug))
}

function validatePost(post) {
  for (const field of [
    'slug',
    'title',
    'excerpt',
    'content',
    'cover_image_url',
    'created_at',
    'updated_at',
    'published_at',
    'author_name',
    'reviewed_at',
    'source_summary',
  ]) {
    if (!String(post[field] || '').trim()) {
      throw new Error(`${post.slug || 'unknown post'} is missing ${field}`)
    }
  }
  if (post.status !== 'published' || post.seo_status !== 'approved') {
    throw new Error(`${post.slug} must be published and SEO approved`)
  }
  if (post.canonical_slug !== null) {
    throw new Error(`${post.slug} must be self-canonical`)
  }
}

function postSqlValues(post) {
  validatePost(post)
  const values = {
    slug: sqlText(post.slug),
    title: sqlText(post.title),
    excerpt: sqlText(post.excerpt),
    content: sqlText(post.content),
    cover_image_url: sqlText(post.cover_image_url),
    created_at: sqlTimestamp(post.created_at),
    updated_at: sqlTimestamp(post.updated_at),
    published_at: sqlTimestamp(post.published_at),
    status: sqlText(post.status),
    seo_status: sqlText(post.seo_status),
    author_name: sqlText(post.author_name),
    reviewed_by: sqlText(post.reviewed_by ?? null),
    reviewed_at: sqlTimestamp(post.reviewed_at),
    source_summary: sqlText(post.source_summary),
    canonical_slug: sqlText(post.canonical_slug),
    project_series_id: sqlText(post.project_series_id),
    series_phase: sqlInteger(post.series_phase),
  }

  return [
    '  (',
    ...REPAIRED_BLOG_MIGRATION_COLUMNS.map(
      (column, index) =>
        `    ${values[column]}${index === REPAIRED_BLOG_MIGRATION_COLUMNS.length - 1 ? '' : ','}`,
    ),
    '  )',
  ].join('\n')
}

export function renderRepairedBlogMigration(posts = repairedBlogPosts) {
  const orderedPosts = orderedRepairedPosts(posts)
  const rows = orderedPosts.map(postSqlValues).join(',\n')
  const insertColumns = REPAIRED_BLOG_MIGRATION_COLUMNS.map((column) => `  ${column}`).join(',\n')
  const updateColumns = REPAIRED_BLOG_MIGRATION_COLUMNS
    .filter((column) => column !== 'slug')
    .map((column) => `  ${column} = excluded.${column}`)
    .join(',\n')

  return `-- Generated from src/data/repairedBlogPosts.js by scripts/render-repaired-blog-migration.mjs.\n-- Keep the JavaScript records canonical; regenerate this static SQL snapshot after editing them.\n-- The migration uses a fixed INSERT/ON CONFLICT statement and no runtime dynamic SQL.\ninsert into public.blog_posts (\n${insertColumns}\n)\nvalues\n${rows}\non conflict (slug) do update\nset\n${updateColumns};\n`
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === invokedPath) {
  const migration = renderRepairedBlogMigration()
  if (process.argv.includes('--write')) {
    const migrationUrl = new URL(
      '../supabase/migrations/20260807130000_restore_rehabilitated_blog_indexing.sql',
      import.meta.url,
    )
    await fs.writeFile(migrationUrl, migration, 'utf8')
    process.stdout.write(`${fileURLToPath(migrationUrl)}\n`)
  } else {
    process.stdout.write(migration)
  }
}
