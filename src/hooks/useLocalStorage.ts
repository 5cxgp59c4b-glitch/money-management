import { useEffect, useRef, useState } from 'react'

function isQuotaError(e: unknown): boolean {
  return (
    e instanceof DOMException &&
    (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  )
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  onQuotaExceeded?: (rollback: () => void) => void,
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const onQuotaExceededRef = useRef(onQuotaExceeded)
  useEffect(() => { onQuotaExceededRef.current = onQuotaExceeded }, [onQuotaExceeded])

  const prevValueRef = useRef(storedValue)

  useEffect(() => {
    const prev = prevValueRef.current
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
      prevValueRef.current = storedValue
    } catch (e) {
      if (isQuotaError(e)) {
        onQuotaExceededRef.current?.(() => {
          setStoredValue(prev)
          prevValueRef.current = prev
        })
      }
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}
