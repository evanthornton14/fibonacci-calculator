import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { fibonacci } from './lib/fib.js'

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())

// Simple CORS for development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.get('/api/fib', (req, res) => {
  const q = req.query.n
  const n = q !== undefined ? Number(q) : NaN
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
    return res.status(400).json({ error: 'Invalid parameter `n`. Provide a non-negative integer.' })
  }
  if (n > 10000) {
    return res.status(400).json({ error: 'Requested n is too large. Max allowed is 10000.' })
  }
  const result = fibonacci(n)
  return res.json({ n, result: result.toString() })
})

app.post('/api/fib', (req, res) => {
  const nRaw = req.body && (typeof req.body.n !== 'undefined' ? req.body.n : undefined)
  const n = typeof nRaw === 'number' ? nRaw : Number(nRaw)
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
    return res.status(400).json({ error: 'Invalid parameter `n`. Provide a non-negative integer.' })
  }
  if (n > 10000) {
    return res.status(400).json({ error: 'Requested n is too large. Max allowed is 10000.' })
  }
  const result = fibonacci(n)
  return res.json({ n, result: result.toString() })
})

// Serve the built Vue app from ../dist
const staticDir = path.resolve(__dirname, '..', 'dist')
app.use(express.static(staticDir))

// Fallback to index.html for SPA client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ error: 'Not found' })
    }
  })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Fibonacci API + static server listening on http://localhost:${PORT}`)
  })
}

export default app
