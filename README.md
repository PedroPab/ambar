# 🎵 Reproductor de Audio con HLS

Interfaz sencilla para reproducir audio usando **HLS (HTTP Live Streaming)** que mejora el rendimiento de tu página web. El audio se carga por fragmentos, haciendo que la reproducción sea más rápida y fluida.

## ✨ Características

- 🚀 Reproducción rápida usando fragmentos HLS
- 🎛️ Controles de play/pause, volumen y progreso
- 📱 Diseño responsive (funciona en móvil y escritorio)
- 🎨 Interfaz moderna con efectos visuales
- 🔄 Soporte para múltiples canciones vía URL
- 🎯 Logo/marca personalizable

---

## 📋 Requisitos

Antes de comenzar, necesitas tener instalado **FFmpeg**:

```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# Fedora
sudo dnf install ffmpeg

# macOS
brew install ffmpeg
```

Verifica la instalación:

```bash
ffmpeg -version
```

---

## 🚀 Uso Rápido

### 1. Convertir tu audio a HLS

**Opción A - Usar el script automático (recomendado):**

```bash
chmod +x convert.sh
./convert.sh tu-cancion.mp3
```

Esto creará automáticamente la carpeta `public/tu-cancion/` con todos los archivos necesarios.

**Opción B - Conversión manual con FFmpeg:**

```bash
ffmpeg -i cancion.mp3 \
  -vn \
  -acodec aac \
  -b:a 128k \
  -hls_time 5 \
  -hls_playlist_type vod \
  -hls_segment_filename "media/segmento_%03d.ts" \
  media/output.m3u8
```

### 2. Agregar la canción al catálogo

Abre `app.js` y agrega tu canción al objeto `CANCIONES`:

**⚠️ IMPORTANTE:** La clave (key) del objeto debe ser **exactamente igual** al nombre que usarás en la URL.

```javascript
const CANCIONES = {
  "mi-cancion": {              // ← Este es el key (debe coincidir con la URL)
    url: "public/mi-cancion/output.m3u8",
    titulo: "Nombre de mi canción",
    artista: "Artista"
  },
  // ... más canciones
};
```

### 3. Iniciar servidor local

```bash
# Con Python
python3 -m http.server 8000

# Con Node.js
npx http-server -p 8000
```

### 4. Abrir en el navegador

**La canción se accede por el PATH de la URL:**

**Ejemplos:**

- `http://localhost:8000/hate` → Carga la canción con key `"hate"`
- `http://localhost:8000/cancion1` → Carga la canción con key `"cancion1"`
- `http://localhost:8000/` → Carga la canción `"default"`

---

## 🎼 Agregar Más Canciones

1. Convierte tu audio:

   ```bash
   ./convert.sh cancion1.mp3
   ./convert.sh cancion2.mp3
   ./convert.sh rock-song.mp3
   ```

2. Edita `app.js` y agrega las canciones:

   **⚠️ IMPORTANTE:** El key del objeto debe ser igual al path de la URL.

   ```javascript
   const CANCIONES = {
     "cancion1": {                    // Key = "cancion1"
       url: "public/cancion1/output.m3u8",
       titulo: "Canción 1",
       artista: "Artista 1"
     },
     "rock-song": {                   // Key = "rock-song"
       url: "public/rock-song/output.m3u8",
       titulo: "Rock Song",
       artista: "Rockstar"
     }
   };
   ```

3. Accede usando el **PATH** de la URL (el mismo que el key):

   ```
   http://localhost:8000/cancion1      ← Key: "cancion1"
   http://localhost:8000/rock-song     ← Key: "rock-song"
   ```

### 📍 Regla importante

```
URL Path = Key del objeto CANCIONES

Ejemplo:
  Key en app.js:  "mi-banda-favorita"
  URL correcta:   /mi-banda-favorita
  URL incorrecta: /miBandaFavorita  ❌
```

---

## 🧪 Probado en

- ✅ Linux (Ubuntu, Fedora)
- ✅ Navegadores: Chrome, Firefox

---

## ❓ Preguntas Frecuentes

**¿Por qué usar HLS en vez de MP3 directo?**

- Carga más rápido (por fragmentos)
- Mejor para archivos grandes
- Menos consumo de datos inicial

**¿Puedo usar otros formatos de audio?**

- Sí, FFmpeg soporta: MP3, WAV, FLAC, OGG, M4A, etc.

---
