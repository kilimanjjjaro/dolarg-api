import { defineConfig } from 'vitest/config'

const WORKER_HOOK_TIMEOUT_MS = 30_000

export default defineConfig({
  test: {
    environment: 'node',
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts']
        }
      },
      {
        extends: true,
        test: {
          name: 'worker',
          include: ['tests/worker/**/*.test.ts'],
          hookTimeout: WORKER_HOOK_TIMEOUT_MS
        }
      }
    ]
  }
})
