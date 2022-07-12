import { createUrl } from '@stefanprobst/request'
import { useState } from 'react'

import { Spinner } from '@/components/spinner'

export const videoProviders = {
  youtube: 'YouTube',
  vimeo: 'Vimeo',
  nakala: 'Nakala',
} as const

export type VideoProvider = keyof typeof videoProviders

interface VideoProps {
  /** @default false */
  autoPlay?: boolean
  caption?: string
  id: string
  /** @default "youtube" */
  provider?: VideoProvider
  /** In seconds. */
  startTime?: number
}

export function Video(props: VideoProps): JSX.Element {
  const { autoPlay, caption, id, provider = 'youtube', startTime } = props

  const url = useVideo(provider, id, autoPlay, startTime)
  const [isLoadingIframe, setIsLoadingIframe] = useState(true)

  function onLoadIframe() {
    setIsLoadingIframe(false)
  }

  return (
    <figure className="grid place-items-center">
      <div className="relative aspect-video w-full">
        <div className="text-primary-600 absolute inset-0 grid place-items-center">
          {isLoadingIframe ? <Spinner /> : null}
        </div>
        <iframe
          allow="fullscreen"
          className="relative h-full w-full"
          loading="lazy"
          onError={onLoadIframe}
          onLoad={onLoadIframe}
          src={String(url)}
          title={provider}
        />
      </div>
      {caption !== undefined ? (
        <figcaption className="py-2 font-medium">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

function useVideo(provider: VideoProvider, id: string, autoPlay = false, startTime?: number) {
  switch (provider) {
    case 'youtube':
      return getYouTubeUrl(id, autoPlay, startTime)
    case 'vimeo':
      return getVimeoUrl(id, autoPlay, startTime)
    case 'nakala':
      return getNakalaUrl(id, autoPlay, startTime)
  }
}

function getYouTubeUrl(id: string, autoPlay: boolean, startTime?: number) {
  const embedUrl = createUrl({
    baseUrl: 'https://www.youtube-nocookie.com/embed/',
    pathname: id,
    searchParams: {
      autoplay: autoPlay ? '1' : undefined,
      start: startTime != null ? String(startTime) : undefined,
    },
  })

  return embedUrl
}

function getVimeoUrl(id: string, autoPlay: boolean, startTime?: number) {
  const embedUrl = createUrl({
    baseUrl: 'https://player.vimeo.com/video/',
    pathname: id,
    searchParams: {
      autoplay: autoPlay ? '1' : undefined,
    },
    hash: startTime != null ? `t=${startTime}s` : undefined,
  })

  return embedUrl
}

function getNakalaUrl(id: string, _autoPlay: boolean, _startTime?: number) {
  const embedUrl = createUrl({
    baseUrl: 'https://api.nakala.fr/embed/',
    pathname: id,
  })

  return embedUrl
}
