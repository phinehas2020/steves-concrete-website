const SUPABASE_PUBLIC_SEGMENT = '/storage/v1/object/public/'
const SUPABASE_RENDER_SEGMENT = '/storage/v1/render/image/public/'
const DUMMY_ORIGIN = 'https://local.image'

function isRelativeUrl(value) {
  return !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value)
}

function toUrl(value) {
  try {
    if (isRelativeUrl(value)) {
      return new URL(value, DUMMY_ORIGIN)
    }
    return new URL(value)
  } catch {
    return null
  }
}

function toOriginalFormat(input, url) {
  if (isRelativeUrl(input)) {
    return `${url.pathname}${url.search}${url.hash}`
  }
  return url.toString()
}

export function isSupabaseStorageUrl(url = '') {
  if (typeof url !== 'string' || !url) return false
  return url.includes(SUPABASE_PUBLIC_SEGMENT) || url.includes(SUPABASE_RENDER_SEGMENT)
}

export function getOptimizedImageUrl(url, options = {}) {
  if (typeof url !== 'string' || !url) return ''
  if (url.startsWith('data:') || url.startsWith('blob:')) return url
  if (!isSupabaseStorageUrl(url)) return url

  const parsed = toUrl(url)
  if (!parsed) return url

  if (parsed.pathname.includes(SUPABASE_PUBLIC_SEGMENT)) {
    parsed.pathname = parsed.pathname.replace(SUPABASE_PUBLIC_SEGMENT, SUPABASE_RENDER_SEGMENT)
  }

  const { width, height, quality = 70, format } = options

  if (typeof width === 'number' && Number.isFinite(width)) {
    parsed.searchParams.set('width', String(Math.round(width)))
  }
  if (typeof height === 'number' && Number.isFinite(height)) {
    parsed.searchParams.set('height', String(Math.round(height)))
  }
  if (typeof quality === 'number' && Number.isFinite(quality)) {
    parsed.searchParams.set('quality', String(Math.round(quality)))
  }
  if (typeof format === 'string' && format) {
    parsed.searchParams.set('format', format)
  }

  return toOriginalFormat(url, parsed)
}

export function getResponsiveImageSrcSet(url, widths = [], options = {}) {
  if (!isSupabaseStorageUrl(url)) return ''

  const uniqueWidths = [...new Set(widths)]
    .filter((value) => Number.isFinite(value) && value > 0)
    .sort((a, b) => a - b)

  if (uniqueWidths.length === 0) return ''

  return uniqueWidths
    .map((width) => `${getOptimizedImageUrl(url, { ...options, width })} ${width}w`)
    .join(', ')
}
