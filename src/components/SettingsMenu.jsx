import { useState } from "react";
import { useEffect, useRef } from "react";

export default function SettingsMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [alarmSound, setAlarmSound] = useState("sound1"); // sound1 | sound2 | mute
  const [alarmVolume, setAlarmVolume] = useState(50); // 0 - 100
const audioRef = useRef(null);

  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setActiveModal(null);
  };

  const openSubModal = (type) => {
    setActiveModal(type);
    setMenuOpen(false);
  };

  const closeSubModal = () => {
    setActiveModal(null);
    setMenuOpen(true);
  };

useEffect(() => {
  if (!audioRef.current) return;

  if (alarmSound === "mute") {
    audioRef.current.pause();
    audioRef.current.src = ""; // importante: limpiar el src
    return;
  }

  const soundPath =
    alarmSound === "sound1"
      ? "/sounds/sonidouno.mp3"
      : "/sounds/sonidodos.mp3";

  // Asignar el nuevo sonido
  audioRef.current.src = soundPath;

  // Cargar y reproducir una vez cargado
  audioRef.current.load(); // fuerza la carga del nuevo src
  audioRef.current.volume = alarmVolume / 100;

  // Esperar a que esté listo antes de reproducir
  audioRef.current
    .play()
    .catch((err) => console.error("Error al reproducir audio:", err));
}, [alarmSound]);

// Control independiente del volumen
useEffect(() => {
  if (audioRef.current) {
    audioRef.current.volume = alarmVolume / 100;
  }
}, [alarmVolume]);


// Estado de notificaciones (inicia en false; se sincroniza en useEffect)
const [notificationsEnabled, setNotificationsEnabled] = useState(false);

// Sincroniza el estado según el permiso actual del navegador
useEffect(() => {
  if (typeof window !== "undefined" && "Notification" in window) {
    setNotificationsEnabled(Notification.permission === "granted");
  }
}, []);

// Toggle que solicita permisos cuando se activa
const toggleNotifications = async () => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    alert("Este navegador no soporta notificaciones.");
    return;
  }

  // Si está activo y lo apagan, solo cambiamos el estado local
  if (notificationsEnabled) {
    setNotificationsEnabled(false);
    return;
  }

  // Si está desactivado, pedimos permiso
  try {
    const result = await Notification.requestPermission();
    if (result === "granted") {
      setNotificationsEnabled(true);
    } else {
      setNotificationsEnabled(false);
      alert("No se concedieron permisos de notificación.");
    }
  } catch (err) {
    console.error("Error solicitando permisos de notificación:", err);
    setNotificationsEnabled(false);
  }
};


// --- TIEMPOS (presets + custom) ---
const [timePreset, setTimePreset] = useState("popular"); // 'popular' | 'medio' | 'extendido' | 'custom'
const [pomodoroMin, setPomodoroMin] = useState(20);
const [shortBreakMin, setShortBreakMin] = useState(5);
const [longBreakMin, setLongBreakMin] = useState(10);

function applyPreset(preset) {
  setTimePreset(preset);
  if (preset === "popular") {
    setPomodoroMin(20); setShortBreakMin(5); setLongBreakMin(10);
  } else if (preset === "medio") {
    setPomodoroMin(40); setShortBreakMin(8); setLongBreakMin(15);
  } else if (preset === "extendido") {
    setPomodoroMin(60); setShortBreakMin(8); setLongBreakMin(15);
  }
  // 'custom' no cambia valores; solo habilita sliders
}

