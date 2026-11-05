import { useEffect, useRef } from 'react'
import './SitePreview.css'

interface SitePreviewProps {
  url: string
  displayUrl: string
  title: string
}

const VIRTUAL_VIEWPORT_WIDTH = 1440

/** Live, non-interactive preview of a site rendered at desktop width and scaled to fit. */
export function SitePreview({ url, displayUrl, title }: SitePreviewProps) {
  const screenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const screen = screenRef.current
    if (!screen) return
    const observer = new ResizeObserver(([entry]) => {
      screen.style.setProperty('--preview-scale', String(entry.contentRect.width / VIRTUAL_VIEWPORT_WIDTH))
    })
    observer.observe(screen)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="site-preview">
      <div className="site-preview__chrome" aria-hidden="true">
        <span className="site-preview__dots">
          <span />
          <span />
          <span />
        </span>
        <span className="site-preview__url">{displayUrl}</span>
      </div>
      <div ref={screenRef} className="site-preview__screen">
        <div className="site-preview__parallax">
          <iframe
            className="site-preview__frame"
            src={url}
            title={`Live preview of ${title}`}
            loading="lazy"
            tabIndex={-1}
            sandbox="allow-scripts allow-same-origin"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="site-preview__sheen" aria-hidden="true" />
      </div>
    </div>
  )
}
