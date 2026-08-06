import { useEffect } from 'react'

const ALIGNMENT_WINDOW_MS = 5000
const ALIGNMENT_INTERVAL_MS = 120

function getHashTarget() {
  if (typeof window === 'undefined' || !window.location.hash) return null

  try {
    const id = decodeURIComponent(window.location.hash.slice(1))
    return id ? document.getElementById(id) : null
  } catch {
    return null
  }
}

/**
 * Keeps hash targets aligned while lazy chunks, images, and remote project data
 * finish changing the height of sections above them. Any deliberate user input
 * cancels the short alignment window so normal scrolling always wins.
 */
export function StableHashScroll() {
  useEffect(() => {
    let intervalId
    let stopTimeoutId

    const stopAlignment = () => {
      if (intervalId) window.clearInterval(intervalId)
      if (stopTimeoutId) window.clearTimeout(stopTimeoutId)
      intervalId = undefined
      stopTimeoutId = undefined
    }

    const alignTarget = () => {
      const target = getHashTarget()
      if (!target) return

      const scrollMarginTop = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0
      const delta = target.getBoundingClientRect().top - scrollMarginTop

      if (Math.abs(delta) > 2) {
        // Temporarily override html { scroll-behavior: smooth } so repeated
        // adjustments do not queue animations while the target is moving.
        const root = document.documentElement
        const previousScrollBehavior = root.style.scrollBehavior
        root.style.scrollBehavior = 'auto'
        window.scrollBy({ top: delta, left: 0, behavior: 'auto' })
        root.style.scrollBehavior = previousScrollBehavior
      }
    }

    const startAlignment = () => {
      stopAlignment()
      if (!window.location.hash) return

      window.requestAnimationFrame(alignTarget)
      intervalId = window.setInterval(alignTarget, ALIGNMENT_INTERVAL_MS)
      stopTimeoutId = window.setTimeout(stopAlignment, ALIGNMENT_WINDOW_MS)
    }

    const userIntentEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown']
    window.addEventListener('hashchange', startAlignment)
    window.addEventListener('popstate', startAlignment)
    userIntentEvents.forEach((eventName) => {
      window.addEventListener(eventName, stopAlignment, { passive: true })
    })

    if (window.location.hash) startAlignment()

    return () => {
      stopAlignment()
      window.removeEventListener('hashchange', startAlignment)
      window.removeEventListener('popstate', startAlignment)
      userIntentEvents.forEach((eventName) => {
        window.removeEventListener(eventName, stopAlignment)
      })
    }
  }, [])

  return null
}
