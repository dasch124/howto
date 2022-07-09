import { useEffect, useState } from 'react'

export function useCurrentTocHeading(): string | null {
  const [hasMdxRendered, setHasMdxRendered] = useState(false)
  const [visibleHeadingId, setVisibleHeadingId] = useState<string | null>(null)

  useEffect(() => {
    setHasMdxRendered(true)
  }, [])

  useEffect(() => {
    if (!hasMdxRendered) return

    const headings = document.querySelectorAll('[data-permalink] > :is(h1, h2, h3, h4, h5)')

    if (headings.length === 0) return

    function getCurrentHeading() {
      const sentinel = window.innerHeight / 3
      let id = headings.values().next().value.id

      for (const heading of headings) {
        const rect = heading.getBoundingClientRect()

        if (rect.top < sentinel) {
          id = heading.id
        } else {
          break
        }
      }

      setVisibleHeadingId(id)
    }

    getCurrentHeading()

    document.addEventListener('resize', getCurrentHeading, { passive: true })
    document.addEventListener('scroll', getCurrentHeading, { passive: true })

    return () => {
      document.removeEventListener('resize', getCurrentHeading)
      document.removeEventListener('scroll', getCurrentHeading)
    }
  }, [hasMdxRendered])

  return visibleHeadingId
}
