import 'tailwindcss/tailwind.css'
import '@/styles/index.css'
import '@/styles/nprogress.css'
import '~/stories/preview.css'

import { I18nProvider } from '@stefanprobst/next-i18n'
import { action } from '@storybook/addon-actions'
import type { DecoratorFn, Parameters } from '@storybook/react'
import {
  initialize as initializeMockServiceWorker,
  mswDecorator as withMockServiceWorker,
} from 'msw-storybook-addon'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import type { NextRouter } from 'next/router'

import { dictionary as common } from '@/app/i18n/common/en'
import { createMockRouter } from '@/mocks/create-mock-router'

initializeMockServiceWorker({ onUnhandledRequest: 'bypass' })

const withRouter: DecoratorFn = function withRouter(story, context) {
  const partial = context.parameters['router'] as Partial<NextRouter>
  const mockRouter = createMockRouter({
    // @ts-expect-error Should return `Promise`.
    push: action('router.push'),
    // @ts-expect-error Should return `Promise`.
    replace: action('router.replace'),
    ...partial,
  })

  return <RouterContext.Provider value={mockRouter}>{story(context)}</RouterContext.Provider>
}

const withProviders: DecoratorFn = function withProviders(story, context) {
  const dictionaries = { common }

  return <I18nProvider dictionaries={dictionaries}>{story(context)}</I18nProvider>
}

export const decorators: Array<DecoratorFn> = [
  withProviders,
  withRouter,
  withMockServiceWorker as DecoratorFn,
]

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
