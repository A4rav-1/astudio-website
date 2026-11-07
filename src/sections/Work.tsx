import { useRef } from 'react'
import { RevealHeading } from '../components/RevealHeading'
import { SitePreview } from '../components/SitePreview'
import { WORK, WORK_SECTION } from '../content'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap, useGSAP } from '../lib/gsap'
import './Work.css'

export function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.utils.toArray<HTMLElement>('.work-card').forEach((card) => {
        const media = card.querySelector('.work-card__media')
        const parallax = card.querySelector('.site-preview__parallax')
        const meta = card.querySelectorAll('.work-card__reveal')

        gsap.fromTo(
          media,
          { clipPath: 'inset(16% 12% 16% 12% round 28px)', scale: 0.92 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 28px)',
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 35%', scrub: true },
          },
        )
        gsap.fromTo(
          parallax,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
        gsap.from(meta, {
          y: 60,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1.3,
          scrollTrigger: { trigger: card, start: 'top 70%', once: true },
        })
      })
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  )

  return (
    <section ref={sectionRef} id="work" className="work" aria-labelledby="work-title">
      <div className="container work__inner">
        <header className="work__header">
          <p className="eyebrow">{WORK_SECTION.eyebrow}</p>
          <RevealHeading id="work-title">{WORK_SECTION.title}</RevealHeading>
        </header>

        {WORK.map((project, index) => (
          <article key={project.id} className={`work-card${index % 2 === 1 ? ' work-card--reverse' : ''}`}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="work-card__media"
              data-cursor-label="Visit"
              aria-label={`Visit ${project.name} (opens in a new tab)`}
            >
              <SitePreview url={project.url} displayUrl={project.displayUrl} title={project.name} />
            </a>
            <div className="work-card__meta">
              <span className="work-card__index work-card__reveal">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="work-card__name work-card__reveal">{project.name}</h3>
              <p className="work-card__kind work-card__reveal">{project.kind}</p>
              <p className="work-card__body work-card__reveal">{project.body}</p>
              <ul className="work-card__tags work-card__reveal">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <a
                className="work-card__visit work-card__reveal"
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit {project.displayUrl}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
