import { Fragment } from 'react'

import type { PostDetails } from '@/cms/cms.client'
import { FeaturedImage } from '@/components/featured-image'
import { PostContent } from '@/components/post-content'
import { PostHeader } from '@/components/post-header'
import { components } from '@/lib/mdx-components'
import { useMdxSync as useMdx } from '@/lib/use-mdx'

interface PostProps {
  post: PostDetails
}

export function Post(props: PostProps): JSX.Element {
  const { post } = props

  const { default: Content } = useMdx(post.code)

  return (
    <Fragment>
      <PostHeader post={post} />
      {post.featuredImage != null ? <FeaturedImage src={post.featuredImage} /> : null}
      <PostContent>
        <Content components={components} />
      </PostContent>
    </Fragment>
  )
}
