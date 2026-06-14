import numpy as np
from rembg import remove, new_session
from PIL import Image
A = "/home/clintonium-119/src/github/clintonium-119/stuffy-frights/assets/enemies"
OUT = "/home/clintonium-119/src/github/clintonium-119/stuffy-frights/public/models"
sess = new_session("isnet-general-use")
def prep(photo, out):
    im = Image.open(photo).convert("RGBA")
    cut = remove(im, session=sess, alpha_matting=True, alpha_matting_foreground_threshold=240,
                 alpha_matting_background_threshold=15, alpha_matting_erode_size=12)
    a = np.array(cut); a[...,3] = np.where(a[...,3] > 150, 255, 0).astype('uint8')
    cut = Image.fromarray(a); bb = cut.getbbox()
    if bb: cut = cut.crop(bb)                       # TIGHT crop, NO square padding
    # composite on white so transparent bg -> white (base-fallback handles it)
    bg = Image.new("RGBA", cut.size, (255,255,255,255)); bg.alpha_composite(cut)
    bg.convert("RGB").save(out)
for name, pre in [("pou","pou"),("fuggler","fuggler"),("gorilla","gorilla"),("llama","llama")]:
    for view in ["front","back","side"]:
        prep(f"{A}/{pre}_{view}.jpg", f"{OUT}/{name}_{view}.png")
    print("tex-prepped", name)
