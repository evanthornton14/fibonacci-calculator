<template>
  <div class="calculator">
    <h2>Fibonacci Calculator</h2>
    <div class="input-row">
      <input
        type="number"
        v-model.number="n"
        min="0"
        placeholder="Enter a number"
        @keyup.enter="calculateFibonacci"
      />
      <button @click="calculateFibonacci">Calculate</button>
    </div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else-if="isInvalidInput" class="error">Please enter a valid non-negative integer.</div>
    <div v-else-if="result !== null" class="result">
      Fibonacci({{ inputNum }}) = {{ result }}
      <span v-if="cached" style="font-weight: normal; font-size: 0.9rem; color: #666"
        >(cached)</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const n = ref<number | null>(null);
const inputNum = ref<number | null>(null);
const isInvalidInput = ref(false);
const result = ref<string | null>(null);
const cached = ref(false);
const loading = ref(false);
const errorMessage = ref<string | null>(null);

async function calculateFibonacci() {
  // basic validation
  if (n.value === null || n.value < 0 || !Number.isInteger(n.value)) {
    isInvalidInput.value = true;
    result.value = null;
    cached.value = false;
    errorMessage.value = null;
    return;
  }

  isInvalidInput.value = false;
  inputNum.value = n.value;
  result.value = null;
  cached.value = false;
  errorMessage.value = null;
  loading.value = true;

  try {
    const url = `/api/fib?n=${encodeURIComponent(String(n.value))}`;
    const resp = await fetch(url);

    type Resp = { n?: number; result?: string; cached?: boolean; error?: string };

    // Try to parse JSON body using whichever helper is available.
    // Some test mocks provide only `text()` which is why we support both.
    type ResponseLike = { json?: () => Promise<unknown>; text?: () => Promise<string> };
    const r = resp as unknown as ResponseLike;
    let parsed: Resp | null = null;
    try {
      if (typeof r.json === 'function') {
        parsed = (await r.json()) as Resp;
      } else if (typeof r.text === 'function') {
        const txt = await r.text();
        parsed = txt ? (JSON.parse(txt) as Resp) : null;
      }
    } catch {
      parsed = null;
    }

    if (!resp.ok) {
      const msg = parsed && parsed.error ? String(parsed.error) : `Request failed: ${resp.status}`;
      throw new Error(msg);
    }

    if (parsed) {
      result.value = parsed.result ?? null;
      cached.value = Boolean(parsed.cached);
    } else {
      result.value = null;
      cached.value = false;
    }
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'message' in err) {
      const maybeMsg = (err as { message?: unknown }).message;
      errorMessage.value = typeof maybeMsg === 'string' ? maybeMsg : String(maybeMsg);
    } else {
      errorMessage.value = String(err);
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.calculator {
  max-width: 300px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}
input[type='number'] {
  /* width: 80%; */
  padding: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
}
.result {
  font-weight: bold;
}

.input-row {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}
.error {
  color: red;
  margin-top: 0.5rem;
}
.result span {
  font-weight: normal;
  font-size: 0.9rem;
  color: #666;
  margin-left: 0.5rem;
}
</style>
