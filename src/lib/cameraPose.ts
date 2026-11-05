import type { CameraPose } from './droneTimeline'
import { clamp, degreesToRadians } from './math'

const WIDE_ASPECT = 1.2
const MAX_PORTRAIT_PUSHBACK = 2.1

/** Pushes the camera back on narrow (portrait) viewports so the deployed drone still fits. */
export function distanceForAspect(baseDistance: number, aspect: number): number {
  if (aspect >= WIDE_ASPECT) return baseDistance
  return baseDistance * clamp(WIDE_ASPECT / aspect, 1, MAX_PORTRAIT_PUSHBACK)
}

/** Orbit position around (0, targetY, 0) for a pose; azimuth 0 looks from +Z. */
export function cameraPositionFromPose(pose: CameraPose, aspect: number): [number, number, number] {
  const distance = distanceForAspect(pose.distance, aspect)
  const azimuth = degreesToRadians(pose.azimuthDeg)
  const elevation = degreesToRadians(pose.elevationDeg)
  const horizontal = Math.cos(elevation) * distance
  return [
    Math.sin(azimuth) * horizontal,
    pose.targetY + Math.sin(elevation) * distance,
    Math.cos(azimuth) * horizontal,
  ]
}
