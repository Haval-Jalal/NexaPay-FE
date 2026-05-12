import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Forces a cache miss on every server restart by timestamping the entry point URL.
// The browser treats /src/main.jsx?t=1234 as a different URL than /src/main.jsx,
// so it always fetches fresh — and Vite then serves all imports with new timestamps too.
const cacheBust = {
  name: 'cache-bust',
  transformIndexHtml(html) {
    const ts = Date.now()
    return html.replace(
      'src="/src/main.jsx"',
      `src="/src/main.jsx?t=${ts}"`
    )
  },
  configureServer(server) {
    server.middlewares.use((_req, res, next) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
      res.setHeader('Pragma', 'no-cache')
      res.setHeader('Expires', '0')
      next()
    })
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cacheBust],
  optimizeDeps: {
    force: true,
  },
})
