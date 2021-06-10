import ErrorBoundary, { useError } from '@stefanprobst/next-error-boundary'
import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import type { ReactNode } from 'react'

import { PreviewProvider } from '@/cms/previews/Preview.context'
import { I18nProvider } from '@/i18n/I18n.context'

export interface PreviewProps extends PreviewTemplateComponentProps {
  children?: ReactNode
}

/**
 * Shared wrapper for CMS previews.
 */
export function Preview(props: PreviewProps): JSX.Element {
  const locale = props.entry.getIn(['data', 'lang'], 'en')

  return (
    <PreviewProvider {...props}>
      <ErrorBoundary fallback={ErrorFallback}>
        <I18nProvider locale={locale} dictionary={undefined}>
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
    <div className="grid place-items-center h-96">
      <div className="space-y-2 text-center">
        <p>An unexpected error has occurred: {error.message}.</p>
        <button
          onClick={onReset}
          className="px-6 py-2 text-sm font-medium text-white transition rounded bg-primary-600 hover:bg-primary-700 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
        >
          Clear errors.
        </button>
      </div>
    </div>
  )
}
