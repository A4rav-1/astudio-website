import { describe, expect, it } from 'vitest'
import { clamp, damp, degreesToRadians, lerp, mapRange, segmentProgress, windowedOpacity } from './math'
import { easeInOutCubic, easeInOutSine, easeOutBack, easeOutCubic, easeOutExpo, linear } from './easing'

describe('math helpers', () => {
  it('clamps into range', () => {
    expect(clamp(5, 0, 1)).toBe(1)
    expect(clamp(-5, 0, 1)).toBe(0)
    expect(clamp(0.4, 0, 1)).toBe(0.4)
  })

  it('lerps and maps ranges', () => {
    expect(lerp(10, 20, 0.25)).toBe(12.5)
    expect(mapRange(5, 0, 10, 100, 200)).toBe(150)
    expect(mapRange(5, 3, 3, 7, 9)).toBe(7)
  })

  it('computes clamped local segment progress', () => {
    expect(segmentProgress(0.5, 0.4, 0.6)).toBeCloseTo(0.5)
    expect(segmentProgress(0.1, 0.4, 0.6)).toBe(0)
    expect(segmentProgress(0.9, 0.4, 0.6)).toBe(1)
    expect(segmentProgress(0.5, 0.5, 0.5)).toBe(1)
  })

  it('fades a window in and out', () => {
    expect(windowedOpacity(0.2, 0.2, 0.6, 0.1)).toBe(0)
    expect(windowedOpacity(0.25, 0.2, 0.6, 0.1)).toBeCloseTo(0.5)
    expect(windowedOpacity(0.4, 0.2, 0.6, 0.1)).toBe(1)
    expect(windowedOpacity(0.6, 0.2, 0.6, 0.1)).toBe(0)
    expect(windowedOpacity(0.95, 0.2, 0.6, 0.1, true)).toBe(1)
  })

  it('converts degrees and damps toward a target', () => {
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI)
    expect(damp(0, 10, 5, 0)).toBe(0)
    expect(damp(0, 10, 5, 100)).toBeCloseTo(10)
    const halfway = damp(0, 10, Math.LN2, 1)
    expect(halfway).toBeCloseTo(5)
  })
})

describe('easing', () => {
  const curves = { linear, easeInOutCubic, easeOutCubic, easeInOutSine, easeOutExpo, easeOutBack }
  for (const [name, curve] of Object.entries(curves)) {
    it(`${name} starts at 0 and ends at 1`, () => {
      expect(curve(0)).toBeCloseTo(0)
      expect(curve(1)).toBeCloseTo(1)
    })
  }

  it('easeInOutCubic is symmetric around the midpoint', () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5)
    expect(easeInOutCubic(0.2) + easeInOutCubic(0.8)).toBeCloseTo(1)
  })

  it('easeOutBack overshoots before settling', () => {
    expect(easeOutBack(0.8)).toBeGreaterThan(1)
  })
})
