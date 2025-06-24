// pages/index.js
export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Bienvenido a PomodoroBySpotify</h1>
        <a
          href="/api/auth/login"
          className="bg-green-500 px-6 py-3 rounded-lg text-xl hover:bg-green-600 transition duration-300"
        >
          Iniciar sesión con Spotify
        </a>
      </div>
    </div>
  );
}
