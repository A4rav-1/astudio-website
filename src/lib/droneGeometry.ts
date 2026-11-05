import { degreesToRadians, lerp } from './math'

export type ArmId = 'frontRight' | 'frontLeft' | 'rearRight' | 'rearLeft'
export type Vec3 = readonly [number, number, number]

export interface ArmConfig {
  id: ArmId
  pivot: Vec3
  foldedAngle: number
  deployedAngle: number
  spinDirection: 1 | -1
}

export const BODY_SIZE = { width: 0.88, height: 0.32, length: 1.6, radius: 0.12 } as const
export const ARM_LENGTH = 1.1
export const PROP_RADIUS = 0.42

/**
 * Arms hinge around Y. Front arms ride high and fold back along the body,
 * rear arms ride low and fold forward, so the stowed pairs stack without touching.
 */
export const ARM_CONFIGS: readonly ArmConfig[] = [
  { id: 'frontRight', pivot: [0.5, 0.1, 0.62], foldedAngle: degreesToRadians(90), deployedAngle: degreesToRadians(-35), spinDirection: 1 },
  { id: 'frontLeft', pivot: [-0.5, 0.1, 0.62], foldedAngle: degreesToRadians(90), deployedAngle: degreesToRadians(215), spinDirection: -1 },
  { id: 'rearRight', pivot: [0.5, -0.1, -0.62], foldedAngle: degreesToRadians(-90), deployedAngle: degreesToRadians(35), spinDirection: -1 },
  { id: 'rearLeft', pivot: [-0.5, -0.1, -0.62], foldedAngle: degreesToRadians(270), deployedAngle: degreesToRadians(145), spinDirection: 1 },
]

export function armAngle(config: ArmConfig, deploy: number): number {
  return lerp(config.foldedAngle, config.deployedAngle, deploy)
}

/** Unit direction (x, z) of an arm's local +X axis after a Y rotation of `angle`. */
export function armDirection(angle: number): { x: number; z: number } {
  return { x: Math.cos(angle), z: -Math.sin(angle) }
}

export interface ModuleConfig {
  dockedPosition: Vec3
  undockedOffset: Vec3
  undockedSpin: number
}

export const MODULE_CONFIGS: readonly ModuleConfig[] = [
  { dockedPosition: [0, -0.225, 0.42], undockedOffset: [0, -1.7, 0.5], undockedSpin: degreesToRadians(-70) },
  { dockedPosition: [0, 0.16, -0.18], undockedOffset: [0, 1.8, -0.2], undockedSpin: degreesToRadians(90) },
  { dockedPosition: [0, -0.235, -0.44], undockedOffset: [0.2, -1.6, -1.1], undockedSpin: degreesToRadians(60) },
]

export function modulePosition(config: ModuleConfig, dock: number): Vec3 {
  const remaining = 1 - dock
  return [
    config.dockedPosition[0] + config.undockedOffset[0] * remaining,
    config.dockedPosition[1] + config.undockedOffset[1] * remaining,
    config.dockedPosition[2] + config.undockedOffset[2] * remaining,
  ]
}
