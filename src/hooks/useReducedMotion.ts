import { useSyncExternalStore } from 'react'
import { getMotionSetting, subscribeMotionSetting } from '../providers/motionStore'

/** True only when the visitor has switched motion off with the site's footer toggle. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeMotionSetting, getMotionSetting) === 'reduced'
}
