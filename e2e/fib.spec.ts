import { test, expect } from '@playwright/test'

test('Fibonacci calculator returns 55 for n=10', async ({ page }) => {
  // Assumes frontend dev server + backend are running (use `npm run dev:full`)
  await page.goto('/')

  const input = page.locator('input[type="number"]')
  await input.fill('10')

  const button = page.locator('button', { hasText: 'Calculate' })
  await button.click()

  // Wait for result to appear
  await expect(page.locator('.result')).toHaveText(/Fibonacci\(10\) = 55/)
})
