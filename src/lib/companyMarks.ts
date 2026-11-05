import type { CompanyRouteId, RouteId } from './route'

export interface CompanyMarkBar {
  from: readonly [number, number]
  to: readonly [number, number]
  opacity: number
}

export interface CompanyMarkGeometry {
  viewBox: string
  bars: readonly CompanyMarkBar[]
}

/** Same stroke as the A Studio mark, on a canvas of the same size, so all four print at one scale. */
export const COMPANY_MARK_STROKE_WIDTH = 225

export const COMPANY_MARKS: Readonly<Record<CompanyRouteId, CompanyMarkGeometry>> = {
  drone: {
    viewBox: '176.9 54.4 1380 1380',
    bars: [
      { from: [1240, 1230], to: [620.4, 1208.4], opacity: 0.4 },
      { from: [1240, 1230], to: [493.7, 763.7], opacity: 0.68 },
      { from: [1240, 1230], to: [723.6, 258.8], opacity: 1 },
    ],
  },
  web: {
    viewBox: '25 50 1380 1380',
    bars: [
      { from: [250, 340], to: [700, 700], opacity: 1 },
      { from: [700, 700], to: [250, 1060], opacity: 1 },
      { from: [780, 1140], to: [1180, 1140], opacity: 1 },
    ],
  },
  exam: {
    viewBox: '-36.1 25 1380 1380',
    bars: [
      { from: [308, 844.6], to: [97.8, 1240], opacity: 1 },
      { from: [470, 540], to: [842.2, 1240], opacity: 1 },
      { from: [790, 400], to: [1210, 400], opacity: 1 },
      { from: [1000, 190], to: [1000, 610], opacity: 1 },
    ],
  },
}

export interface Favicon {
  href: string
  type: 'image/png' | 'image/svg+xml'
}

export function faviconForRoute(route: RouteId, baseUrl: string): Favicon {
  if (route === 'hub') return { href: `${baseUrl}mark.png`, type: 'image/png' }
  return { href: `${baseUrl}marks/${route}.svg`, type: 'image/svg+xml' }
}
