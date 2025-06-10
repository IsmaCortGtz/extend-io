import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/index.ts',
  platform: 'browser',
  external: ['@extend-io/core'],
  output: [
    { file: 'dist/esm/index.mjs', format: 'esm', minify: true },
  ]
});