import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { RouteCurtain } from '../components/RouteCurtain'
import { PAGE_META } from '../content'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { faviconForRoute } from '../lib/companyMarks'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { parseRoute, routeHash, type RouteId } from '../lib/route'
import { RouterContext, type RouterApi } from './routerContext'
import { useSmoothScroll } from './smoothScrollContext'

const COVER_DURATION_S = 0.75
const REVEAL_DURATION_S = 0.85
const BAR_STAGGER_S = 0.09
const HOLD_S = 0.12

export function RouterProvider({ children }: { children: ReactNode }) {
  const scroll = useSmoothScroll()
  const reducedMotion = usePrefersReducedMotion()
  const [route, setRoute] = useState<RouteId>(() => parseRoute(window.location.hash, 'hub'))
  const routeRef = useRef<RouteId>(route)
  const curtainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = PAGE_META[route].documentTitle
    const icon = document.querySelector<HTMLLinkElement>("link[rel='icon']")
    if (!icon) throw new Error('index.html is missing its favicon link')
    const favicon = faviconForRoute(route, import.meta.env.BASE_URL)
    icon.type = favicon.type
    icon.href = favicon.href
  }, [route])

  useEffect(() => {
    const state: { transitioning: boolean; timeline: gsap.core.Timeline | null } = { transitioning: false, timeline: null }

    const commit = (next: RouteId) => {
      routeRef.current = next
      flushSync(() => setRoute(next))
      scroll.jumpToTop()
      ScrollTrigger.refresh()
    }

    function syncToHash() {
      if (state.transitioning) return
      const next = parseRoute(window.location.hash, routeRef.current)
      if (next === routeRef.current) return

      const curtain = curtainRef.current
      if (reducedMotion || !curtain) {
        commit(next)
        return
      }

      state.transitioning = true
      scroll.lock()
      const bars = Array.from(curtain.children)
      state.timeline = gsap
        .timeline({
          onComplete: () => {
            state.transitioning = false
            state.timeline = null
            scroll.unlock()
            syncToHash()
          },
        })
        .set(curtain, { visibility: 'visible' })
        .fromTo(
          bars,
          { scaleY: 0, transformOrigin: '50% 100%' },
          { scaleY: 1, duration: COVER_DURATION_S, ease: 'expo.inOut', stagger: BAR_STAGGER_S },
        )
        .add(() => commit(next))
        .to(bars, {
          scaleY: 0,
          transformOrigin: '50% 0%',
          duration: REVEAL_DURATION_S,
          ease: 'expo.inOut',
          stagger: BAR_STAGGER_S,
          delay: HOLD_S,
        })
        .set(curtain, { visibility: 'hidden' })
    }

    window.addEventListener('hashchange', syncToHash)
    return () => {
      window.removeEventListener('hashchange', syncToHash)
      state.timeline?.kill()
      if (state.transitioning) scroll.unlock()
    }
  }, [reducedMotion, scroll])

  const navigate = useCallback(
    (target: RouteId) => {
      if (target === routeRef.current) {
        scroll.scrollTo(0)
        return
      }
      window.location.hash = routeHash(target)
    },
    [scroll],
  )

  const api = useMemo<RouterApi>(() => ({ route, navigate }), [route, navigate])

  return (
    <RouterContext.Provider value={api}>
      {children}
      <RouteCurtain ref={curtainRef} />
    </RouterContext.Provider>
  )
}
