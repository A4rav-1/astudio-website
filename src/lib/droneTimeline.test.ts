import { describe, expect, it } from 'vitest'
import { sampleKeyframes } from './keyframes'
import { linear } from './easing'
import { CAMERA_KEYFRAMES, STEP_COUNT, droneStateAt, stepIndexAt, stepOpacityAt } from './droneTimeline'
import { ARM_CONFIGS, armAngle, armDirection, modulePosition, MODULE_CONFIGS } from './droneGeometry'
import { cameraPositionFromPose, distanceForAspect } from './cameraPose'

describe('sampleKeyframes', () => {
  const frames = [
    { at: 0, value: { a: 0, b: 10 } },
    { at: 0.5, value: { a: 10, b: 20 } },
    { at: 1, value: { a: 20, b: 0 } },
  ]

  it('returns the edge frames outside the track', () => {
    expect(sampleKeyframes(frames, -1)).toEqual({ a: 0, b: 10 })
    expect(sampleKeyframes(frames, 2)).toEqual({ a: 20, b: 0 })
  })

  it('interpolates between neighbouring frames', () => {
    expect(sampleKeyframes(frames, 0.25, linear)).toEqual({ a: 5, b: 15 })
    expect(sampleKeyframes(frames, 0.75, linear)).toEqual({ a: 15, b: 10 })
  })

  it('throws on an empty track', () => {
    expect(() => sampleKeyframes([], 0.5)).toThrow()
  })
})

describe('droneStateAt', () => {
  it('starts fully stowed with props still and modules away', () => {
    const state = droneStateAt(0)
    expect(state.armDeploy).toEqual([0, 0, 0, 0])
    expect(state.propSpin).toBe(0)
    expect(state.moduleDock).toEqual([0, 0, 0])
    expect(state.activeStep).toBe(0)
    expect(state.stepOpacity[0]).toBe(1)
  })

  it('ends fully deployed, spinning, docked and on the final step', () => {
    const state = droneStateAt(1)
    expect(state.armDeploy).toEqual([1, 1, 1, 1])
    expect(state.armLock).toBe(1)
    expect(state.propSpin).toBe(1)
    expect(state.moduleDock).toEqual([1, 1, 1])
    expect(state.activeStep).toBe(STEP_COUNT - 1)
    expect(state.stepOpacity[STEP_COUNT - 1]).toBe(1)
    expect(state.camera).toEqual(CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1].value)
  })

  it('unfolds front arms before rear arms', () => {
    const state = droneStateAt(0.24)
    expect(state.armDeploy[0]).toBeGreaterThan(state.armDeploy[2])
  })

  it('clamps out-of-range progress', () => {
    expect(droneStateAt(-3)).toEqual(droneStateAt(0))
    expect(droneStateAt(4)).toEqual(droneStateAt(1))
  })

  it('maps progress to steps and shows at most one step fully', () => {
    expect(stepIndexAt(0.1)).toBe(0)
    expect(stepIndexAt(0.5)).toBe(2)
    expect(stepIndexAt(1)).toBe(4)
    expect(stepOpacityAt(0.5, 2)).toBe(1)
    expect(stepOpacityAt(0.5, 1)).toBe(0)
    expect(stepOpacityAt(0.5, 3)).toBe(0)
  })
})

describe('drone geometry', () => {
  it('folds every arm parallel to the body and deploys it diagonally outward', () => {
    for (const config of ARM_CONFIGS) {
      const folded = armDirection(armAngle(config, 0))
      expect(Math.abs(folded.x)).toBeCloseTo(0)
      expect(Math.abs(folded.z)).toBeCloseTo(1)

      const deployed = armDirection(armAngle(config, 1))
      expect(Math.sign(deployed.x)).toBe(Math.sign(config.pivot[0]))
      expect(Math.sign(deployed.z)).toBe(Math.sign(config.pivot[2]))
    }
  })

  it('swings each arm outward through the side, never across the body', () => {
    for (const config of ARM_CONFIGS) {
      const midway = armDirection(armAngle(config, 0.5))
      expect(Math.sign(midway.x)).toBe(Math.sign(config.pivot[0]))
    }
  })

  it('docks modules at their bay position', () => {
    for (const config of MODULE_CONFIGS) {
      expect(modulePosition(config, 1)).toEqual(config.dockedPosition)
      const away = modulePosition(config, 0)
      expect(away[1]).toBeCloseTo(config.dockedPosition[1] + config.undockedOffset[1])
    }
  })
})

describe('camera pose', () => {
  it('keeps distance on wide screens and pushes back on portrait screens', () => {
    expect(distanceForAspect(5, 1.8)).toBe(5)
    expect(distanceForAspect(5, 0.6)).toBeCloseTo(10)
    expect(distanceForAspect(5, 0.2)).toBeCloseTo(10.5)
  })

  it('orbits around the target at the requested distance', () => {
    const pose = { azimuthDeg: 90, elevationDeg: 0, distance: 4, targetY: 1 }
    const [x, y, z] = cameraPositionFromPose(pose, 2)
    expect(x).toBeCloseTo(4)
    expect(y).toBeCloseTo(1)
    expect(z).toBeCloseTo(0)
  })
})
