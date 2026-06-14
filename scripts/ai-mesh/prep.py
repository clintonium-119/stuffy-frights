import sys
from rembg import remove
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA")
cut = remove(im)              # strip the busy background
bb = cut.getbbox()
if bb: cut = cut.crop(bb)     # tight crop to the toy
# pad to square on white so the generator sees a clean centered subject
s = max(cut.size); canvas = Image.new("RGBA",(s,s),(255,255,255,255))
canvas.alpha_composite(cut, ((s-cut.size[0])//2,(s-cut.size[1])//2))
canvas.convert("RGB").save(dst)
print("prepped", dst, canvas.size)
