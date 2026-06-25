import fs from 'node:fs/promises'
import path from 'node:path'

function parseEnvLine(line) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) return null

  const separatorIndex = trimmed.indexOf('=')
  if (separatorIndex === -1) return null

  const key = trimmed.slice(0, separatorIndex).trim()
  let value = trimmed.slice(separatorIndex + 1).trim()

  if (!key) return null

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1)
  }

  return [key, value]
}

export async function loadLocalEnvFile(fileName = '.env') {
  const envPath = path.join(process.cwd(), fileName)
  let content = ''

  try {
    content = await fs.readFile(envPath, 'utf8')
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      console.warn(`Could not read ${fileName}: ${error.message}`)
    }
    return
  }

  for (const line of content.split(/\r?\n/)) {
    const parsed = parseEnvLine(line)
    if (!parsed) continue

    const [key, value] = parsed
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}
