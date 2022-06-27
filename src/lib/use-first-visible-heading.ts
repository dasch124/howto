import { useEffect, useState } from 'react'

export function useFirstVisibleHeading(topOffset = 0): string | null {
  const [visibleHeadingId, setVisibleHeadingId] = useState<string | null>(null)

  useEffect(() => {
    function getFirstHeadingInViewport() {
      const headings = Array.from(
        document.querySelectorAll(':where([data-permalink] > h1, h2, h3, h4, h5)'),
      )

      const firstHeadingInViewport =
        headings.find((heading) => {
          return heading.getBoundingClientRect().top >= topOffset
        }) ?? headings.at(-1)

      setVisibleHeadingId(firstHeadingInViewport?.id ?? null)
    }

    getFirstHeadingInViewport()

    // TODO: ResizeObserver
    document.addEventListener('resize', getFirstHeadingInViewport, {
      passive: true,
    })
    document.addEventListener('scroll', getFirstHeadingInViewport, {
      passive: true,
    })

    return () => {
      document.removeEventListener('resize', getFirstHeadingInViewport)
      document.removeEventListener('scroll', getFirstHeadingInViewport)
    }
  }, [topOffset])

  return visibleHeadingId
}
