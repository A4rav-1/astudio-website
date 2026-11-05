import { MagneticButton } from '../components/MagneticButton'
import { ReactiveWordmark } from '../components/ReactiveWordmark'
import { RevealHeading } from '../components/RevealHeading'
import { COMPANIES, CONTACT_EMAIL, FOOTER, LOCATION, PAGE_META } from '../content'
import { buildMailto } from '../lib/contact'
import { routeHash } from '../lib/route'
import { useRouter } from '../providers/routerContext'
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
  const { route } = useRouter()
  const meta = PAGE_META[route]
  const title = splitLastWord(FOOTER.title)
  const mailto = buildMailto(CONTACT_EMAIL, meta.mailSubject)

  return (
    <footer id="contact" className="footer" aria-labelledby="contact-title">
      <div className="container footer__cta">
        <p className="eyebrow">Contact</p>
        <div className="footer__cta-row">
          <div className="footer__cta-copy">
            <RevealHeading id="contact-title">
              {title.lead} <em>{title.last}</em>
            </RevealHeading>
            <p className="footer__body">{meta.footerBody}</p>
            <a className="footer__email" href={mailto}>
              {CONTACT_EMAIL}
            </a>
          </div>
          <MagneticButton href={mailto} variant="giant" strength={0.4}>
            {meta.footerCta}
            <span aria-hidden="true">→</span>
          </MagneticButton>
        </div>
      </div>

      <ReactiveWordmark text={FOOTER.wordmark} />

      <div className="container footer__bottom">
        <p>
          © {CURRENT_YEAR} A Studio · {LOCATION}
        </p>
        <nav aria-label={FOOTER.companiesLabel} className="footer__links">
          {COMPANIES.map((company) => (
            <a key={company.id} href={routeHash(company.id)}>
              {company.name}
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
