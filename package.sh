#!/bin/sh
# Builds the downloadable plugin: docs/token-swapper-grauity.zip
# (manifest.json + code.js + ui.html in a "Token Swapper" folder).
# Run after any change to the plugin, then commit the new zip.
set -e
cd "$(dirname "$0")"
OUT="docs/token-swapper-grauity.zip"
TMP="$(mktemp -d)"
mkdir -p "$TMP/Token Swapper"
cp manifest.json code.js ui.html "$TMP/Token Swapper/"
rm -f "$OUT"
(cd "$TMP" && zip -qr - "Token Swapper") > "$OUT"
rm -rf "$TMP"
echo "Built $OUT ($(du -h "$OUT" | cut -f1 | tr -d ' '))"
