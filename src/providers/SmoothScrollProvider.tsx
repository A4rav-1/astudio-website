import Lenis from 'lenis'
import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { easeOutExpo } from '../lib/easing'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { SmoothScrollContext, type ScrollListener, type ScrollSnapshot, type SmoothScrollApi } from './smoothScrollContext'

const LOCK_CLASS = 'is-scroll-locked'
const SCROLL_TO_DURATION_S = 1.8

function readNativeSnapshot(previousScroll: number): ScrollSnapshot {
  const scroll = window.scrollY
  const limit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const delta = scroll - previousScroll
  return {
    scroll,
    limit,
    velocity: delta,
    direction: delta > 0 ? 1 : delta < 0 ? -1 : 0,
    progress: limit === 0 ? 0 : scroll / limit,
  }
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)
  const listenersRef = useRef<Set<ScrollListener>>(new Set())

  useEffect(() => {
    const emit = (snapshot: ScrollSnapshot) => {
      for (const listener of listenersRef.current) listener(snapshot)
    }

    if (reducedMotion) {
      const tracker = { previousScroll: window.scrollY }
      const onScroll = () => {
        const snapshot = readNativeSnapshot(tracker.previousScroll)
        tracker.previousScroll = snapshot.scroll
        emit(snapshot)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    const lenis = new Lenis({ autoRaf: false, lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 })
    lenisRef.current = lenis
    const offScroll = lenis.on('scroll', (instance: Lenis) => {
      ScrollTrigger.update()
      emit({
        scroll: instance.scroll,
        limit: instance.limit,
        velocity: instance.velocity,
        direction: instance.direction,
        progress: instance.progress,
      })
    })
    const tick = (timeSeconds: number) => lenis.raf(timeSeconds * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      offScroll()
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reducedMotion])

  const api = useMemo<SmoothScrollApi>(
    () => ({
      subscribe(listener) {
        listenersRef.current.add(listener)
        return () => {
          listenersRef.current.delete(listener)
        }
      },
      scrollTo(target) {
        const lenis = lenisRef.current
        if (lenis) {
          lenis.scrollTo(target, { duration: SCROLL_TO_DURATION_S, easing: easeOutExpo })
          return
        }
        if (typeof target === 'number') {
          window.scrollTo({ top: target })
          return
        }
        document.querySelector(target)?.scrollIntoView()
      },
      jumpToTop() {
        const lenis = lenisRef.current
        if (lenis) {
          lenis.scrollTo(0, { immediate: true, force: true })
          return
        }
        window.scrollTo({ top: 0 })
      },
      lock() {
        document.documentElement.classList.add(LOCK_CLASS)
        lenisRef.current?.stop()
      },
      unlock() {
        document.documentElement.classList.remove(LOCK_CLASS)
        lenisRef.current?.start()
      },
    }),
    [],
  )

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>
}
