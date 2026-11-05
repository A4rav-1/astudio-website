import type { CompanyRouteId, RouteId } from './lib/route'

export interface NavLink {
  label: string
  href: string
}

export interface DroneStepCopy {
  title: string
  body: string
}

export interface CalloutCopy {
  id: CalloutAnchorId
  label: string
  step: number
}

export type CalloutAnchorId = 'body' | 'hinge' | 'motor' | 'moduleBay' | 'moduleSwap' | 'airframe'

export interface CompanyCopy {
  id: CompanyRouteId
  index: string
  name: string
  shortName: string
  tagline: string
  body: string
  linkLabel: string
}

export interface GradientColors {
  color1: string
  color2: string
  color3: string
}

export interface PageHeroCopy {
  eyebrow: string
  headlineLead: string
  headlineAccent: string
  body: string
  primaryCta: string
  primaryHref: string
  secondaryCta: string
  scrollCue: string
  longTitle: boolean
}

export interface SectionCopy {
  eyebrow: string
  title: string
}

export interface PageMeta {
  documentTitle: string
  hero: PageHeroCopy
  gradient: GradientColors
  footerBody: string
  footerCta: string
  mailSubject: string
}

export interface PrincipleCopy {
  index: string
  title: string
  body: string
}

export interface WorkCopy {
  id: 'vkd' | 'krunchee'
  name: string
  kind: string
  body: string
  url: string
  displayUrl: string
  tags: readonly string[]
}

