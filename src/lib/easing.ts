export type EasingFunction = (t: number) => number

export const linear: EasingFunction = (t) => t

export const easeInOutCubic: EasingFunction = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export const easeOutCubic: EasingFunction = (t) => 1 - (1 - t) ** 3

export const easeInOutSine: EasingFunction = (t) => (1 - Math.cos(Math.PI * t)) / 2

export const easeOutExpo: EasingFunction = (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t))

const BACK_OVERSHOOT = 1.70158

export const easeOutBack: EasingFunction = (t) => {
  const c3 = BACK_OVERSHOOT + 1
  return 1 + c3 * (t - 1) ** 3 + BACK_OVERSHOOT * (t - 1) ** 2
}
