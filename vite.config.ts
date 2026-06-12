import { defineConfig } from 'vite';

export default defineConfig({
  base: '/stuffy-frights/',
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    target: 'es2022',
  },
});
