import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

import { Disclosure } from '@/cms/components/disclosure'
import { Download } from '@/cms/components/download'
import { Figure } from '@/cms/components/figure'
import { Quiz } from '@/cms/components/quiz/quiz'
import { SideNote } from '@/cms/components/sidenote'
import { Tabs } from '@/cms/components/tabs'
import { Video } from '@/cms/components/video'
import { CopyToClipboardButton } from '@/components/copy-to-clipboard-button'
import { PostImage } from '@/components/post-image'

// TODO: lazy import Quiz and Tabs

export const components: MDXComponents = {
  // @ts-expect-error Required props `href`.
  a: Link,
  CopyToClipboardButton,
  Disclosure,
  Download,
  Figure,
  // @ts-expect-error Required props `src`.
  img: PostImage,
  Quiz,
  SideNote,
  Tabs,
  Video,
}
