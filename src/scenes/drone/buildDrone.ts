import { Group, Mesh, Object3D, PlaneGeometry } from 'three'
import type { CalloutAnchorId } from '../../content'
import { ARM_CONFIGS } from '../../lib/droneGeometry'
import { degreesToRadians } from '../../lib/math'
import { buildArm, type ArmParts } from './buildArm'
import { buildBody } from './buildBody'
import { buildModules, type ModuleParts } from './buildModules'
import type { DroneMaterials } from './materials'
import { createMesh } from './meshFactory'

export interface DroneParts {
  /** Lifted and swayed as one; everything that flies lives under it. */
  root: Group
  arms: ArmParts[]
  modules: ModuleParts[]
  shadow: Mesh
  anchors: Record<CalloutAnchorId, Object3D>
  materials: DroneMaterials
}

export const GROUND_Y = -0.62

function anchorAt(parent: Object3D, position: readonly [number, number, number]): Object3D {
  const anchor = new Object3D()
  anchor.position.set(...position)
  parent.add(anchor)
  return anchor
}

export function buildDrone(materials: DroneMaterials, radialSegments: number): DroneParts {
  const root = new Group()
  root.name = 'drone'
  root.add(buildBody(materials, radialSegments))

  const arms = ARM_CONFIGS.map((config) => buildArm(config, materials, radialSegments))
  for (const arm of arms) root.add(arm.pivot)

  const modules = buildModules(materials, radialSegments)
  for (const module of modules) root.add(module.group)

  const shadow = createMesh(new PlaneGeometry(3.4, 3.4), materials.shadow, {
    rotation: [degreesToRadians(-90), 0, 0],
    position: [0, GROUND_Y, 0],
    name: 'shadow',
  })

  const frontLeftArm = arms.find((arm) => arm.config.id === 'frontLeft')
  if (!frontLeftArm) throw new Error('Drone is missing its front-left arm')

  return {
    root,
    arms,
    modules,
    shadow,
    materials,
    anchors: {
      body: anchorAt(root, [-0.24, 0.2, 0.2]),
      hinge: anchorAt(root, [0.5, 0.2, 0.62]),
      motor: frontLeftArm.motorAnchor,
      moduleBay: modules[1].anchor,
      moduleSwap: modules[0].anchor,
      airframe: anchorAt(root, [0.3, 0.2, -0.55]),
    },
  }
}
