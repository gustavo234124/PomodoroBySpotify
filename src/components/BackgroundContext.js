import { createContext, useContext, useEffect, useState } from "react";

const BackgroundContext = createContext();

export const useBackground = () => useContext(BackgroundContext);

export const BackgroundProvider = ({ children }) => {
  const [background, setBackground] = useState(null);

  useEffect(() => {
    const storedBg = localStorage.getItem("bg-fondo");
    if (storedBg) setBackground(storedBg);
  }, []);

  const changeBackground = (value) => {
    localStorage.setItem("bg-fondo", value);
    setBackground(value);
  };

  return (
    <BackgroundContext.Provider value={{ background, changeBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
};