import {
  ExclamationIcon,
  InformationCircleIcon,
  LightBulbIcon,
  LightningBoltIcon,
  PencilIcon,
} from '@heroicons/react/outline'
import { capitalize } from '@stefanprobst/capitalize'
import cx from 'clsx'
import type { FC, ReactNode, SVGProps } from 'react'

export const types = ['danger', 'info', 'note', 'tip', 'warning'] as const

export type SideNoteType = typeof types[number]

interface SideNoteProps {
  children: ReactNode
  title?: string
  /** @default "note" */
  type?: SideNoteType
}

const styles: Record<SideNoteType, string> = {
  note: 'border-neutral-600',
  info: 'border-blue-600',
  tip: 'border-green-600',
  warning: 'border-yellow-500',
  danger: 'border-red-600',
}

const icons: Record<SideNoteType, FC<SVGProps<SVGSVGElement>>> = {
  note: PencilIcon,
  info: InformationCircleIcon,
  tip: LightBulbIcon,
  warning: ExclamationIcon,
  danger: LightningBoltIcon,
}

export function SideNote(props: SideNoteProps): JSX.Element {
  const { type = 'note', title = capitalize(type) } = props

  const Icon = icons[type]

  return (
    <aside className={cx('my-6 rounded border-l-4 bg-muted-background px-8 py-4', styles[type])}>
      <p>
        <strong className="flex items-center gap-2 font-bold">
          <Icon className="h-5 w-5 flex-shrink-0" width="1em" />
          <span>{title}</span>
        </strong>
      </p>
      {props.children}
    </aside>
  )
}
