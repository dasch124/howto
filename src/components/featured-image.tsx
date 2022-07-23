import type { ImageProps } from 'next/future/image'

import { ResponsiveImage } from '@/components/resposive-image'

type FeaturedImageProps = ImageProps

export function FeaturedImage(props: FeaturedImageProps): JSX.Element {
  return <ResponsiveImage {...props} className="aspect-video h-full w-full" />
}
