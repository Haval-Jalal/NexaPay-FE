const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5190'

export async function request(path, options = {}, token) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message ?? 'Något gick fel')
  return data
}

export function getToken() {
  const stored = localStorage.getItem('nexapay_user')
  return stored ? JSON.parse(stored).token : null
}
