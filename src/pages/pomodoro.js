import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SettingsMenu from "@/components/SettingsMenu";
import OpenMusic from "@/components/OpenMusic";
import PlayPomodoro from "@/components/PlayPomodoro";
import OpenTask from "@/components/OpenTask";


export default function Pomodoro() {
  const router = useRouter();
  const { token } = router.query;
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState("");

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
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
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

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-900 text-white p-4 relative">
      {/* Menú de configuración */}
      <SettingsMenu />

      {/* Temporizador */}
      <p className="text-9xl font-bold text-white mb-6">30:50</p>

      {/* Frase motivadora */}
      <p className="text-lg text-gray-300 italic text-center max-w-md">
        {quote}
      </p>

      {/* Botones: Play y Música en línea */}
      <div className="flex items-center justify-center gap-6 mt-10">
        <OpenMusic accessToken={accessToken} />
        <PlayPomodoro />
        <OpenTask />
      </div>

      {/* Perfil si está logueado */}
      {accessToken && profile && (
        <div className="absolute top-10 left-10 flex items-center gap-3">
          {profile.images?.[0]?.url && (
            <img
              src={profile.images[0].url}
              alt="Foto de perfil"
              className="w-15 h-15 rounded-full border-1 border-white"
            />
          )}
          <p className="text-white font-medium">
            Hola {profile.display_name || "Usuario"}
          </p>
        </div>
      )}
    </div>
  );
}
