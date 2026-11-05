import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { Mesh, PerspectiveCamera, type Texture } from 'three'
import { cameraPositionFromPose } from '../../lib/cameraPose'
import { droneStateAt } from '../../lib/droneTimeline'
import { damp } from '../../lib/math'
import { applyDroneState, createDroneRuntime } from './applyDroneState'
import { buildDrone, type DroneParts } from './buildDrone'
import { createDroneMaterials, disposeDroneMaterials } from './materials'
import { projectCallouts } from './projectCallouts'
import { createRadialTexture, PROP_BLUR_STOPS, SHADOW_STOPS } from './textures'

interface DroneRigProps {
  progressRef: RefObject<number>
  calloutElements: RefObject<(HTMLElement | null)[]>
  radialSegments: number
  snapToProgress: boolean
}

const PROGRESS_SMOOTHING = 4.5
const MAX_FRAME_DELTA_S = 1 / 20
const WIDE_ASPECT = 1.25
const DESKTOP_FILM_OFFSET = -3

function disposeDrone(parts: DroneParts, textures: readonly Texture[]): void {
  for (const object of [parts.root, parts.shadow]) {
    object.traverse((child) => {
      if (child instanceof Mesh) child.geometry.dispose()
    })
  }
  disposeDroneMaterials(parts.materials)
  for (const texture of textures) texture.dispose()
}

export function DroneRig({ progressRef, calloutElements, radialSegments, snapToProgress }: DroneRigProps) {
  const size = useThree((state) => state.size)
  const smoothedProgress = useRef<number | null>(null)
  const runtime = useRef(createDroneRuntime())

  const { parts, textures } = useMemo(() => {
    const propBlur = createRadialTexture(PROP_BLUR_STOPS)
    const shadow = createRadialTexture(SHADOW_STOPS)
    const materials = createDroneMaterials({ propBlur, shadow })
    return { parts: buildDrone(materials, radialSegments), textures: [propBlur, shadow] as const }
  }, [radialSegments])

  useEffect(() => () => disposeDrone(parts, textures), [parts, textures])

  useFrame((state, delta) => {
    const deltaSeconds = Math.min(delta, MAX_FRAME_DELTA_S)
    const target = progressRef.current
    const previous = smoothedProgress.current ?? target
    const progress = snapToProgress ? target : damp(previous, target, PROGRESS_SMOOTHING, deltaSeconds)
    smoothedProgress.current = progress
    const droneState = droneStateAt(progress)
    applyDroneState(parts, droneState, runtime.current, deltaSeconds)

    const pose = {
      ...droneState.camera,
      azimuthDeg: droneState.camera.azimuthDeg + state.pointer.x * 6,
      elevationDeg: droneState.camera.elevationDeg + state.pointer.y * 3,
    }
    const aspect = size.width / size.height
    const camera = state.camera
    const filmOffset = aspect > WIDE_ASPECT ? DESKTOP_FILM_OFFSET : 0
    if (camera instanceof PerspectiveCamera && camera.filmOffset !== filmOffset) {
      camera.filmOffset = filmOffset
      camera.updateProjectionMatrix()
    }
    camera.position.set(...cameraPositionFromPose(pose, aspect))
    camera.lookAt(0, pose.targetY, 0)
    camera.updateMatrixWorld()

    projectCallouts(parts, camera, size, droneState.stepOpacity, calloutElements.current)
  })

  return (
    <>
      <primitive object={parts.root} />
      <primitive object={parts.shadow} />
    </>
  )
}
