// ============================================================
// sentry.js – initialiserar Sentry om DSN är satt
// ============================================================
// Importeras tidigt i main.jsx. Utan VITE_SENTRY_DSN gör modulen
// ingenting — appen kraschar inte och inga nätverksanrop görs.
// ErrorBoundary läser av window.Sentry för att rapportera fel.
// ============================================================

import * as Sentry from '@sentry/react'

const dsn = import.meta.env.VITE_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0,
  })
  window.Sentry = Sentry
}
