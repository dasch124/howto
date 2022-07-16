import type { Meta } from '@storybook/react'

import { SideNote } from '@/cms/components/sidenote'
import { PostContent } from '@/components/post-content'

const config: Meta = {
  component: SideNote,
  title: 'SideNote',
  decorators: [
    function withPostContainer(story) {
      return <PostContent>{story()}</PostContent>
    },
  ],
}

export default config

export function Note(): JSX.Element {
  return (
    <SideNote>
      <p>This is not super important.</p>
    </SideNote>
  )
}

export function Danger(): JSX.Element {
  return (
    <SideNote type="danger">
      <p>Aaaa! Don&apos;t do this!.</p>
    </SideNote>
  )
}

export function Warning(): JSX.Element {
  return (
    <SideNote type="warning">
      <p>You better not do this.</p>
    </SideNote>
  )
}

export function Tip(): JSX.Element {
  return (
    <SideNote type="tip">
      <p>You could also do this!</p>
    </SideNote>
  )
}

export function Info(): JSX.Element {
  return (
    <SideNote type="info">
      <p>When doing this, nothing will happen.</p>
    </SideNote>
  )
}

export function CustomTitle(): JSX.Element {
  return (
    <SideNote type="info" title="For your eyes only">
      <p>This message will self-destruct.</p>
    </SideNote>
  )
}
