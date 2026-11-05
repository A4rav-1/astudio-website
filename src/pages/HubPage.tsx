import { Marquee } from '../components/Marquee'
import { MARQUEE_PRIMARY, PRINCIPLES, PRINCIPLES_SECTION } from '../content'
import { Companies } from '../sections/Companies'
import { Hero } from '../sections/Hero'
import { IntroStatement } from '../sections/IntroStatement'
import { Principles } from '../sections/Principles'

export function HubPage() {
  return (
    <>
      <Hero route="hub" />
      <Marquee items={MARQUEE_PRIMARY} label="The companies of A Studio" />
      <IntroStatement />
      <Companies />
      <Principles section={PRINCIPLES_SECTION} items={PRINCIPLES} />
    </>
  )
}
