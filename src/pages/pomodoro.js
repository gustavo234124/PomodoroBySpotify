import { useBackground } from "@/components/BackgroundContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SettingsMenu from "@/components/SettingsMenu";
import OpenMusic from "@/components/OpenMusic";
import PlayPomodoro from "@/components/PlayPomodoro";
import OpenTask from "@/components/OpenTask";
import FullScreenToggle from "@/components/FullScreenToggle";

export default function Pomodoro() {
  const router = useRouter();
  const { background } = useBackground();
  const isImage = background?.startsWith("/");
  const { token } = router.query;
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState("");
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    async function loadQuotes() {
      try {
        const res = await fetch("/frasesMotivadoras.json");
        const data = await res.json();
        setQuotes(data);
        setQuote(data[Math.floor(Math.random() * data.length)]);
      } catch (error) {
        console.error("Error cargando frases motivadoras:", error);
      }
    }
    loadQuotes();
  }, []);

  useEffect(() => {
    if (token) setAccessToken(token);
  }, [token]);

  useEffect(() => {
    if (!accessToken) return;
    async function fetchProfile() {
      try {
        const res = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Error fetching profile");
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("No se pudo obtener el perfil", error);
      }
    }
    fetchProfile();
  }, [accessToken]);

  // Muestra u oculta el botón de logout
  const handleProfileClick = () => {
    setShowLogout(v => !v);
  };

  
// Reemplaza esta función en tu Pomodoro.js:
const handleLogout = () => {
  // Navega al endpoint de logout en el servidor...
  window.location.href = "/api/auth/logout";
};
  return (
<div
    className={`h-screen flex flex-col items-center justify-center text-white p-4 relative transition-all duration-500 ${
      isImage ? "" : background
    }`}
    style={
      isImage
        ? {
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        : {}
    }
  >  
 <SettingsMenu />

      <p className="text-9xl font-bold text-white mb-6">30:50</p>
      <p className="text-lg text-gray-300 italic text-center max-w-md">{quote}</p>

      <div className="flex items-center justify-center gap-6 mt-10">
        <OpenMusic accessToken={accessToken} />
        <PlayPomodoro />
        <OpenTask />
      </div>

      {accessToken && profile && (
        <div className="absolute top-10 left-10 flex items-center gap-3">
          <div className="relative">
            <img
              src={profile.images?.[0]?.url}
              alt="Foto de perfil"
              className="w-12 h-12 rounded-full border border-white cursor-pointer"
              onClick={handleProfileClick}
            />
            {showLogout && (
              <button
                onClick={handleLogout}
                className="absolute mt-2 left-0 bg-red-500 text-white px-3 py-1 rounded shadow-md"
              >
                Cerrar sesión
              </button>
            )}
          </div>
          <p
            className="text-white font-medium cursor-pointer"
            onClick={handleProfileClick}
          >
            Hola {profile.display_name || "Usuario"}
          </p>
        </div>
      )}
      <div className="fixed bottom-4 right-4 z-50">
        <FullScreenToggle />
      </div>
    </div>
  );
}
