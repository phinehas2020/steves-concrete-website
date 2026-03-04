import { execSync } from 'node:child_process'

const DEFAULT_BASE_URL = 'https://www.concretewaco.com'
const URL_PATHS = [
  '/',
  '/services/concrete-foundations',
  '/services/concrete-patios',
  '/services/concrete-slabs',
  '/services/concrete-repair',
  '/services/stained-concrete',
  '/services/concrete-sealing',
  '/services/concrete-driveways',
  '/woodway-tx-concrete-contractor',
  '/waco-tx-concrete-contractor',
]

const THRESHOLDS = {
  lcpMs: 2500,
  tbtMs: 200,
  cls: 0.1,
}

function runLighthouse(url) {
  const command = [
    'npx --yes lighthouse',
    JSON.stringify(url),
    "--chrome-flags='--headless=new --no-sandbox --disable-gpu'",
    '--only-categories=performance',
    '--emulated-form-factor=mobile',
    '--output=json',
    '--output-path=stdout',
    '--quiet',
  ].join(' ')

  const output = execSync(command, {
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 1024 * 1024 * 40,
  }).toString()

  const report = JSON.parse(output)
  const audits = report.audits

  return {
    path: new URL(report.finalUrl).pathname,
    score: Math.round((report.categories.performance.score || 0) * 100),
    lcpMs: Math.round(audits['largest-contentful-paint']?.numericValue || 0),
    tbtMs: Math.round(audits['total-blocking-time']?.numericValue || 0),
    cls: Number((audits['cumulative-layout-shift']?.numericValue || 0).toFixed(3)),
    fcpMs: Math.round(audits['first-contentful-paint']?.numericValue || 0),
    ttiMs: Math.round(audits['interactive']?.numericValue || 0),
    fetchedAt: report.fetchTime,
  }
}

function evaluate(result) {
  const failures = []
  if (result.lcpMs > THRESHOLDS.lcpMs) failures.push(`LCP>${THRESHOLDS.lcpMs}`)
  if (result.tbtMs > THRESHOLDS.tbtMs) failures.push(`TBT>${THRESHOLDS.tbtMs}`)
  if (result.cls > THRESHOLDS.cls) failures.push(`CLS>${THRESHOLDS.cls}`)

  return {
    ...result,
    pass: failures.length === 0,
    failures,
  }
}

function printTable(rows) {
  const header = [
    'Status'.padEnd(8),
    'Path'.padEnd(40),
    'Score'.padStart(5),
    'LCP'.padStart(8),
    'TBT'.padStart(7),
    'CLS'.padStart(7),
    'Notes',
  ].join('  ')

  console.log(header)
  console.log('-'.repeat(header.length))

  for (const row of rows) {
    const status = row.pass ? 'PASS' : 'FAIL'
    const notes = row.failures.length ? row.failures.join(',') : '-'
    console.log([
      status.padEnd(8),
      row.path.padEnd(40),
      String(row.score).padStart(5),
      `${row.lcpMs}ms`.padStart(8),
      `${row.tbtMs}ms`.padStart(7),
      String(row.cls).padStart(7),
      notes,
    ].join('  '))
  }
}

function getBaseUrl() {
  const cliArg = process.argv.find((arg) => arg.startsWith('--base-url='))
  const cliBaseUrl = cliArg ? cliArg.slice('--base-url='.length) : ''
  const rawBaseUrl = cliBaseUrl || process.env.BASE_URL || DEFAULT_BASE_URL
  try {
    return new URL(rawBaseUrl).origin
  } catch {
    throw new Error(
      `Invalid base URL "${rawBaseUrl}". Use --base-url=https://example.com or BASE_URL env var.`,
    )
  }
}

function run() {
  const baseUrl = getBaseUrl()
  const asJson = process.argv.includes('--json')
  const results = []

  for (const path of URL_PATHS) {
    const url = `${baseUrl}${path}`
    try {
      const result = runLighthouse(url)
      results.push(evaluate(result))
    } catch (error) {
      results.push({
        path,
        pass: false,
        failures: ['LighthouseError'],
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  if (asJson) {
    console.log(JSON.stringify({
      baseUrl,
      thresholds: THRESHOLDS,
      urls: URL_PATHS,
      results,
    }, null, 2))
  } else {
    printTable(results)
  }

  const failedCount = results.filter((row) => !row.pass).length
  process.exitCode = failedCount > 0 ? 1 : 0
}

run()
