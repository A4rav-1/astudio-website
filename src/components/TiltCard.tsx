import { useEffect, useRef, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { gsap } from '../lib/gsap'
import { pointerPercent, tiltFromPointer } from '../lib/pointer'
import { GlassPanel } from './GlassPanel'
import './TiltCard.css'

interface TiltCardProps {
  children: ReactNode
  accent: string
  className?: string
  maxTiltDegrees?: number
}

/** Liquid-glass card that tilts toward the pointer and carries a spotlight that follows it. */
export function TiltCard({ children, accent, className = '', maxTiltDegrees = 9 }: TiltCardProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const shell = shellRef.current
    const body = bodyRef.current
    if (!shell || !body || reducedMotion) return

    const rotateX = gsap.quickTo(body, 'rotationX', { duration: 0.8, ease: 'power3.out' })
    const rotateY = gsap.quickTo(body, 'rotationY', { duration: 0.8, ease: 'power3.out' })

    const onMove = (event: PointerEvent) => {
      const rect = shell.getBoundingClientRect()
      const pointer = { x: event.clientX, y: event.clientY }
      const tilt = tiltFromPointer(pointer, rect, maxTiltDegrees)
      rotateX(tilt.rotateX)
      rotateY(tilt.rotateY)
      const percent = pointerPercent(pointer, rect)
      shell.style.setProperty('--spot-x', `${percent.x}%`)
      shell.style.setProperty('--spot-y', `${percent.y}%`)
    }
    const onEnter = () => shell.classList.add('is-lit')
    const onLeave = () => {
      shell.classList.remove('is-lit')
      rotateX(0)
      rotateY(0)
    }

    shell.addEventListener('pointermove', onMove)
    shell.addEventListener('pointerenter', onEnter)
    shell.addEventListener('pointerleave', onLeave)
    return () => {
      shell.removeEventListener('pointermove', onMove)
      shell.removeEventListener('pointerenter', onEnter)
      shell.removeEventListener('pointerleave', onLeave)
    }
  }, [maxTiltDegrees, reducedMotion])

  return (
    <div ref={shellRef} className={`tilt ${className}`} style={{ ['--accent' as string]: accent }}>
      <div ref={bodyRef} className="tilt__body">
        <GlassPanel className="tilt__glass" radius={30} bezel={28} refraction={60} blurPx={14}>
          <span className="tilt__spotlight" aria-hidden="true" />
          <span className="tilt__glare" aria-hidden="true" />
          <div className="tilt__content">{children}</div>
        </GlassPanel>
      </div>
    </div>
  )
}
