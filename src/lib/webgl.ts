interface ContextSource {
  getContext(contextId: 'webgl2' | 'webgl'): unknown
}

/** True when the browser can create a WebGL context (school and work PCs often block it by policy). */
export function supportsWebGL(createCanvas: () => ContextSource): boolean {
  const canvas = createCanvas()
  return canvas.getContext('webgl2') !== null || canvas.getContext('webgl') !== null
}
