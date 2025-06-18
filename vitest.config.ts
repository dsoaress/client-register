import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    hookTimeout: 1000 * 10, // 10 seconds
    testTimeout: 1000 * 10, // 10 seconds
    slowTestThreshold: 0,
    include: ['**/?(*.){spec,int-spec,e2e-spec}.?(c|m)[jt]s?(x)'],
    coverage: {
      enabled: true,
      include: ['apps/notification/src', 'apps/user-register/src', 'libs/core/src'],
      exclude: [
        '**/*.d.ts',
        '**/?(*.){spec,int-spec,e2e-spec}.?(c|m)[jt]s?(x)',
        'apps/notification/src/main.ts',
        'apps/user-register/src/main.ts',
        'libs/core/src/main.ts'
      ],
      reporter: ['text', 'html', 'lcov']
    }
  }
})
