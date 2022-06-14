import { useEffect, useState } from 'react'

export function useDebouncedState<T>(value: T, delay = 150): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [value, delay])

  return debouncedValue
}
