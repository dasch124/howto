import type { ReactNode } from 'react'
import { Fragment } from 'react'

interface CmsLayoutProps {
  children?: ReactNode
}

export function CmsLayout(props: CmsLayoutProps): JSX.Element {
  const { children } = props

  return <Fragment>{children}</Fragment>
}
