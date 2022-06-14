import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'

import { Download } from '@/cms/components/download'
import { Figure } from '@/cms/components/figure'
// import { Quiz } from '@/cms/components/quiz/quiz'
import { SideNote } from '@/cms/components/sidenote'
import { Tabs } from '@/cms/components/tabs'
import { Video } from '@/cms/components/video'

// TODO: lazy import Quiz and Tabs

export const components: MDXComponents = {
  // @ts-expect-error Required props `href`.
  a: Link,
  Download,
  Figure,
  Image,
  // Quiz,
  SideNote,
  Tabs,
  Video,
}
