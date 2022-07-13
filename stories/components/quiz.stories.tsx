import type { Meta } from '@storybook/react'

import { Quiz } from '@/cms/components/quiz/quiz'
import { PostContent } from '@/components/post-content'

const config: Meta = {
  component: Quiz,
  title: 'Quiz',
  decorators: [
    function withPostContainer(story) {
      return <PostContent>{story()}</PostContent>
    },
  ],
}

export default config

export function MultipleChoice() {
  return (
    <Quiz>
      <Quiz.Card>
        <Quiz.MultipleChoice>
          <Quiz.Question>
            <p>Select the correct answer!</p>
          </Quiz.Question>
          <Quiz.MultipleChoice.Option isCorrect>
            <p>Yes!</p>
          </Quiz.MultipleChoice.Option>
          <Quiz.MultipleChoice.Option>
            <p>No!</p>
          </Quiz.MultipleChoice.Option>
          <Quiz.MultipleChoice.Option isCorrect>
            <p>Maybe!</p>
          </Quiz.MultipleChoice.Option>
          <Quiz.Message type="correct">
            <p>Yes, maybe!</p>
          </Quiz.Message>
          <Quiz.Message type="incorrect">
            <p>No! Nonononono!</p>
          </Quiz.Message>
        </Quiz.MultipleChoice>
      </Quiz.Card>
    </Quiz>
  )
}

export function MultipleChoiceCustomValidateButton() {
  return (
    <Quiz>
      <Quiz.Card validateButtonLabel="Check this">
        <Quiz.MultipleChoice>
          <Quiz.Question>
            <p>Select the correct answer!</p>
          </Quiz.Question>
          <Quiz.MultipleChoice.Option isCorrect>
            <p>Yes!</p>
          </Quiz.MultipleChoice.Option>
          <Quiz.MultipleChoice.Option>
            <p>No!</p>
          </Quiz.MultipleChoice.Option>
          <Quiz.MultipleChoice.Option isCorrect>
            <p>Maybe!</p>
          </Quiz.MultipleChoice.Option>
          <Quiz.Message type="correct">
            <p>Yes, maybe!</p>
          </Quiz.Message>
          <Quiz.Message type="incorrect">
            <p>No! Nonononono!</p>
          </Quiz.Message>
        </Quiz.MultipleChoice>
      </Quiz.Card>
    </Quiz>
  )
}

export function MultipleChoiceLongOptions() {
  return (
    <Quiz>
      <Quiz.Card validateButtonLabel="Check this">
        <Quiz.MultipleChoice>
          <Quiz.Question>
            <p>
              Consectetur irure exercitation magna incididunt nulla aliqua. Magna consequat
              incididunt culpa laborum laborum. Mollit do ipsum esse ipsum ea mollit incididunt
              labore sint ea adipisicing elit reprehenderit irure. Commodo et qui nisi nisi
              exercitation enim minim. Eu minim nisi magna sint. Pariatur proident ut consectetur
              velit cillum minim mollit eu ad.
            </p>
          </Quiz.Question>
          <Quiz.MultipleChoice.Option isCorrect>
            <p>
              Consectetur irure exercitation magna incididunt nulla aliqua. Magna consequat
              incididunt culpa laborum laborum. Mollit do ipsum esse ipsum ea mollit incididunt
              labore sint ea adipisicing elit reprehenderit irure. Commodo et qui nisi nisi
              exercitation enim minim. Eu minim nisi magna sint. Pariatur proident ut consectetur
              velit cillum minim mollit eu ad.
            </p>
          </Quiz.MultipleChoice.Option>
          <Quiz.MultipleChoice.Option>
            <p>
              Consectetur irure exercitation magna incididunt nulla aliqua. Magna consequat
              incididunt culpa laborum laborum. Mollit do ipsum esse ipsum ea mollit incididunt
              labore sint ea adipisicing elit reprehenderit irure. Commodo et qui nisi nisi
              exercitation enim minim. Eu minim nisi magna sint. Pariatur proident ut consectetur
              velit cillum minim mollit eu ad.
            </p>
          </Quiz.MultipleChoice.Option>
          <Quiz.MultipleChoice.Option isCorrect>
            <p>
              Consectetur irure exercitation magna incididunt nulla aliqua. Magna consequat
              incididunt culpa laborum laborum. Mollit do ipsum esse ipsum ea mollit incididunt
              labore sint ea adipisicing elit reprehenderit irure. Commodo et qui nisi nisi
              exercitation enim minim. Eu minim nisi magna sint. Pariatur proident ut consectetur
              velit cillum minim mollit eu ad.
            </p>
          </Quiz.MultipleChoice.Option>
          <Quiz.Message type="correct">
            <p>
              Consectetur irure exercitation magna incididunt nulla aliqua. Magna consequat
              incididunt culpa laborum laborum. Mollit do ipsum esse ipsum ea mollit incididunt
              labore sint ea adipisicing elit reprehenderit irure. Commodo et qui nisi nisi
              exercitation enim minim. Eu minim nisi magna sint. Pariatur proident ut consectetur
              velit cillum minim mollit eu ad.
            </p>
          </Quiz.Message>
          <Quiz.Message type="incorrect">
            <p>
              Consectetur irure exercitation magna incididunt nulla aliqua. Magna consequat
              incididunt culpa laborum laborum. Mollit do ipsum esse ipsum ea mollit incididunt
              labore sint ea adipisicing elit reprehenderit irure. Commodo et qui nisi nisi
              exercitation enim minim. Eu minim nisi magna sint. Pariatur proident ut consectetur
              velit cillum minim mollit eu ad.
            </p>
          </Quiz.Message>
        </Quiz.MultipleChoice>
      </Quiz.Card>
    </Quiz>
  )
}

