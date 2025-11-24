// ==== CONFIGURACIÓN DE CANCIONES ====
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
    "cancion3": {
        url: "public/cancion3/output.m3u8",
        titulo: "Mi Tercera Canción",
        artista: "Artista 3"
    },
    "hate": {
        url: "public/hate/output.m3u8",
        titulo: "Hate Song",
        artista: "Artista Hate"
    },
    // Puedes agregar más canciones aquí
    "default": {
        url: "public/hate/output.m3u8",
        titulo: "Mi Canción Especial",
        artista: "Artista Desconocido"
    }
};

// ==== OBTENER CANCIÓN DESDE URL ====
function obtenerCancionDesdeURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const cancionId = urlParams.get('cancion') || urlParams.get('song') || urlParams.get('track');
    console.log("🔍 Buscando canción en URL:", cancionId);
    // Si hay un ID de canción en la URL y existe en nuestro catálogo
    if (cancionId && CANCIONES[cancionId]) {
        return CANCIONES[cancionId];
    }
    console.log("❗ No se especificó canción o no se encontró, usando canción por defecto.");

    // Si no, usar la canción por defecto
    return CANCIONES['default'];
}

// Obtener la canción a reproducir
const cancionActual = obtenerCancionDesdeURL();
const HLS_URL = cancionActual.url;
const NOMBRE_TEMA = cancionActual.titulo;

console.log(`🎵 Cargando: ${NOMBRE_TEMA}`);
console.log(`📂 URL: ${HLS_URL}`);

// ==== ELEMENTOS DOM ====
const audio = document.getElementById("audioElement");
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const playLabel = document.getElementById("playLabel");
const back10Btn = document.getElementById("back10Btn");
const forward10Btn = document.getElementById("forward10Btn");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const seekBar = document.getElementById("seekBar");
const progressLabel = document.getElementById("progressLabel");
const volumeBar = document.getElementById("volumeBar");
const volumeIcon = document.getElementById("volumeIcon");
const streamStatus = document.getElementById("streamStatus");
const trackTitle = document.getElementById("trackTitle");
const fakeWaveLines = document.getElementById("fakeWaveLines");

trackTitle.textContent = NOMBRE_TEMA;

// ==== WAVE VISUAL FAKE ====
const bars = 40;
for (let i = 0; i < bars; i++) {
    const bar = document.createElement("div");
    bar.className = "wave-bar";
    bar.style.setProperty("--i", i.toString());
    bar.style.height = Math.random() * 80 + 20 + "%";
    fakeWaveLines.appendChild(bar);
}

// ==== FORMATEO DE TIEMPO ====
function formatTime(seconds) {
    if (!isFinite(seconds)) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function setStatus(text, type = "ok") {
    streamStatus.textContent = "";
    streamStatus.innerHTML = "";
    const dot = document.createElement("span");
    dot.className = "status-dot" + (type === "error" ? " error" : "");
    streamStatus.appendChild(dot);
    const label = document.createTextNode(" " + text);
    streamStatus.appendChild(label);
}

// ==== CARGA HLS ====
function setupAudio(url) {
    if (window.Hls && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(audio);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setStatus("Cargado · listo para reproducir", "ok");
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("Error HLS:", data);
            setStatus("Error en el stream HLS", "error");
        });
    } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
        // Soporte nativo (Safari, iOS)
        audio.src = url;
        setStatus("Cargado con soporte nativo", "ok");
    } else {
        setStatus("Tu navegador no soporta HLS", "error");
    }
}

// Cargar la canción inicial
setupAudio(HLS_URL);

// ==== CAMBIAR CANCIÓN DINÁMICAMENTE ====
function cambiarCancion(cancionId) {
    if (!CANCIONES[cancionId]) {
        console.error(`❌ Canción "${cancionId}" no encontrada`);
        return;
    }

    const nuevaCancion = CANCIONES[cancionId];

    // Pausar audio actual
    audio.pause();
    audio.currentTime = 0;

    // Actualizar información
    trackTitle.textContent = nuevaCancion.titulo;
    setStatus("Cargando nueva canción...", "ok");

    // Cargar nueva canción
    setupAudio(nuevaCancion.url);

    // Actualizar URL sin recargar la página
    const nuevaURL = `${window.location.pathname}?cancion=${cancionId}`;
    window.history.pushState({ cancionId }, '', nuevaURL);

    console.log(`🎵 Canción cambiada a: ${nuevaCancion.titulo}`);
}

// Exponer función globalmente para uso desde consola o botones
window.cambiarCancion = cambiarCancion;

// ==== PLAY / PAUSE ====
function updatePlayUI(isPlaying) {
    if (isPlaying) {
        playIcon.style.display = "none";
        pauseIcon.style.display = "inline";
        playLabel.textContent = "Pausar";
    } else {
        playIcon.style.display = "inline";
        pauseIcon.style.display = "none";
        playLabel.textContent = "Reproducir";
    }
}

playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio
            .play()
            .then(() => updatePlayUI(true))
            .catch((err) => {
                console.error("No se pudo reproducir:", err);
                setStatus("No se pudo reproducir (ver consola)", "error");
            });
    } else {
        audio.pause();
        updatePlayUI(false);
    }
});

audio.addEventListener("play", () => updatePlayUI(true));
audio.addEventListener("pause", () => updatePlayUI(false));

// ==== SALTOS +/- 10s ====
back10Btn.addEventListener("click", () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
});

forward10Btn.addEventListener("click", () => {
    if (isFinite(audio.duration)) {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    } else {
        audio.currentTime += 10;
    }
});

// ==== PROGRESO ====
audio.addEventListener("timeupdate", () => {
    currentTimeEl.textContent = formatTime(audio.currentTime);
    if (isFinite(audio.duration) && audio.duration > 0) {
        durationEl.textContent = formatTime(audio.duration);
        const percent = (audio.currentTime / audio.duration) * 100;
        seekBar.value = percent;
        progressLabel.textContent = `${percent.toFixed(0)}%`;
    } else {
        progressLabel.textContent = "0%";
    }
});

audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
});

// ==== SEEK BAR ====
let isSeeking = false;

seekBar.addEventListener("input", () => {
    isSeeking = true;
    if (isFinite(audio.duration) && audio.duration > 0) {
        const percent = parseFloat(seekBar.value);
        const newTime = (percent / 100) * audio.duration;
        currentTimeEl.textContent = formatTime(newTime);
        progressLabel.textContent = `${percent.toFixed(0)}%`;
    }
});

seekBar.addEventListener("change", () => {
    if (isFinite(audio.duration) && audio.duration > 0) {
        const percent = parseFloat(seekBar.value);
        const newTime = (percent / 100) * audio.duration;
        audio.currentTime = newTime;
    }
    isSeeking = false;
});

// ==== VOLUMEN ====
function updateVolumeIcon(vol) {
    if (vol === 0) {
        volumeIcon.textContent = "🔇";
    } else if (vol < 0.45) {
        volumeIcon.textContent = "🔈";
    } else if (vol < 0.8) {
        volumeIcon.textContent = "🔉";
    } else {
        volumeIcon.textContent = "🔊";
    }
}

audio.volume = parseFloat(volumeBar.value);
updateVolumeIcon(audio.volume);

volumeBar.addEventListener("input", () => {
    const vol = parseFloat(volumeBar.value);
    audio.volume = vol;
    updateVolumeIcon(vol);
});

// Opcional: reproducir con barra espaciadora
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        playPauseBtn.click();
    }
});
