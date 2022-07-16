import type { Meta } from '@storybook/react'
import type { ReactNode } from 'react'

import { getTestPost } from '@/cms/cms.client'
import { PostContent } from '@/components/post-content'
import { PostHeader } from '@/components/post-header'
import { components } from '@/lib/mdx-components'
import { useMdxSync } from '@/lib/use-mdx'

const post = getTestPost('storybook')
process.env['__NEXT_NEW_LINK_BEHAVIOR'] = 'true'

interface PostLayoutProps {
  children?: ReactNode
}

function PostLayout(props: PostLayoutProps): JSX.Element {
  const { children } = props

  return <div className="mx-auto grid max-w-6xl pb-24">{children}</div>
}

const config: Meta = {
  // component: Post,
  title: 'Post',
}

export default config

export function TestPost(): JSX.Element {
  const { default: Content } = useMdxSync(post.code)

  return (
    <PostLayout>
      <PostHeader post={post} />
      <PostContent>
        <Content components={components} />
      </PostContent>
    </PostLayout>
  )
}
