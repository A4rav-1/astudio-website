import { Vector3, type Camera } from 'three'
import { DRONE_CALLOUTS } from '../../content'
import type { DroneParts } from './buildDrone'

const scratch = new Vector3()
const FLIP_THRESHOLD = 0.6

export interface ViewportSize {
  width: number
  height: number
}

/**
 * Moves each callout element onto its 3D anchor's screen position and fades it by its step's opacity.
 * Expects `camera.updateMatrixWorld()` to have been called this frame.
 */
export function projectCallouts(
  parts: DroneParts,
  camera: Camera,
  viewport: ViewportSize,
  stepOpacity: readonly number[],
  elements: readonly (HTMLElement | null)[],
): void {
  DRONE_CALLOUTS.forEach((callout, index) => {
    const element = elements[index]
    if (!element) return
    parts.anchors[callout.id].getWorldPosition(scratch)
    scratch.project(camera)
    const isInFront = scratch.z < 1
    const x = (scratch.x * 0.5 + 0.5) * viewport.width
    const y = (-scratch.y * 0.5 + 0.5) * viewport.height
    const opacity = isInFront ? stepOpacity[callout.step] : 0
    element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
    element.style.opacity = opacity.toFixed(3)
    element.classList.toggle('is-flipped', x > viewport.width * FLIP_THRESHOLD)
  })
}
