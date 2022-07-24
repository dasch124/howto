import { ErrorBoundary, useError } from '@stefanprobst/next-error-boundary'
import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import type { ReactNode } from 'react'

import { dictionary as common } from '@/app/i18n/common/en'
import { Providers } from '@/app/providers.context'
import { PreviewProvider } from '@/cms/previews/preview.context'
import { createMockRouter } from '@/mocks/create-mock-router'

const dictionaries = { common }
const router = createMockRouter()

export interface PreviewProps extends PreviewTemplateComponentProps {
  children?: ReactNode
}

export function Preview(props: PreviewProps): JSX.Element {
  return (
    <PreviewProvider {...props}>
      <ErrorBoundary fallback={ErrorFallback}>
        <RouterContext.Provider value={router}>
          <Providers dictionaries={dictionaries}>
            <div className="p-8">{props.children}</div>
          </Providers>
        </RouterContext.Provider>
      </ErrorBoundary>
    </PreviewProvider>
  )
}

function ErrorFallback() {
  const { error, onReset } = useError()

  return (
    <div className="grid h-full place-content-center gap-2">
      <p>An unexpected error has occurred: {error.message}.</p>
      <button
        onClick={onReset}
        className="transition hover:text-accent-primary-text focus-visible:text-accent-primary-text"
      >
        Clear errors.
      </button>
    </div>
  )
}
