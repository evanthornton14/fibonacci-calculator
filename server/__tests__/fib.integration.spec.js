import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../index.js'

describe('GET /api/fib', () => {
  it('returns 200 and JSON for n=10', async () => {
    const res = await request(app).get('/api/fib?n=10')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('n', 10)
    expect(res.body).toHaveProperty('result', '55')
  })
})
