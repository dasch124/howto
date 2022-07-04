import '@wooorm/starry-night/style/core.css'

import cx from 'clsx'
import type { ReactNode } from 'react'

import proseStyles from '@/styles/prose.module.css'
import syntaxStyles from '@/styles/syntax-highlighting.module.css'

interface PostContentProps {
  children?: ReactNode
}

export function PostContent(props: PostContentProps): JSX.Element {
  const { children } = props

  return (
    <div
      className={cx(
        proseStyles['prose'],
        syntaxStyles['syntax-highlighting'],
        'mx-auto grid grid-cols-prose [:where(&>*)]:[grid-column:bleed] sm:[:where(&>*)]:[grid-column:content]',
      )}
    >
      {children}
    </div>
  )
}
