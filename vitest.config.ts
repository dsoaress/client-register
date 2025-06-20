import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    hookTimeout: 1000 * 10, // 10 seconds
    testTimeout: 1000 * 10, // 10 seconds
    slowTestThreshold: 0,
    include: ['**/?(*.){spec,e2e-spec}.?(c|m)[jt]s?(x)'],
    coverage: {
      enabled: true,
      include: ['apps/notification/src', 'apps/client-register/src', 'libs/core/src'],
      exclude: [
        '**/*.d.ts',
        '**/?(*.){spec,e2e-spec}.?(c|m)[jt]s?(x)',
        'apps/**/src/main.ts',
        // "apps/**/*.module.ts",
        'libs/**/src/main.ts'
      ],
      reporter: ['text', 'html', 'lcov']
    }
  }
})
