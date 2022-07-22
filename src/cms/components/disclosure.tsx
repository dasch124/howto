import type { ReactNode } from 'react'

interface DisclosureProps {
  title?: ReactNode
  children?: ReactNode
}
export function Disclosure(props: DisclosureProps): JSX.Element {
  const { children, title } = props

  return (
    <details>
      <summary>{title}</summary>
      {children}
    </details>
  )
}
