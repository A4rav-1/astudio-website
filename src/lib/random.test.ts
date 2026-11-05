import { describe, expect, it } from 'vitest'
import { createSeededRandom, scatterPoints } from './random'

describe('createSeededRandom', () => {
  it('is deterministic for a seed and stays in [0, 1)', () => {
    const first = createSeededRandom(42)
    const second = createSeededRandom(42)
    for (let index = 0; index < 200; index++) {
      const value = first()
      expect(value).toBe(second())
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })

  it('differs between seeds', () => {
    expect(createSeededRandom(1)()).not.toBe(createSeededRandom(2)())
  })
})

describe('scatterPoints', () => {
  it('fills count * 3 coordinates inside the box', () => {
    const points = scatterPoints(100, [2, 1, 3], 7)
    expect(points).toHaveLength(300)
    for (let index = 0; index < points.length; index += 3) {
      expect(Math.abs(points[index])).toBeLessThanOrEqual(2)
      expect(Math.abs(points[index + 1])).toBeLessThanOrEqual(1)
      expect(Math.abs(points[index + 2])).toBeLessThanOrEqual(3)
    }
  })
})
