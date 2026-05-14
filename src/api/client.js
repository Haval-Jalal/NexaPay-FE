// Axios-instans för alla API-anrop mot NexaPay-backend.
// - baseURL läses från Vite env (VITE_API_URL)
// - Request-interceptor lägger automatiskt på Bearer-token från localStorage
// - Response-interceptor returnerar response.data direkt och normaliserar fel
//   så att consumers kan göra: const data = await api.get('/api/...')

import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:5190'

export function getToken() {
  const stored = localStorage.getItem('nexapay_user')
  return stored ? JSON.parse(stored).token : null
}

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    const message =
      error.response?.data?.message ??
      error.message ??
      `Serverfel (${status ?? 'okänd'})`
    const normalized = new Error(message)
    normalized.status = status
    normalized.data = error.response?.data
    return Promise.reject(normalized)
  }
)

export default api
