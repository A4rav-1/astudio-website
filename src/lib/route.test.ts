import { describe, expect, it } from 'vitest'
import { parseRoute, routeHash, type RouteId } from './route'

describe('parseRoute', () => {
  it('treats an empty hash, # and #/ as the hub', () => {
    expect(parseRoute('', 'drone')).toBe('hub')
    expect(parseRoute('#', 'web')).toBe('hub')
    expect(parseRoute('#/', 'exam')).toBe('hub')
  })

  it('resolves each company route', () => {
    expect(parseRoute('#/drone', 'hub')).toBe('drone')
    expect(parseRoute('#/web', 'hub')).toBe('web')
    expect(parseRoute('#/exam', 'hub')).toBe('exam')
  })

  it('ignores case and trailing slashes', () => {
    expect(parseRoute('#/Drone/', 'hub')).toBe('drone')
    expect(parseRoute('#/WEB', 'hub')).toBe('web')
  })

  it('falls back to the hub for unknown route paths', () => {
    expect(parseRoute('#/nope', 'drone')).toBe('hub')
  })

  it('keeps the current route for in-page anchors', () => {
    expect(parseRoute('#contact', 'web')).toBe('web')
    expect(parseRoute('#drone', 'exam')).toBe('exam')
  })
})

describe('routeHash', () => {
  it('round-trips through parseRoute for every route', () => {
    const routes: RouteId[] = ['hub', 'drone', 'web', 'exam']
    for (const route of routes) expect(parseRoute(routeHash(route), 'hub')).toBe(route)
  })
})
