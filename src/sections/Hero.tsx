import { lazy, Suspense, useRef, type MouseEvent } from 'react'
import { BrandMark } from '../components/BrandMark'
import { CanvasBoundary } from '../components/CanvasBoundary'
import { CompanyMark } from '../components/CompanyMark'
import { GradientFallback } from '../components/GradientFallback'
import { MagneticButton } from '../components/MagneticButton'
import { ScrollHint } from '../components/ScrollHint'
import { PAGE_META } from '../content'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useRenderQuality } from '../hooks/useRenderQuality'
import { useWebGLSupport } from '../hooks/useWebGLSupport'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { normalisedPointer } from '../lib/pointer'
import { routeHash, type HeroRouteId } from '../lib/route'
import { useIntroComplete } from '../providers/introContext'
import { useSmoothScroll } from '../providers/smoothScrollContext'
import './Hero.css'

const GradientBackground = lazy(() =>
  import('../components/GradientBackground').then((module) => ({ default: module.GradientBackground })),
)

interface HeroProps {
  route: HeroRouteId
}

export function Hero({ route }: HeroProps) {
  const { hero, gradient } = PAGE_META[route]
  const sectionRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const introComplete = useIntroComplete()
  const reducedMotion = useReducedMotion()
  const quality = useRenderQuality()
  const webGL = useWebGLSupport()
  const inView = useInView(sectionRef, '160px')
  const scroll = useSmoothScroll()

  useGSAP(
    () => {
      if (!introComplete) return
      if (reducedMotion) {
        gsap.from('.hero__reveal', { autoAlpha: 0, duration: 0.6, ease: 'power1.out', stagger: 0.05 })
        return
      }

      const split = SplitText.create('.hero__title', {
        type: 'lines,chars',
        mask: 'lines',
        linesClass: 'split-line-mask',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 120,
            rotate: 6,
            duration: 1.5,
            ease: 'expo.out',
            stagger: 0.035,
            delay: 0.15,
          }),
      })

      const intro = gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.hero__logo', { scale: 0.7, autoAlpha: 0, duration: 1.6 }, 0)
      if (route === 'hub') {
        intro
          .fromTo(
            '.hero__mark .brand-mark__bar',
            { strokeDasharray: '1 1', strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.5, ease: 'expo.inOut', stagger: 0.2 },
            0.1,
          )
          .from('.hero__mark .brand-mark__bar', { x: -50, y: -90, duration: 1.4, ease: 'expo.out', stagger: 0.2 }, 0.1)
      } else {
        intro.from('.hero__mark--company', { x: -40, y: -70, rotate: -8, duration: 1.6 }, 0.1)
      }
      intro
        .from('.hero__halo', { scale: 0.3, autoAlpha: 0, duration: 2.4 }, 0)
        .from('.hero__veil', { opacity: 1, duration: 2 }, 0)
        .from('.hero__reveal', { y: 40, autoAlpha: 0, duration: 1.4, stagger: 0.08 }, 0.5)

      gsap
        .timeline({
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        .to('.hero__logo-wrap', { yPercent: -28, scale: 0.78, ease: 'none' }, 0)
        .to('.hero__title', { yPercent: -40, ease: 'none' }, 0)
        .to('.hero__aside', { yPercent: -60, autoAlpha: 0, ease: 'none' }, 0)
        .to('.hero__shade', { opacity: 1, ease: 'none' }, 0)

      gsap.to('.hero__scroll-hint', {
        autoAlpha: 0,
        y: 16,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '+=220', scrub: true },
      })

      return () => split.revert()
    },
    { scope: sectionRef, dependencies: [introComplete, reducedMotion, route] },
  )

  useGSAP(
    () => {
      const logo = logoRef.current
      const section = sectionRef.current
      if (!logo || !section || reducedMotion) return
      const rotateX = gsap.quickTo(logo, 'rotationX', { duration: 1.2, ease: 'power3.out' })
      const rotateY = gsap.quickTo(logo, 'rotationY', { duration: 1.2, ease: 'power3.out' })
      const onMove = (event: PointerEvent) => {
        const pointer = normalisedPointer({ x: event.clientX, y: event.clientY }, section.getBoundingClientRect())
        rotateX(-pointer.y * 10)
        rotateY(pointer.x * 14)
      }
      section.addEventListener('pointermove', onMove)
      return () => section.removeEventListener('pointermove', onMove)
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  )

  const onWatch = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scroll.scrollTo(hero.primaryHref)
  }

  return (
    <section ref={sectionRef} className={`hero${route === 'hub' ? ' hero--hub' : ''}`} id="top" aria-labelledby="hero-title">
      <div className="hero__backdrop" aria-hidden="true">
        {webGL ? (
          inView && (
            <CanvasBoundary label="Hero gradient" fallback={<GradientFallback colors={gradient} />}>
              <Suspense fallback={null}>
                <GradientBackground pixelDensity={quality.gradientPixelDensity} colors={gradient} />
              </Suspense>
            </CanvasBoundary>
          )
        ) : (
          <GradientFallback colors={gradient} />
        )}
        <div className="hero__veil" />
        {route === 'hub' && <div className="hero__tint" />}
        <div className="hero__vignette" />
        <div className="hero__shade" />
      </div>

      <div className="hero__logo-wrap" aria-hidden="true">
        <div className="hero__halo" />
        <div ref={logoRef} className="hero__logo">
          {route === 'hub' ? (
            <BrandMark className="hero__mark" />
          ) : (
            <CompanyMark company={route} className="hero__mark hero__mark--company" />
          )}
        </div>
      </div>

      <div className="hero__content container">
        <p className="eyebrow hero__reveal">{hero.eyebrow}</p>
        <h1 id="hero-title" className={`hero__title${hero.longTitle ? ' hero__title--long' : ''}`}>
          {hero.headlineLead} <span className="serif-accent hero__accent">{hero.headlineAccent}</span>
        </h1>
        <div className="hero__aside">
          {hero.body !== null && <p className="hero__body hero__reveal">{hero.body}</p>}
          <div className="hero__ctas hero__reveal">
            <MagneticButton href={hero.primaryHref} onClick={onWatch}>
              {hero.primaryCta}
              <span aria-hidden="true">↓</span>
            </MagneticButton>
            <MagneticButton href={routeHash('start')} variant="ghost">
              {hero.secondaryCta}
            </MagneticButton>
          </div>
        </div>
      </div>

      <ScrollHint
        className="hero__reveal hero__scroll-hint"
        phase="start"
        startLabel={hero.scrollCue}
        activeLabel={hero.scrollCue}
      />
    </section>
  )
}
