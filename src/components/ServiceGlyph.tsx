import type { ServiceCopy } from '../content'

interface ServiceGlyphProps {
  kind: ServiceCopy['id']
}

const STROKE_PROPS = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function ServiceGlyph({ kind }: ServiceGlyphProps) {
  return (
    <svg className="service-glyph" viewBox="0 0 48 48" aria-hidden="true">
      {kind === 'drones' && (
        <g {...STROKE_PROPS}>
          <rect x="18" y="16" width="12" height="16" rx="4" />
          <path d="M18 19 11 12M30 19l7-7M18 29l-7 7M30 29l7 7" />
          <circle cx="10" cy="11" r="6" />
          <circle cx="38" cy="11" r="6" />
          <circle cx="10" cy="37" r="6" />
          <circle cx="38" cy="37" r="6" />
        </g>
      )}
      {kind === 'websites' && (
        <g {...STROKE_PROPS}>
          <rect x="5" y="9" width="38" height="30" rx="5" />
          <path d="M5 17h38" />
          <circle cx="10.5" cy="13" r="1" />
          <circle cx="14.5" cy="13" r="1" />
          <path d="M11 25h14M11 30h9M30 24h7v9h-7z" />
        </g>
      )}
      {kind === 'trainer' && (
        <g {...STROKE_PROPS}>
          <path d="M12 5h17l9 9v29H12z" />
          <path d="M29 5v9h9" />
          <path d="m17 22 3 3 5-6M17 33h14M27 25h4" />
        </g>
      )}
    </svg>
  )
}
