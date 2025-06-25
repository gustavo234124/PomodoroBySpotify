// components/ParticlesBackground.js
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: {
          color: { value: "#000000" },
        },
        particles: {
          color: { value: "#00ffff" },
          links: {
            enable: true,
            color: "#00ffff",
            distance: 150,
            opacity: 0.5,
            width: 1,
          },
          move: {
            enable: true,
            direction: "top",        // 👈 Movimiento base hacia arriba
            random: true,            // 👈 Movimiento aleatorio
            straight: false,         // 👈 Que no se vayan en línea recta
            speed: 5,              // 👈 Velocidad moderada
            outModes: {
              default: "out",        // 👈 Salen de la pantalla y no regresan
            },
          },
          number: {
            value: 200,
            density: {
              enable: true,
              area: 800,
            },
          },
          opacity: {
            value: 0.7,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 2, max: 3 },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",     // 👈 Efecto de repulsión al pasar el mouse
            },
            onClick: {
              enable: true,
              mode: "push",        // 👈 Agrega partículas al hacer click
            },
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
            push: {
              quantity: 4,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
