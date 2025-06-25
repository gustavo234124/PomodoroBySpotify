import { useEffect, useState } from "react";
import ParticlesBackground from "../components/ParticlesBackground";

export default function Home() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchToken() {
    setLoading(true);
    const res = await fetch("/api/auth/get_token");
    if (!res.ok) {
      setToken(null);
      setLoading(false);
      return;
    }
    const data = await res.json();
    const expiresAt = parseInt(data.expires_at, 10);
    const now = Date.now();

    if (expiresAt - now < 5 * 60 * 1000) {
      const refreshRes = await fetch("/api/auth/refresh_token");
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setToken(refreshData.access_token);
      } else {
        setToken(null);
      }
    } else {
      setToken(data.access_token);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchToken();
    const interval = setInterval(fetchToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center text-white relative">
        <ParticlesBackground />
        <div className="text-center z-10">
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

  return (
    <div className="h-screen flex items-center justify-center bg-green-900 text-white">
      <div className="text-center max-w-md px-4">
        <h1 className="text-3xl font-bold mb-4">🎉 ¡Sesión iniciada!</h1>
        <p className="mb-2 break-words">Tu token de acceso es:</p>
        <code className="text-xs bg-black/20 px-4 py-2 rounded break-all">{token}</code>
      </div>
    </div>
  );
}
