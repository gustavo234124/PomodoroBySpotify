import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ParticlesBackground from "@/components/ParticlesBackground";
import Link from "next/link";
import FullScreenToggle from "@/components/FullScreenToggle";


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


const [background, setBackground] = useState(null);

useEffect(() => {
  const storedBg = localStorage.getItem("bg-fondo");
  if (storedBg) {
    setBackground(storedBg);
  }
}, []);

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
  className="bg-[#1DB954] hover:bg-[#179443] text-white font-bold py-2 px-4 rounded flex items-center gap-[10px]"
  onClick={() => {
    window.location.href = "/api/auth/login"; // tu endpoint login
  }}
>
  Iniciar Sesión
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 168 168"
    fill="#FFFFFF"
    className="w-6 h-6"
  >
    <path d="M84 0C37.7 0 0 37.7 0 84s37.7 84 84 84 84-37.7 84-84-37.7-84-84-84zm38.8 121.2c-1.3 2-3.9 2.7-5.9 1.4-16.1-10-36.4-12.3-60.3-7.1-2.3.5-4.6-1-5-3.3-.5-2.3 1-4.6 3.3-5 26.4-6.2 48.9-3.5 67 8.2 2 1.3 2.7 3.9 1.4 5.8zm7.6-18.5c-1.6 2.5-4.9 3.3-7.4 1.7-18.4-11.8-46.4-15.2-68.3-8.7-2.8.8-5.8-.8-6.6-3.6-.8-2.8.8-5.8 3.6-6.6 25-7.3 57.3-3.6 79.1 9.7 2.4 1.5 3.2 4.8 1.6 7.5zm.2-18.7c-22.3-13.6-59.2-14.9-81.6-8.6-3.3 1-6.8-1-7.8-4.3-1-3.3 1-6.8 4.3-7.8 25-7.5 66-6.1 91.6 9.3 3.1 1.9 4.1 6 2.2 9.1-1.9 3.2-6 4.2-9.1 2.3z" />
  </svg>
</button>

  <Link href="/pomodoro" legacyBehavior>
            <a className="text-blue-500 underline py-5">Ahora no</a>
          </Link>

        </div>
         <div className="fixed bottom-4 right-4 z-50">
        <FullScreenToggle />
      </div>
      </div>

    );
  }

  return null; // Por si acaso
}
