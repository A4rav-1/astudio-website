import { supportsWebGL } from '../lib/webgl'

let cached: boolean | null = null

/** Checked once per page load; creating test contexts repeatedly can exhaust the browser's context limit. */
export function useWebGLSupport(): boolean {
  if (cached === null) cached = supportsWebGL(() => document.createElement('canvas'))
  return cached
}
