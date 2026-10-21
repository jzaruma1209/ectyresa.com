import { SITE_URL, WHATSAPP_NUMBER } from '../constants';
import { trackEvent } from '../lib/analytics';

const formatMoney = (value) => `$${(Number(value) || 0).toFixed(2)}`;

export function buildWhatsAppUrl(message) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Mensaje de pedido con lo que el vendedor necesita para cotizar sin repreguntar.
 * @param {object} product Producto mapeado por products.service.
 * @param {{ qty?: number, variant?: string }} [options]
 */
export function buildProductMessage(product, { qty = 1, variant } = {}) {
  const unitPrice = product?.finalPrice ?? product?.price;
  const lines = [
    'Hola ECTYRE, quiero pedir este producto:',
    `• ${product?.name || 'Producto'}`,
    product?.brand && `• Marca: ${product.brand}`,
    product?.measure && `• Medida: ${product.measure}`,
    variant && `• Opción: ${variant}`,
    unitPrice != null && `• Precio web: ${formatMoney(unitPrice)} c/u`,
    `• Cantidad: ${qty}`,
    product?.id != null && `• Enlace: ${SITE_URL}/product/${product.id}`,
  ];
  return lines.filter(Boolean).join('\n');
}

/**
 * Registra el clic en la medición (evento `whatsapp_click`).
 * @param {string} source Dónde se tocó el botón (tarjeta, ficha_producto, boton_flotante…).
 * @param {object} [product]
 * @param {number} [qty]
 */
export function trackWhatsAppClick(source, product, qty = 1) {
  const unitPrice = Number(product?.finalPrice ?? product?.price) || 0;
  trackEvent('whatsapp_click', {
    source,
    ...(product && {
      item_id: String(product.id ?? ''),
      item_name: product.name,
      currency: 'USD',
      value: unitPrice * qty,
    }),
  });
}

/** Abre WhatsApp con el mensaje y registra el clic. */
export function openWhatsApp({ message, source, product, qty = 1 }) {
  trackWhatsAppClick(source, product, qty);
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}
