import { defineConfig } from 'vite';
import pkg from './package.json';

export default defineConfig({
  base: '/stuffy-frights/',
  // Single source of truth for the displayed version (title screen).
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    outDir: 'docs',
    target: 'es2022',
  },
  server: {
    port: 3000,
    strictPort: true,
  },
});
