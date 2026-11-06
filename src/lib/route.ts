export const COMPANY_ROUTE_IDS = ['drone', 'web', 'exam'] as const
export type CompanyRouteId = (typeof COMPANY_ROUTE_IDS)[number]
/** Routes that open with the full-screen hero. */
export type HeroRouteId = 'hub' | CompanyRouteId
export type RouteId = HeroRouteId | 'start'

const ROUTE_PATHS: Readonly<Record<RouteId, string>> = {
  hub: '/',
  drone: '/drone',
  web: '/web',
  exam: '/exam',
  start: '/start',
}

export function isCompanyRoute(route: RouteId): route is CompanyRouteId {
  return (COMPANY_ROUTE_IDS as readonly string[]).includes(route)
}

const ROUTE_BY_PATH: ReadonlyMap<string, RouteId> = new Map(
  (Object.keys(ROUTE_PATHS) as RouteId[]).map((route) => [ROUTE_PATHS[route], route]),
)

export function routeHash(route: RouteId): string {
  return `#${ROUTE_PATHS[route]}`
}

/**
 * Maps a location hash to a route.
 * - empty, `#` and `#/` are the hub
 * - `#/<path>` is a route (unknown paths fall back to the hub)
 * - any other hash (`#contact`) is an in-page anchor and keeps the current route
 */
export function parseRoute(hash: string, currentRoute: RouteId): RouteId {
  if (hash === '' || hash === '#') return 'hub'
  if (!hash.startsWith('#/')) return currentRoute
  const path = hash.slice(1).toLowerCase().replace(/\/+$/, '') || '/'
  return ROUTE_BY_PATH.get(path) ?? 'hub'
}
