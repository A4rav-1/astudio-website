import { useRef } from 'react'
import { PRINCIPLES, PRINCIPLES_SECTION } from '../content'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { gsap, useGSAP } from '../lib/gsap'
import './Principles.css'

export function Principles() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.from('.principle', {
        y: 70,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.principles__grid', start: 'top 82%', toggleActions: 'play none none reverse' },
      })
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  )

  return (
    <section ref={sectionRef} className="principles" aria-labelledby="principles-title">
      <div className="container">
        <header className="principles__header">
          <p className="eyebrow">{PRINCIPLES_SECTION.eyebrow}</p>
          <h2 id="principles-title" className="principles__title">
            {PRINCIPLES_SECTION.title}
          </h2>
        </header>
        <div className="principles__grid">
          {PRINCIPLES.map((principle) => (
            <article key={principle.index} className="principle">
              <span className="principle__index" aria-hidden="true">
                {principle.index}
              </span>
              <h3 className="principle__title">{principle.title}</h3>
              <p className="principle__body">{principle.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
