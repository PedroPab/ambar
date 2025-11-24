# 🎵 Reproductor HLS con Soporte Multi-Canción

Reproductor de audio HLS que permite cambiar de canción mediante parámetros en la URL.

## 📖 Cómo Usar

### Método 1: Parámetros URL

Puedes acceder a diferentes canciones agregando parámetros a la URL:

```
# Canción 1
http://localhost:8000/?cancion=cancion1

# Canción 2
http://localhost:8000/?cancion=cancion2

# Canción 3
http://localhost:8000/?cancion=cancion3

# Canción por defecto (sin parámetro)
http://localhost:8000/
```

**Parámetros válidos:**
- `?cancion=ID` (español)
- `?song=ID` (inglés)
- `?track=ID` (alternativo)

### Método 2: JavaScript

Puedes cambiar de canción desde la consola del navegador o mediante código:

```javascript
// Cambiar a canción 1
cambiarCancion('cancion1');

// Cambiar a canción 2
cambiarCancion('cancion2');

// Cambiar a canción 3
cambiarCancion('cancion3');
```

### Método 3: Botones HTML (opcional)

Puedes agregar botones en tu HTML para cambiar canciones:

```html
<button onclick="cambiarCancion('cancion1')">Canción 1</button>
<button onclick="cambiarCancion('cancion2')">Canción 2</button>
<button onclick="cambiarCancion('cancion3')">Canción 3</button>
```

## 🎼 Configurar Canciones

Edita el objeto `CANCIONES` en `app.js`:

```javascript
const CANCIONES = {
  "cancion1": {
    url: "public/cancion1/output.m3u8",
    titulo: "Mi Primera Canción",
    artista: "Artista 1"
  },
  "cancion2": {
    url: "public/cancion2/output.m3u8",
    titulo: "Mi Segunda Canción",
    artista: "Artista 2"
  },
  // Agregar más canciones aquí...
};
```

## 📁 Estructura de Carpetas Recomendada

```
playMusicPili/
├── index.html
├── app.js
├── styles.css
└── public/
    ├── cancion1/
    │   ├── output.m3u8
    │   ├── segment_000.ts
    │   └── segment_001.ts
    ├── cancion2/
    │   ├── output.m3u8
    │   ├── segment_000.ts
    │   └── segment_001.ts
    └── cancion3/
        ├── output.m3u8
        ├── segment_000.ts
        └── segment_001.ts
```

## 🔧 Generar Archivos HLS

Para cada canción, genera archivos HLS con FFmpeg:

```bash
# Canción 1
mkdir -p public/cancion1
ffmpeg -i cancion1.mp3 \
  -codec:a aac \
  -b:a 128k \
  -f hls \
  -hls_time 10 \
  -hls_list_size 0 \
  -hls_segment_filename "public/cancion1/segment_%03d.ts" \
  public/cancion1/output.m3u8

# Canción 2
mkdir -p public/cancion2
ffmpeg -i cancion2.mp3 \
  -codec:a aac \
  -b:a 128k \
  -f hls \
  -hls_time 10 \
  -hls_list_size 0 \
  -hls_segment_filename "public/cancion2/segment_%03d.ts" \
  public/cancion2/output.m3u8

# Canción 3
mkdir -p public/cancion3
ffmpeg -i cancion3.mp3 \
  -codec:a aac \
  -b:a 128k \
  -f hls \
  -hls_time 10 \
  -hls_list_size 0 \
  -hls_segment_filename "public/cancion3/segment_%03d.ts" \
  public/cancion3/output.m3u8
```

## 🚀 Ejecutar el Proyecto

```bash
# Con Python
python3 -m http.server 8000

# Con Node.js
npx http-server -p 8000

# Luego abre en el navegador
http://localhost:8000/?cancion=cancion1
```

## 💡 Ejemplos de URLs

```
# Producción
https://tudominio.com/?cancion=cancion1
https://tudominio.com/?song=cancion2
https://tudominio.com/?track=cancion3

# Desarrollo local
http://localhost:8000/?cancion=cancion1
http://localhost:8000/?cancion=cancion2
http://localhost:8000/?cancion=cancion3
```

## 🎯 Características

- ✅ Cambio de canción por URL sin recargar la página
- ✅ Soporte para múltiples parámetros (cancion, song, track)
- ✅ Historial del navegador actualizado automáticamente
- ✅ Función JavaScript expuesta globalmente
- ✅ Logging en consola para debugging
- ✅ Fallback a canción por defecto
- ✅ Compatible con HLS nativo (Safari/iOS) y hls.js

## 🐛 Debug

Abre la consola del navegador (F12) para ver logs:

```
🎵 Cargando: Mi Primera Canción
📂 URL: public/cancion1/output.m3u8
```

Si una canción no existe:
```
❌ Canción "cancion4" no encontrada
```

## 📝 Notas

- Los IDs de canciones distinguen entre mayúsculas y minúsculas
- Si el parámetro URL no existe, se usa la canción "default"
- La función `cambiarCancion()` está disponible globalmente en `window.cambiarCancion`
