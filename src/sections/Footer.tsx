import { MagneticButton } from '../components/MagneticButton'
import { ReactiveWordmark } from '../components/ReactiveWordmark'
import { RevealHeading } from '../components/RevealHeading'
import { CONTACT_EMAIL, CONTACT_HREF, FOOTER, LOCATION, NAV_LINKS, WORK } from '../content'
import { useSmoothScroll } from '../providers/smoothScrollContext'
import './Footer.css'

const CURRENT_YEAR = new Date().getFullYear()

function splitLastWord(sentence: string): { lead: string; last: string } {
  const index = sentence.lastIndexOf(' ')
  if (index === -1) return { lead: '', last: sentence }
  return { lead: sentence.slice(0, index), last: sentence.slice(index + 1) }
}

export function Footer() {
  const scroll = useSmoothScroll()
  const title = splitLastWord(FOOTER.title)

  return (
    <footer id="contact" className="footer" aria-labelledby="contact-title">
      <div className="container footer__cta">
        <p className="eyebrow">Contact</p>
        <div className="footer__cta-row">
          <div className="footer__cta-copy">
            <RevealHeading id="contact-title">
              {title.lead} <em>{title.last}</em>
            </RevealHeading>
            <p className="footer__body">{FOOTER.body}</p>
            <a className="footer__email" href={CONTACT_HREF}>
              {CONTACT_EMAIL}
            </a>
          </div>
          <MagneticButton href={CONTACT_HREF} variant="giant" strength={0.4}>
            {FOOTER.cta}
            <span aria-hidden="true">→</span>
          </MagneticButton>
        </div>
      </div>

      <ReactiveWordmark text={FOOTER.wordmark} />

      <div className="container footer__bottom">
        <p>
          © {CURRENT_YEAR} A Studio · {LOCATION}
        </p>
        <nav aria-label="Footer" className="footer__links">
          {NAV_LINKS.slice(0, 3).map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => {
                event.preventDefault()
                scroll.scrollTo(link.href)
              }}
            >
              {link.label}
            </a>
          ))}
          {WORK.map((project) => (
            <a key={project.id} href={project.url} target="_blank" rel="noopener noreferrer">
              {project.name}
            </a>
          ))}
        </nav>
        <button type="button" className="footer__top" onClick={() => scroll.scrollTo(0)}>
          {FOOTER.backToTop} <span aria-hidden="true">↑</span>
        </button>
      </div>
    </footer>
  )
}
