// ============================================================
// hooks/useFetch.js – generisk data-hämtnings-hook
// ============================================================
// Ersätter det duplicerade mönstret useState + useEffect + try/catch
// som annars upprepas på varje sida som hämtar data. Hanterar:
//   * Loading-state (för skeletons/spinners)
//   * Error-state (för inline-felmeddelanden)
//   * "Race conditions" – stale-svar ignoreras via lokal `active`-flagga
//   * Manuell refetch utan att ändra deps
// ============================================================

import { useState, useEffect, useCallback } from 'react'

// Generisk GET-hook: kör fetchFn() och spårar data/loading/error.
// `refetch()` triggar om hämtningen utan att deps ändras.
// `deps` styr automatisk omladdning (t.ex. när ett id ändras).
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshCounter, setRefreshCounter] = useState(0)

  const refetch = useCallback(() => setRefreshCounter(n => n + 1), [])

  useEffect(() => {
    let active = true
    // Reset av loading/error vid ny fetch är *själva poängen* med en data-fetch-hook,
    // så vi gör det synkront här. React 19s set-state-in-effect-regel avråder från
    // det generellt men dokumenterar nätverksanrop som ett legitimt undantag.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError('')
    fetchFn()
      .then(res => { if (active) setData(res) })
      .catch(e => { if (active) setError(e.message ?? 'Något gick fel') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
    // fetchFn återskapas vid varje render – inkludera bara consumer-deps + refresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, refreshCounter])

  return { data, loading, error, refetch, setData }
}
