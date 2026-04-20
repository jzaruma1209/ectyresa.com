/**
 * AppLoader — Pantalla de carga global de Ectyre
 *
 * Se utiliza como `fallback` del <Suspense> raíz mientras se descargan
 * los chunks de ruta generados por React.lazy().
 *
 * Diseño: Logo + spinner con los colores de la marca Ectyre.
 * CSS puro, sin dependencias externas.
 */

import './AppLoader.css';

const AppLoader = () => {
  return (
    <div className="app-loader" role="status" aria-label="Cargando Ectyre…">
      {/* Logo / Wordmark */}
      <div className="app-loader__brand">
        <svg
          className="app-loader__logo-icon"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Llanta simplificada */}
          <circle cx="20" cy="20" r="18" stroke="#1A1A1A" strokeWidth="3" fill="none" />
          <circle cx="20" cy="20" r="10" stroke="#1A1A1A" strokeWidth="2" fill="none" />
          <circle cx="20" cy="20" r="4" fill="#E60000" />
          {/* Radios */}
          <line x1="20" y1="10" x2="20" y2="2"  stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="30" x2="20" y2="38" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="20" x2="2"  y2="20" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="20" x2="38" y2="20" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="app-loader__wordmark">ECTYRE</span>
      </div>

      {/* Barra de progreso animada */}
      <div className="app-loader__bar-track" aria-hidden="true">
        <div className="app-loader__bar-fill" />
      </div>

      <p className="app-loader__text">Cargando…</p>
    </div>
  );
};

export default AppLoader;
