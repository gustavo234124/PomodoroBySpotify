import { useState } from "react";

export default function OpenMusic({ accessToken }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("predeterminada");
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState("naturaleza");
  const [isPlaying, setIsPlaying] = useState(false);
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
             recomendada
          </button>
        </div>

        <div className="hidden sm:grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {selectedOption === "predeterminada" ? (
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
          ) : (
            <>
              <div
                className="bg-green-600 rounded-2xl p-4 flex flex-col items-center cursor-pointer"
                onClick={() => setSelectedAlbum("naturaleza")}
              >
                <img src="/musica/naturaleza.webp" alt="Naturaleza" className="rounded-2xl w-24 h-24 object-cover mb-2" />
                <span className="text-white font-bold">Naturaleza</span>
              </div>
              <div
                className="bg-orange-500 rounded-2xl p-4 flex flex-col items-center cursor-pointer"
                onClick={() => setSelectedAlbum("instrumental")}
              >
                <img src="/instrumental.webp" alt="Instrumental" className="rounded-2xl w-24 h-24 object-cover mb-2" />
                <span className="text-white font-bold">Instrumental</span>
              </div>
              <div
                className="bg-amber-800 rounded-2xl p-4 flex flex-col items-center cursor-pointer"
                onClick={() => setSelectedAlbum("concentracion")}
              >
                <img src="/concentracion.webp" alt="Concentracion" className="rounded-2xl w-24 h-24 object-cover mb-2" />
                <span className="text-white font-bold">Concentracion</span>
              </div>
            </>
          )}
        </div>

        <div className="bg-yellow-600 p-4 rounded-3xl flex flex-col sm:flex-row gap-4">
          <img
            src={
              selectedOption === "predeterminada"
                ? `/${selectedAlbum}.webp`
                : `/${selectedAlbum}.webp`
            }
            alt="Album"
            className="w-full sm:max-w-[200px] h-auto object-cover rounded-3xl mx-auto cursor-pointer"
            onClick={() => setIsSubModalOpen(true)}
          />
          <div className="bg-gray-100 rounded-3xl p-4 sm:p-6 flex-1 flex flex-col justify-between mt-2 sm:mt-0">
            <ul className="text-black font-bold mb-4">
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
             
                <button><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50" fill="none">
  <path d="M10.4163 13.5417V36.4583H2.08301V13.5417H10.4163ZM14.583 37.9375L31.2497 47.3125V2.6875L14.583 12.0625V37.9375ZM44.9601 16.2083L43.7059 14.5437L40.3809 17.0563L41.6351 18.7187C43.0016 20.5279 43.7406 22.7335 43.7399 25.0007C43.7391 27.2679 42.9987 29.473 41.6309 31.2812L40.3747 32.9417L43.6976 35.4542L44.9538 33.7938C46.8687 31.2623 47.9054 28.1752 47.9066 25.001C47.9077 21.8269 46.8732 18.7391 44.9601 16.2062" fill="black"/>
  <path d="M39.1439 20.6022L37.8876 18.9397L34.5626 21.4501L35.8189 23.1126C36.229 23.6552 36.4509 24.3168 36.4509 24.997C36.4509 25.6772 36.229 26.3388 35.8189 26.8814L34.5605 28.5418L37.8835 31.0564L39.1397 29.3939C40.0968 28.1284 40.6151 26.5854 40.6158 24.9987C40.6166 23.4121 40.0998 21.8685 39.1439 20.6022Z" fill="black"/>
</svg></button>

                <button><svg xmlns="http://www.w3.org/2000/svg" width="25" height="30" viewBox="0 0 37 38" fill="none">
  <path d="M1.56278 0.00024128C1.97718 0.00024128 2.37461 0.16486 2.66763 0.457886C2.96066 0.750911 3.12528 1.14834 3.12528 1.56274L3.12528 35.9377C3.12528 36.3521 2.96066 36.7496 2.66763 37.0426C2.37461 37.3356 1.97718 37.5002 1.56278 37.5002C1.14838 37.5002 0.750952 37.3356 0.457927 37.0426C0.164901 36.7496 0.000282104 36.3521 0.000282104 35.9377L0.000282104 1.56274C-0.00252055 1.35678 0.0359805 1.15233 0.113511 0.961497C0.191042 0.77066 0.306026 0.597297 0.45168 0.451643C0.597333 0.30599 0.770701 0.191001 0.961538 0.11347C1.15238 0.0359396 1.35682 -0.00256137 1.56278 0.00024128ZM8.64612 19.9773C8.62739 19.2513 8.77761 18.5309 9.08492 17.8729C9.39223 17.2149 9.84823 16.6373 10.4169 16.1857L29.3961 1.41483C30.0753 0.900243 30.8815 0.581492 31.7294 0.498159H32.2086C32.9299 0.480104 33.6448 0.637383 34.2919 0.956491C35.0625 1.33254 35.7121 1.91718 36.1669 2.64399C36.6199 3.3684 36.8582 4.20633 36.8544 5.06066V32.4565C36.8522 33.2781 36.6291 34.084 36.2086 34.7898C35.7752 35.4915 35.1644 36.0664 34.4378 36.4565C33.714 36.8477 32.8975 37.035 32.0756 36.9983C31.2537 36.9616 30.4572 36.7023 29.7711 36.2482L10.7711 23.5815C10.1669 23.1836 9.66695 22.6482 9.31278 22.019C8.93894 21.3976 8.71099 20.6996 8.64612 19.9773Z" fill="black"/>
