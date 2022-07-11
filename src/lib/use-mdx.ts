import { run, runSync } from '@mdx-js/mdx'
import type { MDXModule } from 'mdx/types'
import { Fragment, useEffect, useMemo, useState } from 'react'
import * as runtime from 'react/jsx-runtime'

function Empty() {
  // @ts-expect-error Missing types for jsx transform.
  return runtime.jsx(Fragment, {})
}

export function useMdx(code: string): MDXModule {
  const [mdxModule, setMdxModule] = useState(() => {
    return {
      /** Avoid "Invalid prop `components` supplied to `React.Fragment`" warning. */
      default: Empty,
    }
  })

  useEffect(() => {
    run(code, runtime).then(setMdxModule)
  }, [code])

  /**
   * Fragment link targets are rendered async, so they are not yet available
   * when the Next.js router tries to update the scroll position.
   */
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id.length > 0) {
      const element = document.getElementById(id)
      if (element != null) {
        element.scrollIntoView()
      }
    }
  }, [mdxModule])

  return mdxModule
}

export function useMdxSync(code: string): MDXModule {
  const mdxModule = useMemo(() => {
    return runSync(code, runtime)
  }, [code])

  return mdxModule
}
