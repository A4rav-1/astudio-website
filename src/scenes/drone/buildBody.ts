import { BoxGeometry, CapsuleGeometry, CylinderGeometry, Group, TorusGeometry } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { ARM_CONFIGS, BODY_SIZE } from '../../lib/droneGeometry'
import { degreesToRadians } from '../../lib/math'
import type { DroneMaterials } from './materials'
import { addChildren, createMesh } from './meshFactory'

const BRAND_BAR_LAYOUT = [
  { length: 0.05, offsetX: -0.09, offsetZ: 0.03 },
  { length: 0.12, offsetX: -0.01, offsetZ: 0.0 },
  { length: 0.2, offsetX: 0.08, offsetZ: -0.03 },
] as const

/** Stowage body: shell, deck, lights, brand bars and the four fixed hinge knuckles with lock rings. */
export function buildBody(materials: DroneMaterials, radialSegments: number): Group {
  const body = new Group()
  body.name = 'body'
  const deckY = BODY_SIZE.height / 2

  addChildren(body, [
    createMesh(
      new RoundedBoxGeometry(BODY_SIZE.width, BODY_SIZE.height, BODY_SIZE.length, 5, BODY_SIZE.radius),
      materials.shell,
      { name: 'shell' },
    ),
    createMesh(new RoundedBoxGeometry(0.64, 0.06, 1.18, 4, 0.03), materials.deck, { position: [0, deckY, 0.02] }),
    createMesh(new RoundedBoxGeometry(0.46, 0.045, 0.05, 2, 0.02), materials.ledFront, {
      position: [0, 0.02, BODY_SIZE.length / 2 - 0.005],
    }),
    createMesh(new RoundedBoxGeometry(0.12, 0.04, 0.04, 2, 0.015), materials.ledRear, {
      position: [-0.26, 0.02, -BODY_SIZE.length / 2 + 0.005],
    }),
    createMesh(new RoundedBoxGeometry(0.12, 0.04, 0.04, 2, 0.015), materials.ledRear, {
      position: [0.26, 0.02, -BODY_SIZE.length / 2 + 0.005],
    }),
  ])

  BRAND_BAR_LAYOUT.forEach((bar, index) => {
    const capsule = createMesh(new CapsuleGeometry(0.022, bar.length, 4, 10), materials.brandBars[index], {
      position: [bar.offsetX, deckY + 0.034, 0.36 + bar.offsetZ],
      rotation: [degreesToRadians(90), 0, degreesToRadians(28)],
    })
    body.add(capsule)
  })

  for (const config of ARM_CONFIGS) {
    const [x, y, z] = config.pivot
    const side = Math.sign(x)
    addChildren(body, [
      createMesh(new BoxGeometry(0.12, 0.09, 0.16), materials.graphite, { position: [x - side * 0.06, y, z] }),
      createMesh(new CylinderGeometry(0.062, 0.062, 0.16, radialSegments), materials.graphite, { position: [x, y, z] }),
      createMesh(new TorusGeometry(0.064, 0.012, 8, radialSegments), materials.lockGlow, {
        position: [x, y + 0.082, z],
        rotation: [degreesToRadians(90), 0, 0],
        name: `lock-${config.id}`,
      }),
    ])
  }

  return body
}
