import { armAngle, modulePosition } from '../../lib/droneGeometry'
import type { DroneState } from '../../lib/droneTimeline'
import { damp } from '../../lib/math'
import type { DroneParts } from './buildDrone'

export interface DroneRuntime {
  propAngle: number
  elapsed: number
}

const MAX_PROP_SPEED_RAD_S = 42
const PROP_PARK_THRESHOLD = 0.01
const LIFT_HEIGHT = 0.38

/** Nearest angle at which a two-blade prop lies along its arm. */
export function parkedPropAngle(angle: number): number {
  return Math.round(angle / Math.PI) * Math.PI
}

export function createDroneRuntime(): DroneRuntime {
  return { propAngle: 0, elapsed: 0 }
}

/** Writes a sampled DroneState onto the scene graph. Mutates `parts` and `runtime` only. */
export function applyDroneState(parts: DroneParts, state: DroneState, runtime: DroneRuntime, deltaSeconds: number): void {
  runtime.elapsed += deltaSeconds
  const { materials } = parts

  if (state.propSpin < PROP_PARK_THRESHOLD) {
    runtime.propAngle = damp(runtime.propAngle, parkedPropAngle(runtime.propAngle), 5, deltaSeconds)
  } else {
    runtime.propAngle += state.propSpin * MAX_PROP_SPEED_RAD_S * deltaSeconds
  }

  parts.arms.forEach((arm, index) => {
    arm.pivot.rotation.y = armAngle(arm.config, state.armDeploy[index])
    arm.blades.rotation.y = runtime.propAngle * arm.config.spinDirection
  })

  materials.lockGlow.emissiveIntensity = state.armLock * 2.6
  materials.blade.opacity = 1 - state.propSpin * 0.78
  materials.propBlur.opacity = state.propSpin * 0.5
  materials.ledFront.emissiveIntensity = 0.5 + state.propSpin * 1.8

  const hover = state.lift
  parts.root.position.y = hover * LIFT_HEIGHT + Math.sin(runtime.elapsed * 1.6) * 0.03 * hover
  parts.root.rotation.z = Math.sin(runtime.elapsed * 0.9) * 0.03 * hover
  parts.root.rotation.x = Math.cos(runtime.elapsed * 0.7) * 0.022 * hover

  parts.modules.forEach((module, index) => {
    const dock = state.moduleDock[index]
    module.group.visible = dock > 0.001
    module.group.position.set(...modulePosition(module.config, dock))
    module.group.rotation.y = module.config.undockedSpin * (1 - dock)
    module.group.scale.setScalar(0.85 + 0.15 * dock)
    materials.moduleAccents[index].emissiveIntensity = dock * 0.35 + state.moduleGlow * 2.4
  })

  parts.shadow.scale.setScalar(1 + hover * 0.45)
  materials.shadow.opacity = 0.8 - hover * 0.45
}
