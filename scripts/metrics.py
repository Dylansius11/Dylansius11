"""Advance widths for the two embedded fonts, so build.mjs can lay out SVG
text by measurement instead of by eye. SVG text never wraps or reflows, so
every line position on the profile is computed from these numbers.

    python3 scripts/metrics.py   ->  scripts/metrics.json
"""
import json
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

out = {}
src = TTFont("fonts/tiktok-sans.woff2")
for w in (400, 500, 600, 700):
    inst = instancer.instantiateVariableFont(TTFont("fonts/tiktok-sans.woff2"), {"wght": w})
    upm = inst["head"].unitsPerEm
    cmap = inst.getBestCmap()
    hmtx = inst["hmtx"].metrics
    out[f"sans{w}"] = {chr(c): round(hmtx[g][0] / upm, 4) for c, g in cmap.items()}

mono = TTFont("fonts/departure-mono.woff2")
upm = mono["head"].unitsPerEm
cmap = mono.getBestCmap()
out["mono"] = {chr(c): round(mono["hmtx"].metrics[g][0] / upm, 4) for c, g in cmap.items()}

json.dump(out, open("scripts/metrics.json", "w"), separators=(",", ":"))
print({k: len(v) for k, v in out.items()}, "mono advance", out["mono"]["A"])
