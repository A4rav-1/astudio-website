import { companyMarkSrc } from '../lib/companyMarks'
import type { CompanyRouteId } from '../lib/route'

interface CompanyMarkProps {
  company: CompanyRouteId
  className?: string
}

/** A sub-brand logo. Decorative: the company name is always written next to it. */
export function CompanyMark({ company, className }: CompanyMarkProps) {
  return (
    <img
      className={className}
      src={companyMarkSrc(company, import.meta.env.BASE_URL)}
      alt=""
      width={1000}
      height={1000}
      decoding="async"
      draggable={false}
      data-company={company}
    />
  )
}
