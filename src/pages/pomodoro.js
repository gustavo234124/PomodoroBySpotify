import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Pomodoro() {
  const router = useRouter();
  const { token } = router.query;
  const [accessToken, setAccessToken] = useState(null);
  const [musicOption, setMusicOption] = useState("predeterminada"); // por default

  useEffect(() => {
    if (token) setAccessToken(token);
  }, [token]);

  // Handler para cambiar opción música
  const handleMusicOptionChange = (option) => {
    setMusicOption(option);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-900 text-white p-4">
      <h1 className="text-3xl mb-6">Pomodoro 🎧⏱️</h1>

      {accessToken ? (
        <>
          <p className="break-words max-w-md mb-6">
            <strong>Access Token:</strong> {accessToken}
          </p>

          {/* Selector de música con login */}
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => handleMusicOptionChange("spotify")}
              className={`px-4 py-2 rounded ${
                musicOption === "spotify" ? "bg-green-600" : "bg-gray-700"
              }`}
            >
              Música Spotify
            </button>
            <button
              onClick={() => handleMusicOptionChange("predeterminada")}
              className={`px-4 py-2 rounded ${
                musicOption === "predeterminada" ? "bg-green-600" : "bg-gray-700"
              }`}
            >
              Música Predeterminada
            </button>
          </div>

          {musicOption === "spotify" ? (
            <p>Aquí iría el reproductor o lógica para música Spotify</p>
          ) : (
            <p>Aquí iría la música predeterminada</p>
          )}
        </>
      ) : (
        <>
          {/* Sin login: sólo música predeterminada */}
          <p className="mb-6">Estás usando música predeterminada sin iniciar sesión.</p>
          <p className="opacity-50 italic mb-6">La opción de Spotify no está disponible sin login.</p>

          {/* Mostrar música predeterminada */}
          <p>Aquí va la música predeterminada</p>
        </>
      )}
    </div>
  );
}
