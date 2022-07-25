import { useEffect, useState } from 'react'

const delay = 2500

interface UseCopyToClipboardResult {
  isCopied: boolean
  copy: (value: string) => void
}
export function useCopyToClipboard(): UseCopyToClipboardResult {
  const [isCopied, setIsCopied] = useState(false)

  function copy(value: string) {
    navigator.clipboard.writeText(value)
    setIsCopied(true)
  }

  useEffect(() => {
    if (!isCopied) return

    const timeout = window.setTimeout(() => {
      setIsCopied(false)
    }, delay)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [isCopied])

  return { copy, isCopied }
}
