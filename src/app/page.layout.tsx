import type { ReactNode } from 'react'
import { Fragment } from 'react'

import { PageFooter } from '@/app/page-footer'
import { PageHeader } from '@/app/page-header'
import { SkipNav } from '@/app/skip-nav'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout(props: PageLayoutProps): JSX.Element {
  const { children } = props

  return (
    <Fragment>
      <SkipNav />
      <div className="grid min-h-full grid-rows-[auto_1fr_auto]">
        <PageHeader />
        {children}
        <PageFooter />
      </div>
    </Fragment>
  )
}
