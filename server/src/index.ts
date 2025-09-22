import express, { Request, Response } from 'express';
import path from 'path';
import rateLimit from 'express-rate-limit';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

function fibonacci(n: number): bigint {
  if (n <= 0) return BigInt(0);
  if (n === 1) return BigInt(1);
  let a = BigInt(0);
  let b = BigInt(1);
  for (let i = 2; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}

// Simple in-memory cache with TTL
type CacheEntry = { value: string; expiresAt: number };
const cache = new Map<number, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes

function getCached(n: number): string | undefined {
  const e = cache.get(n);
  if (!e) return undefined;
  if (Date.now() > e.expiresAt) {
    cache.delete(n);
    return undefined;
  }
  return e.value;
}

function setCached(n: number, value: string) {
  cache.set(n, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

const app = express();
app.use(express.json());

// Rate limiter: 60 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Simple CORS for development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/api/fib', (req: Request, res: Response) => {
  const q = req.query.n as string | undefined;
  const n = q !== undefined ? Number(q) : NaN;
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
    return res
      .status(400)
      .json({ error: 'Invalid parameter `n`. Provide a non-negative integer.' });
  }
  if (n > 10000) {
    return res.status(400).json({ error: 'Requested n is too large. Max allowed is 10000.' });
  }

  const cached = getCached(n);
  if (cached) return res.json({ n, result: cached, cached: true });

  const result = fibonacci(n).toString();
  setCached(n, result);
  return res.json({ n, result, cached: false });
});

app.post('/api/fib', (req: Request, res: Response) => {
  const nRaw = req.body && (typeof req.body.n !== 'undefined' ? req.body.n : undefined);
  const n = typeof nRaw === 'number' ? nRaw : Number(nRaw);
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
    return res
      .status(400)
      .json({ error: 'Invalid parameter `n`. Provide a non-negative integer.' });
  }
  if (n > 10000) {
    return res.status(400).json({ error: 'Requested n is too large. Max allowed is 10000.' });
  }

  const cached = getCached(n);
  if (cached) return res.json({ n, result: cached, cached: true });

  const result = fibonacci(n).toString();
  setCached(n, result);
  return res.json({ n, result, cached: false });
});

// Serve the built Vue app from ../dist
const staticDir = path.resolve(process.cwd(), 'dist');
app.use(express.static(staticDir));

// Fallback to index.html for SPA client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ error: 'Not found' });
    }
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // Informal startup message for local development only
    // Keep console logging out of test output

    console.log(`Fibonacci API + static server listening on http://localhost:${PORT}`);
  });
}

export default app;
