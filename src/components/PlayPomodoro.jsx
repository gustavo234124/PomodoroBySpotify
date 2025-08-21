import { useState, useEffect } from "react";


export default function PlayPomodoro({ onPlay, onPause, setFormattedTime, onStop }) {
  //constates para manejar el estado del tiempo
const [timeLeft, setTimeLeft] = useState(10);
const [isRunning, setIsRunning] = useState(false);

//constantes para manejo de botones
const handlePlay = () => {
  setIsRunning(true);
};

const handlePause = () => {
  setIsRunning(false);
};

//constantes para manejo de tiempo en minutos ys egundos
const minutes = Math.floor(timeLeft / 60);
const seconds = timeLeft % 60;
const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    if (isPlaying) {
      handlePause();
    onPause && onPause();
      } else {
              handlePlay();
      onPlay && onPlay();
    }
    setIsPlaying(!isPlaying);
  };

  //funcion para que elt eimpo se reduzca solo cuando isRunning sea true
useEffect(() => {
  let timer;
  if (isRunning) {
    timer = setInterval(() => {
      setTimeLeft((prev) => {
if (prev <= 1) {
  clearInterval(timer);
  setIsRunning(false);
  setIsPlaying(false);
  console.log("Pomodoro stopped");
  setFormattedTime("00:00");

  // ✅ Llamar onPause y onStop si existen
  onPause && onPause();
  onStop && onStop();

  // ✅ Tocar la alarma si existe
  if (typeof window !== "undefined" && window.pomodoroAlarm?.current) {
    const audio = window.pomodoroAlarm.current;
    audio.currentTime = 0;
    audio.play().catch((err) =>
      console.error("Error al reproducir alarma:", err)
    );
  }

  return 0;
}

        const updatedTime = prev - 1;
        const minutes = Math.floor(updatedTime / 60);
        const seconds = updatedTime % 60;
        const formatted = `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
        setFormattedTime(formatted);
        return updatedTime;
      });
    }, 1000);
  }
  return () => clearInterval(timer);
}, [isRunning]);

  return (
    <button
      onClick={handleClick}
      className="hover:scale-105 bg-gray-600 hover:bg-green-700 rounded-full transition-transform duration-200 p-2"
    >
      {isPlaying ? (
        // Ícono de pausa
        <svg xmlns="http://www.w3.org/2000/svg" width="146" height="139" viewBox="0 0 146 139" fill="none">
          <ellipse cx="73" cy="69.5" rx="73" ry="69.5" fill="transparent" fillOpacity="0.2415" />
          <g fill="white">
            <rect x="52" y="40" width="10" height="50" rx="2" />
            <rect x="84" y="40" width="10" height="50" rx="2" />
          </g>
        </svg>
      ) : (
        // Ícono de reproducir
        <svg xmlns="http://www.w3.org/2000/svg" width="146" height="139" viewBox="0 0 146 139" fill="none">
          <ellipse cx="73" cy="69.5" rx="73" ry="69.5" fill="transparent" fillOpacity="0.2415" />
          <path d="M60 50L60 89L95 69.5L60 50Z" fill="white" />
        </svg>
      )}
    </button>
  );
}
