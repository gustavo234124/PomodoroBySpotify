#!/bin/bash

INPUT_DIR="./public"
QUALITY=85

echo "🔄 Convirtiendo imágenes a WebP..."

find "$INPUT_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read img; do
  webp="${img%.*}.webp"
  cwebp -q $QUALITY "$img" -o "$webp" && echo "✅ $img -> $webp"
done

echo "🎉 Conversión completada."