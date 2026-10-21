import { useEffect, useState } from 'react';

// Esperar solo el contenido inicial; nunca bloquear la tienda indefinidamente.
const MAX_WAIT_MS = 8000;

export default function useHomeReadiness(dataReady, heroRef) {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowLoader(false), MAX_WAIT_MS);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!dataReady || !showLoader) return;
    let cancelled = false;
    const images = Array.from(heroRef.current?.querySelectorAll('img') || []);
    const pendingImages = images.map((image) => {
      // Las tarjetas usan lazy: activar solo las imágenes del hero inicial.
      image.loading = 'eager';
      return image.decode();
    });
    Promise.allSettled([...pendingImages, document.fonts?.ready]).then(() => {
      if (!cancelled) setShowLoader(false);
    });
    return () => { cancelled = true; };
  }, [dataReady, heroRef, showLoader]);

  return showLoader;
}
