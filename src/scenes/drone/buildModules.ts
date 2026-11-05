import { Group, Object3D, SphereGeometry, TorusGeometry } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { MODULE_CONFIGS, type ModuleConfig } from '../../lib/droneGeometry'
import { degreesToRadians } from '../../lib/math'
import type { DroneMaterials } from './materials'
import { addChildren, createMesh } from './meshFactory'

export interface ModuleParts {
  config: ModuleConfig
  group: Group
  anchor: Object3D
}

function withAnchor(group: Group, anchorPosition: readonly [number, number, number]): Object3D {
  const anchor = new Object3D()
  anchor.position.set(...anchorPosition)
  group.add(anchor)
  return anchor
}

function buildFrontPod(materials: DroneMaterials, segments: number): Group {
  const pod = new Group()
  addChildren(pod, [
    createMesh(new RoundedBoxGeometry(0.36, 0.13, 0.3, 3, 0.05), materials.shell),
    createMesh(new RoundedBoxGeometry(0.372, 0.022, 0.312, 2, 0.01), materials.moduleAccents[0], { position: [0, -0.02, 0] }),
    createMesh(new SphereGeometry(0.105, segments, segments / 2), materials.lens, { position: [0, -0.085, 0.07] }),
    createMesh(new TorusGeometry(0.108, 0.012, 8, segments), materials.metal, {
      position: [0, -0.085, 0.07],
      rotation: [degreesToRadians(90), 0, 0],
    }),
  ])
  return pod
}

function buildTopPod(materials: DroneMaterials, segments: number): Group {
  const pod = new Group()
  addChildren(pod, [
    createMesh(new SphereGeometry(0.26, segments, segments / 2, 0, Math.PI * 2, 0, Math.PI / 2), materials.deck, {
      scale: [1, 0.42, 1.3],
      position: [0, 0.03, 0],
    }),
    createMesh(new TorusGeometry(0.262, 0.013, 8, segments * 2), materials.moduleAccents[1], {
      rotation: [degreesToRadians(90), 0, 0],
      scale: [1, 1.3, 1],
      position: [0, 0.03, 0],
    }),
  ])
  return pod
}

function buildRearPod(materials: DroneMaterials): Group {
  const pod = new Group()
  addChildren(pod, [
    createMesh(new RoundedBoxGeometry(0.46, 0.15, 0.44, 3, 0.05), materials.graphite),
    createMesh(new RoundedBoxGeometry(0.472, 0.022, 0.452, 2, 0.01), materials.moduleAccents[2], { position: [0, 0.01, 0] }),
  ])
  for (const x of [-0.17, 0.17]) {
    pod.add(createMesh(new RoundedBoxGeometry(0.05, 0.03, 0.12, 2, 0.01), materials.metal, { position: [x, -0.085, 0] }))
  }
  return pod
}

/** The three swappable modules, each starting away from its bay so it can dock in. */
export function buildModules(materials: DroneMaterials, segments: number): ModuleParts[] {
  const pods = [buildFrontPod(materials, segments), buildTopPod(materials, segments), buildRearPod(materials)]
  const anchorOffsets: readonly (readonly [number, number, number])[] = [
    [0.12, -0.12, 0.14],
    [0, 0.16, 0],
    [0.2, -0.08, -0.1],
  ]
  return pods.map((group, index) => {
    group.name = `module-${index}`
    return { config: MODULE_CONFIGS[index], group, anchor: withAnchor(group, anchorOffsets[index]) }
  })
}
