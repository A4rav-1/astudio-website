import { CanvasTexture, SRGBColorSpace } from 'three'

export interface GradientStop {
  offset: number
  color: string
}

/** Square canvas texture filled with a centred radial gradient. */
export function createRadialTexture(stops: readonly GradientStop[], size = 256): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('2D canvas context is unavailable for radial texture')
  const half = size / 2
  const gradient = context.createRadialGradient(half, half, 0, half, half, half)
  for (const stop of stops) gradient.addColorStop(stop.offset, stop.color)
  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

export const PROP_BLUR_STOPS: readonly GradientStop[] = [
  { offset: 0, color: 'rgba(255,255,255,0)' },
  { offset: 0.18, color: 'rgba(255,255,255,0.05)' },
  { offset: 0.72, color: 'rgba(255,255,255,0.32)' },
  { offset: 0.94, color: 'rgba(255,255,255,0.6)' },
  { offset: 1, color: 'rgba(255,255,255,0)' },
]

export const SHADOW_STOPS: readonly GradientStop[] = [
  { offset: 0, color: 'rgba(255,255,255,0.9)' },
  { offset: 0.45, color: 'rgba(255,255,255,0.4)' },
  { offset: 1, color: 'rgba(255,255,255,0)' },
]

export const GROUND_GLOW_STOPS: readonly GradientStop[] = [
  { offset: 0, color: 'rgba(61,134,255,0.55)' },
  { offset: 0.4, color: 'rgba(21,91,191,0.18)' },
  { offset: 1, color: 'rgba(21,91,191,0)' },
]
