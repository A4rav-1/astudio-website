import { useCallback, useState, type ComponentType } from 'react'
import { Cursor } from './components/Cursor'
import { Loader } from './components/Loader'
import { Marquee } from './components/Marquee'
import { Nav } from './components/Nav'
import { ScrollProgress } from './components/ScrollProgress'
import { MARQUEE_CLOSING } from './content'
import { ScrollTrigger } from './lib/gsap'
import { isCompanyRoute, type RouteId } from './lib/route'
import { DronePage } from './pages/DronePage'
import { ExamPage } from './pages/ExamPage'
import { HubPage } from './pages/HubPage'
import { StartPage } from './pages/StartPage'
import { WebPage } from './pages/WebPage'
import { IntroContext } from './providers/introContext'
import { RouterProvider } from './providers/RouterProvider'
import { useRouter } from './providers/routerContext'
import { SmoothScrollProvider } from './providers/SmoothScrollProvider'
import { Footer } from './sections/Footer'

const PAGES: Readonly<Record<RouteId, ComponentType>> = {
  hub: HubPage,
  drone: DronePage,
  web: WebPage,
  exam: ExamPage,
  start: StartPage,
}

function Site() {
  const { route } = useRouter()
  const Page = PAGES[route]

  return (
    <div className="site" data-company={isCompanyRoute(route) ? route : undefined}>
      <Nav />
      <main id="main" key={route}>
        <Page />
        <Marquee items={MARQUEE_CLOSING} variant="outline" reverse secondsPerLoop={30} label="Get in touch" />
      </main>
      <Footer />
    </div>
  )
}

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
      <RouterProvider>
        <IntroContext.Provider value={introComplete}>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          {loaderMounted && <Loader onReveal={onReveal} onDone={onLoaderDone} />}
          <Cursor />
          <ScrollProgress />
          <Site />
        </IntroContext.Provider>
      </RouterProvider>
    </SmoothScrollProvider>
  )
}
