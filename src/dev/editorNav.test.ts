import { describe, it, expect } from 'vitest';
import { editorNavLinks } from './editorNav';

describe('editorNavLinks', () => {
  it('lists the editor pages in nav order', () => {
    expect(editorNavLinks()).toEqual([
      { label: 'Enemies', href: 'enemies.html' },
      { label: 'Floors', href: 'floors.html' },
    ]);
  });
});
