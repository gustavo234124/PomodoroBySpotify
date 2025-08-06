import { useState } from "react";

export default function SettingsMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // "alarma" | "reinicio" | "fondo" | "tiempo" | "notificaciones"

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setActiveModal(null); // Cierra cualquier sub-modal si abrimos/cerramos el principal
  };

  const openSubModal = (type) => {
    setActiveModal(type);
    setMenuOpen(false); // Opcional: cierra el menú principal al abrir un sub-modal
  };

  const closeSubModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      {/* Botón del menú (icono hamburguesa) */}
      <button
        onClick={toggleMenu}
        className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition"
      >
        {/* SVG de hamburguesa */}
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
    {/* Botón cerrar */}
    <button
      onClick={() => setMenuOpen(false)}
      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
    >
      ×
    </button>

    {/* Fila 1: Alarma + Reinicio Automático */}
    <div className="flex justify-between gap-4">
      <button
        onClick={() => openSubModal("alarma")}
        className="bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl p-4 w-32 flex items-center justify-center font-medium"
      >
        Alarma
      </button>
      <button
        onClick={() => openSubModal("reinicio")}
        className="bg-blue-500 hover:bg-blue-400 text-white rounded-xl p-4 w-32 flex items-center justify-center text-center font-medium"
      >
        Reinicio <br /> automático
      </button>
    </div>

    {/* Fila 2: Fondo (centrado) */}
    <div className="flex justify-center">
      <button
        onClick={() => openSubModal("fondo")}
        className="bg-red-600 hover:bg-red-500 text-white rounded-xl p-4 w-32 text-center font-medium"
      >
        Fondo
      </button>
    </div>

    {/* Fila 3: Tiempo de concentración + Notificaciones */}
    <div className="flex justify-between gap-4">
      <button
        onClick={() => openSubModal("tiempo")}
        className="bg-amber-800 hover:bg-amber-700 text-white rounded-xl p-4 w-32 flex items-center justify-center text-center font-medium"
      >
        Tiempo de <br /> concentración
      </button>
      <button
        onClick={() => openSubModal("notificaciones")}
        className="bg-pink-400 hover:bg-pink-300 text-white rounded-xl p-4 w-32 flex items-center justify-center text-center font-medium"
      >
        Notificaciones
      </button>
    </div>
  </div>
)}


      {/* Sub-modal dinámico */}
      {activeModal && (
        <div className="absolute top-0 right-0 bg-white text-black rounded-bl-4xl  shadow-lg w-[320px] p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold capitalize">{activeModal}</h3>
            <button onClick={closeSubModal} className="text-red-500 font-bold">X</button>
          </div>
          <p className="text-sm">Aquí pondrás la configuración de <strong>{activeModal}</strong>.</p>
        </div>
      )}
    </div>
  );
}
