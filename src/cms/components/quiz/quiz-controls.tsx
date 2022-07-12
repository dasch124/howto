import cx from 'clsx'

import { ActionButton } from '@/cms/components/quiz/action-button'
import { QuizCardStatus, useQuiz } from '@/cms/components/quiz/quiz'

export interface QuizControlsProps {
  onValidate: () => void
}

export function QuizControls(props: QuizControlsProps): JSX.Element {
  const quiz = useQuiz()

  const buttonVariants = {
    [QuizCardStatus.UNANSWERED]: undefined,
    [QuizCardStatus.INCORRECT]: 'error' as const,
    [QuizCardStatus.CORRECT]: 'success' as const,
  }

  function getButtonVariant(status: QuizCardStatus | undefined) {
    if (status == null) return undefined
    return buttonVariants[status]
  }

  const isSingleQuestionQuiz = !quiz.hasPrevious && !quiz.hasNext

  return (
    <div
      className={cx(
        'flex items-center gap-2',
        isSingleQuestionQuiz ? 'justify-center' : 'justify-between',
      )}
    >
      {!isSingleQuestionQuiz ? (
        <ActionButton
          isDisabled={!quiz.hasPrevious}
          onClick={quiz.previous}
          variant={getButtonVariant(quiz.previousStatus)}
        >
          {quiz.labels.previous}
        </ActionButton>
      ) : null}
      <div>
        <ActionButton onClick={props.onValidate} variant={getButtonVariant(quiz.status)}>
          {quiz.labels.validate}
        </ActionButton>
      </div>
      {!isSingleQuestionQuiz ? (
        <ActionButton
          isDisabled={!quiz.hasNext}
          onClick={quiz.next}
          variant={getButtonVariant(quiz.nextStatus)}
        >
          {quiz.labels.next}
        </ActionButton>
      ) : null}
    </div>
  )
}
