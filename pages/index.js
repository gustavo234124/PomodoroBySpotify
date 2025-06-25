import { useEffect, useState } from "react";

export default function Home() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    if (accessToken) {
      setToken(accessToken);
    }
  }, []);

  if (token) {
    return (
      <div className="h-screen flex items-center justify-center bg-green-900 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">🎉 ¡Sesión iniciada!</h1>
          <p className="mb-2">Tu token de acceso es:</p>
          <code className="break-words text-xs bg-black/20 px-4 py-2 rounded">{token}</code>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Bienvenido a PomodoroBySpotify</h1>

        <button
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded font-semibold"
          onClick={() => (window.location.href = "/api/auth/login")}
        >
          Iniciar sesión con Spotify
        </button>
      </div>
    </div>
  );
}
