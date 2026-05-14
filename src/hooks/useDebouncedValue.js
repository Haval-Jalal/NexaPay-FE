import { useState, useEffect } from 'react'

// Returnerar `value` fördröjt med `delay` ms. Reset:ar timern vid varje ny inmatning.
// Ersätter setTimeout+useRef-mönstret för t.ex. live-sökning på kontonummer.
export function useDebouncedValue(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
