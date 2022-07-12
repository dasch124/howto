import { useCallback, useState } from 'react'

interface UseDialogStateResult {
  close: () => void
  isOpen: boolean
  open: () => void
  toggle: () => void
}

export function useDialogState(): UseDialogStateResult {
  const [isOpen, setIsOpen] = useState(false)

  const close = useCallback(function close() {
    setIsOpen(false)
  }, [])

  const open = useCallback(function open() {
    setIsOpen(true)
  }, [])

  const toggle = useCallback(function toggle() {
    setIsOpen((isOpen) => {
      return !isOpen
    })
  }, [])

  return { close, isOpen, open, toggle }
}
