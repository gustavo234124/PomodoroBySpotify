import React, { useEffect } from 'react';

export default function ParticlesBackground() {
  useEffect(() => {
    if (window.particlesJS && typeof window.particlesJS.load === 'function') {
      window.particlesJS.load('particles-js', '/particles-config.json', () => {
        console.log('particles.js cargado');
      });
    } else {
      console.warn('particles.js no está disponible');
    }
  }, []);

  return (
    <div
      id="particles-js"
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
}