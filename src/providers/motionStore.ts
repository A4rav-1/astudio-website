import { MOTION_STORAGE_KEY, parseMotionSetting, type MotionSetting } from '../lib/motionSetting'

const listeners = new Set<() => void>()

function readStoredSetting(): MotionSetting {
  try {
    return parseMotionSetting(window.localStorage.getItem(MOTION_STORAGE_KEY))
  } catch (error) {
    console.warn('Motion setting could not be read; using full motion.', error)
    return 'full'
  }
}

function applyToDocument(setting: MotionSetting): void {
  document.documentElement.dataset.motion = setting
}

let current: MotionSetting = readStoredSetting()
applyToDocument(current)

export function getMotionSetting(): MotionSetting {
  return current
}

export function subscribeMotionSetting(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function setMotionSetting(setting: MotionSetting): void {
  if (setting === current) return
  current = setting
  applyToDocument(setting)
  try {
    window.localStorage.setItem(MOTION_STORAGE_KEY, setting)
  } catch (error) {
    console.warn('Motion setting could not be saved; it applies until the page reloads.', error)
  }
  for (const listener of listeners) listener()
}
