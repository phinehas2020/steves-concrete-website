import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { createClient } from '@supabase/supabase-js'

const DEFAULT_BATCH_SIZE = 500

const KNOWN_TABLES = [
  'admin_users',
  'leads',
  'blog_posts',
  'jobs',
  'hero_images',
  'email_recipients',
  'blog_ai_prompt_settings',
  'blog_photo_albums',
  'blog_photos',
  'blog_post_photos',
  'job_images',
  'blog_post_generation_jobs',
]

const cliArgs = process.argv.slice(2)
const dryRun = hasArg('dry-run')
const skipAuth = hasArg('skip-auth')
const skipStorage = hasArg('skip-storage')
const skipSchema = hasArg('skip-schema')
const rewriteUrls = hasArg('rewrite-urls')
const useVercelSource = hasArg('use-vercel-source')
const explicitBucketCsv = parseValueArg('buckets')
const explicitBuckets = explicitBucketCsv ? new Set(parseCsv(explicitBucketCsv)) : null
const requestedTables = parseCsv(parseValueArg('tables'))
const requestedTableSet = requestedTables.length ? new Set(requestedTables) : null

loadDotEnv(path.resolve('.env'))

const batchSize = parsePositiveInt(process.env.MIGRATION_BATCH_SIZE, DEFAULT_BATCH_SIZE)

let sourceUrl = firstEnvValue('SOURCE_SUPABASE_URL', 'SUPABASE_URL')
let sourceServiceRoleKey = firstEnvValue('SOURCE_SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_ROLE_KEY')
let sourceAnonKey = firstEnvValue(
  'SOURCE_SUPABASE_ANON_KEY',
  'SUPABASE_ANON_KEY',
  'VITE_SUPABASE_ANON_KEY',
)

if ((!sourceUrl || !sourceServiceRoleKey) && useVercelSource) {
  const pulled = loadSourceEnvFromVercel()
  sourceUrl ||= pulled.SOURCE_SUPABASE_URL || pulled.SUPABASE_URL
  sourceServiceRoleKey ||= pulled.SOURCE_SUPABASE_SERVICE_ROLE_KEY || pulled.SUPABASE_SERVICE_ROLE_KEY
  sourceAnonKey ||= pulled.SOURCE_SUPABASE_ANON_KEY || pulled.SUPABASE_ANON_KEY || pulled.VITE_SUPABASE_ANON_KEY
}

const targetUrl = requireEnv(
  'target Supabase URL',
  'TARGET_SUPABASE_URL',
  'DEST_SUPABASE_URL',
  'VITE_SUPABASE_URL',
)
const targetServiceRoleKey = requireEnv(
  'target Supabase service role key',
  'TARGET_SUPABASE_SERVICE_ROLE_KEY',
  'DEST_SUPABASE_SERVICE_ROLE_KEY',
)
let targetDatabaseUrl = firstEnvValue(
  'TARGET_SUPABASE_DB_URL',
  'TARGET_DB_URL',
  'TARGET_DATABASE_URL',
  'SUPABASE_DB_URL',
)

sourceUrl = sanitizeEnvValue(sourceUrl)
sourceServiceRoleKey = sanitizeEnvValue(sourceServiceRoleKey)
sourceAnonKey = sanitizeEnvValue(sourceAnonKey)
const sourceRestKey = sourceServiceRoleKey || sourceAnonKey

targetDatabaseUrl = sanitizeEnvValue(targetDatabaseUrl)

if (!sourceUrl || !sourceServiceRoleKey) {
  throw new Error(
    'Missing source Supabase credentials. Set SOURCE_SUPABASE_URL and SOURCE_SUPABASE_SERVICE_ROLE_KEY, or run with --use-vercel-source.',
  )
}

const source = createClient(sourceUrl, sourceServiceRoleKey, { auth: { persistSession: false } })
const target = createClient(targetUrl, targetServiceRoleKey, { auth: { persistSession: false } })

const discoveredTables = await discoverSourceTables(sourceUrl, sourceRestKey)
const migrationTables = buildMigrationTables(discoveredTables)
const RESET_ORDER = [...migrationTables].reverse()

console.log(`Source project: ${sourceUrl}`)
console.log(`Target project: ${targetUrl}`)
console.log(`Mode: ${dryRun ? 'dry-run' : 'write'}`)

if (!skipSchema) {
  await pushSchemaToTarget()
} else {
  console.log('Skipping schema sync step.')
}

