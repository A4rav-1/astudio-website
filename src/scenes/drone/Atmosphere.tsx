import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  MeshBasicMaterial,
  PlaneGeometry,
  PointsMaterial,
  RingGeometry,
  type Points,
} from 'three'
import { degreesToRadians } from '../../lib/math'
import { scatterPoints } from '../../lib/random'
import { GROUND_Y } from './buildDrone'
import { createRadialTexture, GROUND_GLOW_STOPS } from './textures'

interface AtmosphereProps {
  particleCount: number
}

const PARTICLE_SEED = 20261105
const PARTICLE_DRIFT_RAD_S = 0.025

/** Ground glow, orbit rings and slow drifting dust around the airframe. */
export function Atmosphere({ particleCount }: AtmosphereProps) {
  const pointsRef = useRef<Points>(null)

  const resources = useMemo(() => {
    const glowTexture = createRadialTexture(GROUND_GLOW_STOPS)
    const particleGeometry = new BufferGeometry()
    particleGeometry.setAttribute('position', new BufferAttribute(scatterPoints(particleCount, [5, 2.6, 5], PARTICLE_SEED), 3))
    return {
      glowTexture,
      glowGeometry: new PlaneGeometry(8, 8),
      glowMaterial: new MeshBasicMaterial({
        map: glowTexture,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
      innerRing: new RingGeometry(1.9, 1.912, 160),
      outerRing: new RingGeometry(2.7, 2.706, 160),
      ringMaterial: new MeshBasicMaterial({
        color: '#7fb0ff',
        transparent: true,
        opacity: 0.22,
        side: DoubleSide,
        depthWrite: false,
      }),
      particleGeometry,
      particleMaterial: new PointsMaterial({
        color: '#b8d2ff',
        size: 0.022,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    }
  }, [particleCount])

  useEffect(
    () => () => {
      resources.glowTexture.dispose()
      resources.glowGeometry.dispose()
      resources.glowMaterial.dispose()
      resources.innerRing.dispose()
      resources.outerRing.dispose()
      resources.ringMaterial.dispose()
      resources.particleGeometry.dispose()
      resources.particleMaterial.dispose()
    },
    [resources],
  )

  useFrame((_, delta) => {
    const points = pointsRef.current
    if (points) points.rotation.y += delta * PARTICLE_DRIFT_RAD_S
  })

  const groundRotation: [number, number, number] = [degreesToRadians(-90), 0, 0]

  return (
    <group>
      <mesh geometry={resources.glowGeometry} material={resources.glowMaterial} rotation={groundRotation} position={[0, GROUND_Y - 0.01, 0]} />
      <mesh geometry={resources.innerRing} material={resources.ringMaterial} rotation={groundRotation} position={[0, GROUND_Y, 0]} />
      <mesh geometry={resources.outerRing} material={resources.ringMaterial} rotation={groundRotation} position={[0, GROUND_Y, 0]} />
      {particleCount > 0 && <points ref={pointsRef} geometry={resources.particleGeometry} material={resources.particleMaterial} />}
    </group>
  )
}
