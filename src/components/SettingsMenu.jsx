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
        <div className="absolute top-0 right-0 bg-white text-black rounded-bl-4xl  shadow-lg w-100 p-4 flex flex-col gap-2">
          <button onClick={() => openSubModal("alarma")} className="hover:bg-gray-100 rounded p-2">Alarma</button>
          <button onClick={() => openSubModal("reinicio")} className="hover:bg-gray-100 rounded p-2">Reinicio Automático</button>
          <button onClick={() => openSubModal("fondo")} className="hover:bg-gray-100 rounded p-2">Fondo</button>
          <button onClick={() => openSubModal("tiempo")} className="hover:bg-gray-100 rounded p-2">Tiempo de Concentración</button>
          <button onClick={() => openSubModal("notificaciones")} className="hover:bg-gray-100 rounded p-2">Notificaciones</button>
        </div>
      )}

      {/* Sub-modal dinámico */}
      {activeModal && (
        <div className="absolute top-0 right-0 bg-white text-black rounded-bl-4xl  shadow-lg w-100 p-4">
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
