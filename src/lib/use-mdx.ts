import { run, runSync } from '@mdx-js/mdx'
import type { MDXModule } from 'mdx/types'
import { Fragment, useEffect, useMemo, useState } from 'react'
import * as runtime from 'react/jsx-runtime'

export function useMdx(code: string): MDXModule {
  const [mdxModule, setMdxModule] = useState({
    default: () => {
      /** Avoid "Invalid prop `components` supplied to `React.Fragment`" warning. */
      // @ts-expect-error Missing types for jsx transform.
      return runtime.jsx(Fragment, {})
    },
  })

  useEffect(() => {
    run(code, runtime).then(setMdxModule)
  }, [code])

  return mdxModule
}

export function useMdxSync(code: string): MDXModule {
  const mdxModule = useMemo(() => {
    return runSync(code, runtime)
  }, [code])

  return mdxModule
}
