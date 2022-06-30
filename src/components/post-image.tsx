import type { ImageProps } from 'next/future/image'
import Image from 'next/future/image'

export function PostImage(props: ImageProps): JSX.Element {
  return <Image {...props} placeholder="blur" sizes="800px" />
}
