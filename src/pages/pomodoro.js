import { useBackground } from "@/components/BackgroundContext";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
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
  const [formattedTime, setFormattedTime] = useState("01:00");
  const [alarmSound, setAlarmSound] = useState("sound1");
  const [alarmVolume, setAlarmVolume] = useState(50);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAlarm = localStorage.getItem("selected-alarm");
      if (storedAlarm) {
        setAlarmSound(storedAlarm);
        console.log("🎵 Alarma cargada al montar:", storedAlarm);
      }
      // Ensure selectedSound is loaded safely in browser
      const selectedSound = localStorage.getItem("selected-alarm") || "sound1";
      // You can use selectedSound here if needed
    }
  }, []);

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

  const audioRef = useRef(null);

useEffect(() => {
    if (!audioRef.current) return;

    const handleStorageChange = () => {
      const selectedSound = window.localStorage.getItem("selected-alarm");
      console.log("⏰ Alarma actualizada a:", selectedSound);
      setAlarmSound(selectedSound || "sound1"); // 🟢 Actualiza el estado también
      console.log("🔁 Estado de alarmSound actualizado a:", selectedSound);

      const soundPath =
        selectedSound === "sound2"
          ? "/sounds/sonidodos.mp3"
          : "/sounds/sonidouno.mp3";

      if (audioRef.current) {
        audioRef.current.src = soundPath;
        audioRef.current.load();
        window.pomodoroAlarm = audioRef; // Asegurar referencia global
      }
    };

    // Al montar, cargar alarma
    handleStorageChange();

    // Escuchar cambios en el localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  
  // Reemplaza esta función en tu Pomodoro.js:
  const handleLogout = () => {
    // Navega al endpoint de logout en el servidor...
    window.location.href = "/api/auth/logout";
  };

  const handlePlay = () => {
    console.log("Pomodoro started");
  };

  const handlePause = () => {
    console.log("Pomodoro paused");
  };
const handleStop = () => {
  console.log("Pomodoro stopped (handleStop)");
  if (window.pomodoroAlarm?.current && window.pomodoroAlarm.current.src) {
    try {
      window.pomodoroAlarm.current.currentTime = 0;
      window.pomodoroAlarm.current.play();
    } catch (error) {
      console.error("No se pudo reproducir la alarma:", error);
    }
  } else {
    console.warn("No hay alarma configurada o el audio no está listo.");
  }
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
 <SettingsMenu audioRef={audioRef} />
        <p className="text-9xl font-bold text-white mb-6">{formattedTime}</p>

      <p className="text-lg text-gray-300 italic text-center max-w-md">{quote}</p>

      <div className="flex items-center justify-center gap-6 mt-10">
        <OpenMusic accessToken={accessToken} />
        <PlayPomodoro
          setFormattedTime={setFormattedTime}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop} // <-- agrega esta línea
            alarmSound={alarmSound}

        />        <OpenTask />
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
      <audio ref={audioRef} hidden preload="auto" />
    </div>
  );
}
