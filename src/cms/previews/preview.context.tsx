import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

interface PreviewContextValue {
  /**
   * The preview iframe's `document`.
   */
  document?: Document
  isPreview?: boolean
}

const PreviewContext = createContext<PreviewContextValue>({})

export interface PreviewProviderProps extends PreviewTemplateComponentProps {
  children: ReactNode
}

export function PreviewProvider(props: PreviewProviderProps): JSX.Element {
  const { document, children } = props

  const context = useMemo(() => {
    return { document, isPreview: true }
  }, [document])

  return <PreviewContext.Provider value={context}>{children}</PreviewContext.Provider>
}

export function usePreview(): PreviewContextValue {
  return useContext(PreviewContext)
}
