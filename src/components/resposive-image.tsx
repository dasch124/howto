import { omit } from '@stefanprobst/omit'
import type { ImageProps } from 'next/future/image'
import Image from 'next/future/image'

type ResponsiveImageProps = ImageProps

export function ResponsiveImage(props: ResponsiveImageProps): JSX.Element {
  const { src, width, height } = props

  if (typeof src === 'string' && (width == null || height == null)) {
    const imageProps = omit(props, [
      'loader',
      'onLoadingComplete',
      'placeholder',
      'priority',
      'quality',
      'unoptimized',
    ])
    /**
     * Setting `width` and `height` to reserve space while loading. This will be replaced by the
     * actual image dimensions once the image has been loaded - unless an explicit `aspect-ratio`
     * is set via css.
     *
     * @see https://jakearchibald.com/2022/img-aspect-ratio/
     */
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...imageProps} alt="" height={9} src={src} width={16} />
  }

  return <Image {...props} />
}
