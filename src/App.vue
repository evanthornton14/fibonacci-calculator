<script setup lang="ts">
import FibCalculator from './components/FibCalculator.vue';
</script>

<template>
  <div class="wrapper">
    <FibCalculator />

    <div class="description">
      <p>
        This is a simple Fibonacci calculator built with Vue 3 and TypeScript. Enter a non-negative
        integer to see its Fibonacci number.
      </p>
      <p>The Fibonacci sequence is defined as follows:</p>
      <ul>
        <li>F(0) = 0</li>
        <li>F(1) = 1</li>
        <li>F(n) = F(n-1) + F(n-2) for n &gt; 1</li>
      </ul>
    </div>

    <!-- <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav> -->
  </div>

  <!-- <RouterView /> -->
</template>

<style scoped>
.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

.description {
  max-width: 600px;
  margin: 1rem auto 0;
  padding: 0 1rem;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}
.description p {
  margin-bottom: 1rem;
}
</style>
