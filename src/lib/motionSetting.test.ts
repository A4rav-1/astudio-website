import { describe, expect, it } from 'vitest'
import { parseMotionSetting, toggledMotionSetting } from './motionSetting'

describe('parseMotionSetting', () => {
  it('defaults to full motion when nothing is stored', () => {
    expect(parseMotionSetting(null)).toBe('full')
  })

  it('reads a stored reduced setting', () => {
    expect(parseMotionSetting('reduced')).toBe('reduced')
  })

  it('treats unknown values as full motion', () => {
    expect(parseMotionSetting('off')).toBe('full')
    expect(parseMotionSetting('')).toBe('full')
  })
})

describe('toggledMotionSetting', () => {
  it('flips between full and reduced', () => {
    expect(toggledMotionSetting('full')).toBe('reduced')
    expect(toggledMotionSetting('reduced')).toBe('full')
  })
})
