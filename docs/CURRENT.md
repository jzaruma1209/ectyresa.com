# Estado actual

_Última actualización: 2026-10-21 (America/Guayaquil) · por: Codex_

## Tarea activa
T-03 — Incluir ofertas en productos destacados de la página principal.

## Avance comprobado
- Causa: buildFeaturedGroups seleccionaba solo featured; enOferta se mapea a onSale y no participaba en la selección.
- Corrección local: productos activos con featured o onSale forman la base; se conservan grupos de cuatro y relleno aleatorio.
- La casilla de destacado manual sigue funcionando independientemente de En oferta.

## Validación
- Pruebas Node correctas: oferta sin destacado, destacados manuales, inactivos, vacíos, grupos de 1/2/3/4/5/7/8/9 productos, sin mutaciones.
- ESLint de featuredGroups.js y npm run build correctos.
- Auditoría de memoria: 0 errores; aviso opcional de integración con Gemini.

## Estado Git y producción
- Remotos cambiados por petición del usuario: jzaruma1209/ectyresa.com y jzaruma1209/ectyre-backend.
- Frontend b0c7251 y backend d5dc8d1 subidos y verificados contra main remoto.
- Capturas del usuario muestran ambos commits Ready en Production; no se realizó comprobación funcional en vivo.
- Corrección de ofertas y actualización de memoria locales, sin commit ni push. Backend sin modificaciones locales.

## Próxima acción
Publicar la corrección cuando el usuario solicite la subida; después comprobar una oferta real en el inicio.

