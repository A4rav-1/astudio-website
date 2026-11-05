import { describe, expect, it } from 'vitest'
import { buildMailto } from './contact'

describe('buildMailto', () => {
  it('returns a bare mailto link without a subject', () => {
    expect(buildMailto('a@b.test')).toBe('mailto:a@b.test')
  })

  it('encodes the subject', () => {
    expect(buildMailto('a@b.test', 'A Web Company enquiry')).toBe('mailto:a@b.test?subject=A%20Web%20Company%20enquiry')
  })
})
