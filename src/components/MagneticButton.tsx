import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { gsap } from '../lib/gsap'
import { magneticOffset } from '../lib/pointer'
import './MagneticButton.css'

interface MagneticButtonProps {
  href: string
  children: ReactNode
  variant?: 'solid' | 'ghost' | 'giant'
  strength?: number
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  cursorLabel?: string
}

export function MagneticButton({ href, children, variant = 'solid', strength = 0.35, onClick, cursorLabel }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const button = buttonRef.current
    const label = labelRef.current
    if (!button || !label || reducedMotion) return

    const moveX = gsap.quickTo(button, 'x', { duration: 0.6, ease: 'power3.out' })
    const moveY = gsap.quickTo(button, 'y', { duration: 0.6, ease: 'power3.out' })
    const labelX = gsap.quickTo(label, 'x', { duration: 0.6, ease: 'power3.out' })
    const labelY = gsap.quickTo(label, 'y', { duration: 0.6, ease: 'power3.out' })

    const onMove = (event: PointerEvent) => {
      const offset = magneticOffset({ x: event.clientX, y: event.clientY }, button.getBoundingClientRect(), strength)
      moveX(offset.x)
      moveY(offset.y)
      labelX(offset.x * 0.45)
      labelY(offset.y * 0.45)
    }
    const onLeave = () => {
      gsap.to([button, label], { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.4)', overwrite: true })
    }

    button.addEventListener('pointermove', onMove)
    button.addEventListener('pointerleave', onLeave)
    return () => {
      button.removeEventListener('pointermove', onMove)
      button.removeEventListener('pointerleave', onLeave)
    }
  }, [reducedMotion, strength])

  return (
    <a
      ref={buttonRef}
      href={href}
      className={`magnetic magnetic--${variant}`}
      onClick={onClick}
      data-cursor-label={cursorLabel}
    >
      <span className="magnetic__fill" aria-hidden="true" />
      <span ref={labelRef} className="magnetic__label">
        {children}
      </span>
    </a>
  )
}
