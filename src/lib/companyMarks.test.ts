import { describe, expect, it } from 'vitest'
import { companyMarkSrc, faviconForRoute } from './companyMarks'
import { COMPANY_ROUTE_IDS } from './route'

describe('companyMarkSrc', () => {
  it('points every company at its own logo under the base URL', () => {
    const sources = COMPANY_ROUTE_IDS.map((company) => companyMarkSrc(company, '/astudio-website/'))
    expect(sources).toEqual([
      '/astudio-website/marks/drone.png',
      '/astudio-website/marks/web.png',
      '/astudio-website/marks/exam.png',
    ])
  })
})

describe('faviconForRoute', () => {
  it('uses the A Studio mark on the hub and the start page', () => {
    expect(faviconForRoute('hub', '/astudio-website/')).toEqual({ href: '/astudio-website/mark.png', type: 'image/png' })
    expect(faviconForRoute('start', '/')).toEqual({ href: '/mark.png', type: 'image/png' })
  })

  it('uses the company icon on a company page', () => {
    expect(faviconForRoute('web', '/')).toEqual({ href: '/marks/web-icon.png', type: 'image/png' })
  })
})
