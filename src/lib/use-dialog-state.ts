import { useState } from 'react'

interface UseDialogStateResult {
  close: () => void
  isOpen: boolean
  open: () => void
  toggle: () => void
}

export function useDialogState(): UseDialogStateResult {
  const [isOpen, setIsOpen] = useState(false)

  function close() {
    setIsOpen(false)
  }

  function open() {
    setIsOpen(true)
  }

  function toggle() {
    setIsOpen((isOpen) => {
      return !isOpen
    })
  }

  return { close, isOpen, open, toggle }
}