const [autoPomodoro, setAutoPomodoro] = useState(false);
const [autoBreaks, setAutoBreaks] = useState(false);



  return (
    <div className="absolute top-4 right-4 z-50">
      {/* Botón del menú */}
      <button
        onClick={toggleMenu}
        className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Modal principal */}
      {menuOpen && (
        <div className="absolute top-0 right-0 bg-gray-100 text-black rounded-bl-4xl shadow-lg p-6 flex flex-col gap-4 w-[320px]">
          <button
            onClick={toggleMenu}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
          >
            ×
          </button>

          <div className="flex justify-between gap-4">
            <button onClick={() => openSubModal("alarma")} className="bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl p-4 w-32 font-medium">Alarma</button>
            <button onClick={() => openSubModal("reinicio")} className="bg-blue-500 hover:bg-blue-400 text-white rounded-xl p-4 w-32 text-center font-medium">Reinicio <br /> automático</button>
          </div>

          <div className="flex justify-center">
            <button onClick={() => openSubModal("fondo")} className="bg-red-600 hover:bg-red-500 text-white rounded-xl p-4 w-32 font-medium">Fondo</button>
          </div>

          <div className="flex justify-between gap-4">
            <button onClick={() => openSubModal("tiempo")} className="bg-amber-800 hover:bg-amber-700 text-white rounded-xl p-4 w-32 text-center font-medium">Tiempo de <br /> concentración</button>
            <button onClick={() => openSubModal("notificaciones")} className="bg-pink-400 hover:bg-pink-300 text-white rounded-xl p-4 w-32 text-center font-medium">Notificaciones</button>
          </div>
        </div>
      )}

      {/* Sub-modal */}
      {activeModal && (
        <div className="absolute top-0 right-0 bg-white text-black rounded-bl-4xl shadow-lg w-[320px] p-4">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={closeSubModal}
              className="text-blue-500 hover:text-blue-700 text-2xl font-bold"
            >
              &lt;
            </button>
            <h3 className="font-bold capitalize text-lg">{activeModal}</h3>
          </div>

{activeModal === "alarma" && (
  <>
    {/* Botones de sonido */}
    <div className="flex justify-between gap-2 mb-4">
      <button
        className={`flex-1 py-2 rounded font-medium ${
          alarmSound === "sound1"
            ? "bg-green-600 text-white"
            : "bg-gray-200 text-black"
        }`}
        onClick={() => setAlarmSound("sound1")}
      >
        Sonido 1
      </button>
      <button
        className={`flex-1 py-2 rounded font-medium ${
          alarmSound === "sound2"
            ? "bg-green-600 text-white"
            : "bg-gray-200 text-black"
        }`}
        onClick={() => setAlarmSound("sound2")}
      >
        Sonido 2
      </button>
      <button
        className={`flex-1 py-2 rounded font-medium ${
          alarmSound === "mute"
            ? "bg-red-600 text-white"
            : "bg-gray-200 text-black"
        }`}
        onClick={() => setAlarmSound("mute")}
      >
        Mutear
      </button>
    </div>

    {/* Control de volumen */}
    <div className="mb-2">
      <label htmlFor="volume" className="block text-sm font-medium mb-1">
        Volumen: {alarmVolume}%
      </label>
      <input
        id="volume"
        type="range"
        min="0"
        max="100"
        value={alarmVolume}
        onChange={(e) => setAlarmVolume(Number(e.target.value))}
        className="w-full"
      />
    </div>

    {/* Audio */}
    <audio ref={audioRef} hidden />
  </>
)}



{activeModal === "reinicio" && (
  <div className="space-y-2">
    <h4 className="font-semibold">Reinicio automático</h4>
    <p className="text-sm text-gray-600">Aquí el código de Reinicio automático seccion de reinicio</p>
  </div>
)}

{activeModal === "fondo" && (
  <div className="space-y-2">
    <h4 className="font-semibold">Fondo</h4>
    <p className="text-sm text-gray-600">Aquí el código de Fondo.</p>
  </div>
)}

{activeModal === "tiempo" && (
  <div className="space-y-6">
    <h4 className="font-semibold text-xl">Tiempo de concentracion</h4>

    {/* Popular */}
    <button
      type="button"
      onClick={() => applyPreset("popular")}
      className="w-full text-left"
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 inline-block h-5 w-5 rounded-full border-2 ${
            timePreset === "popular" ? "border-green-600 bg-green-600" : "border-gray-400"
          }`}
        />
        <div>
          <p className="font-semibold">Popular</p>
          <ul className="text-gray-500">
            <li>20 minutos pomodoro</li>
            <li>5 minutos descanso</li>
            <li>10 minutos descanso largo</li>
          </ul>
        </div>
      </div>
    </button>

    {/* Medio */}
    <button
      type="button"
      onClick={() => applyPreset("medio")}
      className="w-full text-left"
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 inline-block h-5 w-5 rounded-full border-2 ${
            timePreset === "medio" ? "border-green-600 bg-green-600" : "border-gray-400"
          }`}
        />
        <div>
          <p className="font-semibold">Medio</p>
          <ul className="text-gray-500">
            <li>40 minutos pomodoro</li>
            <li>8 minutos descanso</li>
            <li>15 minutos descanso largo</li>
          </ul>
        </div>
      </div>
    </button>

    {/* Extendido */}
    <button
      type="button"
      onClick={() => applyPreset("extendido")}
      className="w-full text-left"
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 inline-block h-5 w-5 rounded-full border-2 ${
            timePreset === "extendido" ? "border-green-600 bg-green-600" : "border-gray-400"
          }`}
        />
        <div>
          <p className="font-semibold">Extendido</p>
          <ul className="text-gray-500">
            <li>60 minutos pomodoro</li>
            <li>8 minutos descanso</li>
            <li>15 minutos descanso largo</li>
          </ul>
        </div>
      </div>
    </button>

    {/* Personalizado */}
    <button
      type="button"
      onClick={() => setTimePreset("custom")}
      className="w-full text-left"
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 inline-block h-5 w-5 rounded-full border-2 ${
            timePreset === "custom" ? "border-green-600 bg-green-600" : "border-gray-400"
          }`}
        />
        <div className="w-full">
          <p className="font-semibold">Personalizado</p>

          {/* Pomodoro */}
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold">{pomodoroMin} minutos</span>
              <span className="text-sm text-gray-500">Pomodoro</span>
            </div>
            <input
              type="range"
              min={5}
              max={120}
              step={5}
              value={pomodoroMin}
              onChange={(e) => setPomodoroMin(Number(e.target.value))}
              disabled={timePreset !== "custom"}
              className="w-full accent-gray-600 disabled:opacity-40"
            />
          </div>

          {/* Descanso corto */}
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold">{shortBreakMin} minutos</span>
              <span className="text-sm text-gray-500">Descanso</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={shortBreakMin}
              onChange={(e) => setShortBreakMin(Number(e.target.value))}
              disabled={timePreset !== "custom"}
              className="w-full accent-gray-600 disabled:opacity-40"
            />
          </div>

          {/* Descanso largo */}
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold">{longBreakMin} minutos</span>
              <span className="text-sm text-gray-500">Descanso largo</span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={longBreakMin}
              onChange={(e) => setLongBreakMin(Number(e.target.value))}
              disabled={timePreset !== "custom"}
              className="w-full accent-gray-600 disabled:opacity-40"
            />
          </div>
        </div>
      </div>
    </button>
  </div>
)}


{activeModal === "notificaciones" && (
  <div>
    {/* Header con título y switch alineados horizontalmente */}
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-semibold">Notificaciones</h4>

      {/* Switch accesible */}
      <button
        type="button"
        role="switch"
        aria-checked={notificationsEnabled}
        onClick={toggleNotifications}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out 
          ${notificationsEnabled ? "bg-green-500" : "bg-gray-300"}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out 
            ${notificationsEnabled ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>

    <p className="text-xs text-gray-600">
      Estado: {notificationsEnabled ? "Activadas (permiso concedido)" : "Desactivadas"}
    </p>
  </div>
)}

        </div>
      )}
    </div>
  );
}
