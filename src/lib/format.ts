import { clamp } from './math'

/** Loader counter text: integer percentage padded to three digits ("007", "100"). */
export function formatCounter(value: number): string {
  return String(Math.round(clamp(value, 0, 100))).padStart(3, '0')
}

/** Step label such as "02 / 05". */
export function formatStepLabel(index: number, total: number): string {
  return `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
}

/** Marquee speed multiplier from scroll velocity; sign follows scroll direction. */
export function velocityToTimeScale(velocity: number, sensitivity = 0.08, maxBoost = 5): number {
  const boost = clamp(Math.abs(velocity) * sensitivity, 0, maxBoost)
  const direction = velocity < 0 ? -1 : 1
  return direction * (1 + boost)
}

/** Skew (degrees) applied to marquee rows while scrolling fast. */
export function velocityToSkew(velocity: number, maxDegrees = 8): number {
  return clamp(velocity * -0.25, -maxDegrees, maxDegrees)
}
