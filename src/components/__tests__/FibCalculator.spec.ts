import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import FibCalculator from '../FibCalculator.vue'

describe('FibCalculator.vue', () => {
  it('fetches result from backend and displays it (including cached)', async () => {
    // mock global fetch
    const fakeResponse = { n: 10, result: '55', cached: false }
    const mockFetch = vi.fn(() =>
      Promise.resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(fakeResponse)) }),
    )
    type FetchFn = (input: RequestInfo, init?: RequestInit) => Promise<Response>
    const g = global as unknown as { fetch?: FetchFn }
    const origFetch = g.fetch
    g.fetch = mockFetch as unknown as FetchFn

    const wrapper = mount(FibCalculator)

    // set input value and trigger calculate
    const input = wrapper.find('input[type="number"]')
    await input.setValue('10')
    await wrapper.find('button').trigger('click')

    // wait for next tick / promises
    await new Promise((r) => setTimeout(r, 10))

    expect(mockFetch).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Fibonacci(10) = 55')

    // simulate cached response on second call
    const fakeResponseCached = { n: 10, result: '55', cached: true }
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(fakeResponseCached)),
      }),
    )

    await wrapper.find('button').trigger('click')
    await new Promise((r) => setTimeout(r, 10))

    expect(wrapper.text()).toContain('(cached)')

    // restore fetch
    g.fetch = origFetch
  })
})
