/**
 * Browser-side client for the dev write-to-source endpoint (served only by
 * `vite dev`, see devWriteConfigPlugin at the repo root). POSTs a serialized
 * config-block body to be written into the named source file's marked region.
 * Returns a result the caller can surface in the UI; never throws.
 */
export interface SaveResult {
  ok: boolean;
  error?: string;
}

export async function saveConfigBlock(file: string, blockId: string, body: string): Promise<SaveResult> {
  try {
    const res = await fetch('/__apo/write-config', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ file, blockId, body }),
    });
    const json = (await res.json().catch(() => ({}))) as SaveResult;
    if (!res.ok || !json.ok) return { ok: false, error: json.error ?? `HTTP ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
