import { useEffect, useState, type RefObject } from 'react'

/** True while the element is within the viewport extended by `rootMargin`. */
export function useInView(target: RefObject<Element | null>, rootMargin = '0px'): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = target.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    observer.observe(element)
    return () => observer.disconnect()
  }, [target, rootMargin])

  return inView
}
