import { readFileSync, writeFileSync } from 'node:fs';
import type { Plugin } from 'vite';
import { resolveSafeConfigPath, replaceMarkedRegion } from './src/dev/configWriter';

/**
 * Dev-only Vite middleware backing the viewer's "save to source" buttons. It
 * serves `POST /__apo/write-config` with `{ file, blockId, body }`, validates
 * that `file` resolves under `<repoRoot>/src/`, replaces that file's marked
 * region with `body`, and writes it back to disk. `apply: 'serve'` keeps it out
 * of the production build entirely. Lives at the repo root (like vite.config.ts)
 * because it uses node APIs and the tsconfig scopes tsc to `src/`.
 */
export function devWriteConfigPlugin(repoRoot: string): Plugin {
  return {
    name: 'apo-dev-write-config',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__apo/write-config', (req, res) => {
        const send = (code: number, payload: object): void => {
          res.statusCode = code;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify(payload));
        };
        if (req.method !== 'POST') {
          send(405, { ok: false, error: 'POST only' });
          return;
        }
        let raw = '';
        req.on('data', (chunk) => (raw += chunk));
        req.on('end', () => {
          try {
            const { file, blockId, body } = JSON.parse(raw) as {
              file?: string;
              blockId?: string;
              body?: string;
            };
            if (typeof file !== 'string' || typeof blockId !== 'string' || typeof body !== 'string') {
              send(400, { ok: false, error: 'expected { file, blockId, body } strings' });
              return;
            }
            const abs = resolveSafeConfigPath(repoRoot, file);
            if (!abs) {
              send(400, { ok: false, error: `unsafe path: ${file}` });
              return;
            }
            const next = replaceMarkedRegion(readFileSync(abs, 'utf8'), blockId, body);
            writeFileSync(abs, next);
            console.log(`[apo] wrote ${file} (block "${blockId}")`);
            send(200, { ok: true });
          } catch (e) {
            send(400, { ok: false, error: e instanceof Error ? e.message : String(e) });
          }
        });
      });
    },
  };
}
