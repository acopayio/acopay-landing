#!/usr/bin/env python3
"""Regenerate title-only favicons from transparent logo-redraw.

Source: public/assets/logo-redraw-512.png
Output (circular clip, black interior #0c1017, transparent outside):
  - public/assets/favicon.png
  - public/assets/favicon-title-512.png
  - public/assets/title-icon-128.png
  - public/assets/title-icon-512.png

Does NOT modify logo.png / BrandLogo / OG assets.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "assets" / "logo-redraw-512.png"
BLACK = (12, 16, 23, 255)  # #0c1017
OUTPUTS = {
    128: [
        ROOT / "public" / "assets" / "favicon.png",
        ROOT / "public" / "assets" / "title-icon-128.png",
    ],
    512: [
        ROOT / "public" / "assets" / "favicon-title-512.png",
        ROOT / "public" / "assets" / "title-icon-512.png",
    ],
}


def make_title_favicon(src: Image.Image, size: int) -> Image.Image:
    if src.size != (size, size):
        src = src.resize((size, size), Image.Resampling.LANCZOS)
    pad = max(1, size // 64)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((pad, pad, size - 1 - pad, size - 1 - pad), fill=255)

    black_layer = Image.new("RGBA", (size, size), BLACK)
    base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    base.paste(black_layer, (0, 0), mask)
    out = Image.alpha_composite(base, src)
    rch, gch, bch, ach = out.split()
    ach = Image.composite(ach, Image.new("L", (size, size), 0), mask)
    return Image.merge("RGBA", (rch, gch, bch, ach))


def main() -> None:
    src = Image.open(SRC).convert("RGBA")
    for size, paths in OUTPUTS.items():
        img = make_title_favicon(src, size)
        for path in paths:
            img.save(path, "PNG", optimize=True)
            print(f"wrote {path}")


if __name__ == "__main__":
    main()
