import { describe, expect, it } from 'vitest'
import { COMPANY_MARKS, faviconForRoute } from './companyMarks'
import { COMPANY_ROUTE_IDS } from './route'

describe('COMPANY_MARKS', () => {
  it('defines a mark for every company, on the same size canvas', () => {
    for (const company of COMPANY_ROUTE_IDS) {
      const mark = COMPANY_MARKS[company]
      expect(mark.bars.length).toBeGreaterThanOrEqual(3)
      expect(mark.viewBox.split(' ').slice(2)).toEqual(['1380', '1380'])
    }
  })

  it('keeps one bar at full strength in every mark', () => {
    for (const company of COMPANY_ROUTE_IDS) {
      expect(COMPANY_MARKS[company].bars.some((bar) => bar.opacity === 1)).toBe(true)
    }
  })
})

describe('faviconForRoute', () => {
  it('uses the A Studio mark on the hub', () => {
    expect(faviconForRoute('hub', '/astudio-website/')).toEqual({ href: '/astudio-website/mark.png', type: 'image/png' })
  })

  it('uses the company mark on a company page', () => {
    expect(faviconForRoute('web', '/')).toEqual({ href: '/marks/web.svg', type: 'image/svg+xml' })
  })
})
