import { useEffect, useRef, type MouseEvent } from 'react'
import { COMPANIES, NAV_CTA, NAV_LINKS } from '../content'
import { routeHash } from '../lib/route'
import { useRouter } from '../providers/routerContext'
import { useSmoothScroll } from '../providers/smoothScrollContext'
import { CompanyMark } from './CompanyMark'
import { GlassPanel } from './GlassPanel'
import './Nav.css'

const HIDE_AFTER_PX = 160
const SOLID_AFTER_PX = 40

export function Nav() {
  const navRef = useRef<HTMLElement>(null)
  const scroll = useSmoothScroll()
  const { route, navigate } = useRouter()
  const company = COMPANIES.find((entry) => entry.id === route)

  useEffect(
    () =>
      scroll.subscribe(({ scroll: position, direction }) => {
        const nav = navRef.current
        if (!nav) return
        nav.classList.toggle('is-scrolled', position > SOLID_AFTER_PX)
        if (direction === 1 && position > HIDE_AFTER_PX) nav.classList.add('is-hidden')
        if (direction === -1 || position <= HIDE_AFTER_PX) nav.classList.remove('is-hidden')
      }),
    [scroll],
  )

  const onBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (route !== 'hub') return
    event.preventDefault()
    navigate('hub')
  }

  return (
    <header ref={navRef} className="nav">
      <GlassPanel className="nav__panel" radius={999} bezel={14} refraction={30} blurPx={6}>
        <a href={routeHash('hub')} className={`nav__brand${company ? ' nav__brand--company' : ''}`} onClick={onBrandClick} aria-label="A Studio, home">
          {company ? (
            <CompanyMark company={company.id} className="nav__brand-mark" />
          ) : (
            <img src={`${import.meta.env.BASE_URL}mark.png`} alt="" width={28} height={28} />
          )}
          <span>{company ? company.name : 'A Studio'}</span>
        </a>
        <nav aria-label="Companies">
          <ul className="nav__links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="nav__link" aria-current={link.href === routeHash(route) ? 'page' : undefined}>
                  <span className="nav__link-text" data-text={link.label}>
                    {link.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href={NAV_CTA.href} className="nav__cta" aria-current={route === 'start' ? 'page' : undefined}>
          {NAV_CTA.label}
        </a>
      </GlassPanel>
    </header>
  )
}
