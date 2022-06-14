import ErrorBoundary, { useError } from '@stefanprobst/next-error-boundary'
import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { PreviewProvider } from '@/cms/previews/preview.context'
import { I18nProvider } from '@/i18n/I18n.context'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'

export interface PreviewProps extends PreviewTemplateComponentProps {
  children?: ReactNode
}

/**
 * Shared wrapper for CMS previews.
 */
export function Preview(props: PreviewProps): JSX.Element {
  const locale = props.entry.getIn(['data', 'lang'], 'en')
  const [dictionary, setDictionary] = useState<{ [namespace: string]: Dictionary } | undefined>(
    undefined,
  )

  useEffect(() => {
    loadDictionary(locale, ['common']).then((dictionary) => {
      return setDictionary(dictionary)
    })
  }, [locale])

  return (
    <PreviewProvider {...props}>
      <ErrorBoundary fallback={ErrorFallback}>
        <I18nProvider locale={locale} dictionary={dictionary}>
          <div className="flex flex-col p-8">{props.children}</div>
        </I18nProvider>
      </ErrorBoundary>
    </PreviewProvider>
  )
}

/**
 * Error boundary fallback.
 */
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
