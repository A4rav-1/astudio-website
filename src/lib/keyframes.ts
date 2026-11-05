import { easeInOutCubic, type EasingFunction } from './easing'
import { clamp, lerp } from './math'

export type NumericRecord = Record<string, number>

export interface Keyframe<T extends NumericRecord> {
  at: number
  value: T
}

/**
 * Samples a keyframe track at `progress` (0..1), easing between neighbouring frames.
 * Frames must be sorted by `at` ascending.
 */
export function sampleKeyframes<T extends NumericRecord>(
  frames: readonly Keyframe<T>[],
  progress: number,
  easing: EasingFunction = easeInOutCubic,
): T {
  if (frames.length === 0) throw new Error('sampleKeyframes needs at least one keyframe')
  const first = frames[0]
  const last = frames[frames.length - 1]
  if (progress <= first.at) return { ...first.value }
  if (progress >= last.at) return { ...last.value }

  const nextIndex = frames.findIndex((frame) => frame.at > progress)
  const from = frames[nextIndex - 1]
  const to = frames[nextIndex]
  const local = easing(clamp((progress - from.at) / (to.at - from.at), 0, 1))

  const sampled: NumericRecord = {}
  for (const key of Object.keys(from.value)) {
    sampled[key] = lerp(from.value[key], to.value[key], local)
  }
  return sampled as T
}
