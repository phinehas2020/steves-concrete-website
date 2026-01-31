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
