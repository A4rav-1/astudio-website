export type ScrollHintPhase = 'start' | 'active' | 'done'

const START_PHASE_END = 0.04
const DONE_PHASE_START = 0.94

/** Which prompt a pinned, scroll-driven section should show for a 0–1 scroll progress. */
export function scrollHintPhase(progress: number): ScrollHintPhase {
  if (progress >= DONE_PHASE_START) return 'done'
  if (progress < START_PHASE_END) return 'start'
  return 'active'
}
