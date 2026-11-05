import { useCallback, useState } from 'react'
import { Cursor } from './components/Cursor'
import { Loader } from './components/Loader'
import { Marquee } from './components/Marquee'
import { Nav } from './components/Nav'
import { ScrollProgress } from './components/ScrollProgress'
import { MARQUEE_CLOSING, MARQUEE_PRIMARY } from './content'
import { ScrollTrigger } from './lib/gsap'
import { IntroContext } from './providers/introContext'
import { SmoothScrollProvider } from './providers/SmoothScrollProvider'
import { DroneSequence } from './sections/DroneSequence'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { IntroStatement } from './sections/IntroStatement'
import { Principles } from './sections/Principles'
import { Services } from './sections/Services'
import { Work } from './sections/Work'

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const [loaderMounted, setLoaderMounted] = useState(true)

  const onReveal = useCallback(() => setIntroComplete(true), [])
  const onLoaderDone = useCallback(() => {
    setLoaderMounted(false)
    ScrollTrigger.refresh()
  }, [])

  return (
    <SmoothScrollProvider>
      <IntroContext.Provider value={introComplete}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {loaderMounted && <Loader onReveal={onReveal} onDone={onLoaderDone} />}
        <Cursor />
        <ScrollProgress />
        <Nav />
        <main id="main">
          <Hero />
          <Marquee items={MARQUEE_PRIMARY} label="What A Studio makes" />
          <IntroStatement />
          <DroneSequence />
          <Services />
          <Principles />
          <Work />
          <Marquee items={MARQUEE_CLOSING} variant="outline" reverse secondsPerLoop={30} label="Get in touch" />
        </main>
        <Footer />
      </IntroContext.Provider>
    </SmoothScrollProvider>
  )
}