await resetDestinationTables()
await migratePublicTables()

if (!skipAuth) {
  await migrateAuthUsers()
} else {
  console.log('Skipping auth user migration.')
}

if (!skipStorage) {
  await migrateStorageBuckets()
} else {
  console.log('Skipping storage migration.')
}

if (!dryRun) {
  await verifyMigrationCounts()
}

if (!skipSchema) {
  console.log('')
  console.log('Migration complete.')
  console.log('Auth password hashes are not copied with this script.')
  console.log('Ask admin users to set/reset passwords if they use email/password auth locally.')
} else {
  console.log('')
  console.log('Migration complete.')
  console.log('Auth password hashes are not copied with this script.')
  console.log('Ask admin users to set/reset passwords if they use email/password auth locally.')
}

async function resetDestinationTables() {
  console.log('')
  console.log('Resetting destination public tables for line-for-line copy...')

  for (const table of RESET_ORDER) {
    const existingCount = await countRows(target, table.name)
    console.log(`  ${table.name}: ${existingCount} existing row(s)`)

    if (dryRun || existingCount === 0) {
      continue
    }

    const deleteColumn = table.deleteColumn || 'id'
    const { error } = await target.from(table.name).delete().not(deleteColumn, 'is', null)
    if (error) {
      throw new Error(`Failed to clear destination table ${table.name}: ${error.message}`)
    }
  }
}

async function migratePublicTables() {
  console.log('')
  console.log('Copying public tables...')

  for (const table of migrationTables) {
    const sourceRows = await fetchAllRows(source, table)
    console.log(`  ${table.name}: ${sourceRows.length} source row(s)`)

    if (sourceRows.length === 0) {
      continue
    }

    if (dryRun) {
      continue
    }

    const rowsToInsert = rewriteUrls
      ? sourceRows.map((row) => rewriteSourceOrigin(row, sourceUrl, targetUrl))
      : sourceRows

    for (const chunk of chunkArray(rowsToInsert, batchSize)) {
      const { error } = await target.from(table.name).insert(chunk)
      if (error) {
        throw new Error(`Failed inserting into ${table.name}: ${error.message}`)
      }
    }
  }
}

async function migrateAuthUsers() {
  console.log('')
  console.log('Copying auth users...')

  const sourceUsers = await listAllAuthUsers(source)
  const targetUsers = await listAllAuthUsers(target)
  const targetUsersById = new Map(targetUsers.map((user) => [user.id, user]))
  const targetUsersByEmail = new Map(
    targetUsers
      .filter((user) => user.email)
      .map((user) => [user.email.toLowerCase(), user]),
  )

  console.log(`  source auth users: ${sourceUsers.length}`)
  console.log(`  target auth users: ${targetUsers.length}`)

  for (const user of sourceUsers) {
    const payload = buildAuthPayload(user)
    if (!payload.email && !payload.phone) {
      console.log(`  skipping auth user ${user.id} (no email or phone)`)
      continue
    }

    const existingById = targetUsersById.get(user.id)
    const existingByEmail = payload.email ? targetUsersByEmail.get(payload.email.toLowerCase()) : null

    if (existingByEmail && existingByEmail.id !== user.id) {
      throw new Error(
        `Destination auth already has ${payload.email} with a different id (${existingByEmail.id}). Use a fresh hosted project or clean destination auth users first.`,
      )
    }

    if (dryRun) {
      console.log(`  ${existingById ? 'update' : 'create'} auth user ${payload.email || payload.phone || user.id}`)
      continue
    }

    if (existingById) {
      const { error } = await target.auth.admin.updateUserById(user.id, payload)
      if (error) {
        throw new Error(`Failed updating auth user ${payload.email || user.id}: ${error.message}`)
      }
      continue
    }

    const { error } = await target.auth.admin.createUser(payload)
    if (error) {
      throw new Error(`Failed creating auth user ${payload.email || user.id}: ${error.message}`)
    }
  }
}

