import { describe, it, expect } from 'vitest'
import { fibonacci } from '../lib/fib.js'

describe('fibonacci', () => {
  it('returns correct small values', () => {
    expect(fibonacci(0).toString()).toBe('0')
    expect(fibonacci(1).toString()).toBe('1')
    expect(fibonacci(2).toString()).toBe('1')
    expect(fibonacci(3).toString()).toBe('2')
    expect(fibonacci(10).toString()).toBe('55')
  })

  it('handles larger n', () => {
    const res = fibonacci(50)
    expect(typeof res).toBe('bigint')
  })
})
