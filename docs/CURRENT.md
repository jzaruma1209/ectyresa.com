# Estado actual

_Última actualización: 2026-10-21 (America/Guayaquil) · por: Claude Code_

## Tarea activa
Vender por WhatsApp: medición, un solo botón de pedido y SEO básico.

## Avance comprobado
- WhatsApp centralizado en constants (WHATSAPP_NUMBER = 593999601748, SITE_URL). utils/whatsapp.js arma el mensaje (nombre, marca, medida, precio web, cantidad, enlace) y registra el clic.
- Botón "Pedir" con ícono de WhatsApp en tarjetas; "Pedir por WhatsApp · $total" en la ficha de producto. El carrito ya no se enlaza en el Header (desktop y móvil); /cart y /checkout siguen existiendo.
- Botón flotante y "Cotiza por WhatsApp" (búsqueda sin resultados) con mensaje propio y medición.
- lib/analytics.js: GA4 solo si existe VITE_GA_MEASUREMENT_ID; page_view por ruta de la tienda (PublicLayout, sin admin) y evento whatsapp_click (source, item_id, item_name, value en USD).
- hooks/usePageMeta.js: título, descripción, robots, canonical y og:* por página. Ficha de producto con datos reales; búsqueda y páginas de cuenta con noindex.
- index.html: Open Graph y Twitter estáticos con /og-image.jpg (1200×630); preconnect corregido a ectyre-backend.vercel.app.
- robots.txt y sitemap dinámico: backend GET /api/v1/seo/sitemap.xml (productos activos y marcas, caché 1 h) publicado en /sitemap.xml por un rewrite de vercel.json.

## Validación
- Vista previa local con API de producción y GA falso: mensajes correctos en tarjeta, ficha y botón flotante; eventos page_view (también al navegar dentro de la SPA) y whatsapp_click; títulos y canonical correctos; robots.txt y og-image servidos; móvil revisado.
- ESLint sin errores nuevos (siguen los previos: AppSidebar `Icon`, `err` sin uso en OrdersPage y OrderDetailPage, y el aviso de dependencias en ProductDetailsPage). Build correcto. Sitemap probado con datos simulados.

## Estado Git y producción
- Backend f7dc7a6 subido. Frontend: commit de esta tarea subido a main.

## Próxima acción
Usuario: crear la propiedad GA4, cargar VITE_GA_MEASUREMENT_ID en Vercel y volver a desplegar; marcar whatsapp_click como evento clave; dar de alta el sitio en Google Search Console y enviar el sitemap; crear el Perfil de Empresa en Google.
Revisar con el usuario: la ficha muestra calificación 4.8 (214 opiniones) fija y "IVA incluido", mientras las tarjetas dicen "+ IVA".
Pendientes de prioridad media: re-render del Header en cada scroll, Leaflet en main.jsx y /placeholder-tire.png inexistente.