async function migrateStorageBuckets() {
  console.log('')
  console.log('Copying storage buckets...')

  const { data: sourceBuckets, error: sourceBucketsError } = await source.storage.listBuckets()
  if (sourceBucketsError) {
    throw new Error(`Failed listing source storage buckets: ${sourceBucketsError.message}`)
  }

  const { data: targetBuckets, error: targetBucketsError } = await target.storage.listBuckets()
  if (targetBucketsError) {
    throw new Error(`Failed listing target storage buckets: ${targetBucketsError.message}`)
  }

  const targetBucketById = new Map((targetBuckets || []).map((bucket) => [bucket.id, bucket]))
  const effectiveBuckets = filterBuckets(sourceBuckets || [])

  if (effectiveBuckets.length === 0) {
    console.log('  No eligible buckets to migrate.')
    return
  }

  for (const bucket of effectiveBuckets) {
    console.log(`  bucket ${bucket.id}`)

    if (!dryRun) {
      await ensureTargetBucket(bucket, targetBucketById.get(bucket.id))
      const { error: emptyError } = await target.storage.emptyBucket(bucket.id)
      if (emptyError) {
        throw new Error(`Failed emptying target bucket ${bucket.id}: ${emptyError.message}`)
      }
    }

    const objectPaths = await listAllBucketObjectPaths(source, bucket.id)
    console.log(`    objects: ${objectPaths.length}`)

    if (dryRun) {
      continue
    }

    for (const objectPath of objectPaths) {
      const { data: downloaded, error: downloadError } = await source.storage.from(bucket.id).download(objectPath)
      if (downloadError) {
        throw new Error(`Failed downloading ${bucket.id}/${objectPath}: ${downloadError.message}`)
      }

      const arrayBuffer = await downloaded.arrayBuffer()
      const { error: uploadError } = await target.storage.from(bucket.id).upload(objectPath, arrayBuffer, {
        upsert: true,
        contentType: downloaded.type || undefined,
      })

      if (uploadError) {
        throw new Error(`Failed uploading ${bucket.id}/${objectPath}: ${uploadError.message}`)
      }
    }
  }
}

async function ensureTargetBucket(sourceBucket, existingTargetBucket) {
  const bucketOptions = {
    public: Boolean(sourceBucket.public),
    fileSizeLimit: sourceBucket.file_size_limit ?? undefined,
    allowedMimeTypes: sourceBucket.allowed_mime_types ?? undefined,
  }

  if (!existingTargetBucket) {
    const { error } = await target.storage.createBucket(sourceBucket.id, bucketOptions)
    if (error) {
      throw new Error(`Failed creating target bucket ${sourceBucket.id}: ${error.message}`)
    }
    return
  }

  const { error } = await target.storage.updateBucket(sourceBucket.id, bucketOptions)
  if (error) {
    throw new Error(`Failed updating target bucket ${sourceBucket.id}: ${error.message}`)
  }
}

async function verifyMigrationCounts() {
  console.log('')
  console.log('Verifying row counts...')

  for (const table of migrationTables) {
    const sourceCount = await countRows(source, table.name)
    const targetCount = await countRows(target, table.name)
    if (sourceCount !== targetCount) {
      throw new Error(`Count mismatch for ${table.name}: source=${sourceCount}, target=${targetCount}`)
    }
    console.log(`  ${table.name}: ${targetCount}`)
  }
}

async function pushSchemaToTarget() {
  if (!targetDatabaseUrl) {
    console.log('')
    console.log('Skipping schema sync step: TARGET_SUPABASE_DB_URL is not set.')
    return
  }

  if (!isCommandAvailable('supabase')) {
    throw new Error('supabase CLI is required for automatic schema sync. Install it, or run with --skip-schema.')
  }

  const dbUrl = sanitizeConnectionUrl(targetDatabaseUrl)
  const workdir = path.resolve(process.cwd(), 'supabase')
  console.log('')
  console.log('Running supabase db push on target...')
  runCommand('supabase', ['db', 'push', '--db-url', dbUrl, '--workdir', workdir, '--yes'])
}

