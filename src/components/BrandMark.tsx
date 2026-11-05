import {
  BRAND_MARK_BARS,
  BRAND_MARK_STROKE_WIDTH,
  BRAND_MARK_VIEWBOX,
  type BarGeometry,
} from '../lib/brandMarkGeometry'
import './BrandMark.css'

interface BrandMarkProps {
  className?: string
  title?: string
  /** When set, the other two bars are dimmed so one company colour leads. */
  highlight?: BarGeometry['id']
}

const VIEWBOX = `${BRAND_MARK_VIEWBOX.x} ${BRAND_MARK_VIEWBOX.y} ${BRAND_MARK_VIEWBOX.width} ${BRAND_MARK_VIEWBOX.height}`

export function BrandMark({ className, title, highlight }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox={VIEWBOX}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {BRAND_MARK_BARS.map((bar) => {
        const dimmed = highlight !== undefined && bar.id !== highlight
        return (
          <path
            key={bar.id}
            className={`brand-mark__bar brand-mark__bar--${bar.id}${dimmed ? ' brand-mark__bar--dim' : ''}`}
            d={`M ${bar.from[0]} ${bar.from[1]} L ${bar.to[0]} ${bar.to[1]}`}
            stroke={bar.color}
            strokeWidth={BRAND_MARK_STROKE_WIDTH}
            strokeLinecap="round"
            fill="none"
            pathLength={1}
          />
        )
      })}
    </svg>
  )
}
