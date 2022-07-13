import cx from 'clsx'
import type { ReactElement, ReactNode } from 'react'
import { useState } from 'react'

import { getChildElements } from '@/cms/components/quiz/get-child-elements'
import { QuizCardStatus, useQuiz } from '@/cms/components/quiz/quiz'
import { QuizCardLayout } from '@/cms/components/quiz/quiz-card-layout'

export interface QuizMultipleChoiceProps {
  children?: ReactNode
  variant?: 'multiple' | 'single'
}

export function QuizMultipleChoice(props: QuizMultipleChoiceProps): JSX.Element {
  const quiz = useQuiz()

  const childElements = getChildElements(props.children)
  const options = childElements.filter(isMultipleChoiceOption)

  const correctAnswers = options
    .filter((option) => {
      return option.props.isCorrect === true
    })
    .map((option) => {
      return options.indexOf(option)
    })
  const isSingleChoice = props.variant === 'single'
  const [checked, setChecked] = useState<Set<number>>(new Set())

  function toggle(index: number) {
    if (isSingleChoice) {
      setChecked(new Set([index]))
    } else {
      setChecked((_checked) => {
        const checked = new Set(_checked)
        if (checked.has(index)) {
          checked.delete(index)
        } else {
          checked.add(index)
        }
        return checked
      })
    }

    quiz.setStatus(QuizCardStatus.UNANSWERED)
  }

  function onValidate() {
    const isCorrect =
      correctAnswers.length === checked.size &&
      correctAnswers.every((index) => {
        return checked.has(index)
      })

    quiz.setStatus(isCorrect === true ? QuizCardStatus.CORRECT : QuizCardStatus.INCORRECT)
  }

  const name = /** TODO: unique name */ 'quiz'
  const type = isSingleChoice ? 'radio' : 'checkbox'

  const component = (
    <ul className="list-none">
      {options.map((option, index) => {
        return (
          <li key={index}>
            <label className="flex items-center gap-3">
              <input
                checked={checked.has(index)}
                className={cx(
                  'h-3-5 w-3-5 text-accent-primary-background focus:ring-current',
                  !isSingleChoice && 'rounded',
                )}
                name={name}
                onChange={() => {
                  toggle(index)
                }}
                type={type}
              />
              {option}
            </label>
          </li>
        )
      })}
    </ul>
  )

  return (
    <QuizCardLayout component={component} onValidate={onValidate}>
      {props.children}
    </QuizCardLayout>
  )
}

QuizMultipleChoice.isQuizCard = true

export interface MultipleChoiceOptionProps {
  children?: ReactNode
  isCorrect?: boolean
}

export function QuizMultipleChoiceOption(props: MultipleChoiceOptionProps): JSX.Element {
  return <span>{props.children}</span>
}

export function isMultipleChoiceOption(
  component: JSX.Element,
): component is ReactElement<MultipleChoiceOptionProps> {
  return component.type === QuizMultipleChoiceOption
}

QuizMultipleChoice.Option = QuizMultipleChoiceOption
