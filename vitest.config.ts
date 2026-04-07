import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: "happy-dom",
    coverage: {
      provider: 'v8' // or 'istanbul'
    },
    env: {
      VITE_DATABASE_URL: 'memory://'
    }
  },
})
