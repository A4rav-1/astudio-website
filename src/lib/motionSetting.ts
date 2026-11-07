/**
 * The site's own motion switch. Animations run by default, even when the OS asks for reduced motion,
 * because managed PCs (schools, offices) often turn off Windows animation effects for everyone.
 * Visitors who need less motion use the footer toggle, which is remembered in localStorage.
 */
export type MotionSetting = 'full' | 'reduced'

export const MOTION_STORAGE_KEY = 'astudio-motion'

export function parseMotionSetting(stored: string | null): MotionSetting {
  return stored === 'reduced' ? 'reduced' : 'full'
}

export function toggledMotionSetting(current: MotionSetting): MotionSetting {
  return current === 'full' ? 'reduced' : 'full'
}
