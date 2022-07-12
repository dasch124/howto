import type { Meta } from '@storybook/react'

import { Quiz } from '@/cms/components/quiz/quiz'

const config: Meta = {
  component: Quiz,
  title: 'Quiz',
}

export default config

export function MultipleChoice() {
  return (
    <Quiz>
      <Quiz.Card>
        <Quiz.MultipleChoice>
          <Quiz.Question>Select the correct answer!</Quiz.Question>
          <Quiz.MultipleChoice.Option isCorrect>Yes!</Quiz.MultipleChoice.Option>
          <Quiz.MultipleChoice.Option>No!</Quiz.MultipleChoice.Option>
          <Quiz.MultipleChoice.Option isCorrect>Maybe!</Quiz.MultipleChoice.Option>
          <Quiz.Message type="correct">Yes, maybe!</Quiz.Message>
          <Quiz.Message type="incorrect">No! Nonononono!</Quiz.Message>
        </Quiz.MultipleChoice>
      </Quiz.Card>
    </Quiz>
  )
}
