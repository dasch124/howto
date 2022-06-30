import cx from 'clsx'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface ActionButtonProps extends Pick<ComponentPropsWithoutRef<'button'>, 'onClick'> {
  children: ReactNode
  isDisabled?: boolean
  variant?: 'error' | 'success'
}

export function ActionButton(props: ActionButtonProps): JSX.Element {
  const { children, isDisabled = false, onClick, variant } = props

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
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
