import { useEffect, useRef } from 'react'
import { useSmoothScroll } from '../providers/smoothScrollContext'
import './ScrollProgress.css'

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  const scroll = useSmoothScroll()

  useEffect(
    () =>
      scroll.subscribe(({ progress }) => {
        const bar = barRef.current
        if (bar) bar.style.transform = `scaleX(${progress})`
      }),
    [scroll],
  )

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={barRef} className="scroll-progress__bar" />
    </div>
  )
}
