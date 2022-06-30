import type { ReactElement } from 'react'
import { Fragment } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import type { QuizCardStatus } from '@/cms/components/quiz/quiz'
import { useQuiz } from '@/cms/components/quiz/quiz'
import type { QuizMessageProps } from '@/cms/components/quiz/quiz-message'
import { QuizMessage } from '@/cms/components/quiz/quiz-message'

export interface QuizMessagesProps {
  messages: Array<ReactElement<QuizMessageProps>>
}

export function QuizMessages(props: QuizMessagesProps): JSX.Element | null {
  const { messages } = props

  const { t } = useI18n<'common'>()
  const quiz = useQuiz()

  const statusMessages = messages.filter((message) => {
    return message.props.type === quiz.status
  })

  if (statusMessages.length > 0) {
    return <Fragment>{statusMessages}</Fragment>
  }

  const defaultStatusMessages: Record<QuizCardStatus, string | null> = {
    incorrect: t(['common', 'quiz', 'incorrect']),
    correct: t(['common', 'quiz', 'correct']),
    unanswered: null,
  }

  const defaultStatusMessage = defaultStatusMessages[quiz.status]

  if (defaultStatusMessage == null) return null

  return <QuizMessage type={quiz.status}>{defaultStatusMessage}</QuizMessage>
}
