import { createUrlSearchParams } from '@stefanprobst/request'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export type UseParamsResult =
  | {
      params: null
      isParamsReady: false
    }
  | {
      params: URLSearchParams
      isParamsReady: true
    }

export function useParams(): UseParamsResult {
  const router = useRouter()

  const params = useMemo(() => {
    if (!router.isReady) return null

    /**
     * Using `router.query` instead of the full URL from `useRoute`,
     * to include the dynamic path segments.
     */
    return createUrlSearchParams(router.query)
  }, [router])

  if (!router.isReady) {
    return { params: null, isParamsReady: router.isReady }
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { params: params!, isParamsReady: router.isReady }
}
