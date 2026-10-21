# Estado actual

_Última actualización: 2026-10-21 (America/Guayaquil) · por: Claude Code_

## Tarea activa
Optimización de carga (prioridad alta de la auditoría del 2026-10-21): imágenes, loader de la home y caché.

## Avance comprobado
- Imágenes Cloudinary: utils/cloudinaryImage.js agrega f_auto,q_auto,c_limit,w_N; se usa en tarjetas, marcas, buscador por vehículo, carrito, catálogo de marca y ficha de producto. Llanta 165 KB → 39 KB; logo de marca 26 KB → 4 KB.
- /public: WebP redimensionados (fondo_auto 1.66 MB → 45 KB, logo 2 287 KB → 8 KB, infollanta 284 KB → 12 KB, 1.webp 3 KB, llanta1/2) y favicon.png de 3 KB. Los PNG originales se conservan.
- Home sin loader bloqueante: se quitaron useHomeReadiness y el AppLoader de HomePage; quedan los skeletons y el botón Reintentar. AppLoader sigue como fallback de Suspense y de AdminRoute.
- Caché: vercel.json del frontend con /assets inmutable (1 año) e imágenes 1 día + SWR; la reescritura SPA ya no cubre /assets. Backend: middleware cachePublica (s-maxage=60, SWR 300, solo GET 200) en /productos y /promociones.
- T-03 (altura de destacados) sigue pendiente de revisión visual por el usuario.

## Validación
- ESLint sin errores nuevos (quedan dos avisos previos: AppSidebar `Icon` sin uso y dependencias de useEffect en ProductDetailsPage). npm run build correcto. El backend carga app.js; middleware probado: GET 200 con caché, 500 y POST sin caché.
- Vista previa local contra la API de producción (1280×720): imágenes de la home ~200 KB frente a 3.3 MB, sin imágenes rotas, ficha de producto correcta. El CLS (~0.13) ya existía en producción (0.148): lo causa el pie de página al montar la ruta.

## Estado Git y producción
- Backend 4344bae subido a main.
- Frontend: commit de esta tarea subido a main (ver git log).

## Próxima acción
Verificar en producción: cabeceras de caché (x-vercel-cache HIT en /productos y Vary: Origin para ectyre.com y www) y la carga de la home. Pendientes de prioridad media: re-render del Header en cada scroll, Leaflet en main.jsx, preconnect a onrender.com y /placeholder-tire.png inexistente.
