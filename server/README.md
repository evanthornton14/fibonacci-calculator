Fibonacci Calculator - Express server + static SPA hosting

This server uses Express to provide the `/api/fib` endpoint and also serves the built Vue app from the `../dist` directory.

Local development

- Run the Vue dev server (from repo root): `npm run dev`
- Run the API server (from `server/`): `node index.js` or `npm run dev`

Production / serving the built app

1. Build the client from the repo root:

   npm run build

   This creates `dist/` in the repo root.

2. Start the Express server (from `server/`):

   node index.js

Endpoints

- GET /api/fib?n=10 -> { n: 10, result: "55" }
- POST /api/fib -> JSON body { "n": 10 }

Notes

- The server uses BigInt internally and returns the result as a string to avoid JSON BigInt issues.
- A sane upper limit (10000) is enforced to prevent excessive CPU usage.
