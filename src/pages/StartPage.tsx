import { useState } from 'react'
import { CompanyMark } from '../components/CompanyMark'
import { RevealHeading } from '../components/RevealHeading'
import { WebEnquiryForm } from '../components/WebEnquiryForm'
import { EXAM_TRAINER_URL, START_PAGE, type StartChoiceCopy } from '../content'
import { useSmoothScroll } from '../providers/smoothScrollContext'
import './StartPage.css'

type Step = 'choose' | 'web'

function ChoiceBody({ choice }: { choice: StartChoiceCopy }) {
  return (
    <>
      <CompanyMark company={choice.company} className="start-choice__mark" />
      <span className="start-choice__name">{choice.name}</span>
      <span className="start-choice__title">{choice.title}</span>
      <span className="start-choice__body">{choice.body}</span>
    </>
  )
}

function Choice({ choice, onWeb }: { choice: StartChoiceCopy; onWeb: () => void }) {
  if (choice.company === 'web') {
    return (
      <button type="button" className="start-choice" data-company="web" onClick={onWeb}>
        <ChoiceBody choice={choice} />
        <span className="start-choice__action">
          {choice.action} <span aria-hidden="true">→</span>
        </span>
      </button>
    )
  }
  if (choice.company === 'exam') {
    return (
      <a className="start-choice" data-company="exam" href={EXAM_TRAINER_URL} target="_blank" rel="noopener noreferrer">
        <ChoiceBody choice={choice} />
        <span className="start-choice__action">
          {choice.action} <span aria-hidden="true">↗</span>
        </span>
      </a>
    )
  }
  return (
    <div className="start-choice start-choice--soon" data-company={choice.company} aria-disabled="true">
      <ChoiceBody choice={choice} />
      <span className="start-choice__action start-choice__action--soon">{choice.action}</span>
    </div>
  )
}

export function StartPage() {
  const [step, setStep] = useState<Step>('choose')
  const scroll = useSmoothScroll()

  const show = (next: Step) => {
    setStep(next)
    scroll.scrollTo(0)
  }

  return (
    <section className="start container" aria-labelledby="start-title">
      <h1 id="start-title" className="visually-hidden">
        {START_PAGE.eyebrow}
      </h1>
      {step === 'choose' ? (
        <>
          <header className="start__header">
            <p className="eyebrow">{START_PAGE.eyebrow}</p>
            <RevealHeading>{START_PAGE.title}</RevealHeading>
          </header>
          <div className="start__choices">
            {START_PAGE.choices.map((choice) => (
              <Choice key={choice.company} choice={choice} onWeb={() => show('web')} />
            ))}
          </div>
        </>
      ) : (
        <div data-company="web">
          <WebEnquiryForm onBack={() => show('choose')} />
        </div>
      )}
    </section>
  )
}
