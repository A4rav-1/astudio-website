import { useEffect, useRef } from 'react'
import { FINE_POINTER_QUERY, useMediaQuery, usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { gsap } from '../lib/gsap'
import './Cursor.css'

const INTERACTIVE_SELECTOR = 'a, button, [data-cursor]'
const ROOT_CLASS = 'has-custom-cursor'

export function Cursor() {
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY)
  const reducedMotion = usePrefersReducedMotion()
  const enabled = hasFinePointer && !reducedMotion
  const rootRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!enabled || !root || !dot || !ring || !label) return

    document.documentElement.classList.add(ROOT_CLASS)
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (event: PointerEvent) => {
      root.classList.add('is-visible')
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
    }

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(INTERACTIVE_SELECTOR) : null
      const text = target?.dataset.cursorLabel ?? ''
      label.textContent = text
      root.classList.toggle('is-hovering', Boolean(target) && !text)
      root.classList.toggle('is-labelled', Boolean(text))
    }

    const onLeaveWindow = () => root.classList.remove('is-visible')
    const onDown = () => root.classList.add('is-pressed')
    const onUp = () => root.classList.remove('is-pressed')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeaveWindow)

    return () => {
      document.documentElement.classList.remove(ROOT_CLASS)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={rootRef} className="cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor__ring">
        <span ref={labelRef} className="cursor__label" />
      </div>
      <div ref={dotRef} className="cursor__dot" />
    </div>
  )
}
