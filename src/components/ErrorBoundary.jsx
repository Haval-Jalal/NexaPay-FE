// ============================================================
// components/ErrorBoundary.jsx – global render-felfångare
// ============================================================
// React-class krävs eftersom hooks inte exponerar componentDidCatch.
// Visar en fallback istället för blank skärm vid render-fel och
// rapporterar felet till Sentry om det är initialiserat.
// ============================================================

import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (window.Sentry?.captureException) {
      window.Sentry.captureException(error, { extra: info })
    } else {
      console.error('[ErrorBoundary]', error, info)
    }
  }

  handleReload = () => {
    this.setState({ error: null })
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <h1 className="text-xl font-semibold text-white mb-2">Något gick fel</h1>
          <p className="text-gray-400 text-sm mb-5">
            Ett oväntat fel inträffade. Ladda om sidan för att försöka igen.
          </p>
          <button
            onClick={this.handleReload}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg px-5 py-2.5 transition"
          >
            Ladda om
          </button>
          {import.meta.env.DEV && (
            <pre className="mt-5 text-left text-xs text-red-300 bg-red-950/40 border border-red-900/50 rounded-lg p-3 overflow-auto max-h-48">
              {String(this.state.error?.stack ?? this.state.error)}
            </pre>
          )}
        </div>
      </div>
    )
  }
}
