import { defineConfig } from 'vite';

export default defineConfig({
  base: '/stuffy-frights/',
  build: {
    outDir: 'docs',
    target: 'es2022',
  },
  server: {
    port: 3000,
    strictPort: true,
  },
});
