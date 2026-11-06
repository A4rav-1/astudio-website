import { useRef } from 'react'
import { CompanyMark } from '../components/CompanyMark'
import { INTRO_STATEMENT, type StatementSegment } from '../content'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { routeHash } from '../lib/route'
import './IntroStatement.css'

function inDocumentOrder(elements: Element[]): Element[] {
  return [...elements].sort((first, second) =>
    first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  )
}

function StatementBrand({ segment }: { segment: StatementSegment }) {
  if (segment.brand === null) return segment.text
  if (segment.brand === 'hub') {
    return (
      <span className="intro__brand intro__brand--studio">
        <img className="intro__mark" src={`${import.meta.env.BASE_URL}mark.png`} alt="" width={28} height={28} />
        {segment.text}
      </span>
    )
  }
  return (
    <a className="intro__brand" href={routeHash(segment.brand)} data-company={segment.brand}>
      <CompanyMark company={segment.brand} className="intro__mark" />
      {segment.text}
    </a>
  )
}

export function IntroStatement() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      const text = textRef.current
      if (!text || reducedMotion) return
      const marks = [...text.querySelectorAll('.intro__mark')]
      const split = SplitText.create(text, {
        type: 'words',
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            inDocumentOrder([...self.words, ...marks]),
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
    <section ref={sectionRef} className="intro container" id="about" aria-label="About A Studio">
      <p className="eyebrow">Who we are</p>
      <p ref={textRef} className="intro__text">
        {INTRO_STATEMENT.map((segment) => (
          <StatementBrand key={segment.text} segment={segment} />
        ))}
      </p>
    </section>
  )
}
