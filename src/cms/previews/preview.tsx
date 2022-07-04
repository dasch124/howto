import { ErrorBoundary, useError } from '@stefanprobst/next-error-boundary'
import { I18nProvider } from '@stefanprobst/next-i18n'
import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import type { Dictionaries } from '@/app/i18n/dictionaries'
import { loadDictionaries } from '@/app/i18n/load-dictionaries'
import { PreviewProvider } from '@/cms/previews/preview.context'

export interface PreviewProps extends PreviewTemplateComponentProps {
  children?: ReactNode
}

export function Preview(props: PreviewProps): JSX.Element {
  const locale = props.entry.getIn(['data', 'lang'], 'en')
  const [dictionaries, setDictionaries] = useState<Partial<Dictionaries>>({})

  useEffect(() => {
    loadDictionaries(locale, ['common']).then((dictionary) => {
      return setDictionaries(dictionary)
    })
  }, [locale])

  return (
    <PreviewProvider {...props}>
      <ErrorBoundary fallback={ErrorFallback}>
        <I18nProvider dictionaries={dictionaries}>
          <div className="flex flex-col p-8">{props.children}</div>
        </I18nProvider>
      </ErrorBoundary>
    </PreviewProvider>
  )
}

function ErrorFallback() {
  const { error, onReset } = useError()

  return (
    <div className="grid h-96 place-items-center">
      <div className="space-y-2 text-center">
        <p>An unexpected error has occurred: {error.message}.</p>
        <button
          onClick={onReset}
          className="bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-600 rounded px-6 py-2 text-sm font-medium text-white transition focus:outline-none focus-visible:ring"
        >
          Clear errors.
        </button>
      </div>
    </div>
  )
}
