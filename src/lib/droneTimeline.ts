import { easeInOutCubic, easeInOutSine, easeOutCubic } from './easing'
import { sampleKeyframes, type Keyframe } from './keyframes'
import { clamp, segmentProgress, windowedOpacity } from './math'

/** Scroll progress at which each of the five story steps begins; the last entry closes the final step. */
export const STEP_BOUNDARIES: readonly number[] = [0, 0.14, 0.4, 0.58, 0.8, 1]
export const STEP_COUNT = STEP_BOUNDARIES.length - 1
const STEP_FADE = 0.035

export interface CameraPose extends Record<string, number> {
  azimuthDeg: number
  elevationDeg: number
  distance: number
  targetY: number
}

export type ArmDeploy = readonly [number, number, number, number]
export type ModuleDock = readonly [number, number, number]

export interface DroneState {
  armDeploy: ArmDeploy
  armLock: number
  propSpin: number
  lift: number
  moduleDock: ModuleDock
  moduleGlow: number
  camera: CameraPose
  activeStep: number
  stepOpacity: readonly number[]
}

export const CAMERA_KEYFRAMES: readonly Keyframe<CameraPose>[] = [
  { at: 0, value: { azimuthDeg: 38, elevationDeg: 20, distance: 5.4, targetY: 0 } },
  { at: 0.14, value: { azimuthDeg: 24, elevationDeg: 28, distance: 4.7, targetY: 0 } },
  { at: 0.4, value: { azimuthDeg: -30, elevationDeg: 62, distance: 7.4, targetY: 0 } },
  { at: 0.58, value: { azimuthDeg: -90, elevationDeg: 14, distance: 7.2, targetY: 0.25 } },
  { at: 0.8, value: { azimuthDeg: -150, elevationDeg: -6, distance: 6.6, targetY: 0.4 } },
  { at: 1, value: { azimuthDeg: -205, elevationDeg: 18, distance: 7.6, targetY: 0.3 } },
]

export function stepIndexAt(progress: number): number {
  const clamped = clamp(progress, 0, 1)
  for (let index = STEP_COUNT - 1; index >= 0; index--) {
    if (clamped >= STEP_BOUNDARIES[index]) return index
  }
  return 0
}

export function stepOpacityAt(progress: number, stepIndex: number): number {
  const start = STEP_BOUNDARIES[stepIndex]
  const end = STEP_BOUNDARIES[stepIndex + 1]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === STEP_COUNT - 1
  const fadeInStart = isFirst ? -STEP_FADE : start
  return windowedOpacity(progress, fadeInStart, end, STEP_FADE, isLast)
}

export function droneStateAt(progress: number): DroneState {
  const p = clamp(progress, 0, 1)
  const frontArms = easeInOutCubic(segmentProgress(p, 0.16, 0.3))
  const rearArms = easeInOutCubic(segmentProgress(p, 0.22, 0.36))

  return {
    armDeploy: [frontArms, frontArms, rearArms, rearArms],
    armLock: segmentProgress(p, 0.34, 0.4),
    propSpin: easeInOutSine(segmentProgress(p, 0.42, 0.54)),
    lift: easeInOutCubic(segmentProgress(p, 0.44, 0.58)),
    moduleDock: [
      easeOutCubic(segmentProgress(p, 0.6, 0.68)),
      easeOutCubic(segmentProgress(p, 0.64, 0.72)),
      easeOutCubic(segmentProgress(p, 0.68, 0.76)),
    ],
    moduleGlow: segmentProgress(p, 0.74, 0.86),
    camera: sampleKeyframes(CAMERA_KEYFRAMES, p),
    activeStep: stepIndexAt(p),
    stepOpacity: Array.from({ length: STEP_COUNT }, (_, index) => stepOpacityAt(p, index)),
  }
}
