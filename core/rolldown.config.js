import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/index.ts',
  platform: 'neutral',
  external: ['jszip'],
  output: [
    { file: 'dist/cjs/index.cjs', format: 'cjs', minify: true, exports: 'named' },
    { file: 'dist/esm/index.mjs', format: 'esm', minify: true }
  ],
});