// Bas-klient för alla API-anrop. Övriga api-filer använder request() härifrån.

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5190'

export async function request(path, options = {}, token = null) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  // Läs body som text först – res.json() kraschar på tom body
  const text = await res.text()
  let data = null
  if (text) {
    try { data = JSON.parse(text) } catch { /* icke-JSON svar */ }
  }

  if (!res.ok) {
    const error = new Error(data?.message ?? `Serverfel (${res.status})`)
    error.status = res.status
    throw error
  }

  return data
}

export function getToken() {
  const stored = localStorage.getItem('nexapay_user')
  return stored ? JSON.parse(stored).token : null
}
