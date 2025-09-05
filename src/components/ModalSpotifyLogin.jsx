// components/ModalSpotifyLogin.jsx
import React from "react";

export default function ModalSpotifyLogin({ isOpen, onClose, onLogin }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-gray-100 p-8 rounded-lg max-w-md w-full text-center">
        <h2 id="modal-title" className="text-xl font-bold mb-4">Conéctate con Spotify</h2>
        <p className="mb-6">Escucha tus playlists favoritas directamente aquí.</p>
        <button
          onClick={onLogin}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center gap-2"
        >
          Iniciar sesión
          <img src="/spotify-icon.svg" className="w-5 h-5" alt="Spotify" />
        </button>
        <button
          className="mt-4 text-sm text-gray-500 underline"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
