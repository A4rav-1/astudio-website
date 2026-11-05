import {
  AdditiveBlending,
  Color,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  type Material,
  type Texture,
} from 'three'
import { BRAND_COLORS } from '../../content'

export interface DroneMaterials {
  shell: MeshPhysicalMaterial
  deck: MeshPhysicalMaterial
  graphite: MeshStandardMaterial
  metal: MeshStandardMaterial
  lens: MeshPhysicalMaterial
  blade: MeshStandardMaterial
  propBlur: MeshBasicMaterial
  lockGlow: MeshStandardMaterial
  ledFront: MeshStandardMaterial
  ledRear: MeshStandardMaterial
  brandBars: readonly [MeshStandardMaterial, MeshStandardMaterial, MeshStandardMaterial]
  moduleAccents: readonly [MeshStandardMaterial, MeshStandardMaterial, MeshStandardMaterial]
  shadow: MeshBasicMaterial
}

export interface DroneTextures {
  propBlur: Texture | null
  shadow: Texture | null
}

function emissive(color: string, intensity: number): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: new Color(color).multiplyScalar(0.25),
    emissive: new Color(color),
    emissiveIntensity: intensity,
    roughness: 0.4,
    metalness: 0.1,
  })
}

const BRAND_TRIPLET = [BRAND_COLORS.red, BRAND_COLORS.yellow, BRAND_COLORS.blue] as const

export function createDroneMaterials(textures: DroneTextures): DroneMaterials {
  return {
    shell: new MeshPhysicalMaterial({
      color: '#0d1c31',
      metalness: 0.55,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
    }),
    deck: new MeshPhysicalMaterial({
      color: '#0f2546',
      metalness: 0.3,
      roughness: 0.42,
      clearcoat: 0.5,
      clearcoatRoughness: 0.35,
    }),
    graphite: new MeshStandardMaterial({ color: '#1c2635', metalness: 0.65, roughness: 0.36 }),
    metal: new MeshStandardMaterial({ color: '#b9c3d3', metalness: 1, roughness: 0.2 }),
    lens: new MeshPhysicalMaterial({ color: '#04080f', metalness: 0.2, roughness: 0.04, clearcoat: 1 }),
    blade: new MeshStandardMaterial({ color: '#0c1119', metalness: 0.25, roughness: 0.45, transparent: true }),
    propBlur: new MeshBasicMaterial({
      color: '#a9c8ff',
      map: textures.propBlur,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: AdditiveBlending,
    }),
    lockGlow: emissive('#3d86ff', 0),
    ledFront: emissive('#cfe0ff', 0.6),
    ledRear: emissive(BRAND_COLORS.red, 1.4),
    brandBars: [emissive(BRAND_TRIPLET[0], 0.9), emissive(BRAND_TRIPLET[1], 0.9), emissive(BRAND_TRIPLET[2], 1.1)],
    moduleAccents: [emissive(BRAND_TRIPLET[0], 0), emissive(BRAND_TRIPLET[1], 0), emissive(BRAND_TRIPLET[2], 0)],
    shadow: new MeshBasicMaterial({
      color: '#000000',
      map: textures.shadow,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    }),
  }
}

export function disposeDroneMaterials(materials: DroneMaterials): void {
  const all: Material[] = [
    materials.shell,
    materials.deck,
    materials.graphite,
    materials.metal,
    materials.lens,
    materials.blade,
    materials.propBlur,
    materials.lockGlow,
    materials.ledFront,
    materials.ledRear,
    ...materials.brandBars,
    ...materials.moduleAccents,
    materials.shadow,
  ]
  for (const material of all) material.dispose()
}
