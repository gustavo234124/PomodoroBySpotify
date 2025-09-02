import { useState, useEffect, useRef } from "react";
import { albumSongs } from "../data/songs.js";

function SongItem({ song, isSelected, onSelect }) {
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    const audio = new Audio(song.file);
    audio.addEventListener("loadedmetadata", () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60)
        .toString()
        .padStart(2, "0");
      setDuration(`${minutes}:${seconds}`);
    });
  }, [song.file]);

  return (
    <li
      className={`flex justify-between p-2 rounded cursor-pointer transition-colors ${
        isSelected
          ? "bg-black text-green-500 font-bold"
          : "hover:bg-gray-200 text-black"
      }`}
      onClick={() => onSelect(song)}
    >
      <span>{song.name}</span>
      <span>{duration || "..."}</span>
    </li>
  );
}

export default function OpenMusic({ accessToken }) {
  // --- SPOTIFY WEB PLAYBACK SDK ---
  useEffect(() => {
    if (!accessToken) return;

    // ✅ DEFINIR ESTA FUNCIÓN PRIMERO PARA CREAR EL REPRODUCTOR PERSONALIZADO MEDIANTE SDK 
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'TavoPomodoro Player',
        getOAuthToken: cb => cb(accessToken),
        volume: 0.5,
      });

      // Opcional: listeners para ready/error
      player.addListener('ready', ({ device_id }) => {
        console.log('✅ Spotify Player listo con device ID:', device_id);
        window.spotifyDeviceId = device_id;
      });

      player.addListener('initialization_error', e => console.error('🎧 init error', e));
      player.addListener('authentication_error', e => console.error('🔐 auth error', e));
      player.addListener('account_error', e => console.error('👤 account error', e));
      player.addListener('playback_error', e => console.error('⛔️ playback error', e));

      player.connect(); 
    };

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Limpieza
      if (window.Spotify) {
        window.onSpotifyWebPlaybackSDKReady = null;
      }
      document.body.removeChild(script);
    };
  }, [accessToken]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("predeterminada");
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState("naturaleza");
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleModal = () => setIsOpen(!isOpen);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Spotify playlists
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

