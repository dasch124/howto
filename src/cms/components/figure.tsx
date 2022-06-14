import type { ReactNode } from 'react'

interface FigureProps {
  children?: ReactNode
}

// TODO: we could just render the `<figure>` directly in the remark plugin and drop the `<Figure>` wrapper.
export function Figure(props: FigureProps): JSX.Element {
  const { children } = props

  return <figure>{children}</figure>
}
