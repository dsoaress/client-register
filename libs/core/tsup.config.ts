import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/main.ts'],
  clean: true,
  outDir: 'dist',
  dts: true,
  minify: true,
  sourcemap: true,
  format: ['esm']
})
