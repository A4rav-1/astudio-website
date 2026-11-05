export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  if (inMax === inMin) return outMin
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)
}

/** Local 0..1 progress of `progress` inside the [start, end] window, clamped. */
export function segmentProgress(progress: number, start: number, end: number): number {
  if (end <= start) return progress >= end ? 1 : 0
  return clamp((progress - start) / (end - start), 0, 1)
}

/**
 * Opacity that ramps in after `start` and out before `end`, each over `fade`.
 * When `holdAtEnd` is true the value stays at 1 past `end` (used for the final step).
 */
export function windowedOpacity(
  progress: number,
  start: number,
  end: number,
  fade: number,
  holdAtEnd = false,
): number {
  const fadeIn = segmentProgress(progress, start, start + fade)
  if (holdAtEnd) return fadeIn
  const fadeOut = 1 - segmentProgress(progress, end - fade, end)
  return Math.min(fadeIn, fadeOut)
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/** Frame-rate independent exponential smoothing toward `target`. */
export function damp(current: number, target: number, smoothing: number, deltaSeconds: number): number {
  return lerp(current, target, 1 - Math.exp(-smoothing * deltaSeconds))
}
