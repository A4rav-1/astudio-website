import { Fragment, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { velocityToSkew, velocityToTimeScale } from '../lib/format'
import { gsap, useGSAP } from '../lib/gsap'
import { useSmoothScroll } from '../providers/smoothScrollContext'
import { BrandMark } from './BrandMark'
import './Marquee.css'

interface MarqueeProps {
  items: readonly string[]
  variant?: 'solid' | 'outline'
  reverse?: boolean
  secondsPerLoop?: number
  label: string
}

const REPEATS_PER_HALF = 3

function MarqueeGroup({ items, hidden }: { items: readonly string[]; hidden: boolean }) {
  return (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {Array.from({ length: REPEATS_PER_HALF }, (_, repeat) => (
        <Fragment key={repeat}>
          {items.map((item) => (
            <span key={`${repeat}-${item}`} className="marquee__item">
              {item}
              <BrandMark className="marquee__glyph" />
            </span>
          ))}
        </Fragment>
      ))}
    </div>
  )
}

export function Marquee({ items, variant = 'solid', reverse = false, secondsPerLoop = 38, label }: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const scroll = useSmoothScroll()

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track || reducedMotion) return
      const loop = gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration: secondsPerLoop, ease: 'none', repeat: -1 },
      )
      const skew = gsap.quickTo(track, 'skewX', { duration: 0.6, ease: 'power3.out' })
      const unsubscribe = scroll.subscribe(({ velocity }) => {
        gsap.to(loop, { timeScale: velocityToTimeScale(velocity), duration: 0.5, overwrite: true })
        skew(velocityToSkew(velocity))
      })
      return unsubscribe
    },
    { scope: rootRef, dependencies: [reducedMotion, reverse, secondsPerLoop] },
  )

  return (
    <div ref={rootRef} className={`marquee marquee--${variant}`} role="marquee" aria-label={label}>
      <div ref={trackRef} className="marquee__track">
        <MarqueeGroup items={items} hidden={false} />
        <MarqueeGroup items={items} hidden />
      </div>
    </div>
  )
}
