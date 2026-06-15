import { FloorsEditor } from './FloorsEditor';
import { mountEditorNav } from './editorNav';

/**
 * Entry point for floors.html — the dev-only per-floor visibility/atmosphere
 * editor (the "Floors" page of the debug editor). The editor body (lit-room
 * preview + sliders) is built out in a later phase; this mounts the shell.
 */
mountEditorNav('floors');
const canvas = document.getElementById('floors') as HTMLCanvasElement;
const editor = new FloorsEditor(canvas);
// Dev convenience: expose for console / automated inspection.
(window as unknown as { __floors: FloorsEditor }).__floors = editor;
