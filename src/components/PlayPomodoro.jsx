import { useState } from "react";

export default function PlayPomodoro({ onPlay, onPause }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    if (isPlaying) {
      onPause && onPause();
    } else {
      onPlay && onPlay();
    }
    setIsPlaying(!isPlaying);
  };

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
