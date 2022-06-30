import LightBulbIcon from '@heroicons/react/outline/LightBulbIcon'
import LightningBoltIcon from '@heroicons/react/outline/LightningBoltIcon'
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
    <div className="flex items-start space-x-2 border-t border-neutral-200 text-neutral-500">
      {Icon != null ? <Icon className="mt-2 h-6 w-6 flex-shrink-0" /> : null}
      <div className="mt-2.5 flex flex-col space-y-2 text-sm">{props.children}</div>
    </div>
  )
}

export function isQuizMessage(component: JSX.Element): component is ReactElement<QuizMessageProps> {
  return component.type === QuizMessage
}
