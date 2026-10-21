// Inserta transformaciones de Cloudinary (formato y calidad automáticos, ancho máximo)
// para no descargar la imagen original. Las URLs que no son de Cloudinary o que ya
// traen transformaciones se devuelven sin cambios.
const UPLOAD_SEGMENT = "/image/upload/";
const HAS_TRANSFORM = /^[a-z]{1,3}_[^/]+\//;

/**
 * @param {string} url URL de la imagen.
 * @param {number} [width] Ancho máximo en píxeles (usar ~2x el tamaño mostrado).
 * @returns {string}
 */
export function optimizeImage(url, width) {
  if (typeof url !== "string" || !url.includes("res.cloudinary.com")) return url;
  const index = url.indexOf(UPLOAD_SEGMENT);
  if (index === -1) return url;
  const start = index + UPLOAD_SEGMENT.length;
  const rest = url.slice(start);
  if (HAS_TRANSFORM.test(rest)) return url;
  const transform = ["f_auto", "q_auto", "c_limit", width && `w_${width}`].filter(Boolean).join(",");
  return `${url.slice(0, start)}${transform}/${rest}`;
}
