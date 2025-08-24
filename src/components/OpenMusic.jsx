import { useState } from "react";

export default function OpenMusic({ accessToken }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("predeterminada");
  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botón que abre el bottom sheet */}
      <button
        onClick={toggleModal}
        className="bg-gray-600 hover:bg-green-700 p-3 rounded-full shadow-lg flex items-center justify-center"
      >
        {/* SVG de música */}
       <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 102 93" fill="transparent">
  <ellipse cx="51" cy="46.5" rx="51" ry="46.5" fill="transparent" fill-opacity="0.2415"/>
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
          w-full max-w-[700px] px-8 bg-white text-black p-6
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

        <h2 className="text-xl font-bold mb-4">Opciones de música</h2>

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
            Musica recomendada
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {selectedOption === "predeterminada" ? (
            <>
              <div className="bg-red-600 rounded-2xl p-4 flex flex-col items-center">
                <img src="/naturaleza.jpeg" alt="Naturaleza" className="rounded-2xl w-24 h-24 object-cover mb-2" />
                <span className="text-white font-bold">Naturaleza</span>
              </div>
              <div className="bg-purple-600 rounded-2xl p-4 flex flex-col items-center">
                <img src="/instrumental.jpg" alt="Instrumental" className="rounded-2xl w-24 h-24 object-cover mb-2" />
                <span className="text-white font-bold">Instrumental</span>
              </div>
              <div className="bg-blue-600 rounded-2xl p-4 flex flex-col items-center">
                <img src="/concentracion.jpeg" alt="Concentracion" className="rounded-2xl w-24 h-24 object-cover mb-2" />
                <span className="text-white font-bold">Concentracion</span>
              </div>
            </>
          ) : (
            <>
              <div className="bg-green-600 rounded-2xl p-4 flex flex-col items-center">
                <img src="/musica/naturaleza.jpg" alt="Naturaleza" className="rounded-2xl w-24 h-24 object-cover mb-2" />
                <span className="text-white font-bold">Naturaleza</span>
              </div>
              <div className="bg-orange-500 rounded-2xl p-4 flex flex-col items-center">
                <img src="/musica/instrumental.jpg" alt="Instrumental" className="rounded-2xl w-24 h-24 object-cover mb-2" />
                <span className="text-white font-bold">Instrumental</span>
              </div>
              <div className="bg-amber-800 rounded-2xl p-4 flex flex-col items-center">
                <img src="/musica/concentracion.jpg" alt="Concentracion" className="rounded-2xl w-24 h-24 object-cover mb-2" />
                <span className="text-white font-bold">Concentracion</span>
              </div>
            </>
          )}
        </div>

        <div className="bg-yellow-600 p-4 rounded-3xl flex gap-4">
          <img src="/musica/concentracion.jpg" alt="Album" className="w-48 h-48 object-cover rounded-3xl" />
          <div className="bg-gray-100 rounded-3xl p-6 flex-1 flex flex-col justify-between">
            <ul className="text-white font-bold mb-4">
              <li className="flex justify-between"><span>Cancion uno</span><span>3:42</span></li>
              <li className="flex justify-between"><span>Cancion dos</span><span>3:42</span></li>
              <li className="flex justify-between"><span>Cancion tres</span><span>3:42</span></li>
              <li className="flex justify-between"><span>Cancion cuatro</span><span>3:42</span></li>
              <li className="flex justify-between"><span>Cancion cinco</span><span>3:42</span></li>
            </ul>
            <div>
              <div className="h-2 bg-gray-400 rounded-full mb-4 relative">
                <div className="w-2/3 h-full bg-blue-600 rounded-full absolute top-0 left-0" />
                <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-[-4px] left-[66%]" />
              </div>
              <div className="flex justify-around items-center text-black">
                <button>🔈</button>
                <button>⏮️</button>
                <button className="text-3xl">▶️</button>
                <button>⏭️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
