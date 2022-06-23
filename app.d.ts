type IsoDateString = string

type UrlString = string

type Primitive = boolean | number | string

type PageParamsInput = {
  [K: string]: Primitive | ReadonlyArray<Primitive>
}

type PageParams<T extends PageParamsInput> = {
  [K in keyof T as string extends K ? never : K]: Exclude<T[K], undefined> extends Primitive
    ? string
    : ReadonlyArray<string>
}

declare module '*.svg' {
  import type { StaticImageData } from 'next/image'

  const content: StaticImageData

  export default content
}
