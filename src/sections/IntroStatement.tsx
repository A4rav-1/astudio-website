import { useRef } from 'react'
import { INTRO_STATEMENT } from '../content'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import './IntroStatement.css'

export function IntroStatement() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      const text = textRef.current
      if (!text || reducedMotion) return
      const split = SplitText.create(text, {
        type: 'words',
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: 'none',
              stagger: 0.12,
              scrollTrigger: { trigger: text, start: 'top 78%', end: 'bottom 45%', scrub: true },
            },
          ),
      })
      return () => split.revert()
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  )

  return (
    <section ref={sectionRef} className="intro container" aria-label="About A Studio">
      <p className="eyebrow">Who we are</p>
      <p ref={textRef} className="intro__text">
        {INTRO_STATEMENT}
      </p>
    </section>
  )
}
