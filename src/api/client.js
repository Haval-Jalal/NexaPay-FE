// ============================================================
// client.js – src/api
// ============================================================
// Bas-klient för alla API-anrop.
// Alla andra api-filer använder request() härifrån
// så att vi inte upprepar fetch-logiken överallt.
// ============================================================

// Bas-URL för API:et – hämtas från miljövariabel, annars localhost
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5190'

// Gemensam request-funktion som används av alla api-filer
// path    = t.ex. '/api/auth/login'
// options = fetch-alternativ (method, body, headers)
// token   = JWT-token, skickas med i Authorization-headern om det finns
export async function request(path, options = {}, token = null) {
  // Bygg headers – alltid JSON, lägg till Authorization om token finns
  const headers = { 'Content-Type': 'application/json', ...options.headers }

  // Om token skickades med, lägg till Bearer-headern
  if (token) headers['Authorization'] = `Bearer ${token}`

  // Gör fetch-anropet mot API:et
  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  // Läs body som text först – res.json() kraschar på tom body
  const text = await res.text()
  let data = null
  if (text) {
    try { data = JSON.parse(text) } catch { /* icke-JSON svar */ }
  }

  // Om HTTP-statuskoden inte är 2xx, kasta ett fel med API:ets meddelande
  if (!res.ok) throw new Error(data?.message ?? `Serverfel (${res.status})`)

  // Returnera hela svaret (data.data innehåller den faktiska nyttolasten)
  return data
}

// Hämtar JWT-token från localStorage
// Används av api-filerna för att skicka med token automatiskt
export function getToken() {
  // Hämta den sparade användaren från localStorage
  const stored = localStorage.getItem('nexapay_user')

  // Om ingen användare finns, returnera null – annars plocka ut token
  return stored ? JSON.parse(stored).token : null
}
