import { useMemo } from 'react'
import { selectRenderQuality, type RenderQuality } from '../lib/renderQuality'
import { MOBILE_QUERY, useMediaQuery } from './useMediaQuery'

export function useRenderQuality(): RenderQuality {
  const isMobile = useMediaQuery(MOBILE_QUERY)
  return useMemo(
    () =>
      selectRenderQuality({
        viewportWidth: isMobile ? 375 : window.innerWidth,
        devicePixelRatio: window.devicePixelRatio,
        hardwareConcurrency: navigator.hardwareConcurrency,
      }),
    [isMobile],
  )
}
