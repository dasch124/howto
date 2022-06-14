import { I18nProvider } from '@stefanprobst/next-i18n'
import type { ReactNode } from 'react'

import type { DictionariesProps } from '@/app/i18n/dictionaries'

interface ProvidersProps extends DictionariesProps {
  children: ReactNode
}

export function Providers(props: ProvidersProps): JSX.Element {
  const { children, dictionaries } = props

  return <I18nProvider dictionaries={dictionaries}>{children}</I18nProvider>
}
