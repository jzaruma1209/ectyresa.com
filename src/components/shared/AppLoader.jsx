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
      <div className="app-loader__content">
        <img src="/2.png" alt="Ectyre Loader" className="app-loader__img" />
        <p className="app-loader__text">Cargando…</p>
      </div>
    </div>
  );
};

export default AppLoader;
