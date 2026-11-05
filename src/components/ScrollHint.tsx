import type { ScrollHintPhase } from '../lib/scrollHint'
import './ScrollHint.css'

interface ScrollHintProps {
  phase: ScrollHintPhase
  startLabel: string
  activeLabel: string
  className?: string
}

export function ScrollHint({ phase, startLabel, activeLabel, className = '' }: ScrollHintProps) {
  const label = phase === 'start' ? startLabel : activeLabel
  return (
    <div className={`scroll-hint scroll-hint--${phase} ${className}`.trim()} aria-hidden="true" data-phase={phase}>
      <span className="scroll-hint__mouse">
        <span className="scroll-hint__wheel" />
      </span>
      <span className="scroll-hint__label">{label}</span>
      <span className="scroll-hint__chevrons">
        <span />
        <span />
        <span />
      </span>
    </div>
  )
}
