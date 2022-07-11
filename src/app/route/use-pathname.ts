import { useRoute } from '@/app/route/use-route'

export interface UsePathnameResult {
  pathname: string
}

export function usePathname(): UsePathnameResult {
  const route = useRoute()

  return { pathname: route.pathname }
}
