import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Pomodoro() {
  const router = useRouter();
  const { token } = router.query;
  const [accessToken, setAccessToken] = useState(null);
  const [musicOption, setMusicOption] = useState("predeterminada");
  const [profile, setProfile] = useState(null); // Aquí guardaremos la info del usuario

  useEffect(() => {
    if (token) setAccessToken(token);
  }, [token]);

  // Cuando tenemos el accessToken, hacemos fetch para obtener perfil
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

  const handleMusicOptionChange = (option) => {
    setMusicOption(option);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-900 text-white p-4">
      <h1 className="text-3xl mb-6">PomodoroBySpotify</h1>

      {accessToken ? (
        <>
          {profile && (
            <div className="mb-6 flex items-center gap-4">
              {profile.images?.[0]?.url && (
                <img
                  src={profile.images[0].url}
                  alt="Foto de perfil"
                  className="w-12 h-12 rounded-full"
                />
              )}
              <p>Hola, {profile.display_name || "Usuario"}</p>
            </div>
          )}

          <p className="break-words max-w-md mb-6">
            <strong>Access Token:</strong> {accessToken}
          </p>

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
          <p className="mb-6">Estás usando música predeterminada sin iniciar sesión.</p>
          <p className="opacity-50 italic mb-6">La opción de Spotify no está disponible sin login.</p>
          <p>Aquí va la música predeterminada</p>
        </>
      )}
    </div>
  );
}
