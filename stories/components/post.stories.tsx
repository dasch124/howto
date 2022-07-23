import type { Meta } from '@storybook/react'

import { getTestPost } from '@/cms/cms.client'
import { MainLayout } from '@/components/main.layout'
import { Post } from '@/components/post'

const post = getTestPost('storybook')

const config: Meta = {
  component: Post,
  title: 'Post',
  decorators: [
    (story) => {
      return <MainLayout>{story()}</MainLayout>
    },
  ],
}

export default config

export function TestPost(): JSX.Element {
  return <Post post={post} />
}
