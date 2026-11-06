import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { START_PAGE } from '../content'
import { SUPABASE } from '../lib/supabase'
import { useSmoothScroll } from '../providers/smoothScrollContext'
import {
  BUDGETS,
  EMPTY_DRAFT,
  LIMITS,
  PROJECT_TYPES,
  submitWebEnquiry,
  TIMELINES,
  validateWebEnquiry,
  type WebEnquiryDraft,
  type WebEnquiryField,
} from '../lib/webEnquiry'
import './WebEnquiryForm.css'

type SubmitState = 'idle' | 'sending' | 'sent' | 'failed'
type FieldErrors = Partial<Record<WebEnquiryField, string>>

interface TextFieldProps {
  field: WebEnquiryField
  label: string
  value: string
  error: string | undefined
  onChange: (field: WebEnquiryField, value: string) => void
  type?: 'text' | 'email' | 'tel' | 'url'
  autoComplete?: string
  maxLength: number
  required?: boolean
  multiline?: boolean
  inputRef?: React.Ref<HTMLInputElement>
}

function TextField({ field, label, value, error, onChange, type = 'text', autoComplete, maxLength, required = false, multiline = false, inputRef }: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const shared = {
    id,
    name: field,
    value,
    maxLength,
    required,
    'aria-invalid': error !== undefined,
    'aria-describedby': error === undefined ? undefined : errorId,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(field, event.target.value),
  }
  return (
    <div className={`enquiry__field${multiline ? ' enquiry__field--wide' : ''}`}>
      <label htmlFor={id} className="enquiry__label">
        {label}
        {!required && <span className="enquiry__optional"> (optional)</span>}
      </label>
      {multiline ? (
        <textarea {...shared} rows={6} className="enquiry__input enquiry__input--area" data-lenis-prevent />
      ) : (
        <input {...shared} ref={inputRef} type={type} autoComplete={autoComplete} className="enquiry__input" />
      )}
      {error !== undefined && (
        <p id={errorId} className="enquiry__error">
          {error}
        </p>
      )}
    </div>
  )
}

interface ChoiceFieldProps {
  field: WebEnquiryField
  legend: string
  options: readonly { value: string; label: string }[]
  value: string
  error: string | undefined
  onChange: (field: WebEnquiryField, value: string) => void
}

function ChoiceField({ field, legend, options, value, error, onChange }: ChoiceFieldProps) {
  const errorId = useId()
  return (
    <fieldset className="enquiry__field enquiry__field--wide" aria-describedby={error === undefined ? undefined : errorId}>
      <legend className="enquiry__label">{legend}</legend>
      <div className="enquiry__chips">
        {options.map((option) => (
          <label key={option.value} className="enquiry__chip">
            <input
              type="radio"
              name={field}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(field, option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error !== undefined && (
        <p id={errorId} className="enquiry__error">
          {error}
        </p>
      )}
    </fieldset>
  )
}

interface WebEnquiryFormProps {
  onBack: () => void
}

export function WebEnquiryForm({ onBack }: WebEnquiryFormProps) {
  const copy = START_PAGE.form
  const [draft, setDraft] = useState<WebEnquiryDraft>(EMPTY_DRAFT)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [state, setState] = useState<SubmitState>('idle')
  const [trap, setTrap] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)
  const scroll = useSmoothScroll()

  useEffect(() => {
    nameRef.current?.focus({ preventScroll: true })
  }, [])

  // The thank-you card is much shorter than the form, so bring it into view.
  useEffect(() => {
    if (state === 'sent') scroll.scrollTo(0)
  }, [state, scroll])

  const update = (field: WebEnquiryField, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (current[field] === undefined) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const result = validateWebEnquiry(draft)
    if (!result.ok) {
      setErrors(result.errors)
      const firstInvalid = (Object.keys(EMPTY_DRAFT) as WebEnquiryField[]).find((field) => result.errors[field] !== undefined)
      if (firstInvalid !== undefined) form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    // Bots fill every field, including the hidden one; show them success and send nothing.
    if (trap !== '') {
      setState('sent')
      return
    }
    setState('sending')
    try {
      await submitWebEnquiry(result.row, SUPABASE)
      setState('sent')
      setDraft(EMPTY_DRAFT)
    } catch (error) {
      console.error(error)
      setState('failed')
    }
  }

  if (state === 'sent') {
    return (
      <div className="enquiry enquiry--done" role="status">
        <h2 className="enquiry__title">{copy.successTitle}</h2>
        <p className="enquiry__lede">{copy.successBody}</p>
        <div className="enquiry__actions">
          <button type="button" className="enquiry__submit" onClick={() => setState('idle')}>
            {copy.successAgain}
          </button>
          <button type="button" className="enquiry__back" onClick={onBack}>
            {copy.back}
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className="enquiry" onSubmit={onSubmit} noValidate aria-labelledby="enquiry-title">
      <div className="enquiry__head">
        <button type="button" className="enquiry__back" onClick={onBack}>
          <span aria-hidden="true">←</span> {copy.back}
        </button>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="enquiry-title" className="enquiry__title">
          {copy.title}
        </h2>
      </div>

      <div className="enquiry__grid">
        <TextField field="name" label="Your name" value={draft.name} error={errors.name} onChange={update} autoComplete="name" maxLength={LIMITS.name} required inputRef={nameRef} />
        <TextField field="email" label="Email" type="email" value={draft.email} error={errors.email} onChange={update} autoComplete="email" maxLength={LIMITS.email} required />
        <TextField field="company" label="Company" value={draft.company} error={errors.company} onChange={update} autoComplete="organization" maxLength={LIMITS.company} />
        <TextField field="phone" label="Phone" type="tel" value={draft.phone} error={errors.phone} onChange={update} autoComplete="tel" maxLength={LIMITS.phone} />
        <ChoiceField field="projectType" legend="What do you need?" options={PROJECT_TYPES} value={draft.projectType} error={errors.projectType} onChange={update} />
        <ChoiceField field="budget" legend="Budget" options={BUDGETS} value={draft.budget} error={errors.budget} onChange={update} />
        <ChoiceField field="timeline" legend="Timeline" options={TIMELINES} value={draft.timeline} error={errors.timeline} onChange={update} />
        <TextField field="currentSite" label="Current website" type="url" value={draft.currentSite} error={errors.currentSite} onChange={update} autoComplete="url" maxLength={LIMITS.currentSite} />
        <TextField field="details" label="About the project" value={draft.details} error={errors.details} onChange={update} maxLength={LIMITS.detailsMax} required multiline />
      </div>

      <div className="enquiry__trap" aria-hidden="true">
        <label>
          Leave this empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(event) => setTrap(event.target.value)} />
        </label>
      </div>

      <div className="enquiry__actions">
        <button type="submit" className="enquiry__submit" disabled={state === 'sending'}>
          {state === 'sending' ? copy.sending : copy.submit}
          <span aria-hidden="true">→</span>
        </button>
        {state === 'failed' && (
          <p className="enquiry__error" role="alert">
            {copy.failure}
          </p>
        )}
      </div>
    </form>
  )
}
