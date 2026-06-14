import numpy as np
from PIL import Image
M = "/home/clintonium-119/src/github/clintonium-119/stuffy-frights/public/models"
for n in ["pou","fuggler","gorilla","llama"]:
    px=[]
    for v in ["front","back","side"]:
        a=np.asarray(Image.open(f"{M}/{n}_{v}.png").convert("RGB")).reshape(-1,3).astype(float)
        # exclude near-white background (min channel > 200)
        mask = a.min(axis=1) < 205
        px.append(a[mask])
    allpx=np.concatenate(px)
    avg=allpx.mean(axis=0).astype(int)
    print(f"{n} 0x{avg[0]:02x}{avg[1]:02x}{avg[2]:02x}  (n={len(allpx)})")
