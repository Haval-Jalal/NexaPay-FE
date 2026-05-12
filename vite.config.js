import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const noCache = {
  name: 'no-cache',
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
  plugins: [react(), tailwindcss(), noCache],
  optimizeDeps: {
    force: true,
  },
})
