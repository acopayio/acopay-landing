#!/usr/bin/env python3
"""Title (+ optional UI circle) icons: center logo mark, then circular black clip.

Source (title): public/assets/logo-redraw-512.png — recentered by cyan/content bbox
Source (UI circle): public/assets/logo.png — same pipeline for BrandLogo Light

Output:
  - favicon.png / title-icon-128.png
  - favicon-title-512.png / title-icon-512.png
  - logo-circle.png (512) — BrandLogo Light only
"""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
REDRAW = ROOT / "public" / "assets" / "logo-redraw-512.png"
LOGO = ROOT / "public" / "assets" / "logo.png"
BLACK = (12, 16, 23, 255)
TITLE_OUT = {
    128: [
        ROOT / "public" / "assets" / "favicon.png",
        ROOT / "public" / "assets" / "title-icon-128.png",
    ],
    512: [
        ROOT / "public" / "assets" / "favicon-title-512.png",
        ROOT / "public" / "assets" / "title-icon-512.png",
    ],
}
UI_CIRCLE = ROOT / "public" / "assets" / "logo-circle.png"


def content_bbox(im: Image.Image) -> tuple[int, int, int, int]:
    """BBox of neon cyan mark (optical logo), not soft alpha glow."""
    w, h = im.size
    px = im.load()
    xs: list[int] = []
    ys: list[int] = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 40:
                continue
            if g > 80 and b > 80 and g + b > r * 2.0 and (g + b) > 160:
                xs.append(x)
                ys.append(y)
    if xs:
        return min(xs), min(ys), max(xs), max(ys)
    bbox = im.getbbox()
    if not bbox:
        return 0, 0, w - 1, h - 1
    return bbox


def center_and_fit(src: Image.Image, size: int, fill_ratio: float = 0.88) -> Image.Image:
    """Crop square around content center, scale evenly, paste mid-canvas."""
    l, t, r, b = content_bbox(src)
    ccx = (l + r) / 2
    ccy = (t + b) / 2
    half = max(r - l, b - t) / 2
    half += max(2.0, 0.02 * src.width)

    left = int(math.floor(ccx - half))
    top = int(math.floor(ccy - half))
    right = int(math.ceil(ccx + half))
    bottom = int(math.ceil(ccy + half))
    side = max(right - left, bottom - top)

    tile = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    src_l = max(0, left)
    src_t = max(0, top)
    src_r = min(src.width, right)
    src_b = min(src.height, bottom)
    piece = src.crop((src_l, src_t, src_r, src_b))
    tile.paste(piece, (src_l - left, src_t - top), piece)

    target = max(1, int(round(size * fill_ratio)))
    tile = tile.resize((target, target), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ox = (size - target) // 2
    oy = (size - target) // 2
    canvas.paste(tile, (ox, oy), tile)
    return canvas


def circle_clip(src: Image.Image, size: int) -> Image.Image:
    fitted = center_and_fit(src, size)
    pad = max(1, size // 64)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((pad, pad, size - 1 - pad, size - 1 - pad), fill=255)
    black = Image.new("RGBA", (size, size), BLACK)
    base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    base.paste(black, (0, 0), mask)
    out = Image.alpha_composite(base, fitted)
    r, g, b, a = out.split()
    a = Image.composite(a, Image.new("L", (size, size), 0), mask)
    return Image.merge("RGBA", (r, g, b, a))


def main() -> None:
    redraw = Image.open(REDRAW).convert("RGBA")
    for size, paths in TITLE_OUT.items():
        img = circle_clip(redraw, size)
        for path in paths:
            img.save(path, "PNG", optimize=True)
            print(f"wrote {path}")

    logo = Image.open(LOGO).convert("RGBA")
    ui = circle_clip(logo, 512)
    ui.save(UI_CIRCLE, "PNG", optimize=True)
    print(f"wrote {UI_CIRCLE}")

    # Verify cyan centers near mid
    for p in [TITLE_OUT[128][1], TITLE_OUT[512][1], UI_CIRCLE]:
        im = Image.open(p).convert("RGBA")
        bb = content_bbox(im)
        cx = (bb[0] + bb[2]) / 2
        cy = (bb[1] + bb[3]) / 2
        print(f"center check {p.name}: ({cx:.1f},{cy:.1f}) vs ({im.width/2},{im.height/2})")


if __name__ == "__main__":
    main()
