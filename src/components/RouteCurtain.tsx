import { forwardRef } from 'react'
import { BRAND_MARK_BARS } from '../lib/brandMarkGeometry'
import './RouteCurtain.css'

export const RouteCurtain = forwardRef<HTMLDivElement>(function RouteCurtain(_props, ref) {
  return (
    <div ref={ref} className="route-curtain" aria-hidden="true">
      {BRAND_MARK_BARS.map((bar) => (
        <span key={bar.id} className="route-curtain__bar" style={{ backgroundColor: bar.color }} />
      ))}
    </div>
  )
})
