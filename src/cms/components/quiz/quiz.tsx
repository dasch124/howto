import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import { getChildElements } from '@/cms/components/quiz/get-child-elements'
import { isQuizCard, QuizCard } from '@/cms/components/quiz/quiz-card'
import { QuizMessage } from '@/cms/components/quiz/quiz-message'
import { QuizMultipleChoice } from '@/cms/components/quiz/quiz-multiple-choice'
import { QuizQuestion } from '@/cms/components/quiz/quiz-question'
import { QuizXmlCodeEditor } from '@/cms/components/quiz/quiz-xml-code-editor'

type Values<T> = {
  [K in keyof T]: T[K]
}[keyof T]

export interface QuizService {
  hasNext: boolean
  hasPrevious: boolean
  next: () => void
  previous: () => void
  setStatus: (status: QuizCardStatus) => void
  status: QuizCardStatus
  nextStatus: QuizCardStatus | undefined
  previousStatus: QuizCardStatus | undefined
  isHidden: boolean
  labels: {
    validate: string
    next: string
    previous: string
  }
}

const QuizContext = createContext<QuizService | null>(null)

export function useQuiz(): QuizService {
  const state = useContext(QuizContext)

  if (state === null) {
    throw new Error('`useQuiz` must be nested inside a `Quiz`.')
  }

  return state
}

export const QuizCardStatus = {
  UNANSWERED: 'unanswered',
  INCORRECT: 'incorrect',
  CORRECT: 'correct',
} as const

export type QuizCardStatus = Values<typeof QuizCardStatus>

export interface QuizProps {
  children?: ReactNode
}

export function Quiz(props: QuizProps): JSX.Element | null {
  const { t } = useI18n<'common'>()

  const childElements = getChildElements(props.children)
  const cards = childElements.filter(isQuizCard)

  const [cardsStatus, setCardsStatus] = useState<Array<QuizCardStatus>>(
    Array(cards.length).fill(QuizCardStatus.UNANSWERED),
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const hasNext = currentIndex < cards.length - 1
  const hasPrevious = currentIndex > 0

  function next() {
    if (hasNext) {
      setCurrentIndex((currentIndex) => {
        return currentIndex + 1
      })
    }
  }

  function previous() {
    if (hasPrevious) {
      setCurrentIndex((currentIndex) => {
        return currentIndex - 1
      })
    }
  }

  if (cards.length === 0) return null

  return (
    <aside>
      {cards.map((card, index) => {
        function setStatus(status: QuizCardStatus) {
          setCardsStatus((cardsStatus) => {
            const newCardsStatus = [...cardsStatus]
            newCardsStatus[index] = status
            return newCardsStatus
          })
        }

        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        const status = cardsStatus[index]!
        const nextStatus = cardsStatus[index + 1]
        const previousStatus = cardsStatus[index - 1]
        /** Hidden quiz cards are rendered but hidden, in order to preserve component state. */
        const isHidden = index !== currentIndex

        const labels = {
          validate: card.props.validateButtonLabel ?? t(['common', 'quiz', 'validate']),
          next: t(['common', 'quiz', 'next']),
          previous: t(['common', 'quiz', 'previous']),
        }

        const service = {
          hasNext,
          hasPrevious,
          next,
          previous,
          setStatus,
          status,
          nextStatus,
          previousStatus,
          isHidden,
          labels,
        }

        return (
          <QuizContext.Provider key={index} value={service}>
            {card}
          </QuizContext.Provider>
        )
      })}
    </aside>
  )
}

Quiz.Card = QuizCard
Quiz.Question = QuizQuestion
Quiz.Message = QuizMessage
Quiz.MultipleChoice = QuizMultipleChoice
Quiz.XmlCodeEditor = QuizXmlCodeEditor
