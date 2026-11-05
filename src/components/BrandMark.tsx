import { BRAND_MARK_BARS, BRAND_MARK_STROKE_WIDTH, BRAND_MARK_VIEWBOX } from '../lib/brandMarkGeometry'

interface BrandMarkProps {
  className?: string
  title?: string
}

const VIEWBOX = `${BRAND_MARK_VIEWBOX.x} ${BRAND_MARK_VIEWBOX.y} ${BRAND_MARK_VIEWBOX.width} ${BRAND_MARK_VIEWBOX.height}`

export function BrandMark({ className, title }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox={VIEWBOX}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {BRAND_MARK_BARS.map((bar) => (
        <path
          key={bar.id}
          className={`brand-mark__bar brand-mark__bar--${bar.id}`}
          d={`M ${bar.from[0]} ${bar.from[1]} L ${bar.to[0]} ${bar.to[1]}`}
          stroke={bar.color}
          strokeWidth={BRAND_MARK_STROKE_WIDTH}
          strokeLinecap="round"
          fill="none"
          pathLength={1}
        />
      ))}
    </svg>
  )
}
