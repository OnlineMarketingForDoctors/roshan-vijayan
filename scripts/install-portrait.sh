#!/usr/bin/env bash
#
# Installs a generated portrait as the "Meet Mr Vijayan" photo.
#
# That section reads /images/web/doctor-suit.jpg on the homepage, the about
# page and every procedure page, so replacing the file updates all of them at
# once — no code change needed.
#
# Usage, from the repo root:
#   bash scripts/install-portrait.sh '<image-url>'
#
# Uses sips, which ships with macOS, to downscale to the 1120x1500 the site
# serves and convert to JPEG. The generated files are ~1792x2400 PNGs, far
# larger than the page needs.
set -euo pipefail

URL="${1:-}"
if [ -z "$URL" ]; then
  echo "Usage: bash scripts/install-portrait.sh '<image-url>'" >&2
  exit 1
fi

DEST="public/images/web/doctor-suit.jpg"
if [ ! -f "$DEST" ]; then
  echo "Run this from the repo root — $DEST not found." >&2
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Downloading..."
curl --fail -sS -o "$TMP/portrait.png" "$URL"
echo "Got $(wc -c < "$TMP/portrait.png" | tr -d ' ') bytes."

echo "Resizing to 1120x1500 and converting to JPEG..."
sips -s format jpeg -s formatOptions 82 \
     --resampleHeightWidth 1500 1120 \
     "$TMP/portrait.png" --out "$TMP/doctor-suit.jpg" >/dev/null

mv "$TMP/doctor-suit.jpg" "$DEST"
echo "Installed $DEST ($(wc -c < "$DEST" | tr -d ' ') bytes)."
echo
echo "Check it looks right, then:"
echo "  git add $DEST && git commit -m 'Update the Meet Mr Vijayan portrait' && git push"
