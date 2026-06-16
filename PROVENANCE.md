# Asset provenance

## Interior models — `public/models/interior/`

- **Pack:** Quaternius — "Ultimate House Interior" (June 2020).
- **Source:** https://quaternius.com/packs/ultimatehomeinterior.html
- **License:** **CC0 1.0 Universal** (Public Domain Dedication) —
  https://creativecommons.org/publicdomain/zero/1.0/ . No attribution required;
  Quaternius is supported via Patreon (https://www.patreon.com/quaternius).
- **Original files:** `assets/Ultimate House Interior Pack/` (FBX / OBJ+MTL /
  Blend, flat-colour low-poly, no texture maps). 123 models.
- **Pipeline:** converted OBJ+MTL → GLB by `scripts/convert-interior.cjs`
  (using the `obj2gltf` devDependency) into `public/models/interior/*.glb`;
  the manifest (id, file, category, source-unit dims) is generated to
  `src/world/assets/catalog.data.ts`. Re-generate with
  `node scripts/convert-interior.cjs`.

## Enemy models — `public/models/*.glb`

See the `hifi-stuffies` / `meshy-rig` workstream history (AI-generated, adopted
by decision note).
