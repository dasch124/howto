import { useRouter } from 'next/router'

import { useRoute } from '@/app/route/use-route'

export type UseSearchParamsResult =
  | {
      hash: null
      isUrlFragmentReady: false
    }
  | {
      hash: string
      isUrlFragmentReady: true
    }

export function useUrlFragment(): UseSearchParamsResult {
  const router = useRouter()
  const { hash } = useRoute()

  if (!router.isReady) {
    return { hash: null, isUrlFragmentReady: router.isReady }
  }

  return { hash, isUrlFragmentReady: router.isReady }
}
