# Funciones de la Web de Reproductor HLS

## 🎵 Funciones de Reproducción de Audio

### `setupAudio()`
**Descripción:** Configura y carga el stream HLS en el elemento de audio.

**Funcionalidad:**
- Detecta si el navegador soporta HLS mediante hls.js
- Carga el archivo `.m3u8` desde la URL configurada
- Implementa fallback para Safari/iOS con soporte nativo
- Maneja eventos de éxito y error en la carga del manifiesto
- Actualiza el estado visual según el resultado de la carga

**Eventos manejados:**
- `Hls.Events.MANIFEST_PARSED` - Cuando el manifiesto se carga correctamente
- `Hls.Events.ERROR` - Cuando ocurre un error en el stream

---

## 🎮 Funciones de Controles

### `updatePlayUI(isPlaying)`
**Descripción:** Actualiza la interfaz de usuario del botón play/pause.

**Parámetros:**
- `isPlaying` (boolean) - Estado de reproducción actual

**Funcionalidad:**
- Alterna entre iconos de play (▶) y pause (⏸)
- Cambia el texto del botón entre "Reproducir" y "Pausar"
- Sincroniza la UI con el estado real del audio

**Event Listeners relacionados:**
- `playPauseBtn.click` - Toggle play/pause
- `audio.play` - Actualiza UI cuando inicia reproducción
- `audio.pause` - Actualiza UI cuando pausa

### Botón Play/Pause
**Event Listener:** `playPauseBtn.addEventListener('click')`

**Funcionalidad:**
- Verifica si el audio está pausado
- Llama a `audio.play()` con manejo de promesas
- Llama a `audio.pause()` si está reproduciendo
- Captura y muestra errores de reproducción en consola
- Actualiza el estado visual mediante `updatePlayUI()`

### Botón Retroceder 10s
**Event Listener:** `back10Btn.addEventListener('click')`

**Funcionalidad:**
- Retrocede 10 segundos en la reproducción
- Usa `Math.max(0, audio.currentTime - 10)` para no ir a valores negativos
- Actualización instantánea de la posición del audio

### Botón Avanzar 10s
**Event Listener:** `forward10Btn.addEventListener('click')`

**Funcionalidad:**
- Avanza 10 segundos en la reproducción
- Verifica que la duración sea finita antes de calcular
- Usa `Math.min(duration, currentTime + 10)` para no exceder la duración total

---

## ⏱️ Funciones de Tiempo y Progreso

### `formatTime(seconds)`
**Descripción:** Formatea segundos a formato MM:SS.

**Parámetros:**
- `seconds` (number) - Tiempo en segundos

**Retorna:**
- String en formato "MM:SS" (ej: "03:45")
- "--:--" si el valor no es finito

**Funcionalidad:**
- Calcula minutos y segundos
- Aplica padding de ceros a la izquierda
- Maneja casos de duración infinita o indefinida

### Event: `audio.timeupdate`
**Descripción:** Se ejecuta continuamente mientras el audio se reproduce.

**Funcionalidad:**
- Actualiza el tiempo actual (`currentTime`) en formato legible
- Calcula el porcentaje de progreso
- Actualiza el valor de la barra de progreso (`seekBar`)
- Muestra el porcentaje de reproducción
- Solo actualiza si la duración es válida y mayor a 0

### Event: `audio.loadedmetadata`
**Descripción:** Se ejecuta cuando los metadatos del audio se cargan.

**Funcionalidad:**
- Obtiene y muestra la duración total del audio
- Formatea la duración con `formatTime()`
- Actualiza el elemento `durationEl`

---

## 🎚️ Funciones de Barra de Progreso (Seek)

### Event: `seekBar.input`
**Descripción:** Se ejecuta mientras el usuario arrastra la barra.

**Funcionalidad:**
- Activa la bandera `isSeeking = true`
- Calcula el nuevo tiempo basado en el porcentaje
- Actualiza visualmente el tiempo y porcentaje
- NO cambia la posición real del audio (solo preview)

### Event: `seekBar.change`
**Descripción:** Se ejecuta cuando el usuario suelta la barra.

**Funcionalidad:**
- Calcula el tiempo final basado en el porcentaje
- Cambia `audio.currentTime` a la nueva posición
- Desactiva la bandera `isSeeking = false`
- Verifica que la duración sea válida antes de aplicar

---

## 🔊 Funciones de Volumen

### `updateVolumeIcon(vol)`
**Descripción:** Actualiza el icono de volumen según el nivel.

**Parámetros:**
- `vol` (number) - Nivel de volumen entre 0 y 1

**Funcionalidad:**
- 🔇 Mute (vol === 0)
- 🔈 Bajo (vol < 0.45)
- 🔉 Medio (vol < 0.8)
- 🔊 Alto (vol >= 0.8)

### Event: `volumeBar.input`
**Descripción:** Se ejecuta al cambiar el control de volumen.

**Funcionalidad:**
- Lee el valor de la barra de volumen (0 a 1)
- Actualiza `audio.volume` en tiempo real
- Llama a `updateVolumeIcon()` para actualizar el icono

**Inicialización:**
- Volumen inicial establecido en 0.9 (90%)
- Se aplica tanto al audio como al control visual

