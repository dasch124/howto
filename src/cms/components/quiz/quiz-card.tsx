import type { ReactElement, ReactNode } from 'react'

import { useQuiz } from '@/cms/components/quiz/quiz'

export interface QuizCardProps {
  children?: ReactNode
  validateButtonLabel?: string
}

export function QuizCard(props: QuizCardProps): JSX.Element {
  const { isHidden } = useQuiz()
  return <div hidden={isHidden}>{props.children}</div>
}

export function isQuizCard(component: JSX.Element): component is ReactElement<QuizCardProps> {
  return component.type === QuizCard
}
