type IsoDateString = string

type UrlString = string

declare module '*.svg' {
  import type { StaticImageData } from 'next/image'

  const content: StaticImageData

  export default content
}
