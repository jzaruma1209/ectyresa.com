/**
 * Ruta pública de un producto. La fuente única de verdad es el backend (`ruta` en GET /productos),
 * que arma /product/{id}-{slug} con el slug guardado en la BD. La tienda NO recalcula el slug
 * desde el nombre: así el enlace no cambia si se edita el nombre y coincide con sitemap y canonical.
 * Mientras un producto no tenga slug (o el backend aún no lo envíe) la ruta es /product/{id}.
 * @param {{ id: number|string, path?: string }} product
 * @returns {string}
 */
export function productPath(product) {
  return product?.path || `/product/${product?.id}`;
}

/**
 * Obtiene el id del parámetro de ruta: "8-nombre" y "8" devuelven "8".
 * @param {string} param
 * @returns {string}
 */
export function parseProductId(param) {
  const match = /^(\d+)(?:-|$)/.exec(param || '');
  return match ? match[1] : param;
}
