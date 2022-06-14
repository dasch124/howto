import type { ReactNode } from 'react'

interface DownloadProps {
  children?: ReactNode
}

// TODO: we could just render the `<a>` directly in the remark plugin and drop the `<Download>` wrapper.
export function Download(props: DownloadProps): JSX.Element {
  const { children } = props

  return <span>{children}</span>
}
