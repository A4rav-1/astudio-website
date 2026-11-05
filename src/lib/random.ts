/** Deterministic PRNG (mulberry32) returning floats in [0, 1). */
export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let mixed = state
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1)
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}

/** Flat xyz array of `count` points scattered uniformly inside a box of the given half-extents. */
export function scatterPoints(count: number, halfExtents: readonly [number, number, number], seed: number): Float32Array {
  const random = createSeededRandom(seed)
  const positions = new Float32Array(count * 3)
  for (let index = 0; index < count; index++) {
    positions[index * 3] = (random() * 2 - 1) * halfExtents[0]
    positions[index * 3 + 1] = (random() * 2 - 1) * halfExtents[1]
    positions[index * 3 + 2] = (random() * 2 - 1) * halfExtents[2]
  }
  return positions
}
