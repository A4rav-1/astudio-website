import { describe, expect, it } from 'vitest'
import { buildDisplacementMapSvg, toSvgDataUri } from './glassDisplacement'

describe('buildDisplacementMapSvg', () => {
  it('rounds dimensions and clamps radius and bezel to half the shortest side', () => {
    const svg = buildDisplacementMapSvg({ width: 100.4, height: 40, radius: 999, bezel: 999 })
    expect(svg).toContain('width="100" height="40"')
    expect(svg).toContain('rx="20"')
    expect(svg).toContain('x="20" y="20" width="60" height="0"')
  })

  it('never emits zero-sized canvases', () => {
    const svg = buildDisplacementMapSvg({ width: 0, height: 0, radius: 10, bezel: 5 })
    expect(svg).toContain('width="1" height="1"')
  })
})

describe('toSvgDataUri', () => {
  it('encodes the svg as a data uri', () => {
    expect(toSvgDataUri('<svg a="#"/>')).toBe('data:image/svg+xml;charset=utf-8,%3Csvg%20a%3D%22%23%22%2F%3E')
  })
})
