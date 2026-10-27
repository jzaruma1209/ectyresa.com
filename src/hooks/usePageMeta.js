import { useEffect } from 'react';

import { SITE_NAME, SITE_URL } from '../constants';

// Valores por defecto: los mismos que index.html (lo que ven WhatsApp y Facebook al compartir).
export const DEFAULT_TITLE = 'ECTYRE S.A. | Llantas en La Troncal, Cañar';
export const DEFAULT_DESCRIPTION =
  'Compra llantas para autos, camionetas y otros vehículos en ECTYRE S.A., La Troncal, Cañar. Consulta marcas, medidas y disponibilidad. Atención en nuestro local y envíos a Ecuador, según cobertura.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * Título, descripción, canonical y etiquetas Open Graph de la página actual.
 * Google las lee al renderizar la SPA; las redes sociales solo leen las de index.html.
 * @param {{ title?: string, description?: string, image?: string, path?: string, noindex?: boolean }} [meta]
 */
export function usePageMeta({ title, description, image, path, noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const finalDescription = description || DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${path ?? window.location.pathname}`;

    document.title = fullTitle;
    setMeta('name', 'description', finalDescription);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', finalDescription);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image || DEFAULT_IMAGE);
    setCanonical(url);
  }, [title, description, image, path, noindex]);
}
