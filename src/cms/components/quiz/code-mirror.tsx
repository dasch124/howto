import type { Ref } from 'react'
import { forwardRef } from 'react'

export const CodeMirror = forwardRef(function CodeMirror(
  _props: unknown,
  ref: Ref<HTMLDivElement>,
): JSX.Element {
  return <div ref={ref} className="overflow-hidden rounded bg-white text-black" />
})
