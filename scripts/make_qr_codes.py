#!/usr/bin/env python3
"""Draw the QR codes used in the talks.

Run: `npm run qr`. These are static codes: each image contains the address itself,
with no shortener or QR service in between, so a code keeps working for as long as
the address it holds does.
"""

from pathlib import Path

import segno
import zxingcpp
from PIL import Image

OUTPUT = Path(__file__).resolve().parents[1] / "public" / "edtrace" / "images" / "talks"
TALK = "speaking/learning-in-the-llm-era"

CODES = {
    # One per deck language, so a scan opens the page in the language being presented.
    "qr-talk-en": f"https://drkabongo.com/{TALK}",
    "qr-talk-fr": f"https://drkabongo.com/fr/{TALK}",
    "qr-talk-ln": f"https://drkabongo.com/ln/{TALK}",
    "qr-talk-lua": f"https://drkabongo.com/lua/{TALK}",
    "qr-darakili-android": "https://play.google.com/store/apps/details?id=com.darakili.android",
    "qr-darakili-ios": "https://apps.apple.com/app/id6806669532",
}

# All codes use the grid of the longest address, so they have the same size and line up side by side.
VERSION = max(segno.make(url, error="m", micro=False).version for url in CODES.values())

for name, url in CODES.items():
    path = OUTPUT / f"{name}.png"
    # Black on white with the standard 4-module margin, readable in dark mode too.
    code = segno.make(url, error="m", micro=False, version=VERSION)
    code.save(path, scale=12, border=4, dark="#000000", light="#ffffff")
    decoded = [result.text for result in zxingcpp.read_barcodes(Image.open(path))]
    if decoded != [url]:
        raise SystemExit(f"{path.name} does not read back as {url}: {decoded}")
    print(f"{path.name}  ->  {url}")
