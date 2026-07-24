from PIL import Image
import os

root = r"C:\Users\adminpc\Desktop\solana\acopay-landing"
src = os.path.join(root, "public", "assets", "logo.png")
out = os.path.join(root, "public", "assets", "logo-light.png")

im = Image.open(src).convert("RGBA")
px = im.load()
w, h = im.size

for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        mx = max(r, g, b)
        if mx < 40:
            px[x, y] = (0, 0, 0, 0)
            continue
        if mx < 70 and (g + b) < 120:
            px[x, y] = (0, 0, 0, 0)

bbox = im.getbbox()
if not bbox:
    raise SystemExit("empty after key")

pad = 4
l, t, r2, b2 = bbox
l = max(0, l - pad)
t = max(0, t - pad)
r2 = min(w, r2 + pad)
b2 = min(h, b2 + pad)
cropped = im.crop((l, t, r2, b2))

side = max(cropped.size)
canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
ox = (side - cropped.size[0]) // 2
oy = (side - cropped.size[1]) // 2
canvas.paste(cropped, (ox, oy), cropped)
canvas = canvas.resize((512, 512), Image.Resampling.LANCZOS)
canvas.save(out, "PNG", optimize=True)
print("wrote", out, "bytes", os.path.getsize(out), "bbox", canvas.getbbox())
