import { useRef, type MouseEvent } from 'react'
import { RevealHeading } from '../components/RevealHeading'
import { ServiceGlyph } from '../components/ServiceGlyph'
import { TiltCard } from '../components/TiltCard'
import { SERVICES, SERVICES_SECTION } from '../content'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { gsap, useGSAP } from '../lib/gsap'
import { useSmoothScroll } from '../providers/smoothScrollContext'
import './Services.css'

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const scroll = useSmoothScroll()

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.from('.services__card', {
        y: 120,
        autoAlpha: 0,
        rotateX: -14,
        duration: 1.6,
        stagger: 0.12,
        scrollTrigger: { trigger: '.services__grid', start: 'top 85%', once: true },
      })
      gsap.to('.services__orb', {
        yPercent: (index: number) => [-30, 25, -45][index] ?? 0,
        xPercent: (index: number) => [10, -15, 20][index] ?? 0,
        rotate: (index: number) => `+=${[18, -12, 24][index] ?? 0}`,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  )

  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute('href')
    if (!href?.startsWith('#')) return
    event.preventDefault()
    scroll.scrollTo(href)
  }

  return (
    <section ref={sectionRef} id="services" className="services" aria-labelledby="services-title">
      <div className="services__backdrop" aria-hidden="true">
        <span className="services__orb services__orb--blue" />
        <span className="services__orb services__orb--yellow" />
        <span className="services__orb services__orb--red" />
      </div>

      <div className="container services__inner">
        <header className="services__header">
          <p className="eyebrow">{SERVICES_SECTION.eyebrow}</p>
          <RevealHeading id="services-title">{SERVICES_SECTION.title}</RevealHeading>
        </header>

        <ul className="services__grid">
          {SERVICES.map((service) => (
            <li key={service.id} className="services__card">
              <TiltCard accent={service.accent}>
                <article className="service">
                  <div className="service__top">
                    <span className="service__index">{service.index}</span>
                    <ServiceGlyph kind={service.id} />
                  </div>
                  <h3 className="service__title">{service.title}</h3>
                  <p className="service__body">{service.body}</p>
                  <a className="service__link" href={service.href} onClick={onLinkClick}>
                    {service.linkLabel}
                    <span aria-hidden="true" className="service__arrow">
                      →
                    </span>
                  </a>
                </article>
              </TiltCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
