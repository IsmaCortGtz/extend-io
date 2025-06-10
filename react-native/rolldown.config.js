import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/index.ts',
  platform: 'node',
  external: ['@extend-io/core'],
  output: [
    { file: 'dist/cjs/index.cjs', format: 'cjs', minify: true, exports: 'named' },
    { file: 'dist/esm/index.mjs', format: 'esm', minify: true },
  ]
});