useEffect(() => {
  if (!accessToken) return;

  const fetchPlaylists = async () => {
    try {
      const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      const likedRes = await fetch("https://api.spotify.com/v1/me/tracks?limit=50", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const likedData = await likedRes.json();
      const likedTracks = Array.isArray(likedData?.items)
        ? likedData.items.map(item => item.track)
        : [];

      const likedPlaylist = {
        id: "liked-songs",
        name: "Canciones que te gustan",
        image: "https://misc.scdn.co/liked-songs/liked-songs-640.png",
        tracks: likedTracks,
      };

      setSpotifyPlaylists([likedPlaylist, ...(data.items || [])]);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  fetchPlaylists();
}, [accessToken]);

  const fetchPlaylistTracks = async (playlistId) => {
    try {
      const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setPlaylistTracks(data.items.map(item => item.track));
    } catch (error) {
      console.error("Error al obtener canciones:", error);
    }
  };

  const handleSelectSpotifyPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    // Si es la playlist especial de "Me gusta", ya tenemos las canciones en playlist.tracks.items
    if (playlist.id === "liked-songs" && playlist.tracks && playlist.tracks.items) {
      setPlaylistTracks(playlist.tracks.items);
    } else {
      fetchPlaylistTracks(playlist.id);
    }
  };

  // Función para reproducir una canción en Spotify usando la Web API de Spotify
  const playTrackOnSpotify = async (trackUri) => {
    if (!accessToken) return;
    try {
      // Usar el device_id del Web Playback SDK si está disponible
      const deviceId = window.spotifyDeviceId;
      await fetch(
        `https://api.spotify.com/v1/me/player/play${deviceId ? `?device_id=${deviceId}` : ""}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: [trackUri],
          }),
        }
      );
    } catch (error) {
      console.error("Error reproduciendo canción en Spotify:", error);
    }
  };

  const handleSelectSpotifyTrack = (index) => {
    // Solo ejecuta la reproducción en Spotify si está activo el modo Spotify
    if (selectedOption === "spotify") {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      const song = playlistTracks[index];
      if (song && song.uri) {
        playTrackOnSpotify(song.uri);
      }
    }
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) =>
      prev === 0 ? playlistTracks.length - 1 : prev - 1
    );
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) =>
      prev === playlistTracks.length - 1 ? 0 : prev + 1
    );
  };
  // Song navigation states
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [audio, setAudio] = useState(null);

  // Ref for audio element and progress state
  const audioRef = useRef(null);

  // Avanzar automáticamente a la siguiente canción cuando termina la actual (loop)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      const currentAlbumSongs = albumSongs[selectedAlbum];
      const nextIndex = (currentSongIndex + 1) % currentAlbumSongs.length;
      setCurrentSongIndex(nextIndex);
      setIsPlaying(true); // Ensures autoplay of next song
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [selectedAlbum, currentSongIndex]);
  const [progress, setProgress] = useState(0);

  // Volume state and handler
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);

  // Helper to get the current song object
  const currentSong =
    albumSongs[selectedAlbum] && albumSongs[selectedAlbum][currentSongIndex];

  // Volume handler
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Sync progress bar with audio
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    const updateProgress = () => {
      const percentage = (audioEl.currentTime / audioEl.duration) * 100;
      setProgress(percentage || 0);
    };
    audioEl.addEventListener("timeupdate", updateProgress);
    return () => {
      audioEl.removeEventListener("timeupdate", updateProgress);
    };
  }, [currentSong]);

  // When album changes, reset song index to 0
  useEffect(() => {
    setCurrentSongIndex(0);
  }, [selectedAlbum]);

  // Play song when index or album changes (reuse <audio> element)
  useEffect(() => {
    if (!currentSong) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = currentSong.file;
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongIndex, selectedAlbum]);

  // Ensure audio plays/pauses explicitly when isPlaying or song changes
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSongIndex]);

  // Handlers for next/prev (circular navigation)
  const handlePrev = () => {
    const songs = albumSongs[selectedAlbum];
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
  };
  const handleNext = () => {
    const songs = albumSongs[selectedAlbum];
    setCurrentSongIndex((prevIndex) =>
      prevIndex === songs.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      {/* Botón que abre el bottom sheet */}
      <button
        onClick={toggleModal}
        className="bg-gray-600 hover:bg-green-700 p-3 rounded-full shadow-lg flex items-center justify-center"
      >
        {/* SVG de música */}
       <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 102 93"
         fill="transparent"
         className="w-10 h-10 sm:w-[50px] sm:h-[50px]"
       >
  <ellipse cx="51" cy="46.5" rx="51" ry="46.5" fill="transparent" fillOpacity="0.2415"/>
  <path d="M76 26.8447V55.4877C75.9995 57.6214 75.2344 59.6953 73.8235 61.3878C72.4126 63.0803 70.4346 64.2968 68.1963 64.8487C65.9581 65.4006 63.5846 65.257 61.444 64.4402C59.3033 63.6234 57.5152 62.1791 56.3569 60.3311C55.1985 58.4832 54.7347 56.3349 55.0374 54.2195C55.34 52.1041 56.3922 50.1398 58.0307 48.6311C59.6693 47.1225 61.8026 46.1538 64.0999 45.8754C66.3972 45.5969 68.7301 46.0243 70.7368 47.0911V36.5402L44.4208 40.5774V57.911C44.4208 58.0564 44.4076 58.1969 44.3813 58.3326C44.5703 60.1961 44.0845 62.0647 42.9999 63.6474C41.9152 65.2302 40.2924 66.4381 38.3845 67.083C36.4765 67.7279 34.3905 67.7736 32.4514 67.213C30.5123 66.6523 28.829 65.5168 27.6639 63.9833C26.4987 62.4499 25.917 60.6046 26.0095 58.735C26.1021 56.8654 26.8635 55.0765 28.1753 53.647C29.4871 52.2174 31.2755 51.2276 33.2619 50.8316C35.2484 50.4356 37.3212 50.6558 39.1576 51.4578V30.8843C39.1574 29.737 39.5993 28.6269 40.4045 27.7514C41.2097 26.876 42.3261 26.2919 43.555 26.1032L69.871 22.066C70.6249 21.9503 71.397 21.9871 72.1339 22.1739C72.8707 22.3607 73.5546 22.693 74.1378 23.1478C74.7211 23.6025 75.1898 24.1688 75.5114 24.8073C75.833 25.4457 75.9997 26.1409 76 26.8447ZM35.2102 55.4877C34.1633 55.4877 33.1592 55.8707 32.419 56.5524C31.6787 57.234 31.2628 58.1586 31.2628 59.1226C31.2628 60.0866 31.6787 61.0112 32.419 61.6929C33.1592 62.3745 34.1633 62.7575 35.2102 62.7575C36.2571 62.7575 37.2612 62.3745 38.0014 61.6929C38.7417 61.0112 39.1576 60.0866 39.1576 59.1226C39.1576 58.1586 38.7417 57.234 38.0014 56.5524C37.2612 55.8707 36.2571 55.4877 35.2102 55.4877ZM65.4736 50.6412C64.0777 50.6412 62.739 51.1518 61.752 52.0607C60.7649 52.9696 60.2104 54.2023 60.2104 55.4877C60.2104 56.7731 60.7649 58.0058 61.752 58.9147C62.739 59.8236 64.0777 60.3342 65.4736 60.3342C66.8695 60.3342 68.2082 59.8236 69.1952 58.9147C70.1823 58.0058 70.7368 56.7731 70.7368 55.4877C70.7368 54.2023 70.1823 52.9696 69.1952 52.0607C68.2082 51.1518 66.8695 50.6412 65.4736 50.6412ZM70.7368 26.8447L44.4208 30.8843V35.6654L70.7368 31.6258V26.8447Z" fill="white"/>
</svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleModal}
        />
      )}

      {/* Bottom sheet responsivo */}
      <div
        className={
          `
          fixed bottom-0 left-1/2 transform -translate-x-1/2
          w-full max-w-[700px] px-8 bg-gray-400 text-black p-6
          rounded-t-xl shadow-lg z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `
      }
      >
        {/* Botón cerrar */}
        <button
          onClick={toggleModal}
          className="absolute top-4 right-4 text-red-500 text-xl font-bold"
        >
          ×
        </button>


        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setSelectedOption("spotify")}
            className={`border-2 px-6 py-2 rounded-full font-bold ${
              selectedOption === "spotify"
                ? "bg-white text-black border-black"
                : "bg-gray-200 text-gray-500 border-gray-400"
            }`}
          >
            Musica de Spotify
          </button>
          <button
            onClick={() => setSelectedOption("predeterminada")}
            className={`px-6 py-2 rounded-full font-bold ${
              selectedOption === "predeterminada"
                ? "bg-gray-700 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
             recomendada
          </button>
        </div>

        {/* Spotify playlists carousel above album cards */}
        {selectedOption === "spotify" && (
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4">
            {spotifyPlaylists.length === 0 ? (
              <p className="text-white text-center col-span-full w-full">
                No se encontraron playlists o aún se están cargando.
              </p>
            ) : (
              spotifyPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="min-w-[140px] flex-shrink-0 bg-white rounded-xl overflow-hidden shadow hover:scale-105 transition cursor-pointer"
                  onClick={() => {
                    handleSelectSpotifyPlaylist(playlist);
                  }}
                >
                  <img
                    src={playlist.image || (playlist.images && playlist.images[0]?.url)}
                    alt={playlist.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2 text-sm font-bold truncate text-center text-black">
                    {playlist.name}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="hidden sm:grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {selectedOption === "predeterminada" && (
            <>
              <div
                className="bg-red-600 rounded-2xl p-4 flex flex-col items-center cursor-pointer"
                onClick={() => setSelectedAlbum("naturaleza")}
              >
                <img src="/naturaleza.webp" alt="Naturaleza" className="rounded-2xl w-24 h-24 object-cover mb-2" />
                <span className="text-white font-bold">Naturaleza</span>
              </div>
              <div
                className="bg-purple-600 rounded-2xl p-4 flex flex-col items-center cursor-pointer"
                onClick={() => setSelectedAlbum("instrumental")}
              >
                <img src="/instrumental.webp" alt="Instrumental" className="rounded-2xl w-24 h-24 object-cover mb-2" />
                <span className="text-white font-bold">Instrumental</span>
              </div>
              <div
                className="bg-blue-600 rounded-2xl p-4 flex flex-col items-center cursor-pointer"
                onClick={() => setSelectedAlbum("concentracion")}
              >
                <img src="/concentracion.webp" alt="Concentracion" className="rounded-2xl w-24 h-24 object-cover mb-2" />
                <span className="text-white font-bold">Concentracion</span>
              </div>
            </>
          )}
        </div>

        {selectedOption === "spotify" && (
          <div className="bg-yellow-500 rounded-3xl p-4 flex flex-col sm:flex-row gap-4">
            {/* Portada de playlist seleccionada */}
            <img
              src={
                selectedPlaylist?.images?.[0]?.url || "/default-playlist.jpg"
              }
              alt={selectedPlaylist?.name || "Playlist"}
              className="w-[220px] h-[110px] sm:max-w-[200px] sm:h-auto object-cover rounded-3xl mx-auto cursor-pointer"
            />
            {/* Contenido de la playlist seleccionada */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 flex-1 flex flex-col justify-between mt-2 sm:mt-0">
              <div className="max-h-[250px] overflow-y-auto pr-1">
                <ul className="text-black font-bold mb-4">
                  {playlistTracks.map((track, index) => (
                    <li
                      key={track.id}
                      className={`flex justify-between p-2 rounded cursor-pointer transition-colors ${
                        currentTrackIndex === index
                          ? "bg-black text-green-500 font-bold"
                          : "hover:bg-gray-200 text-black"
                      }`}
                      onClick={() => handleSelectSpotifyTrack(index)}
                    >
                      <span>{track.name}</span>
                      <span>
                        {Math.floor(track.duration_ms / 60000)}:
                        {(Math.floor((track.duration_ms % 60000) / 1000))
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="h-2 bg-gray-400 rounded-full mb-4 relative">
                  <div
                    className="h-full bg-blue-600 rounded-full absolute top-0 left-0 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                  <div
                    className="w-4 h-4 bg-blue-600 rounded-full absolute top-[-4px] transition-all duration-200"
                    style={{ left: `calc(${progress}% - 8px)` }}
                  />
                </div>
                <div className="flex justify-around items-center text-black">
                  <button onClick={handlePrevTrack}>⏮️</button>
                  <button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? "⏸️" : "▶️"}
                  </button>
                  <button onClick={handleNextTrack}>⏭️</button>
                </div>
              </div>
            </div>
          </div>
        )}

      {selectedOption !== "spotify" && (
          <div className="bg-yellow-600 p-4 rounded-3xl flex flex-col sm:flex-row gap-4">
            <img
              src={
                selectedOption === "predeterminada"
                  ? `/${selectedAlbum}.webp`
                  : `/${selectedAlbum}.webp`
              }
              alt="Album"
              className="w-[220px] h-[110px] sm:max-w-[200px] sm:h-auto object-cover rounded-3xl mx-auto cursor-pointer"
              onClick={() => setIsSubModalOpen(true)}
            />
            <div className="bg-gray-100 rounded-3xl p-4 sm:p-6 flex-1 flex flex-col justify-between mt-2 sm:mt-0">
              <div className="max-h-[250px] overflow-y-auto pr-1">
                <ul className="text-black font-bold mb-4">
                  {albumSongs[selectedAlbum]?.map((song, index) => (
                    <SongItem
                      key={index}
                      song={song}
                      isSelected={currentSongIndex === index}
                        onSelect={() => {
                          if (audioRef.current) {
                            audioRef.current.pause();
                            audioRef.current.src = song.file;
                            audioRef.current.volume = volume;
                            audioRef.current.play();
                          }
                          setCurrentSongIndex(index);
                          setIsPlaying(true);
                        }}
                    />
                  ))}
                </ul>
              </div>
              <div>
                <div className="h-2 bg-gray-400 rounded-full mb-4 relative">
                  <div
                    className="h-full bg-blue-600 rounded-full absolute top-0 left-0 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                  <div
                    className="w-4 h-4 bg-blue-600 rounded-full absolute top-[-4px] transition-all duration-200"
                    style={{ left: `calc(${progress}% - 8px)` }}
                  />
                </div>
                <div className="flex justify-around items-center text-black">
                  <div className="relative flex flex-col items-center">
                    {/* Slider visible al hacer clic */}
                    {showVolumeSlider && (
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="absolute bottom-[40px] h-24 w-2 appearance-none bg-gray-300 rounded-lg"
                        style={{
                          writingMode: 'vertical-lr',
                          direction: 'rtl',
                          WebkitAppearance: 'slider-vertical',
                        }}
                      />
                    )}
                    {/* Botón con SVG de sonido */}
                    <button onClick={() => setShowVolumeSlider(!showVolumeSlider)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 46 46"
                        fill="none"
                        className="w-6 h-6 sm:w-8 sm:h-8"
                      >
                        <path d="M8.41634 11.5417V34.4583H0.0830078V11.5417H8.41634ZM12.583 35.9375L29.2497 45.3125V0.6875L12.583 10.0625V35.9375ZM42.9601 14.2083L41.7059 12.5437L38.3809 15.0563L39.6351 16.7187C41.0016 18.5279 41.7406 20.7335 41.7399 23.0007C41.7391 25.2679 40.9987 27.473 39.6309 29.2812L38.3747 30.9417L41.6976 33.4542L42.9538 31.7938C44.8687 29.2623 45.9054 26.1752 45.9066 23.001C45.9077 19.8269 44.8732 16.7391 42.9601 14.2062" fill="black"/>
                      </svg>
                    </button>
                  </div>
                  <button onClick={handlePrev}><svg xmlns="http://www.w3.org/2000/svg" width="37" height="38" viewBox="0 0 37 38" fill="none">
  <path d="M1.56278 0.000240326C1.97718 0.000240326 2.37461 0.16486 2.66763 0.457886C2.96066 0.750912 3.12528 1.14834 3.12528 1.56274L3.12528 35.9377C3.12528 36.3521 2.96066 36.7496 2.66763 37.0426C2.37461 37.3356 1.97718 37.5002 1.56278 37.5002C1.14838 37.5002 0.750954 37.3356 0.457928 37.0426C0.164902 36.7496 0.000282288 36.3521 0.000282288 35.9377L0.000282288 1.56274C-0.00252151 1.35677 0.0359802 1.15234 0.11351 0.961498C0.19104 0.77066 0.306026 0.597298 0.451679 0.451645C0.597332 0.305988 0.770702 0.191002 0.961536 0.113472C1.15237 0.0359383 1.35682 -0.00255966 1.56278 0.000240326ZM8.64612 19.9773C8.62739 19.2513 8.77761 18.5309 9.08492 17.8729C9.39223 17.2149 9.84823 16.6373 10.4169 16.1857L29.3961 1.41483C30.0753 0.900242 30.8815 0.581493 31.7294 0.498158H32.2086C32.9299 0.480106 33.6448 0.637383 34.2919 0.95649C35.0625 1.33254 35.7121 1.91718 36.1669 2.64399C36.6199 3.3684 36.8582 4.20633 36.8544 5.06066L36.8544 32.4565C36.8522 33.2781 36.6291 34.084 36.2086 34.7898C35.7752 35.4915 35.1644 36.0664 34.4378 36.4565C33.714 36.8477 32.8975 37.035 32.0756 36.9983C31.2537 36.9616 30.4572 36.7023 29.7711 36.2482L10.7711 23.5815C10.1669 23.1836 9.66695 22.6482 9.31278 22.019C8.93894 21.3976 8.71099 20.6996 8.64612 19.9773Z" fill="black"/>
</svg></button>
                  <button
                    className="text-3xl"
                    onClick={() => {
                      if (audioRef.current) {
                        if (isPlaying) {
                          audioRef.current.pause();
                        } else {
                          audioRef.current.play();
                        }
                        setIsPlaying(prev => !prev);
                      }
                    }}
                  >
                    {isPlaying ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 50 50"
                        fill="none"
                        className="w-8 h-8 sm:w-12 sm:h-12"
                      >
                        <path d="M29.1667 39.5832V10.4165H37.5V39.5832H29.1667ZM12.5 39.5832V10.4165H20.8333V39.5832H12.5Z" fill="green"/>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 50 64"
                        fill="none"
                        className="w-8 h-8 sm:w-12 sm:h-12"
                      >
                        <path d="M0 0V64L50 32L0 0Z" fill="black"/>
                      </svg>
                    )}
                  </button>
                  <button onClick={handleNext}><svg xmlns="http://www.w3.org/2000/svg" width="37" height="38" viewBox="0 0 37 38" fill="none">
  <path d="M35.2917 37.5C34.8773 37.5 34.4799 37.3354 34.1869 37.0424C33.8938 36.7493 33.7292 36.3519 33.7292 35.9375V1.5625C33.7292 1.1481 33.8938 0.750671 34.1869 0.457646C34.4799 0.16462 34.8773 0 35.2917 0C35.7061 0 36.1035 0.16462 36.3966 0.457646C36.6896 0.750671 36.8542 1.1481 36.8542 1.5625V35.9375C36.857 36.1435 36.8185 36.3479 36.741 36.5387C36.6635 36.7296 36.5485 36.9029 36.4028 37.0486C36.2572 37.1943 36.0838 37.3092 35.893 37.3868C35.7021 37.4643 35.4977 37.5028 35.2917 37.5ZM28.2084 17.5229C28.2271 18.2489 28.0769 18.9693 27.7696 19.6273C27.4623 20.2853 27.0063 20.8629 26.4375 21.3146L7.45838 36.0854C6.77921 36.6 5.97296 36.9188 5.12504 37.0021H4.64588C3.92458 37.0201 3.20967 36.8629 2.56254 36.5438C1.79201 36.1677 1.1424 35.5831 0.687544 34.8563C0.234631 34.1318 -0.0037423 33.2939 4.44236e-05 32.4396V5.04375C0.00229432 4.22215 0.225354 3.41625 0.645878 2.71042C1.07926 2.00876 1.6901 1.43385 2.41671 1.04375C3.14049 0.652522 3.95695 0.465253 4.77888 0.501947C5.60081 0.53864 6.39734 0.797917 7.08338 1.25208L26.0834 13.9188C26.6875 14.3167 27.1875 14.8521 27.5417 15.4813C27.9156 16.1026 28.1435 16.8007 28.2084 17.5229Z" fill="black"/>
</svg></button>
                </div>
              </div>
              {/* Hidden audio element for playback */}
              {currentSong && (
                <audio
                  ref={audioRef}
                  src={currentSong.file}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  // Remove onEnded, handled by effect above
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submodal solo para móviles */}
      {isSubModalOpen && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white p-4 overflow-y-auto h-[95vh] rounded-t-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Explorar álbumes</h3>
            <button onClick={() => setIsSubModalOpen(false)} className="text-red-500 text-xl font-bold">×</button>
          </div>
          <div className="flex flex-col gap-4">
            <div
              className="bg-purple-500 rounded-2xl p-4 flex flex-col items-center cursor-pointer"
              onClick={() => {
                setSelectedAlbum("instrumental");
                setIsSubModalOpen(false);
              }}
            >
              <img src="/instrumental.webp" alt="Instrumental" className="rounded-2xl w-[210px] h-[110px] object-cover mb-2" />
              <span className="text-white font-bold">Instrumental</span>
            </div>
            <div
              className="bg-red-500 rounded-2xl p-4 flex flex-col items-center cursor-pointer"
              onClick={() => {
                setSelectedAlbum("naturaleza");
                setIsSubModalOpen(false);
              }}
            >
              <img src="/naturaleza.webp" alt="Naturaleza" className="rounded-2xl w-[210px] h-[110px] object-cover mb-2" />
              <span className="text-white font-bold">Naturaleza</span>
            </div>
            <div
              className="bg-blue-500 rounded-2xl p-4 flex flex-col items-center cursor-pointer"
              onClick={() => {
                setSelectedAlbum("concentracion");
                setIsSubModalOpen(false);
              }}
            >
              <img src="/concentracion.webp" alt="Concentracion" className="rounded-2xl w-[210px] h-[110px] object-cover mb-2" />
              <span className="text-white font-bold">Concentracion</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
