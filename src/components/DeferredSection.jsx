import { useEffect, useRef, useState } from 'react'

export function DeferredSection({
  children,
  className = '',
  rootMargin = '320px 0px',
  minHeight = 0,
  anchorId,
}) {
  const containerRef = useRef(null)
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window === 'undefined') return false
    return typeof IntersectionObserver === 'undefined'
  })

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

  const style = minHeight ? { minHeight } : undefined

  // Anchor targets (e.g. #contact) live inside the deferred children, so hash
  // links would silently no-op before render. Host the id on the placeholder
  // until the real section takes over.
  return (
    <div
      ref={containerRef}
      id={shouldRender ? undefined : anchorId}
      className={className}
      style={style}
    >
      {shouldRender ? children : null}
    </div>
  )
}
