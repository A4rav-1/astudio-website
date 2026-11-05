import { describe, expect, it } from 'vitest'
import { magneticOffset, normalisedPointer, pointerPercent, proximityFalloff, tiltFromPointer } from './pointer'
import { formatCounter, formatStepLabel, velocityToSkew, velocityToTimeScale } from './format'
import { selectRenderQuality } from './renderQuality'

const rect = { left: 100, top: 100, width: 200, height: 100 }

describe('pointer helpers', () => {
  it('normalises the pointer to -1..1 around the centre', () => {
    expect(normalisedPointer({ x: 200, y: 150 }, rect)).toEqual({ x: 0, y: 0 })
    expect(normalisedPointer({ x: 300, y: 100 }, rect)).toEqual({ x: 1, y: -1 })
    expect(normalisedPointer({ x: 900, y: 900 }, rect)).toEqual({ x: 1, y: 1 })
    expect(normalisedPointer({ x: 1, y: 1 }, { left: 0, top: 0, width: 0, height: 0 })).toEqual({ x: 0, y: 0 })
  })

  it('tilts toward the pointer', () => {
    const tilt = tiltFromPointer({ x: 300, y: 100 }, rect, 10)
    expect(tilt.rotateY).toBe(10)
    expect(tilt.rotateX).toBe(10)
  })

  it('pulls toward the pointer by strength', () => {
    expect(magneticOffset({ x: 260, y: 150 }, rect, 0.5)).toEqual({ x: 30, y: 0 })
  })

  it('falls off smoothly with distance', () => {
    expect(proximityFalloff(0, 100)).toBe(1)
    expect(proximityFalloff(50, 100)).toBeCloseTo(0.5)
    expect(proximityFalloff(150, 100)).toBe(0)
    expect(proximityFalloff(10, 0)).toBe(0)
  })

  it('reports pointer percentages', () => {
    expect(pointerPercent({ x: 150, y: 125 }, rect)).toEqual({ x: 25, y: 25 })
  })
})

describe('format helpers', () => {
  it('pads loader counters', () => {
    expect(formatCounter(7.4)).toBe('007')
    expect(formatCounter(100)).toBe('100')
    expect(formatCounter(140)).toBe('100')
  })

  it('formats step labels', () => {
    expect(formatStepLabel(1, 5)).toBe('02 / 05')
  })

  it('maps scroll velocity to marquee speed and skew', () => {
    expect(velocityToTimeScale(0)).toBe(1)
    expect(velocityToTimeScale(-10)).toBeCloseTo(-1.8)
    expect(velocityToTimeScale(1000)).toBe(6)
    expect(velocityToSkew(1000)).toBe(-8)
    expect(velocityToSkew(-4)).toBe(1)
  })
})

describe('selectRenderQuality', () => {
  it('uses the high tier on capable desktops with DPR capped at 2', () => {
    const quality = selectRenderQuality({ viewportWidth: 1440, devicePixelRatio: 3, hardwareConcurrency: 12 })
    expect(quality.tier).toBe('high')
    expect(quality.maxDpr).toBe(2)
  })

  it('drops to the low tier on phones and low-core devices', () => {
    const phone = selectRenderQuality({ viewportWidth: 375, devicePixelRatio: 3, hardwareConcurrency: 8 })
    expect(phone.tier).toBe('low')
    expect(phone.maxDpr).toBe(1.5)
    const lowCore = selectRenderQuality({ viewportWidth: 1440, devicePixelRatio: 1, hardwareConcurrency: 4 })
    expect(lowCore.tier).toBe('low')
    expect(lowCore.maxDpr).toBe(1)
  })
})
