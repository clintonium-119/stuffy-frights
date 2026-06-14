"""Generate a shape GLB from a prepared (bg-removed, cropped) image via the
Hunyuan3D-2 Hugging Face Space. Usage: python generate.py <input.png> <out.glb>
Requires HF_TOKEN in env and `gradio_client`. The user authorized uploading the
prepared reference images to the Space (see DEC). Shape only — we texture +
rig in-engine."""
import os, sys, shutil
from gradio_client import Client, handle_file
src, dst = sys.argv[1], sys.argv[2]
c = Client("tencent/Hunyuan3D-2", token=os.environ["HF_TOKEN"], verbose=False)
res = c.predict(caption="", image=handle_file(src),
    mv_image_front=None, mv_image_back=None, mv_image_left=None, mv_image_right=None,
    steps=30, guidance_scale=5.0, seed=1234, octree_resolution=256,
    check_box_rembg=False, num_chunks=8000, randomize_seed=False, api_name="/shape_generation")
cand = res[0] if isinstance(res, (tuple, list)) else res
if isinstance(cand, dict): cand = cand.get("value") or cand.get("path")
shutil.copy(cand, dst); print("saved", dst, os.path.getsize(dst))