async function discoverSourceTables(apiUrl, apiKey) {
  if (!apiKey) {
    console.log('No source API key available, using known table list.')
    return []
  }

  const endpoint = `${apiUrl.replace(/\/+$/, '')}/rest/v1/`
  const response = await fetch(endpoint, {
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/openapi+json',
    },
  })

  if (!response.ok) {
    console.log(`Unable to read OpenAPI from source (${response.status}) - falling back to known table list.`)
    return []
  }

  const spec = (await response.json()) || {}
  const paths = spec.paths || {}
  const definitions = spec.definitions || spec.components?.schemas || {}
  const discovered = []
  const seen = new Set()

  for (const [route, methods] of Object.entries(paths)) {
    if (!route.startsWith('/')) {
      continue
    }

    const tableName = route.slice(1)
    if (!tableName || tableName.includes('/')) {
      continue
    }

    if (!methods || !methods.get || !methods.post || !methods.delete) {
      continue
    }

    if (requestedTableSet && !requestedTableSet.has(tableName)) {
      continue
    }

    const definition = definitions[tableName] || {}
    const requiredColumns = Array.isArray(definition.required) ? definition.required : []
    const properties = definition.properties ? Object.keys(definition.properties) : []
    const finalColumns = requiredColumns.length ? requiredColumns : properties

    discovered.push({
      name: tableName,
      columns: new Set(finalColumns),
      orderBy: pickPreferredColumn(finalColumns, ['created_at', 'updated_at', 'id']),
      deleteColumn: pickPreferredColumn(finalColumns, ['id', 'created_at', 'updated_at']),
    })
    seen.add(tableName)
  }

  if (discovered.length === 0) {
    return []
  }

  for (const tableName of KNOWN_TABLES) {
    if (requestedTableSet && !requestedTableSet.has(tableName)) {
      continue
    }

    if (seen.has(tableName)) {
      continue
    }

    discovered.push({ name: tableName, columns: new Set(), orderBy: 'created_at', deleteColumn: 'id' })
  }

  console.log(`Discovered ${discovered.length} source tables from PostgREST OpenAPI.`)
  return discovered
}

function buildMigrationTables(discoveredTables) {
  const tableMap = new Map()

  for (const entry of discoveredTables) {
    tableMap.set(entry.name, entry)
  }

  const ordered = []
  const seen = new Set()

  const orderedKnown = KNOWN_TABLES.filter((tableName) => {
    if (requestedTableSet && !requestedTableSet.has(tableName)) {
      return false
    }
    return tableMap.has(tableName) || discoveredTables.length === 0
  })

  for (const tableName of orderedKnown) {
    if (requestedTableSet && !requestedTableSet.has(tableName)) {
      continue
    }

    const fromDiscover = tableMap.get(tableName)
    const entry = fromDiscover || {
      name: tableName,
      columns: new Set(),
      orderBy: 'created_at',
      deleteColumn: 'id',
    }
    ordered.push(entry)
    seen.add(tableName)
  }

  const discoveredNames = discoveredTables.map((table) => table.name)
  for (const tableName of discoveredNames.sort()) {
    if (seen.has(tableName)) {
      continue
    }
    if (requestedTableSet && !requestedTableSet.has(tableName)) {
      continue
    }

    const entry = tableMap.get(tableName)
    if (!entry) {
      continue
    }

    ordered.push({
      name: entry.name,
      columns: entry.columns,
      orderBy: entry.orderBy || 'created_at',
      deleteColumn: entry.deleteColumn || 'id',
    })
    seen.add(tableName)
  }

  return ordered
}

async function fetchAllRows(client, table) {
  const rows = []
  let from = 0

  for (;;) {
    const to = from + batchSize - 1
    let query = client.from(table.name).select('*').range(from, to)

    if (table.orderBy) {
      query = query.order(table.orderBy, { ascending: true })
    }

    const { data, error } = await query
    if (error) {
      throw new Error(`Failed reading ${table.name}: ${error.message}`)
    }

    if (!data || data.length === 0) {
      break
  }

    rows.push(...data)

    if (data.length < batchSize) {
      break
    }

    from += data.length
  }

  return rows
}

async function countRows(client, tableName) {
  const { count, error } = await client.from(tableName).select('*', { count: 'exact', head: true })
  if (error) {
    throw new Error(`Failed counting ${tableName}: ${error.message}`)
  }
  return count ?? 0
}

async function listAllAuthUsers(client) {
  const users = []
  let page = 1

  for (;;) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage: 200 })
    if (error) {
      throw new Error(`Failed listing auth users on page ${page}: ${error.message}`)
    }

    const batch = data?.users ?? []
    users.push(...batch)

    if (batch.length < 200) {
      break
    }

    page += 1
  }

  return users
}

function buildAuthPayload(user) {
  return {
    id: user.id,
    email: user.email ?? undefined,
    phone: user.phone ?? undefined,
    email_confirm: Boolean(user.email_confirmed_at),
    phone_confirm: Boolean(user.phone_confirmed_at),
    user_metadata: rewriteUrls ? rewriteSourceOrigin(user.user_metadata ?? {}, sourceUrl, targetUrl) : user.user_metadata,
    app_metadata: rewriteUrls ? rewriteSourceOrigin(user.app_metadata ?? {}, sourceUrl, targetUrl) : user.app_metadata,
  }
}

