import { Mesh, type BufferGeometry, type Material, type Object3D } from 'three'
import type { Vec3 } from '../../lib/droneGeometry'

interface MeshOptions {
  position?: Vec3
  rotation?: Vec3
  scale?: Vec3
  name?: string
}

export function createMesh(geometry: BufferGeometry, material: Material, options: MeshOptions = {}): Mesh {
  const mesh = new Mesh(geometry, material)
  if (options.position) mesh.position.set(...options.position)
  if (options.rotation) mesh.rotation.set(...options.rotation)
  if (options.scale) mesh.scale.set(...options.scale)
  if (options.name) mesh.name = options.name
  return mesh
}

export function addChildren(parent: Object3D, children: readonly Object3D[]): void {
  for (const child of children) parent.add(child)
}
