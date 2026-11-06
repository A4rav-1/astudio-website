/**
 * Web enquiries: the form's options, validation and the request that stores one in
 * Supabase. The table only lets the public site insert, so nothing here can read
 * enquiries back; they are read in the Supabase dashboard.
 */

export const PROJECT_TYPES = [
  { value: 'new_site', label: 'A new website' },
  { value: 'redesign', label: 'A redesign' },
  { value: 'online_store', label: 'An online store' },
  { value: 'other', label: 'Something else' },
] as const

export const BUDGETS = [
  { value: 'under_2k', label: 'Under $2k' },
  { value: '2k_5k', label: '$2k to $5k' },
  { value: '5k_10k', label: '$5k to $10k' },
  { value: '10k_plus', label: '$10k+' },
  { value: 'unsure', label: 'Not sure yet' },
] as const

export const TIMELINES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1_3_months', label: '1 to 3 months' },
  { value: '3_6_months', label: '3 to 6 months' },
  { value: 'flexible', label: 'Flexible' },
] as const

export type ProjectType = (typeof PROJECT_TYPES)[number]['value']
export type Budget = (typeof BUDGETS)[number]['value']
export type Timeline = (typeof TIMELINES)[number]['value']

/** What the form holds while someone types: every field is a string, choices start empty. */
export interface WebEnquiryDraft {
  name: string
  email: string
  company: string
  phone: string
  projectType: string
  budget: string
  timeline: string
  currentSite: string
  details: string
}

export type WebEnquiryField = keyof WebEnquiryDraft

/** A row for public.web_enquiries; limits match the table's check constraints. */
export interface WebEnquiryRow {
  name: string
  email: string
  company: string | null
  phone: string | null
  project_type: ProjectType
  budget: Budget
  timeline: Timeline
  current_site: string | null
  details: string
}

export type ValidationResult =
  | { ok: true; row: WebEnquiryRow }
  | { ok: false; errors: Partial<Record<WebEnquiryField, string>> }

export const EMPTY_DRAFT: WebEnquiryDraft = {
  name: '',
  email: '',
  company: '',
  phone: '',
  projectType: '',
  budget: '',
  timeline: '',
  currentSite: '',
  details: '',
}

export const LIMITS = {
  name: 120,
  email: 254,
  company: 160,
  phone: 40,
  currentSite: 300,
  detailsMin: 10,
  detailsMax: 4000,
} as const

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

function isOneOf<T extends string>(value: string, options: readonly { value: T }[]): value is T {
  return options.some((option) => option.value === value)
}

function optional(value: string): string | null {
  return value === '' ? null : value
}

export function validateWebEnquiry(draft: WebEnquiryDraft): ValidationResult {
  const trimmed = Object.fromEntries(
    Object.entries(draft).map(([field, value]) => [field, value.trim()]),
  ) as unknown as WebEnquiryDraft
  const errors: Partial<Record<WebEnquiryField, string>> = {}

  if (trimmed.name === '') errors.name = 'Tell us your name.'
  else if (trimmed.name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`

  if (!EMAIL_PATTERN.test(trimmed.email) || trimmed.email.length > LIMITS.email) {
    errors.email = 'Enter an email we can reply to.'
  }
  if (trimmed.company.length > LIMITS.company) errors.company = `Keep it under ${LIMITS.company} characters.`
  if (trimmed.phone.length > LIMITS.phone) errors.phone = `Keep it under ${LIMITS.phone} characters.`
  if (trimmed.currentSite.length > LIMITS.currentSite) {
    errors.currentSite = `Keep it under ${LIMITS.currentSite} characters.`
  }

  if (!isOneOf(trimmed.projectType, PROJECT_TYPES)) errors.projectType = 'Pick what you need.'
  if (!isOneOf(trimmed.budget, BUDGETS)) errors.budget = 'Pick a budget, or “Not sure yet”.'
  if (!isOneOf(trimmed.timeline, TIMELINES)) errors.timeline = 'Pick a timeline.'

  if (trimmed.details.length < LIMITS.detailsMin) errors.details = 'Give us a sentence or two about the project.'
  else if (trimmed.details.length > LIMITS.detailsMax) errors.details = `Keep it under ${LIMITS.detailsMax} characters.`

  if (
    Object.keys(errors).length > 0 ||
    !isOneOf(trimmed.projectType, PROJECT_TYPES) ||
    !isOneOf(trimmed.budget, BUDGETS) ||
    !isOneOf(trimmed.timeline, TIMELINES)
  ) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    row: {
      name: trimmed.name,
      email: trimmed.email,
      company: optional(trimmed.company),
      phone: optional(trimmed.phone),
      project_type: trimmed.projectType,
      budget: trimmed.budget,
      timeline: trimmed.timeline,
      current_site: optional(trimmed.currentSite),
      details: trimmed.details,
    },
  }
}

export interface SupabaseTarget {
  url: string
  publishableKey: string
}

/** Inserts the enquiry. Throws with Supabase's message when the insert is refused. */
export async function submitWebEnquiry(
  row: WebEnquiryRow,
  target: SupabaseTarget,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const response = await fetchImpl(`${target.url}/rest/v1/web_enquiries`, {
    method: 'POST',
    headers: {
      apikey: target.publishableKey,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  })
  if (!response.ok) {
    throw new Error(`Enquiry was not saved (${response.status}): ${await response.text()}`)
  }
}
