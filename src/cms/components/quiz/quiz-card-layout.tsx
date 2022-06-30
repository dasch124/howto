import type { ReactNode } from 'react'

import { getChildElements } from '@/cms/components/quiz/get-child-elements'
import { QuizControls } from '@/cms/components/quiz/quiz-controls'
import { isQuizMessage } from '@/cms/components/quiz/quiz-message'
import { QuizMessages } from '@/cms/components/quiz/quiz-messages'
import { isQuizQuestion } from '@/cms/components/quiz/quiz-question'

export interface QuizCardLayoutProps {
  children?: ReactNode
  component?: JSX.Element
  onValidate: () => void
}

export function QuizCardLayout(props: QuizCardLayoutProps): JSX.Element {
  const childElements = getChildElements(props.children)
  const question = childElements.filter(isQuizQuestion)
  const messages = childElements.filter(isQuizMessage)

  return (
    <div className="quiz-card flex flex-col space-y-8 rounded bg-white p-8 shadow-md">
      {question}
      {props.component}
      <QuizControls onValidate={props.onValidate} />
      <QuizMessages messages={messages} />
    </div>
  )
}
