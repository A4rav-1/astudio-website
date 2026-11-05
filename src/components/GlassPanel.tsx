import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { buildDisplacementMapSvg, toSvgDataUri } from '../lib/glassDisplacement'
import './GlassPanel.css'

interface GlassPanelProps {
  children: ReactNode
  className?: string
  radius?: number
  bezel?: number
  refraction?: number
  blurPx?: number
}

const supportsSvgBackdropFilter: boolean =
  typeof CSS !== 'undefined' && CSS.supports('backdrop-filter', 'url(#probe)')

export function GlassPanel({
  children,
  className = '',
  radius = 28,
  bezel = 22,
  refraction = 38,
  blurPx = 3,
}: GlassPanelProps) {
  const filterId = `glass-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const panelRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    observer.observe(panel)
    return () => observer.disconnect()
  }, [])

  const hasSize = size.width > 0 && size.height > 0
  const mapUri = hasSize ? toSvgDataUri(buildDisplacementMapSvg({ ...size, radius, bezel })) : ''
  const backdrop =
    supportsSvgBackdropFilter && hasSize
      ? `url(#${filterId}) blur(${blurPx}px) saturate(1.5) brightness(1.08)`
      : `blur(${blurPx * 4}px) saturate(1.5) brightness(1.08)`

  const style: CSSProperties = {
    borderRadius: radius,
    backdropFilter: backdrop,
    WebkitBackdropFilter: backdrop,
  }

  return (
    <div ref={panelRef} className={`glass ${className}`} style={style}>
      {supportsSvgBackdropFilter && hasSize && (
        <svg className="glass__filter" aria-hidden="true" width="0" height="0" focusable="false">
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
            <feImage href={mapUri} x="0" y="0" width={size.width} height={size.height} result="map" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={refraction}
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </svg>
      )}
      {children}
    </div>
  )
}