export const CONTACT_EMAIL = 'hello@astudio.example'
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}`
export const LOCATION = 'Melbourne, Australia'

export const BRAND_COLORS = {
  red: '#F90500',
  yellow: '#FDC107',
  blue: '#155BBF',
  navy: '#031428',
} as const

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Drones', href: '#/drone' },
  { label: 'Web', href: '#/web' },
  { label: 'Exam', href: '#/exam' },
]

export const NAV_CTA = { label: 'Start a project', href: '#contact' } as const

export const SCROLL_HINTS = {
  drone: { start: 'Scroll to unfold the drone', active: 'Keep scrolling' },
} as const

export const INTRO_STATEMENT =
  'A Studio is a Melbourne studio and the parent of three companies. A Drone Company builds modular folding drones. A Web Company builds websites for companies. A Exam Company trains VCE students the way the exam will test them.'

export const MARQUEE_PRIMARY: readonly string[] = [
  'A Drone Company',
  'A Web Company',
  'A Exam Company',
  'Made in Melbourne',
]

export const MARQUEE_CLOSING: readonly string[] = ['Have something to build?', 'Say hello', CONTACT_EMAIL]

export const DRONE_SECTION = {
  eyebrow: 'The airframe',
  title: 'One frame. Many jobs.',
} as const

export const DRONE_STEPS: readonly DroneStepCopy[] = [
  {
    title: 'Stowed',
    body: 'A solid stowage body. Arms folded flat along the frame, nothing hanging loose.',
  },
  {
    title: 'Fold-out locking arms',
    body: 'Each arm swings out on its hinge and locks into flight position.',
  },
  {
    title: 'Spin up',
    body: 'Props come up to speed and the airframe lifts off its stand.',
  },
  {
    title: 'Swappable modules',
    body: 'Modules dock into the frame. Change the module, change the job.',
  },
  {
    title: 'One airframe, many jobs',
    body: 'The same airframe, re-equipped for whatever the day needs.',
  },
]

export const DRONE_CALLOUTS: readonly CalloutCopy[] = [
  { id: 'body', label: 'Stowage body', step: 0 },
  { id: 'hinge', label: 'Locking hinge', step: 1 },
  { id: 'motor', label: 'Props up to speed', step: 2 },
  { id: 'moduleBay', label: 'Module bay', step: 3 },
  { id: 'moduleSwap', label: 'Swappable module', step: 3 },
  { id: 'airframe', label: 'One airframe', step: 4 },
]

export const COMPANIES_SECTION: SectionCopy = {
  eyebrow: 'The companies',
  title: 'Pick a company.',
}

export const COMPANIES: readonly CompanyCopy[] = [
  {
    id: 'drone',
    index: '01',
    name: 'A Drone Company',
    shortName: 'Drones',
    tagline: 'Modular folding drones.',
    body: 'Fold-out locking arms, a solid stowage body and swappable modules. One airframe for many jobs.',
    linkLabel: 'Enter',
  },
  {
    id: 'web',
    index: '02',
    name: 'A Web Company',
    shortName: 'Web',
    tagline: 'Websites for companies.',
    body: "From a consulting firm's site to a nut and snack store with its own admin portal and stock management.",
    linkLabel: 'Enter',
  },
  {
    id: 'exam',
    index: '03',
    name: 'A Exam Company',
    shortName: 'Exam',
    tagline: 'The VCE Exam Trainer.',
    body: 'A study app for Victorian VCE students: exam-style practice, worked feedback and subject packs checked against official exam specifications.',
    linkLabel: 'Enter',
  },
]

export const OTHER_COMPANIES_SECTION: SectionCopy = {
  eyebrow: 'Also from A Studio',
  title: 'The other companies.',
}

export const PRINCIPLES_SECTION: SectionCopy = {
  eyebrow: 'How we think',
  title: 'Principles',
}

export const PRINCIPLES: readonly PrincipleCopy[] = [
  {
    index: '01',
    title: 'One airframe. Many jobs.',
    body: 'Swappable modules mean the drone you carry is the drone the job needs.',
  },
  {
    index: '02',
    title: 'Fold it. Lock it. Fly it.',
    body: 'Arms fold into a solid body for the trip, then lock out for flight.',
  },
  {
    index: '03',
    title: 'Sites that do the work.',
    body: 'A front door for a consulting firm. A full store with admin and stock for a snack brand.',
  },
  {
    index: '04',
    title: 'Checked against the real thing.',
    body: 'Exam Trainer subject packs are checked against official VCE exam specifications.',
  },
  {
    index: '05',
    title: 'Made in Melbourne.',
    body: 'Designed and built by A Studio in Melbourne, Australia.',
  },
]

export const WORK_SECTION = {
  eyebrow: 'Selected work',
  title: 'Live and working.',
} as const

export const WORK: readonly WorkCopy[] = [
  {
    id: 'vkd',
    name: 'VKD Consultants',
    kind: 'Consulting firm website',
    body: 'The website for VKD Consultants, a consulting firm.',
    url: 'https://www.vkdconsultants.com.au/',
    displayUrl: 'vkdconsultants.com.au',
    tags: ['Company website', 'Live'],
  },
  {
    id: 'krunchee',
    name: 'Krunchee Nutty Galore',
    kind: 'Nut and snack e-commerce',
    body: 'An online store for nuts and snacks, with an admin portal and stock management behind it.',
    url: 'https://kruncheenuttygalore.com.au/',
    displayUrl: 'kruncheenuttygalore.com.au',
    tags: ['E-commerce', 'Admin portal', 'Stock management'],
  },
]

export const DRONE_PRINCIPLES: readonly PrincipleCopy[] = [
  PRINCIPLES[0],
  PRINCIPLES[1],
  { ...PRINCIPLES[4], index: '03' },
]

export const WEB_FEATURES_SECTION: SectionCopy = {
  eyebrow: 'What we build',
  title: 'Sites, stores, back offices.',
}

export const WEB_FEATURES: readonly PrincipleCopy[] = [
  {
    index: '01',
    title: 'Company websites.',
    body: 'A clear front door for a consulting firm, live for VKD Consultants.',
  },
  {
    index: '02',
    title: 'E-commerce.',
    body: 'An online store for nuts and snacks, live for Krunchee Nutty Galore.',
  },
  {
    index: '03',
    title: 'Admin and stock.',
    body: 'An admin portal and stock management behind the store.',
  },
]

export const EXAM_STEPS_SECTION: SectionCopy = {
  eyebrow: 'How it works',
  title: 'Practise, learn, check.',
}

export const EXAM_STEPS: readonly PrincipleCopy[] = [
  {
    index: '01',
    title: 'Practise.',
    body: 'Exam-style questions, so the real paper is not the first time you see the format.',
  },
  {
    index: '02',
    title: 'Get feedback.',
    body: 'Worked feedback on each answer, not just a mark.',
  },
  {
    index: '03',
    title: 'Check against the spec.',
    body: 'Subject packs are checked against official VCE exam specifications.',
  },
]

const SHARED_SCROLL_CUE = 'Scroll to explore'

export const PAGE_META: Readonly<Record<RouteId, PageMeta>> = {
  hub: {
    documentTitle: 'A Studio',
    hero: {
      eyebrow: `A Studio · ${LOCATION}`,
      headlineLead: 'Three',
      headlineAccent: 'companies.',
      body: 'One studio in Melbourne: modular folding drones, websites for companies and the VCE Exam Trainer.',
      primaryCta: 'Meet the companies',
      primaryHref: '#companies',
      secondaryCta: 'Start a project',
      scrollCue: SHARED_SCROLL_CUE,
      longTitle: true,
    },
    gradient: { color1: '#155BBF', color2: '#0A2F73', color3: '#020A14' },
    footerBody: 'Drones, websites or study tools. Tell us what you need.',
    footerCta: 'Start a project',
    mailSubject: 'A Studio enquiry',
  },
  drone: {
    documentTitle: 'A Drone Company · A Studio',
    hero: {
      eyebrow: 'A Studio · A Drone Company',
      headlineLead: 'Built to',
      headlineAccent: 'unfold.',
      body: 'Modular folding drones: fold-out locking arms, a solid stowage body and swappable modules. One airframe for many jobs.',
      primaryCta: 'Watch it unfold',
      primaryHref: '#drone',
      secondaryCta: 'Get in touch',
      scrollCue: SHARED_SCROLL_CUE,
      longTitle: false,
    },
    gradient: { color1: '#155BBF', color2: '#0A2F73', color3: '#020A14' },
    footerBody: 'Interested in the airframe? Say hello.',
    footerCta: 'Get in touch',
    mailSubject: 'A Drone Company enquiry',
  },
  web: {
    documentTitle: 'A Web Company · A Studio',
    hero: {
      eyebrow: 'A Studio · A Web Company',
      headlineLead: 'Sites that',
      headlineAccent: 'work.',
      body: "Websites for companies. From a consulting firm's front door to a full store with admin and stock behind it.",
      primaryCta: 'See the work',
      primaryHref: '#work',
      secondaryCta: 'Start a site',
      scrollCue: SHARED_SCROLL_CUE,
      longTitle: true,
    },
    gradient: { color1: '#C99A06', color2: '#5C4303', color3: '#140E02' },
    footerBody: 'Need a website for your company? Tell us about it.',
    footerCta: 'Start a site',
    mailSubject: 'A Web Company enquiry',
  },
  exam: {
    documentTitle: 'A Exam Company · A Studio',
    hero: {
      eyebrow: 'A Studio · A Exam Company',
      headlineLead: 'Ready for',
      headlineAccent: 'the exam.',
      body: 'The VCE Exam Trainer: exam-style practice, worked feedback and subject packs checked against official exam specifications.',
      primaryCta: 'How it works',
      primaryHref: '#how',
      secondaryCta: 'Ask about it',
      scrollCue: SHARED_SCROLL_CUE,
      longTitle: true,
    },
    gradient: { color1: '#C41410', color2: '#5E0A08', color3: '#150404' },
    footerBody: 'Questions about the VCE Exam Trainer? Ask away.',
    footerCta: 'Ask us',
    mailSubject: 'A Exam Company enquiry',
  },
}

export const FOOTER = {
  title: 'Have something worth building?',
  backToTop: 'Back to top',
  wordmark: 'A Studio',
  companiesLabel: 'Companies',
} as const