---

## 📊 Funciones de Estado y Feedback

### `setStatus(text, type)`
**Descripción:** Actualiza el indicador de estado del reproductor.

**Parámetros:**
- `text` (string) - Mensaje a mostrar
- `type` (string) - Tipo de estado: "ok" o "error"

**Funcionalidad:**
- Limpia el contenido anterior del elemento de estado
- Crea un punto indicador con color según el tipo:
  - Verde (`.status-dot`) para "ok"
  - Rojo (`.status-dot.error`) para "error"
- Añade el texto del mensaje
- Proporciona feedback visual sobre el estado del stream

**Estados mostrados:**
- "Listo para reproducir" - Estado inicial
- "Cargado · listo para reproducir" - Manifiesto HLS cargado
- "Cargado con soporte nativo" - Safari/iOS
- "Error en el stream HLS" - Error de carga
- "Tu navegador no soporta HLS" - Incompatibilidad
- "No se pudo reproducir (ver consola)" - Error de reproducción

---

## 🎨 Funciones de Interfaz Visual

### Generación de Barras de Onda (Fake Waveform)
**Ubicación:** Líneas 678-685

**Funcionalidad:**
- Crea 40 barras visuales (`wave-bar`)
- Asigna altura aleatoria a cada barra (20% a 100%)
- Aplica variable CSS `--i` para delay de animación escalonado
- Añade animación CSS `wave` con duración de 1.2s
- Efecto puramente decorativo (no refleja audio real)

**Propiedades:**
```javascript
const bars = 40;
bar.style.height = Math.random() * 80 + 20 + "%";
bar.style.setProperty("--i", i.toString());
```

---

## ⌨️ Funciones de Interacción con Teclado

### Event: `document.keydown` (Barra espaciadora)
**Descripción:** Permite controlar reproducción con el teclado.

**Funcionalidad:**
- Detecta cuando se presiona la barra espaciadora (`e.code === 'Space'`)
- Solo funciona cuando el foco está en el body
- Previene el scroll de página (`e.preventDefault()`)
- Simula clic en el botón play/pause
- Mejora la accesibilidad y experiencia de usuario

---

## 🔧 Configuración y Variables

### Variables de Configuración
```javascript
const HLS_URL = "http://168.181.186.24:9000/pili/hate/output.m3u8"
const NOMBRE_TEMA = "Mi Canción Especial"
```

**Descripción:**
- `HLS_URL` - Ruta al archivo manifiesto .m3u8
- `NOMBRE_TEMA` - Título de la canción a mostrar

### Referencias DOM (Líneas 660-674)
Todas las referencias a elementos HTML:
- `audio` - Elemento `<audio>` HTML5
- `playPauseBtn` - Botón principal de control
- `playIcon` / `pauseIcon` - Iconos del botón
- `playLabel` - Texto del botón
- `back10Btn` / `forward10Btn` - Botones de salto
- `currentTimeEl` / `durationEl` - Displays de tiempo
- `seekBar` - Barra de progreso
- `progressLabel` - Etiqueta de porcentaje
- `volumeBar` - Control de volumen
- `volumeIcon` - Icono de volumen
- `streamStatus` - Indicador de estado
- `trackTitle` - Título de la canción
- `fakeWaveLines` - Contenedor de ondas visuales

---

## 🔄 Flujo de Ejecución

### 1. Inicialización
```
setupAudio() → Carga HLS → Actualiza estado
```

### 2. Reproducción
```
Click Play → audio.play() → updatePlayUI(true) → Eventos timeupdate
```

### 3. Control de Progreso
```
timeupdate → Calcula % → Actualiza seekBar → Muestra tiempo
```

### 4. Cambio de Posición
```
Drag seekBar → input event → Preview tiempo → change event → Aplica currentTime
```

### 5. Control de Volumen
```
Cambio volumeBar → input event → Actualiza audio.volume → updateVolumeIcon()
```

---

## 📦 Dependencias de Funciones

```
setupAudio()
  └─ setStatus()

playPauseBtn.click
  ├─ audio.play() / audio.pause()
  └─ updatePlayUI()

audio.timeupdate
  └─ formatTime()

seekBar.input/change
  └─ formatTime()

volumeBar.input
  └─ updateVolumeIcon()
```

---

## 🎯 Resumen de Capacidades

| Función | Estado | Descripción |
|---------|--------|-------------|
| Streaming HLS | ✅ | Reproduce archivos .m3u8 con fragmentación |
| Play/Pause | ✅ | Control básico de reproducción |
| Seek (Saltar) | ✅ | Navegación en la línea de tiempo |
| Saltos rápidos | ✅ | ±10 segundos con botones |
| Control volumen | ✅ | Ajuste de 0% a 100% |
| Visualización tiempo | ✅ | Tiempo actual y duración total |
| Progreso visual | ✅ | Barra y porcentaje |
| Estados visuales | ✅ | Feedback de carga y errores |
| Atajos teclado | ✅ | Barra espaciadora para play/pause |
| Animaciones | ✅ | Ondas visuales decorativas |
| Responsive | ✅ | Adaptable a móviles |
| Compatibilidad | ✅ | Fallback para Safari/iOS |
