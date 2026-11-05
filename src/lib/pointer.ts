import { clamp } from './math'

export interface Rect {
  left: number
  top: number
  width: number
  height: number
}

export interface Point {
  x: number
  y: number
}

/** Pointer position relative to a rect, normalised to -1..1 on each axis (0 = centre). */
export function normalisedPointer(pointer: Point, rect: Rect): Point {
  if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 }
  return {
    x: clamp(((pointer.x - rect.left) / rect.width) * 2 - 1, -1, 1),
    y: clamp(((pointer.y - rect.top) / rect.height) * 2 - 1, -1, 1),
  }
}

/** 3D tilt in degrees: pointer at the right edge tips the right side away from the viewer. */
export function tiltFromPointer(pointer: Point, rect: Rect, maxDegrees: number): { rotateX: number; rotateY: number } {
  const normalised = normalisedPointer(pointer, rect)
  return { rotateX: -normalised.y * maxDegrees, rotateY: normalised.x * maxDegrees }
}

/** Offset that pulls an element toward the pointer by `strength` of the distance from its centre. */
export function magneticOffset(pointer: Point, rect: Rect, strength: number): Point {
  const centreX = rect.left + rect.width / 2
  const centreY = rect.top + rect.height / 2
  return { x: (pointer.x - centreX) * strength, y: (pointer.y - centreY) * strength }
}

/** Smooth 1 → 0 falloff with distance; 0 at or beyond `radius`. */
export function proximityFalloff(distance: number, radius: number): number {
  if (radius <= 0) return 0
  const t = clamp(1 - distance / radius, 0, 1)
  return t * t * (3 - 2 * t)
}

/** Pointer position as percentages of a rect, for CSS custom properties. */
export function pointerPercent(pointer: Point, rect: Rect): Point {
  if (rect.width === 0 || rect.height === 0) return { x: 50, y: 50 }
  return {
    x: ((pointer.x - rect.left) / rect.width) * 100,
    y: ((pointer.y - rect.top) / rect.height) * 100,
  }
}
