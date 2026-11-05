import { createContext, useContext } from 'react'
import type { RouteId } from '../lib/route'

export interface RouterApi {
  route: RouteId
  navigate: (route: RouteId) => void
}

export const RouterContext = createContext<RouterApi | null>(null)

export function useRouter(): RouterApi {
  const api = useContext(RouterContext)
  if (!api) throw new Error('useRouter must be used inside <RouterProvider>')
  return api
}
