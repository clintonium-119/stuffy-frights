# AI-mesh pipeline (research-validated)

Turns reference photos into clean, game-ready stuffy meshes. The geometry comes
from an image-to-3D model; texturing, eyes/teeth, and the animation rig are done
in-engine (Three.js) so the procedural gaze / stair foot-placement still work.

Tooling (all confirmed working in this env): `rembg`+`Pillow` (prep), HF
`gradio_client` → `tencent/Hunyuan3D-2` (shape), `trimesh`+`numpy` (floater
removal + Taubin smooth), `@gltf-transform/cli` (weld + simplify/decimate).

Pipeline per character:
1. `prep.py <photo> <clean.png>` — strip background, tight-crop, pad to square.
   (Crop accessories like hats OUT — they're re-added procedurally in code.)
2. `generate.py <clean.png> <raw.glb>` — Hunyuan3D shape (uploads the prepped
   image to the Space; user-authorized).
3. `clean.py <raw.glb> <smooth.glb>` — keep largest component + Taubin smooth.
4. `gltf-transform weld … && gltf-transform simplify … --ratio 0.12` — decimate
   to ~300 KB.
5. In-engine: plush material + inset 3D eyes/teeth + a hand-designed skeleton
   with proximity skinning weights (SkinnedMesh), driven by the existing
   articulation. (Auto-rig Spaces like UniRig were all down/unreliable.)

NOT committed: the raw/working `.glb` outputs (see .gitignore).