</svg></button>

                <button className="text-3xl" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 50 50" fill="none">
                      <path d="M29.1667 39.5832V10.4165H37.5V39.5832H29.1667ZM12.5 39.5832V10.4165H20.8333V39.5832H12.5Z" fill="green"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="45" viewBox="0 0 50 64" fill="none">
                      <path d="M0 0V64L50 32L0 0Z" fill="black"/>
                    </svg>
                  )}
                </button>



                <button><svg xmlns="http://www.w3.org/2000/svg" width="25" height="30" viewBox="0 0 37 38" fill="none">
  <path d="M35.2917 37.5C34.8773 37.5 34.4799 37.3354 34.1869 37.0424C33.8938 36.7493 33.7292 36.3519 33.7292 35.9375V1.5625C33.7292 1.1481 33.8938 0.750671 34.1869 0.457645C34.4799 0.16462 34.8773 0 35.2917 0C35.7061 0 36.1035 0.16462 36.3966 0.457645C36.6896 0.750671 36.8542 1.1481 36.8542 1.5625V35.9375C36.857 36.1435 36.8185 36.3479 36.741 36.5387C36.6635 36.7296 36.5485 36.9029 36.4028 37.0486C36.2572 37.1943 36.0838 37.3092 35.893 37.3868C35.7021 37.4643 35.4977 37.5028 35.2917 37.5ZM28.2084 17.5229C28.2271 18.2489 28.0769 18.9693 27.7696 19.6273C27.4623 20.2853 27.0063 20.8629 26.4375 21.3146L7.45838 36.0854C6.77921 36.6 5.97296 36.9188 5.12504 37.0021H4.64588C3.92458 37.0201 3.20967 36.8629 2.56254 36.5438C1.79201 36.1677 1.1424 35.5831 0.687544 34.8563C0.234631 34.1318 -0.0037423 33.2939 4.44236e-05 32.4396V5.04375C0.00229432 4.22215 0.225354 3.41625 0.645878 2.71042C1.07926 2.00876 1.6901 1.43385 2.41671 1.04375C3.14049 0.652522 3.95695 0.465253 4.77888 0.501947C5.60081 0.53864 6.39734 0.797917 7.08338 1.25208L26.0834 13.9188C26.6875 14.3167 27.1875 14.8521 27.5417 15.4813C27.9156 16.1026 28.1435 16.8007 28.2084 17.5229Z" fill="black"/>
</svg></button>
              </div>
            </div>
          </div>
        </div>
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
              <img src="/instrumental.webp" alt="Instrumental" className="rounded-2xl w-24 h-24 object-cover mb-2" />
              <span className="text-white font-bold">Instrumental</span>
            </div>
            <div
              className="bg-red-500 rounded-2xl p-4 flex flex-col items-center cursor-pointer"
              onClick={() => {
                setSelectedAlbum("naturaleza");
                setIsSubModalOpen(false);
              }}
            >
              <img src="/naturaleza.webp" alt="Naturaleza" className="rounded-2xl w-24 h-24 object-cover mb-2" />
              <span className="text-white font-bold">Naturaleza</span>
            </div>
            <div
              className="bg-blue-500 rounded-2xl p-4 flex flex-col items-center cursor-pointer"
              onClick={() => {
                setSelectedAlbum("concentracion");
                setIsSubModalOpen(false);
              }}
            >
              <img src="/concentracion.webp" alt="Concentracion" className="rounded-2xl w-24 h-24 object-cover mb-2" />
              <span className="text-white font-bold">Concentracion</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
