import { useMemo } from 'react'
import { getAccounts } from '../api/accounts'
import { useFetch } from './useFetch'

// Hämtar kontolistan från backend. Returnerar redan uppackad array i `accounts`.
// `onlyOpen = true` filtrerar bort frysta/stängda – användbart i Transfer/PayInvoice.
export function useAccounts({ onlyOpen = false } = {}) {
  const { data, loading, error, refetch } = useFetch(() => getAccounts(), [])

  const accounts = useMemo(() => {
    const all = data?.data ?? []
    return onlyOpen ? all.filter(a => a.status === 'Open') : all
  }, [data, onlyOpen])

  return { accounts, loading, error, refetch }
}
