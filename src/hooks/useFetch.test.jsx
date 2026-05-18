import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useFetch } from './useFetch'

describe('useFetch', () => {
  it('returnerar data efter lyckat anrop', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ data: { hello: 'world' } })
    const { result } = renderHook(() => useFetch(fetchFn))

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual({ data: { hello: 'world' } })
    expect(result.current.error).toBe('')
  })

  it('returnerar error vid fel', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('Boom'))
    const { result } = renderHook(() => useFetch(fetchFn))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Boom')
    expect(result.current.data).toBeNull()
  })

  it('ignorerar stale-svar när hooken unmountas', async () => {
    let resolveFn
    const fetchFn = vi.fn(() => new Promise(r => { resolveFn = r }))
    const { result, unmount } = renderHook(() => useFetch(fetchFn))

    unmount()
    await act(async () => {
      resolveFn({ data: 'late' })
    })
    // Ingen kasträning förväntas — data ska aldrig sättas efter unmount.
    expect(result.current.data).toBeNull()
  })

  it('refetch triggar nytt anrop', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ data: 1 })
    const { result } = renderHook(() => useFetch(fetchFn))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(fetchFn).toHaveBeenCalledTimes(1)

    await act(async () => { result.current.refetch() })
    await waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(2))
  })
})
