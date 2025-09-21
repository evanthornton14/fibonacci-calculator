// Simple test script to call the local Fibonacci API
;(async function () {
  try {
    const res = await fetch('http://localhost:4000/api/fib?n=10')
    const json = await res.json()
    console.log(JSON.stringify(json))
    process.exit(0)
  } catch (err) {
    console.error('Request failed', err.message || err)
    process.exit(2)
  }
})()
