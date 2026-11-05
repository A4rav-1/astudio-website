import { CircleGeometry, CylinderGeometry, Group, Object3D, SphereGeometry } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { ARM_LENGTH, PROP_RADIUS, type ArmConfig } from '../../lib/droneGeometry'
import { degreesToRadians } from '../../lib/math'
import type { DroneMaterials } from './materials'
import { addChildren, createMesh } from './meshFactory'

export interface ArmParts {
  config: ArmConfig
  pivot: Group
  blades: Group
  motorAnchor: Object3D
}

const BLADE_PITCH = degreesToRadians(10)
const PROP_HEIGHT = 0.15

function buildPropeller(materials: DroneMaterials, radialSegments: number): { propeller: Group; blades: Group } {
  const propeller = new Group()
  propeller.position.set(ARM_LENGTH, PROP_HEIGHT, 0)
  const blades = new Group()
  const bladeLength = PROP_RADIUS - 0.03

  for (const side of [1, -1] as const) {
    blades.add(
      createMesh(new RoundedBoxGeometry(bladeLength, 0.012, 0.075, 2, 0.006), materials.blade, {
        position: [side * (bladeLength / 2 + 0.03), 0, 0],
        rotation: [side * BLADE_PITCH, 0, 0],
      }),
    )
  }
  blades.add(createMesh(new CylinderGeometry(0.038, 0.038, 0.045, radialSegments), materials.metal))

  addChildren(propeller, [
    blades,
    createMesh(new CircleGeometry(PROP_RADIUS, radialSegments * 2), materials.propBlur, {
      rotation: [degreesToRadians(-90), 0, 0],
      position: [0, 0.006, 0],
    }),
  ])
  return { propeller, blades }
}

/** One fold-out arm: tapered boom, motor and two-blade prop, pivoting at the hinge knuckle. */
export function buildArm(config: ArmConfig, materials: DroneMaterials, radialSegments: number): ArmParts {
  const pivot = new Group()
  pivot.name = `arm-${config.id}`
  pivot.position.set(...config.pivot)

  const isFront = config.pivot[2] > 0
  const boomLength = ARM_LENGTH - 0.1

  addChildren(pivot, [
    createMesh(new RoundedBoxGeometry(0.2, 0.075, 0.115, 2, 0.03), materials.graphite, { position: [0.1, 0, 0] }),
    createMesh(new CylinderGeometry(0.05, 0.036, boomLength, radialSegments), materials.graphite, {
      position: [0.06 + boomLength / 2, 0, 0],
      rotation: [0, 0, degreesToRadians(90)],
    }),
    createMesh(new CylinderGeometry(0.11, 0.11, 0.035, radialSegments), materials.graphite, {
      position: [ARM_LENGTH, 0.01, 0],
    }),
    createMesh(new CylinderGeometry(0.094, 0.104, 0.12, radialSegments), materials.metal, {
      position: [ARM_LENGTH, 0.085, 0],
    }),
    createMesh(new SphereGeometry(0.03, 12, 8), isFront ? materials.ledFront : materials.ledRear, {
      position: [ARM_LENGTH, -0.035, 0],
    }),
  ])

  const { propeller, blades } = buildPropeller(materials, radialSegments)
  pivot.add(propeller)

  const motorAnchor = new Object3D()
  motorAnchor.position.set(ARM_LENGTH, PROP_HEIGHT + 0.05, 0)
  pivot.add(motorAnchor)

  return { config, pivot, blades, motorAnchor }
}
