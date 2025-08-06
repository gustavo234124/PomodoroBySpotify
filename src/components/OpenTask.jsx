// components/OpenTask.jsx
import { useState } from "react";

export default function OpenTask() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botón que abre el panel */}
      <button
        onClick={toggleModal}
        className="p-0 bg-gray-600 border-none hover:bg-green-700 rounded-full"
      >
        {/* SVG circular con checkbox */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="70"
          height="70"
          viewBox="0 0 80 80"
        >
          <circle cx="40" cy="40" r="40" fill="#C1C1BD" fillOpacity="0.24" />
          <g fill="#FFFFFF">
            <rect x="20" y="22" width="6" height="6" rx="1" />
            <rect x="32" y="24" width="24" height="2" rx="1" />
            <rect x="20" y="34" width="6" height="6" rx="1" />
            <rect x="32" y="36" width="24" height="2" rx="1" />
            <rect x="20" y="46" width="6" height="6" rx="1" />
            <rect x="32" y="48" width="24" height="2" rx="1" />
          </g>
        </svg>
      </button>

      {/* Capa de fondo */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleModal}
        />
      )}

      {/* Panel lateral */}
      <div
        className={`
          fixed top-0 right-0
          h-full w-80            /* ajusta ancho aquí */
          bg-white text-black p-6
          z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Cerrar */}
        <button
          onClick={toggleModal}
          className="absolute top-4 right-4 text-red-500 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4">Tus tareas</h2>
        <p className="text-gray-700 mb-6">
          Aquí puedes mostrar, agregar o editar tus tareas pendientes.
        </p>
        {/* ... contenido de tus tareas ... */}
      </div>
    </>
  );
}
