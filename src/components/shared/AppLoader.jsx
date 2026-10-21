/**
 * AppLoader — Pantalla de carga global de Ectyre
 *
 * Se utiliza como `fallback` del <Suspense> raíz mientras se descargan
 * los chunks de ruta generados por React.lazy().
 *
 * Diseño: Logo + spinner con los colores de la marca Ectyre.
 * CSS puro, sin dependencias externas.
 */

import { useEffect, useRef } from 'react';
import './AppLoader.css';

const AppLoader = () => {
  const loaderRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    loaderRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    <div ref={loaderRef} className="app-loader" role="status" aria-label="Cargando Ectyre…" tabIndex={-1}
      onKeyDown={(event) => { if (event.key === 'Tab') event.preventDefault(); }}>
      <div className="app-loader__content">
        <img src="/2.webp" alt="Ectyre Loader" className="app-loader__img" />
        <p className="app-loader__text">Cargando…</p>
      </div>
    </div>
  );
};

export default AppLoader;
