"""Draws an opaque bar across the patient's eyes in the arm lift pair.

  python3 scripts/redact-arm-lift-eyes.py   (run from public/images/ba/)

Kept as the record of how the published images were anonymised. The bar
coordinates are specific to this pair and are not reusable elsewhere.

Done numerically rather than with an image model: the point is to remove
identifying detail from a real patient's photograph, so nothing else in the
picture may change and the bar must be genuinely opaque, not a blur that can be
undone. The after photograph is boxed wider and deeper because the glasses are
themselves identifying.
"""
from PIL import Image, ImageDraw

BARS = {
    'before': (335, 62, 476, 106),
    'after':  (338, 62, 492, 122),
}

for name, box in BARS.items():
    im = Image.open(f'arm-lift-1-{name}.jpg').convert('RGB')
    ImageDraw.Draw(im).rectangle(box, fill=(17, 17, 17))
    im.save(f'redacted-{name}.jpg', quality=92, subsampling=0)
    print(f'{name}: bar {box} on {im.size}')
