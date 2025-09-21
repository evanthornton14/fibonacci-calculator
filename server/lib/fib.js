export function fibonacci(n) {
  if (n <= 0) return BigInt(0)
  if (n === 1) return BigInt(1)
  let a = BigInt(0)
  let b = BigInt(1)
  for (let i = 2; i <= n; i++) {
    const c = a + b
    a = b
    b = c
  }
  return b
}
