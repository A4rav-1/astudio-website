export interface BarGeometry {
  id: 'red' | 'yellow' | 'blue'
  color: string
  from: readonly [number, number]
  to: readonly [number, number]
}

/** Centre-lines of the three logo bars, traced from mark.png on its 1560px artboard. */
export const BRAND_MARK_BARS: readonly BarGeometry[] = [
  { id: 'red', color: '#F90500', from: [245, 1060], to: [358, 1272] },
  { id: 'yellow', color: '#FDC107', from: [510, 645], to: [845, 1265] },
  { id: 'blue', color: '#155BBF', from: [797, 218], to: [1350, 1248] },
]

export const BRAND_MARK_STROKE_WIDTH = 225

/** Tight bounds around the round-capped bars: x, y, width, height. */
export const BRAND_MARK_VIEWBOX = { x: 100, y: 80, width: 1380, height: 1330 } as const
