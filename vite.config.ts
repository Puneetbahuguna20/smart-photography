import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import galleryHandler from './api/gallery.ts'
import imageHandler from './api/image.ts'
import bookingsHandler from './api/bookings.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load local environment variables including server-side keys from .env.local
  const env = loadEnv(mode, process.cwd(), '')
  // In Node.js, process.env is a special object requiring Object.assign
  Object.assign(process.env, env)

  return {
    plugins: [
      react(),
      {
        name: 'vercel-serverless-api-dev',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = new URL(req.url || '', 'http://localhost')
            if (url.pathname === '/api/gallery') {
              try {
                await galleryHandler(req as any, res as any)
              } catch (err) {
                next(err)
              }
              return
            }
            if (url.pathname === '/api/image') {
              try {
                await imageHandler(req as any, res as any)
              } catch (err) {
                next(err)
              }
              return
            }
            if (url.pathname === '/api/bookings') {
              try {
                // Collect body for POST request if needed
                let data = ''
                req.on('data', (chunk) => {
                  data += chunk
                })
                req.on('end', async () => {
                  if (data) {
                    try {
                      ;(req as any).body = JSON.parse(data)
                    } catch {
                      ;(req as any).body = data
                    }
                  }
                  await bookingsHandler(req as any, res as any)
                })
              } catch (err) {
                next(err)
              }
              return
            }
            next()
          })
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