async function listAllBucketObjectPaths(client, bucketId, prefix = '') {
  const objectPaths = []
  let offset = 0

  for (;;) {
    const { data, error } = await client.storage.from(bucketId).list(prefix, {
      limit: 100,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    })

    if (error) {
      throw new Error(`Failed listing objects in ${bucketId}/${prefix}: ${error.message}`)
    }

    if (!data || data.length === 0) {
      break
    }

    for (const entry of data) {
      const fullPath = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.id == null) {
        objectPaths.push(...await listAllBucketObjectPaths(client, bucketId, fullPath))
      } else {
        objectPaths.push(fullPath)
      }
    }

    if (data.length < 100) {
      break
    }

    offset += data.length
  }

  return objectPaths
}

function filterBuckets(sourceBuckets) {
  if (!explicitBuckets) {
    return sourceBuckets
  }

  return sourceBuckets.filter((bucket) => explicitBuckets.has(bucket.id))
}

function rewriteSourceOrigin(value, source, target) {
  if (typeof value === 'string') {
    return value.split(source).join(target)
  }

  if (Array.isArray(value)) {
    return value.map((entry) => rewriteSourceOrigin(entry, source, target))
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, rewriteSourceOrigin(entry, source, target)]),
    )
  }

  return value
}

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return
  }

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#') || !line.includes('=')) {
      continue
    }

    const separatorIndex = line.indexOf('=')
    const key = line.slice(0, separatorIndex).trim()
    const rawValue = line.slice(separatorIndex + 1)

    if (!key || process.env[key]) {
      continue
    }

    process.env[key] = sanitizeEnvValue(rawValue)
  }
}

function loadSourceEnvFromVercel() {
  const tmpFile = path.join(os.tmpdir(), `steves-vercel-env-${Date.now()}.env`)

  try {
    execFileSync('vercel', ['env', 'pull', tmpFile, '--environment=production', '--yes'], { stdio: 'ignore' })

    const values = {}

    for (const line of fs.readFileSync(tmpFile, 'utf8').split(/\r?\n/)) {
      if (!line || line.trim().startsWith('#') || !line.includes('=')) {
        continue
      }
      const separatorIndex = line.indexOf('=')
      const key = line.slice(0, separatorIndex).trim()
      const rawValue = line.slice(separatorIndex + 1)
      values[key] = sanitizeEnvValue(rawValue)
    }

    return values
  } finally {
    fs.rmSync(tmpFile, { force: true })
  }
}

function requireEnv(label, ...names) {
  const value = firstEnvValue(...names)
  if (!value) {
    throw new Error(`Missing ${label}. Checked: ${names.join(', ')}`)
  }
  return value
}

function firstEnvValue(...names) {
  for (const name of names) {
    const value = sanitizeEnvValue(process.env[name])
    if (value) {
      return value
    }
  }
  return ''
}

function sanitizeEnvValue(value) {
  if (typeof value !== 'string') {
    return ''
  }

  let normalized = value.replace(/\r/g, '').replace(/\0/g, '').trim()
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1)
  }
  return normalized.replace(/\\n/g, '\n').trim()
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function chunkArray(items, size) {
  const chunks = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  return chunks
}

function hasArg(name) {
  return cliArgs.includes(`--${name}`)
}

function parseValueArg(name) {
  const prefix = `--${name}=`
  const assignment = cliArgs.find((arg) => arg.startsWith(prefix))
  if (assignment) {
    return assignment.slice(prefix.length)
  }

  const idx = cliArgs.indexOf(`--${name}`)
  if (idx >= 0 && cliArgs[idx + 1] && !cliArgs[idx + 1].startsWith('--')) {
    return cliArgs[idx + 1]
  }

  return ''
}

function parseCsv(value) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function pickPreferredColumn(columns = [], candidates = []) {
  const set = new Set(columns)
  for (const candidate of candidates) {
    if (set.has(candidate)) {
      return candidate
    }
  }
  return columns[0] || ''
}

function isCommandAvailable(command) {
  try {
    execFileSync('which', [command], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function runCommand(command, args) {
  execFileSync(command, args, { stdio: 'inherit' })
}

function sanitizeConnectionUrl(value) {
  try {
    const parsed = new URL(value)
    if (parsed.password) {
      parsed.password = encodeURIComponent(decodeURIComponent(parsed.password))
    }
    return parsed.toString()
  } catch {
    return value
  }
}
