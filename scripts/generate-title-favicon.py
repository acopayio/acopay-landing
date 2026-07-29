#!/usr/bin/env python3
"""Regenerate title-only favicons from transparent logo-redraw.

Source: public/assets/logo-redraw-512.png (transparent cyan hex mark)
Output:
  - public/assets/favicon.png (128) — browser tab
  - public/assets/favicon-title-512.png (512) — apple-touch / PWA

Clip = flat-top hexagon matching neon border; fill = brand black #0c1017 inside;
outside hex = transparent. Does NOT modify logo.png / BrandLogo / OG assets.
"""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "assets" / "logo-redraw-512.png"
OUT_128 = ROOT / "public" / "assets" / "favicon.png"
OUT_512 = ROOT / "public" / "assets" / "favicon-title-512.png"
BLACK = (12, 16, 23, 255)  # #0c1017
# Measured vertex radius of neon mark on 512 source
SRC_VERTEX_R = 307.2


def make_title_favicon(src: Image.Image, size: int) -> Image.Image:
    if src.size != (size, size):
        src = src.resize((size, size), Image.Resampling.LANCZOS)
    w, h = src.size
    cx, cy = w / 2, h / 2
    r = size * (SRC_VERTEX_R / 512) * 1.02
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    pts = [
        (cx + r * math.cos(math.radians(30 + 60 * i)), cy + r * math.sin(math.radians(30 + 60 * i)))
        for i in range(6)
    ]
    draw.polygon(pts, fill=255)

    black_layer = Image.new("RGBA", (w, h), BLACK)
    base = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    base.paste(black_layer, (0, 0), mask)
    out = Image.alpha_composite(base, src)
    rch, gch, bch, ach = out.split()
    ach = Image.composite(ach, Image.new("L", (w, h), 0), mask)
    return Image.merge("RGBA", (rch, gch, bch, ach))


def main() -> None:
    src = Image.open(SRC).convert("RGBA")
    make_title_favicon(src, 128).save(OUT_128, "PNG", optimize=True)
    make_title_favicon(src, 512).save(OUT_512, "PNG", optimize=True)
    print(f"wrote {OUT_128}")
    print(f"wrote {OUT_512}")


if __name__ == "__main__":
    main()
