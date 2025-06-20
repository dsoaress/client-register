import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/main.ts'],
  clean: true,
  outDir: 'dist',
  format: ['esm'],
  publicDir: true
})
