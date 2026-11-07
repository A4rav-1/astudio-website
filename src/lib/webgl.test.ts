import { describe, expect, it } from 'vitest'
import { supportsWebGL } from './webgl'

function fakeCanvas(available: readonly string[]) {
  return () => ({
    getContext: (contextId: string) => (available.includes(contextId) ? {} : null),
  })
}

describe('supportsWebGL', () => {
  it('accepts WebGL 2', () => {
    expect(supportsWebGL(fakeCanvas(['webgl2']))).toBe(true)
  })

  it('falls back to WebGL 1', () => {
    expect(supportsWebGL(fakeCanvas(['webgl']))).toBe(true)
  })

  it('reports no support when both contexts are blocked', () => {
    expect(supportsWebGL(fakeCanvas([]))).toBe(false)
  })
})
