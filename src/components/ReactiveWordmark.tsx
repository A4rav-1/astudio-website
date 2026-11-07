import { useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap, useGSAP } from '../lib/gsap'
import { proximityFalloff } from '../lib/pointer'
import './ReactiveWordmark.css'

interface ReactiveWordmarkProps {
  text: string
}

const LIFT_EM = 0.16
const RADIUS_FRACTION = 0.24

/** Giant wordmark whose letters rise and light up near the cursor. */
export function ReactiveWordmark({ text }: ReactiveWordmarkProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const wrap = wrapRef.current
      const spot = spotRef.current
      if (!wrap || !spot || reducedMotion) return
      const chars = gsap.utils.toArray<HTMLElement>('.wordmark__char', wrap)

      gsap.from(chars, {
        yPercent: 120,
        duration: 1.6,
        stagger: 0.05,
        ease: 'expo.out',
        scrollTrigger: { trigger: wrap, start: 'top 92%', once: true },
      })

      const lifts = chars.map((char) => gsap.quickTo(char, 'y', { duration: 0.7, ease: 'power3.out' }))
      const spotX = gsap.quickTo(spot, 'x', { duration: 0.9, ease: 'power3.out' })
      const spotY = gsap.quickTo(spot, 'y', { duration: 0.9, ease: 'power3.out' })

      const onMove = (event: PointerEvent) => {
        const wrapRect = wrap.getBoundingClientRect()
        const radius = wrapRect.width * RADIUS_FRACTION
        const fontSize = parseFloat(getComputedStyle(wrap).fontSize)
        spotX(event.clientX - wrapRect.left)
        spotY(event.clientY - wrapRect.top)
        chars.forEach((char, index) => {
          const rect = char.getBoundingClientRect()
          const distance = Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2))
          const heat = proximityFalloff(distance, radius)
          char.style.setProperty('--heat', heat.toFixed(3))
          lifts[index](-heat * fontSize * LIFT_EM)
        })
      }
      const onEnter = () => wrap.classList.add('is-active')
      const onLeave = () => {
        wrap.classList.remove('is-active')
        chars.forEach((char, index) => {
          char.style.setProperty('--heat', '0')
          lifts[index](0)
        })
      }

      wrap.addEventListener('pointermove', onMove)
      wrap.addEventListener('pointerenter', onEnter)
      wrap.addEventListener('pointerleave', onLeave)
      return () => {
        wrap.removeEventListener('pointermove', onMove)
        wrap.removeEventListener('pointerenter', onEnter)
        wrap.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: wrapRef, dependencies: [reducedMotion] },
  )

  return (
    <div ref={wrapRef} className="wordmark">
      <div ref={spotRef} className="wordmark__spot" aria-hidden="true" />
      <p className="wordmark__text" aria-label={text}>
        {text.split('').map((char, index) => (
          <span key={index} className="wordmark__mask" aria-hidden="true">
            <span className="wordmark__char">{char === ' ' ? ' ' : char}</span>
          </span>
        ))}
      </p>
    </div>
  )
}
