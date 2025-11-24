#!/bin/bash

# ============================
# Conversor automático a HLS
# Uso:
#   ./convert.sh archivo.mp3
# ============================

# 1. Verificar parámetro
if [ -z "$1" ]; then
  echo "❌ Error: Debes pasar un archivo de audio."
  echo "👉 Ejemplo: ./convert.sh cancion.mp3"
  exit 1
fi

INPUT_FILE="$1"

# 2. Verificar que el archivo existe
if [ ! -f "$INPUT_FILE" ]; then
  echo "❌ Error: El archivo '$INPUT_FILE' no existe."
  exit 1
fi

# 3. Obtener nombre base sin extensión
BASENAME=$(basename "$INPUT_FILE")
NAME="${BASENAME%.*}"

# 4. Crear carpeta destino dentro de public/
OUTPUT_DIR="public/$NAME"

mkdir -p "$OUTPUT_DIR"

echo "📁 Carpeta creada: $OUTPUT_DIR"
echo "🎧 Archivo a convertir: $INPUT_FILE"

# 5. Ejecutar FFmpeg para generar HLS dentro de la carpeta
ffmpeg -i "$INPUT_FILE" \
  -vn \
  -acodec aac \
  -b:a 128k \
  -hls_time 5 \
  -hls_playlist_type vod \
  -hls_segment_filename "$OUTPUT_DIR/segmento_%03d.ts" \
  "$OUTPUT_DIR/output.m3u8"

echo "✅ Conversión completada."
echo "📂 Archivos generados en: $OUTPUT_DIR"
echo "➡ Usa esta ruta en tu web:"
echo "   $OUTPUT_DIR/output.m3u8"
