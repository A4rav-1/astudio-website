import { describe, expect, it, vi } from 'vitest'
import { EMPTY_DRAFT, submitWebEnquiry, validateWebEnquiry, type WebEnquiryDraft, type WebEnquiryRow } from './webEnquiry'

const COMPLETE: WebEnquiryDraft = {
  name: '  Sam Lee ',
  email: 'sam@example.com',
  company: '',
  phone: '0400 000 000',
  projectType: 'online_store',
  budget: '5k_10k',
  timeline: 'flexible',
  currentSite: '',
  details: 'We sell coffee beans and need a store with stock tracking.',
}

const TARGET = { url: 'https://project.supabase.co', publishableKey: 'sb_publishable_test' }

describe('validateWebEnquiry', () => {
  it('turns a complete draft into a trimmed row, with blank optional fields as null', () => {
    const result = validateWebEnquiry(COMPLETE)
    expect(result).toEqual({
      ok: true,
      row: {
        name: 'Sam Lee',
        email: 'sam@example.com',
        company: null,
        phone: '0400 000 000',
        project_type: 'online_store',
        budget: '5k_10k',
        timeline: 'flexible',
        current_site: null,
        details: 'We sell coffee beans and need a store with stock tracking.',
      },
    })
  })

  it('reports every missing required field at once', () => {
    const result = validateWebEnquiry(EMPTY_DRAFT)
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(Object.keys(result.errors).sort()).toEqual(['budget', 'details', 'email', 'name', 'projectType', 'timeline'])
  })

  it('rejects a bad email, an unknown choice and over-long text', () => {
    const result = validateWebEnquiry({ ...COMPLETE, email: 'sam@', budget: 'millions', company: 'x'.repeat(161) })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(Object.keys(result.errors).sort()).toEqual(['budget', 'company', 'email'])
  })

  it('needs at least a short sentence of detail', () => {
    const result = validateWebEnquiry({ ...COMPLETE, details: 'site pls' })
    expect(result.ok).toBe(false)
  })
})

describe('submitWebEnquiry', () => {
  const row: WebEnquiryRow = {
    name: 'Sam',
    email: 'sam@example.com',
    company: null,
    phone: null,
    project_type: 'new_site',
    budget: 'unsure',
    timeline: 'asap',
    current_site: null,
    details: 'A site for my cafe please.',
  }

  it('posts the row to the web_enquiries table without asking for it back', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 201 }))
    await submitWebEnquiry(row, TARGET, fetchImpl)
    expect(fetchImpl).toHaveBeenCalledWith('https://project.supabase.co/rest/v1/web_enquiries', {
      method: 'POST',
      headers: { apikey: 'sb_publishable_test', 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(row),
    })
  })

  it('throws with the status and message when Supabase refuses the insert', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response('violates check constraint', { status: 400 }))
    await expect(submitWebEnquiry(row, TARGET, fetchImpl)).rejects.toThrow('Enquiry was not saved (400): violates check constraint')
  })
})
