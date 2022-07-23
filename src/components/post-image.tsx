import type { ImageProps } from 'next/future/image'

import { ResponsiveImage } from '@/components/resposive-image'

type PostImageProps = Omit<ImageProps, 'placeholder' | 'sizes'>

export function PostImage(props: PostImageProps): JSX.Element {
  return <ResponsiveImage {...props} placeholder="blur" sizes="800px" />
}
