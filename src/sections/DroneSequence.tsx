import { lazy, Suspense, useRef, useState } from 'react'
import { CanvasBoundary } from '../components/CanvasBoundary'
import { CompanyMark } from '../components/CompanyMark'
import { RevealHeading } from '../components/RevealHeading'
import { ScrollHint } from '../components/ScrollHint'
import { DRONE_CALLOUTS, DRONE_SECTION, DRONE_STEPS, SCROLL_HINTS } from '../content'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useRenderQuality } from '../hooks/useRenderQuality'
import { useWebGLSupport } from '../hooks/useWebGLSupport'
import { stepIndexAt } from '../lib/droneTimeline'
import { formatStepLabel } from '../lib/format'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { scrollHintPhase, type ScrollHintPhase } from '../lib/scrollHint'
import './DroneSequence.css'

const PIN_LENGTH_VIEWPORTS = 2.6

const DroneCanvas = lazy(() => import('../scenes/drone/DroneCanvas').then((module) => ({ default: module.DroneCanvas })))

export function DroneSequence() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const railFillRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef(0)
  const calloutElements = useRef<(HTMLElement | null)[]>([])
  const [activeStep, setActiveStep] = useState(0)
  const [hintPhase, setHintPhase] = useState<ScrollHintPhase>('start')
  const reducedMotion = useReducedMotion()
  const quality = useRenderQuality()
  const stageInView = useInView(stageRef, '120px')
  const webGL = useWebGLSupport()
  const droneFallback = (
    <div className="drone__fallback" aria-hidden="true">
      <CompanyMark company="drone" className="drone__fallback-mark" />
    </div>
  )

  useGSAP(
    () => {
      const stage = stageRef.current
      if (!stage) return
      if (reducedMotion) {
        progressRef.current = 1
        setActiveStep(DRONE_STEPS.length - 1)
        return
      }
      progressRef.current = 0
      const trigger = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: () => `+=${window.innerHeight * PIN_LENGTH_VIEWPORTS}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress
          setActiveStep(stepIndexAt(self.progress))
          setHintPhase(scrollHintPhase(self.progress))
          const fill = railFillRef.current
          if (fill) fill.style.transform = `scaleY(${self.progress})`
        },
      })
      return () => trigger.kill()
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  )

  return (
    <section
      ref={sectionRef}
      id="drone"
      className={`drone${reducedMotion ? ' drone--static' : ''}`}
      aria-labelledby="drone-title"
    >
      <div className="drone__intro container">
        <p className="eyebrow">{DRONE_SECTION.eyebrow}</p>
        <RevealHeading id="drone-title">{DRONE_SECTION.title}</RevealHeading>
      </div>

      <div ref={stageRef} className="drone__stage">
        <div className="drone__viewport">
          {webGL ? (
            <CanvasBoundary label="Drone scene" fallback={droneFallback}>
              <Suspense fallback={null}>
                <DroneCanvas
                  progressRef={progressRef}
                  calloutElements={calloutElements}
                  quality={quality}
                  active={stageInView}
                  staticFrame={reducedMotion}
                />
              </Suspense>
            </CanvasBoundary>
          ) : (
            droneFallback
          )}
          <div className="drone__callouts" aria-hidden="true">
            {DRONE_CALLOUTS.map((callout, index) => (
              <div
                key={callout.id}
                className="callout"
                ref={(element) => {
                  calloutElements.current[index] = element
                }}
              >
                <span className="callout__dot" />
                <span className="callout__line" />
                <span className="callout__label">{callout.label}</span>
              </div>
            ))}
          </div>
        </div>

        <ol className="drone__captions">
          {DRONE_STEPS.map((step, index) => (
            <li
              key={step.title}
              className={`drone__caption${index === activeStep ? ' is-active' : ''}`}
              aria-current={index === activeStep ? 'step' : undefined}
            >
              <span className="drone__caption-index">{formatStepLabel(index, DRONE_STEPS.length)}</span>
              <h3 className="drone__caption-title">{step.title}</h3>
              <p className="drone__caption-body">{step.body}</p>
            </li>
          ))}
        </ol>

        {!reducedMotion && (
          <ScrollHint phase={hintPhase} startLabel={SCROLL_HINTS.drone.start} activeLabel={SCROLL_HINTS.drone.active} />
        )}

        <div className="drone__rail" aria-hidden="true">
          <span ref={railFillRef} className="drone__rail-fill" />
          {DRONE_STEPS.map((step, index) => (
            <span key={step.title} className={`drone__rail-tick${index <= activeStep ? ' is-passed' : ''}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
