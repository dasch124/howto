import type { ReactNode } from 'react'

import { MainContent } from '@/components/main-content'

interface MainLayoutProps {
  children?: ReactNode
}

export function MainLayout(props: MainLayoutProps): JSX.Element {
  const { children } = props

  return (
    <MainContent className="my-16 grid grid-cols-page content-start gap-y-16 py-8 px-2 sm:px-8 2xl:gap-x-16 [:where(&>*)]:[grid-column:content]">
      {children}
    </MainContent>
  )
}
