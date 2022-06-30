import type { ReactElement, ReactNode } from 'react'

export interface QuizQuestionProps {
  children?: ReactNode
}

export function QuizQuestion(props: QuizQuestionProps): JSX.Element {
  return <div className="flex flex-col space-y-2">{props.children}</div>
}

export function isQuizQuestion(
  component: JSX.Element,
): component is ReactElement<QuizQuestionProps> {
  return component.type === QuizQuestion
}
