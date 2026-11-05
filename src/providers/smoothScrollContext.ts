import { createContext, useContext } from 'react'

export interface ScrollSnapshot {
  scroll: number
  limit: number
  velocity: number
  direction: -1 | 0 | 1
  progress: number
}

export type ScrollListener = (snapshot: ScrollSnapshot) => void

export interface SmoothScrollApi {
  subscribe: (listener: ScrollListener) => () => void
  scrollTo: (target: string | number) => void
  jumpToTop: () => void
  lock: () => void
  unlock: () => void
}

export const SmoothScrollContext = createContext<SmoothScrollApi | null>(null)

export function useSmoothScroll(): SmoothScrollApi {
  const api = useContext(SmoothScrollContext)
  if (!api) throw new Error('useSmoothScroll must be used inside <SmoothScrollProvider>')
  return api
}
