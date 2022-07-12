import { LightBulbIcon, LightningBoltIcon } from '@heroicons/react/outline'
import type { ReactElement, ReactNode } from 'react'

import type { QuizCardStatus } from '@/cms/components/quiz/quiz'

const icons = {
  correct: LightBulbIcon,
  incorrect: LightningBoltIcon,
  unanswered: null,
}

export interface QuizMessageProps {
  children?: ReactNode
  type: QuizCardStatus
}

export function QuizMessage(props: QuizMessageProps): JSX.Element | null {
  const Icon = icons[props.type]

  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 border-t border-neutral-400 pt-4">
      {Icon != null ? (
        <p>
          <Icon className="h-5 w-5 flex-shrink-0" width="1em" />{' '}
        </p>
      ) : null}
      <div className="grid gap-y-2">{props.children}</div>
    </div>
  )
}

export function isQuizMessage(component: JSX.Element): component is ReactElement<QuizMessageProps> {
  return component.type === QuizMessage
}
