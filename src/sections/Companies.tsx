import { useRef, type PointerEvent } from 'react'
import { BrandMark } from '../components/BrandMark'
import { RevealHeading } from '../components/RevealHeading'
import { COMPANIES, COMPANIES_SECTION, OTHER_COMPANIES_SECTION } from '../content'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { gsap, useGSAP } from '../lib/gsap'
import { pointerPercent } from '../lib/pointer'
import { routeHash, type CompanyRouteId } from '../lib/route'
import './Companies.css'

interface CompaniesProps {
  /** When set, that company is left out and the section reads as a cross-link to the others. */
  excludeCompany?: CompanyRouteId
}

export function Companies({ excludeCompany }: CompaniesProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const copy = excludeCompany ? OTHER_COMPANIES_SECTION : COMPANIES_SECTION
  const companies = COMPANIES.filter((company) => company.id !== excludeCompany)

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.from('.company-card', {
        y: 90,
        autoAlpha: 0,
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.14,
        scrollTrigger: { trigger: '.companies__grid', start: 'top 82%', toggleActions: 'play none none reverse' },
      })
    },
    { scope: sectionRef, dependencies: [reducedMotion, excludeCompany] },
  )

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const card = event.currentTarget
    const position = pointerPercent({ x: event.clientX, y: event.clientY }, card.getBoundingClientRect())
    card.style.setProperty('--pointer-x', `${position.x}%`)
    card.style.setProperty('--pointer-y', `${position.y}%`)
  }

  return (
    <section ref={sectionRef} id="companies" className="companies" aria-labelledby="companies-title">
      <div className="container">
        <header className="companies__header">
          <p className="eyebrow">{copy.eyebrow}</p>
          <RevealHeading id="companies-title">{copy.title}</RevealHeading>
        </header>
        <div className="companies__grid" data-count={companies.length}>
          {companies.map((company) => (
            <a
              key={company.id}
              href={routeHash(company.id)}
              className="company-card"
              data-company={company.id}
              onPointerMove={onPointerMove}
            >
              <span className="company-card__glow" aria-hidden="true" />
              <BrandMark className="company-card__mark" highlight={company.markHighlight} />
              <span className="company-card__index" aria-hidden="true">
                {company.index}
              </span>
              <span className="company-card__text">
                <span className="company-card__tagline">{company.tagline}</span>
                <span className="company-card__name">{company.name}</span>
                <span className="company-card__body">{company.body}</span>
              </span>
              <span className="company-card__enter">
                {company.linkLabel}
                <span aria-hidden="true" className="company-card__arrow">
                  →
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
