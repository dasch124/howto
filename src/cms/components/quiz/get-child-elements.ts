import type { ReactNode } from 'react'
import { Children, isValidElement } from 'react'

export function getChildElements(children: ReactNode): Array<JSX.Element> {
  return Children.toArray(children).filter(isValidElement)
}
