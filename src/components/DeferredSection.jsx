import { useEffect, useRef, useState } from 'react'

export function DeferredSection({
  children,
  className = '',
  rootMargin = '320px 0px',
  minHeight = 0,
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

  return (
    <div ref={containerRef} className={className} style={style}>
      {shouldRender ? children : null}
    </div>
  )
}
