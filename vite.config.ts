import { defineConfig } from 'vite';
import pkg from './package.json';
import { devWriteConfigPlugin } from './devWriteConfigPlugin';

export default defineConfig({
  base: '/stuffy-frights/',
  // Dev-only: lets the enemy viewer's "save to source" buttons write tuning
  // edits back into src/ (apply:'serve', so it never enters the build).
  plugins: [devWriteConfigPlugin(process.cwd())],
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
