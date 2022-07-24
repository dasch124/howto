import type { ImageProps } from 'next/future/image'

import { LightBox } from '@/components/lightbox'

type PostImageProps = Omit<ImageProps, 'placeholder' | 'sizes'>

export function PostImage(props: PostImageProps): JSX.Element {
  return <LightBox {...props} placeholder="blur" sizes="800px" />
}
