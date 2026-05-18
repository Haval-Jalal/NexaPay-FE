// ============================================================
// main.jsx – React-rotpunkt
// ============================================================
// Monterar App-komponenten i DOM-elementet med id="root".
// StrictMode aktiverar dubbel-rendering av effekter i utveckling
// så att vi tidigt upptäcker buggar i useEffect-cleanup.
// ============================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './sentry'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
