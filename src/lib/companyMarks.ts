import type { CompanyRouteId, RouteId } from './route'

/** The glossy sub-brand logo, cut from the design sheet onto a shared square canvas so all three keep one scale. */
export function companyMarkSrc(company: CompanyRouteId, baseUrl: string): string {
  return `${baseUrl}marks/${company}.png`
}

export interface Favicon {
  href: string
  type: 'image/png'
}

export function faviconForRoute(route: RouteId, baseUrl: string): Favicon {
  if (route === 'hub') return { href: `${baseUrl}mark.png`, type: 'image/png' }
  return { href: `${baseUrl}marks/${route}-icon.png`, type: 'image/png' }
}
