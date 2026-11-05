import { useRef } from 'react'
import { LOCATION } from '../content'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { formatCounter } from '../lib/format'
import { gsap, useGSAP } from '../lib/gsap'
import { useSmoothScroll } from '../providers/smoothScrollContext'
import { BrandMark } from './BrandMark'
import './Loader.css'

const PANEL_COUNT = 5
const WORDMARK = 'A Studio'

interface LoaderProps {
  onReveal: () => void
  onDone: () => void
}

export function Loader({ onReveal, onDone }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const scroll = useSmoothScroll()

  useGSAP(
    () => {
      scroll.lock()
      const counter = counterRef.current
      if (!counter) throw new Error('Loader counter element is missing')

      if (reducedMotion) {
        counter.textContent = formatCounter(100)
        gsap.set('.brand-mark__bar', { autoAlpha: 1 })
        gsap
          .timeline({ delay: 0.3 })
          .call(() => {
            scroll.unlock()
            onReveal()
          })
          .to(rootRef.current, { autoAlpha: 0, duration: 0.4, ease: 'power1.out' })
          .call(onDone)
        return
      }

      const progress = { value: 0 }
      const intro = gsap.timeline({ paused: true })
      intro
        .set('.brand-mark__bar', { strokeDasharray: '1 1', strokeDashoffset: 1, autoAlpha: 1 })
        .to(
          progress,
          {
            value: 100,
            duration: 2.4,
            ease: 'power2.inOut',
            onUpdate: () => {
              counter.textContent = formatCounter(progress.value)
            },
          },
          0,
        )
        .to('.brand-mark__bar', { strokeDashoffset: 0, duration: 0.9, ease: 'expo.inOut', stagger: 0.28 }, 0.15)
        .from('.brand-mark__bar', { x: -60, y: -110, duration: 1.1, ease: 'expo.out', stagger: 0.28 }, 0.15)
        .from('.loader__char', { yPercent: 110, duration: 1, stagger: 0.04 }, 1.1)
        .from('.loader__meta', { autoAlpha: 0, y: 12, duration: 0.8, stagger: 0.08 }, 0.4)

      const outro = gsap.timeline({ paused: true })
      outro
        .to('.loader__content', { yPercent: -18, autoAlpha: 0, duration: 0.9, ease: 'expo.in' })
        .call(() => {
          scroll.unlock()
          onReveal()
        })
        .to('.loader__panel', { yPercent: -100, duration: 1.15, ease: 'expo.inOut', stagger: 0.07 }, '-=0.2')
        .call(onDone)

      const introDone = new Promise<void>((resolve) => {
        intro.eventCallback('onComplete', () => resolve())
      })
      intro.play()
      Promise.all([introDone, document.fonts.ready]).then(() => outro.play(), (reason: unknown) => {
        console.error('Loader could not wait for fonts', reason)
        outro.play()
      })
    },
    { scope: rootRef, dependencies: [] },
  )

  return (
    <div ref={rootRef} className="loader" role="status" aria-label="Loading A Studio">
      <div className="loader__panels" aria-hidden="true">
        {Array.from({ length: PANEL_COUNT }, (_, index) => (
          <span key={index} className="loader__panel" />
        ))}
      </div>
      <div className="loader__content">
        <div className="loader__brand">
          <BrandMark className="loader__mark" />
          <p className="loader__wordmark" aria-hidden="true">
            {WORDMARK.split('').map((char, index) => (
              <span key={index} className="loader__char-mask">
                <span className="loader__char">{char === ' ' ? ' ' : char}</span>
              </span>
            ))}
          </p>
        </div>
        <span ref={counterRef} className="loader__counter">
          000
        </span>
        <p className="loader__meta loader__meta--left">Drones · Websites · Exam Trainer</p>
        <p className="loader__meta loader__meta--right">{LOCATION}</p>
      </div>
    </div>
  )
}
