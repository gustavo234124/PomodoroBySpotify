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


          {/* Placeholder para los demás */}
          {activeModal !== "alarma" && (
            <p className="text-sm">
              Aquí pondrás la configuración de <strong>{activeModal}</strong>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
