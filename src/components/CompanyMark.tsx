import { COMPANY_MARK_STROKE_WIDTH, COMPANY_MARKS } from '../lib/companyMarks'
import type { CompanyRouteId } from '../lib/route'

interface CompanyMarkProps {
  company: CompanyRouteId
  className?: string
}

/** A sub-brand logo. Sets data-company so it always draws in its own accent colour. */
export function CompanyMark({ company, className }: CompanyMarkProps) {
  const { viewBox, bars } = COMPANY_MARKS[company]
  return (
    <svg className={className} viewBox={viewBox} data-company={company} aria-hidden="true">
      {bars.map((bar) => (
        <path
          key={`${bar.to[0]}-${bar.to[1]}`}
          className="brand-mark__bar"
          d={`M ${bar.from[0]} ${bar.from[1]} L ${bar.to[0]} ${bar.to[1]}`}
          style={{ stroke: 'var(--accent)' }}
          strokeWidth={COMPANY_MARK_STROKE_WIDTH}
          strokeLinecap="round"
          fill="none"
          opacity={bar.opacity}
          pathLength={1}
        />
      ))}
    </svg>
  )
}
