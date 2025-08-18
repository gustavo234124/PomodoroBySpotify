// src/components/FullScreenToggle.jsx
import { useState } from "react";
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from "@heroicons/react/24/outline"; // Opcional si usas Heroicons

export default function FullScreenToggle() {
  const [isFull, setIsFull] = useState(false);

  const toggleFullScreen = () => {
    const el = document.documentElement;

    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFull(true));
    } else {
      document.exitFullscreen().then(() => setIsFull(false));
    }
  };

  return (
    <button
      onClick={toggleFullScreen}
      className="fixed bottom-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-md shadow-md sm:bottom-6 sm:right-6"
      title={isFull ? "Salir de pantalla completa" : "Pantalla completa"}
    >
      {isFull ? (
        <ArrowsPointingInIcon className="h-6 w-6" />
      ) : (
        <ArrowsPointingOutIcon className="h-6 w-6" />
      )}
    </button>
  );
}