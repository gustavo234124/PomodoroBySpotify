import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function Home() {
  const router = useRouter();
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
        router.push({
          pathname: "/pomodoro",
          query: { token: refreshData.access_token },
        });
      } else {
        setToken(null);
      }
    } else {
      setToken(data.access_token);
      router.push({
        pathname: "/pomodoro",
        query: { token: data.access_token },
      });
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
      <div className="h-screen flex items-center justify-center bg-zinc-900 text-white">
        <p className="text-lg animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (!token) {
    // Aquí va tu UI de login normal (botón, etc)
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <ParticlesBackground />
        <div className="backdrop-blur-lg bg-white/10 rounded-xl p-8 shadow-lg w-full max-w-[800px] flex flex-col items-center justify-center mx-4
          sm:w-[80vw]
          xs:w-[98vw]">
          <p className="text-white text-3xl font-bold text-center">
            Bienvenido a PomodoroBySpotify
          </p>
          <img 
            src="/iconanimation.gif" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full max-w-xs mx-auto"
          />
          <p className="text-white text-2xl font-bold text-center py-5">
            Conéctate para sincronizar tus playlist favoritas
          </p>
          <button
            className="bg-[#1DB954] hover:bg-[#179443] text-white font-bold py-2 px-4 rounded flex items-center gap-[15px]"
            onClick={() => {
              window.location.href = "/api/auth/login"; // tu endpoint login
            }}
          >
            Iniciar Sesión
            {/* svg aquí */}
          </button>
        </div>
      </div>
    );
  }

  return null; // Por si acaso
}
