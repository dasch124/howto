import { CH } from '@code-hike/mdx/components'
import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

import { Disclosure } from '@/cms/components/disclosure'
import { Download } from '@/cms/components/download'
import { Figure } from '@/cms/components/figure'
import { Quiz } from '@/cms/components/quiz/quiz'
import { SideNote } from '@/cms/components/sidenote'
import { Tabs } from '@/cms/components/tabs'
import { Video } from '@/cms/components/video'
import { PostImage } from '@/components/post-image'

// TODO: lazy import CH, Quiz and Tabs

export const components: MDXComponents = {
  // @ts-expect-error Required props `href`.
  a: Link,
  CH,
  Disclosure,
  Download,
  Figure,
  Image: PostImage,
  Quiz,
  SideNote,
  Tabs,
  Video,
}
