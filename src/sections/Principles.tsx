import { useRef } from 'react'
import type { PrincipleCopy, SectionCopy } from '../content'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap, useGSAP } from '../lib/gsap'
import './Principles.css'

interface PrinciplesProps {
  id?: string
  section: SectionCopy
  items: readonly PrincipleCopy[]
}

export function Principles({ id, section, items }: PrinciplesProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

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
    <section ref={sectionRef} id={id} className="principles" aria-labelledby={`${id ?? 'principles'}-title`}>
      <div className="container">
        <header className="principles__header">
          <p className="eyebrow">{section.eyebrow}</p>
          <h2 id={`${id ?? 'principles'}-title`} className="principles__title">
            {section.title}
          </h2>
        </header>
        <div className="principles__grid">
          {items.map((principle) => (
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
