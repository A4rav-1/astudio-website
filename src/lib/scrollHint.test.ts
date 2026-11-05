import { describe, expect, it } from 'vitest'
import { scrollHintPhase } from './scrollHint'

describe('scrollHintPhase', () => {
  it('starts in the start phase at zero progress', () => {
    expect(scrollHintPhase(0)).toBe('start')
    expect(scrollHintPhase(0.039)).toBe('start')
  })

  it('is active through the middle of the section', () => {
    expect(scrollHintPhase(0.04)).toBe('active')
    expect(scrollHintPhase(0.5)).toBe('active')
    expect(scrollHintPhase(0.939)).toBe('active')
  })

  it('is done near the end of the section', () => {
    expect(scrollHintPhase(0.94)).toBe('done')
    expect(scrollHintPhase(1)).toBe('done')
  })
})
