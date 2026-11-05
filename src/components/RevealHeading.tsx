import { useRef, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { gsap, SplitText, useGSAP } from '../lib/gsap'

interface RevealHeadingProps {
  children: ReactNode
  className?: string
  level?: 2 | 3
  id?: string
}

/** Heading whose lines rise out of a mask when scrolled into view. */
export function RevealHeading({ children, className = 'section-title', level = 2, id }: RevealHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      const heading = headingRef.current
      if (!heading) return
      if (reducedMotion) {
        gsap.from(heading, { autoAlpha: 0, duration: 0.6, scrollTrigger: { trigger: heading, start: 'top 90%', once: true } })
        return
      }
      const split = SplitText.create(heading, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.4,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
          }),
      })
      return () => split.revert()
    },
    { scope: headingRef, dependencies: [reducedMotion] },
  )

  const Tag = level === 2 ? 'h2' : 'h3'
  return (
    <Tag ref={headingRef} id={id} className={className}>
      {children}
    </Tag>
  )
}
