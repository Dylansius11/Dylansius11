# Fonts

Subsets of the two typefaces the portfolio uses, embedded as base64 inside
every SVG on this profile so each image renders with nothing else loaded.

| File | Source | Licence |
|---|---|---|
| `tiktok-sans.woff2` | TikTok Sans, github.com/tiktok/TikTokSans | SIL Open Font License 1.1 |
| `departure-mono.woff2` | Departure Mono, departuremono.com | SIL Open Font License 1.1 |

Subset to Basic Latin plus the few symbols the profile prints. TikTok Sans is
pinned at optical size 28 and weights 400 to 700, which takes it from 75kB to
23kB. Rebuild them with:

```
pyftsubset TikTokSans-Variable.woff2 --unicodes="U+0020-007E,U+00A0,U+00B7,U+00D7,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2190-2193,U+2197,U+2198,U+00E9" --flavor=woff2 --layout-features='kern,liga,tnum,lnum' --output-file=tiktok-sans.woff2
fonttools varLib.instancer tiktok-sans.woff2 opsz=28 wght=400:700
python3 scripts/metrics.py
```
