#!/bin/bash

# ============================
# Convertir TODOS los archivos de audio en la carpeta Sonidos
# Uso:
#   ./convert-all.sh
# ============================

# Carpeta de origen
SOURCE_DIR="Sonidos"

# Verificar que existe la carpeta Sonidos
if [ ! -d "$SOURCE_DIR" ]; then
  echo "❌ Error: La carpeta '$SOURCE_DIR' no existe."
  exit 1
fi

# Contar archivos de audio
AUDIO_FILES=("$SOURCE_DIR"/*.{mp3,wav,m4a,flac,ogg})
TOTAL=0

for file in "${AUDIO_FILES[@]}"; do
  if [ -f "$file" ]; then
    ((TOTAL++))
  fi
done

if [ $TOTAL -eq 0 ]; then
  echo "❌ No se encontraron archivos de audio en '$SOURCE_DIR'"
  exit 1
fi

echo "🎵 Encontrados $TOTAL archivos de audio en '$SOURCE_DIR'"
echo "🚀 Iniciando conversión masiva..."
echo ""

# Contador de éxitos
SUCCESS=0
CURRENT=0

# Procesar cada archivo de audio
for INPUT_FILE in "$SOURCE_DIR"/*.{mp3,wav,m4a,flac,ogg}; do
  # Verificar que el archivo existe (evita errores si no hay archivos de una extensión)
  if [ ! -f "$INPUT_FILE" ]; then
    continue
  fi

  ((CURRENT++))
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📀 [$CURRENT/$TOTAL] Procesando: $(basename "$INPUT_FILE")"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  # Obtener nombre base sin extensión
  BASENAME=$(basename "$INPUT_FILE")
  NAME="${BASENAME%.*}"
  
  # Crear carpeta destino dentro de public/
  OUTPUT_DIR="public/$NAME"
  
  mkdir -p "$OUTPUT_DIR"
  
  echo "📁 Carpeta: $OUTPUT_DIR"
  
  # Ejecutar FFmpeg
  ffmpeg -i "$INPUT_FILE" \
    -vn \
    -acodec aac \
    -b:a 128k \
    -hls_time 5 \
    -hls_playlist_type vod \
    -hls_segment_filename "$OUTPUT_DIR/segmento_%03d.ts" \
    "$OUTPUT_DIR/output.m3u8" \
    -loglevel error -stats
  
  # Verificar si la conversión fue exitosa
  if [ $? -eq 0 ]; then
    echo "✅ Convertido exitosamente: $NAME"
    ((SUCCESS++))
  else
    echo "❌ Error al convertir: $NAME"
  fi
  
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Proceso completado"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Archivos convertidos: $SUCCESS/$TOTAL"
echo "📂 Archivos generados en: public/"
echo ""
echo "💡 Ahora debes agregar las canciones a app.js:"
echo ""

# Generar código JavaScript sugerido
echo "const CANCIONES = {"

for INPUT_FILE in "$SOURCE_DIR"/*.{mp3,wav,m4a,flac,ogg}; do
  if [ ! -f "$INPUT_FILE" ]; then
    continue
  fi
  
  BASENAME=$(basename "$INPUT_FILE")
  NAME="${BASENAME%.*}"
  
  echo "  \"$NAME\": {"
  echo "    url: \"public/$NAME/output.m3u8\","
  echo "    titulo: \"$NAME\","
  echo "    artista: \"Artista\""
  echo "  },"
done

echo "  // ... más canciones"
echo "};"
echo ""
echo "📋 Copia este código y pégalo en app.js"
