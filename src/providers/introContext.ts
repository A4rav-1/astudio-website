import { createContext, useContext } from 'react'

/** True once the loader's curtain has lifted and the hero may start its entrance. */
export const IntroContext = createContext<boolean>(false)

export function useIntroComplete(): boolean {
  return useContext(IntroContext)
}
