import { useRouter } from 'next/router'
import nprogress from 'nprogress'
import { useEffect } from 'react'

nprogress.configure({ showSpinner: false })

const delay = 150

export function usePageLoadProgressIndicator(): void {
  const router = useRouter()

  useEffect(() => {
    let timeout: number

    function start() {
      timeout = window.setTimeout(() => {
        nprogress.start()
      }, delay)
    }

    function done() {
      window.clearTimeout(timeout)
      nprogress.done()
    }

    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', done)
    router.events.on('routeChangeError', done)

    return () => {
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', done)
      router.events.off('routeChangeError', done)
    }
  }, [router.events])
}
