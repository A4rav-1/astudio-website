export interface RenderQualityInput {
  viewportWidth: number
  devicePixelRatio: number
  hardwareConcurrency: number
}

export interface RenderQuality {
  tier: 'high' | 'low'
  maxDpr: number
  particleCount: number
  gradientPixelDensity: number
  sphereSegments: number
}

export const MOBILE_BREAKPOINT_PX = 768
const LOW_END_CORE_COUNT = 4

export function selectRenderQuality({ viewportWidth, devicePixelRatio, hardwareConcurrency }: RenderQualityInput): RenderQuality {
  const isLow = viewportWidth < MOBILE_BREAKPOINT_PX || hardwareConcurrency <= LOW_END_CORE_COUNT
  const safeDpr = Math.max(1, devicePixelRatio)
  if (isLow) {
    return {
      tier: 'low',
      maxDpr: Math.min(safeDpr, 1.5),
      particleCount: 60,
      gradientPixelDensity: 0.6,
      sphereSegments: 20,
    }
  }
  return {
    tier: 'high',
    maxDpr: Math.min(safeDpr, 2),
    particleCount: 240,
    gradientPixelDensity: 1,
    sphereSegments: 40,
  }
}
