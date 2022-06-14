import { useButton } from '@react-aria/button'
import type { AriaButtonProps } from '@react-types/button'
import cx from 'clsx'
import { useRef } from 'react'

import { usePreview } from '@/cms/previews/preview.context'

export interface ActionButtonProps extends AriaButtonProps {
  variant?: 'error' | 'success'
}

/**
 * Action button.
 */
export function ActionButton(props: ActionButtonProps): JSX.Element {
  const { isPreview } = usePreview()
  const isDisabled = props.isDisabled === true
  const variant = props.variant

  const buttonRef = useRef<HTMLButtonElement>(null)
  const handlers =
    isPreview === true
      ? {
          /**
           * FIXME: Needs investigation why `onPress` does not work inside the CMS preview `iframe`.
           */
          onClick: props.onPress,
          onPress: undefined,
        }
      : {}
  const { buttonProps } = useButton(
    {
      ...props,
      ...handlers,
    },
    buttonRef,
  )

  return (
    <button
      className={cx(
        'cursor-default self-end rounded px-2 py-1 text-sm font-medium transition',
        isDisabled
          ? 'pointer-events-none bg-neutral-100 text-neutral-400'
          : variant === 'error'
          ? 'bg-red-100 text-red-800 hover:bg-red-200'
          : variant === 'success'
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      )}
      {...buttonProps}
      ref={buttonRef}
    >
      {props.children}
    </button>
  )
}
