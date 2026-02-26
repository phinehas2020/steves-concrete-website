import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines clsx and tailwind-merge for optimal class handling
 * @param {...any} inputs - Class names, objects, or arrays
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

const SUPABASE_PUBLIC_OBJECT_PATH = '/storage/v1/object/public/'
const SUPABASE_RENDER_IMAGE_PATH = '/storage/v1/render/image/public/'

/**
 * Build a transformed Supabase image URL when the source is a public object URL.
 */
export function getSupabaseOptimizedImageUrl(
  url,
  { width, height, quality = 70, format = 'webp' } = {},
) {
  if (!url || typeof url !== 'string') return url

  try {
    const parsedUrl = new URL(url)
    if (!parsedUrl.pathname.includes(SUPABASE_PUBLIC_OBJECT_PATH)) return url

    const transformedPath = parsedUrl.pathname.replace(
      SUPABASE_PUBLIC_OBJECT_PATH,
      SUPABASE_RENDER_IMAGE_PATH,
    )

    const optimizedUrl = new URL(`${parsedUrl.origin}${transformedPath}`)
    if (width) optimizedUrl.searchParams.set('width', String(width))
    if (height) optimizedUrl.searchParams.set('height', String(height))
    if (quality) optimizedUrl.searchParams.set('quality', String(quality))
    if (format) optimizedUrl.searchParams.set('format', format)

    return optimizedUrl.toString()
  } catch {
    return url
  }
}

/**
 * Build a responsive srcSet for Supabase-hosted public image URLs.
 */
export function buildSupabaseImageSrcSet(url, widths = [480, 768, 1024, 1440], options = {}) {
  if (!url || !Array.isArray(widths) || widths.length === 0) return undefined

  return widths
    .map((width) => `${getSupabaseOptimizedImageUrl(url, { ...options, width })} ${width}w`)
    .join(', ')
}

/**
 * Handle image error by trying alternative extension
 * Tries .jpg if .jpeg fails, then hides the image instead of showing fallback
 */
export function handleImageError(e, fallback = null) {
  const currentSrc = e.target.src
  // Try .jpg if .jpeg fails
  if (currentSrc.includes('.jpeg')) {
    e.target.src = currentSrc.replace('.jpeg', '.jpg')
  } else if (currentSrc.includes('.jpg')) {
    // If .jpg also fails, hide the image or use fallback if provided
    if (fallback) {
      e.target.src = fallback
    } else {
      e.target.style.display = 'none'
    }
  } else {
    if (fallback) {
      e.target.src = fallback
    } else {
      e.target.style.display = 'none'
    }
  }
}
