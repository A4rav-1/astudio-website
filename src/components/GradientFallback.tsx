import type { CSSProperties } from 'react'
import type { GradientColors } from '../content'
import './GradientFallback.css'

interface GradientFallbackProps {
  colors: GradientColors
}

/** A CSS-only moving gradient for browsers where the WebGL shader gradient cannot run. */
export function GradientFallback({ colors }: GradientFallbackProps) {
  const style = {
    '--fallback-1': colors.color1,
    '--fallback-2': colors.color2,
    '--fallback-3': colors.color3,
  } as CSSProperties
  return <div className="gradient-fallback" style={style} />
}
