// Google Analytics 4. Solo se activa si existe VITE_GA_MEASUREMENT_ID (variable de entorno en Vercel);
// sin ese ID todas las funciones son inofensivas (desarrollo local, vistas previas).
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialized = false;

export function initAnalytics() {
  if (!MEASUREMENT_ID || initialized || typeof window === 'undefined') return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  // gtag espera el objeto `arguments`, no un arreglo.
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  // Las vistas de página se envían a mano en cada cambio de ruta (la tienda es una SPA).
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function trackPageView(path) {
  if (!initialized) return;
  window.gtag('event', 'page_view', { page_path: path, page_location: window.location.href });
}

/**
 * @param {string} name Nombre del evento en GA4 (snake_case).
 * @param {Record<string, unknown>} [params]
 */
export function trackEvent(name, params = {}) {
  if (!initialized) return;
  window.gtag('event', name, params);
}
