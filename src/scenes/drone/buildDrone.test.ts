import { Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import { ARM_CONFIGS } from '../../lib/droneGeometry'
import { droneStateAt } from '../../lib/droneTimeline'
import { applyDroneState, createDroneRuntime, parkedPropAngle } from './applyDroneState'
import { buildDrone } from './buildDrone'
import { createDroneMaterials } from './materials'

function freshDrone() {
  return buildDrone(createDroneMaterials({ propBlur: null, shadow: null }), 12)
}

describe('buildDrone', () => {
  it('builds four arms, three modules and every callout anchor', () => {
    const drone = freshDrone()
    expect(drone.arms).toHaveLength(ARM_CONFIGS.length)
    expect(drone.modules).toHaveLength(3)
    expect(Object.keys(drone.anchors).sort()).toEqual(['airframe', 'body', 'hinge', 'moduleBay', 'moduleSwap', 'motor'])
  })
})

describe('applyDroneState', () => {
  it('stows arms alongside the body and hides undocked modules at the start', () => {
    const drone = freshDrone()
    applyDroneState(drone, droneStateAt(0), createDroneRuntime(), 1 / 60)
    for (const arm of drone.arms) {
      expect(arm.pivot.rotation.y).toBeCloseTo(arm.config.foldedAngle)
    }
    expect(drone.modules.every((module) => !module.group.visible)).toBe(true)
    expect(drone.materials.propBlur.opacity).toBe(0)
  })

  it('deploys arms, docks modules and lights the locks at the end', () => {
    const drone = freshDrone()
    applyDroneState(drone, droneStateAt(1), createDroneRuntime(), 1 / 60)
    for (const arm of drone.arms) {
      expect(arm.pivot.rotation.y).toBeCloseTo(arm.config.deployedAngle)
    }
    for (const module of drone.modules) {
      expect(module.group.visible).toBe(true)
      expect(module.group.position.toArray()).toEqual([...module.config.dockedPosition])
    }
    expect(drone.materials.lockGlow.emissiveIntensity).toBeGreaterThan(2)
    expect(drone.root.position.y).toBeGreaterThan(0.3)
  })

  it('places deployed motors out past the body corners', () => {
    const drone = freshDrone()
    applyDroneState(drone, droneStateAt(1), createDroneRuntime(), 0)
    drone.root.updateMatrixWorld(true)
    const motor = drone.anchors.motor.getWorldPosition(new Vector3())
    expect(motor.x).toBeLessThan(-1)
    expect(motor.z).toBeGreaterThan(1)
  })

  it('spins props while powered and parks them along the arm when stopped', () => {
    const drone = freshDrone()
    const runtime = createDroneRuntime()
    applyDroneState(drone, droneStateAt(1), runtime, 0.1)
    expect(runtime.propAngle).toBeGreaterThan(0)
    for (let frame = 0; frame < 600; frame++) applyDroneState(drone, droneStateAt(0), runtime, 1 / 60)
    expect(runtime.propAngle).toBeCloseTo(parkedPropAngle(runtime.propAngle), 3)
  })
})