export function SingleChoice() {
  return (
    <Quiz>
      <Quiz.Card>
        <Quiz.MultipleChoice variant="single">
          <Quiz.Question>
            <p>Select the correct answer!</p>
          </Quiz.Question>
          <Quiz.MultipleChoice.Option isCorrect>
            <p>Yes!</p>
          </Quiz.MultipleChoice.Option>
          <Quiz.MultipleChoice.Option>
            <p>No!</p>
          </Quiz.MultipleChoice.Option>
          <Quiz.MultipleChoice.Option>
            <p>Maybe!</p>
          </Quiz.MultipleChoice.Option>
          <Quiz.Message type="correct">
            <p>Yes!</p>
          </Quiz.Message>
          <Quiz.Message type="incorrect">
            <p>No! Nonononono!</p>
          </Quiz.Message>
        </Quiz.MultipleChoice>
      </Quiz.Card>
    </Quiz>
  )
}

export function XmlCodeEditor() {
  const code = `<html>
  <p>Hello, world!</p>
</html>`
  const solution = `<html>
  <body>
    <p>Hello, world!</p>
  </body>
</html>`

  return (
    <Quiz>
      <Quiz.Card>
        <Quiz.XmlCodeEditor code={code} solution={solution}>
          <Quiz.Question>
            <p>Fix this!</p>
          </Quiz.Question>
          <Quiz.Message type="correct">
            <p>Yes!</p>
          </Quiz.Message>
          <Quiz.Message type="incorrect">
            <p>No! Nonononono!</p>
          </Quiz.Message>
        </Quiz.XmlCodeEditor>
      </Quiz.Card>
    </Quiz>
  )
}

export function XmlCodeEditorValidateSelection() {
  const code = `<html>
  <p>Hello, world!</p>
</html>`
  const solution = `<p>Hello, world!</p>`

  return (
    <Quiz>
      <Quiz.Card>
        <Quiz.XmlCodeEditor code={code} solution={solution} validate="selection">
          <Quiz.Question>
            <p>Select the paragraph!</p>
          </Quiz.Question>
          <Quiz.Message type="correct">
            <p>Yes!</p>
          </Quiz.Message>
          <Quiz.Message type="incorrect">
            <p>No! Nonononono!</p>
          </Quiz.Message>
        </Quiz.XmlCodeEditor>
      </Quiz.Card>
    </Quiz>
  )
}
