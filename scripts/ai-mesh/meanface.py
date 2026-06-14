"""Generate menacing-state texture variants (<model>_<view>_mean.png): hard
darken + strong contrast + hot-red shadows + heavy vignette for a clearly
menacing mood. Reproducible — rerun after the base textures change."""
import numpy as np
from PIL import Image
M = "public/models"
def meanify(src, dst):
    im = Image.open(src).convert("RGB")
    base = np.asarray(im).astype(np.float32) / 255.0
    a = (base - 0.5) * 1.35 + 0.5
    a *= 0.6
    shadow = 1.0 - a.mean(axis=2, keepdims=True)
    a[..., 0] += shadow[..., 0] * 0.28 + 0.05
    a[..., 1] -= shadow[..., 0] * 0.05
    a[..., 2] -= shadow[..., 0] * 0.12
    h, w, _ = a.shape
    yy, xx = np.mgrid[0:h, 0:w]
    rr = np.sqrt(((xx / w) - 0.5) ** 2 + ((yy / h) - 0.5) ** 2) / 0.7071
    vig = (1.0 - np.clip(rr, 0, 1) * 0.6)[..., None]
    white = (np.asarray(im).min(axis=2, keepdims=True) > 232)
    out = np.clip(a * vig, 0, 1)
    out = np.where(white, base, out)
    Image.fromarray((out * 255).astype(np.uint8)).save(dst)
for n in ["pou", "fuggler", "gorilla", "llama"]:
    for v in ["front", "side"]:
        meanify(f"{M}/{n}_{v}.png", f"{M}/{n}_{v}_mean.png")
    print("mean", n)
