import { useEffect, useRef, useState } from 'react'

export function DeferredSection({
  children,
  className = '',
  rootMargin = '320px 0px',
  minHeight = 0,
  anchorId,
  eager = false,
}) {
  const containerRef = useRef(null)
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window === 'undefined') return false
    if (eager) return true
    if (anchorId && window.location.hash === `#${anchorId}`) return true
    return typeof IntersectionObserver === 'undefined'
  })

  useEffect(() => {
    if (!anchorId || shouldRender) return undefined

    const renderMatchingHash = () => {
      if (window.location.hash === `#${anchorId}`) setShouldRender(true)
    }

    window.addEventListener('hashchange', renderMatchingHash)
    return () => window.removeEventListener('hashchange', renderMatchingHash)
  }, [anchorId, shouldRender])

  useEffect(() => {
    if (shouldRender) return undefined

    const node = containerRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting)
        if (isVisible) {
          setShouldRender(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [rootMargin, shouldRender])

  const style = minHeight || anchorId
    ? {
        ...(minHeight ? { minHeight } : {}),
        ...(anchorId ? { scrollMarginTop: '5rem' } : {}),
      }
    : undefined

  // Keep anchor ownership on this stable wrapper so the target exists before
  // lazy children load. A matching direct hash renders immediately; ordinary
  // visits wait until the wrapper approaches the viewport.
  return (
    <div
      ref={containerRef}
      id={anchorId}
      className={className}
      style={style}
    >
      {shouldRender ? children : null}
    </div>
  )
}
