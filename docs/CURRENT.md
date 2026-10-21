# Estado actual

_Última actualización: 2026-10-21 (America/Guayaquil) · por: Codex_

## Tarea activa
T-03 — Ajustar la altura de las tarjetas de productos destacados.

## Avance comprobado
- Causa: buildFeaturedGroups seleccionaba solo featured; enOferta se mapea a onSale y no participaba en la selección.
- Corrección publicada: productos activos con featured o onSale forman la base; se conservan grupos de cuatro y relleno aleatorio.
- La casilla de destacado manual sigue funcionando independientemente de En oferta.
- Ajuste local solicitado: solo el grid de destacados reduce la proporción del área de imagen de 16/10 a 2/1; conserva textos, controles y las tarjetas de otras secciones.

## Validación
- Pruebas Node correctas: oferta sin destacado, destacados manuales, inactivos, vacíos, grupos de 1/2/3/4/5/7/8/9 productos, sin mutaciones.
- ESLint de featuredGroups.js y npm run build correctos.
- Ajuste de altura: ESLint de HeroSearchOptions.jsx y compilación Vite correctos; pendiente de revisión visual.
- Auditoría de memoria: 0 errores; aviso opcional de integración con Gemini.

## Estado Git y producción
- Remotos cambiados por petición del usuario: jzaruma1209/ectyresa.com y jzaruma1209/ectyre-backend.
- Frontend b0c7251 y backend d5dc8d1 subidos y verificados contra main remoto.
- Capturas del usuario muestran ambos commits Ready en Production; no se realizó comprobación funcional en vivo.
- Corrección de ofertas publicada: commit 57461eb en main y Vercel dpl_CxLvtaAswUQT8w71rFZmstMFeWrt Ready en Production, con alias www.ectyre.com. HTTP 200 comprobado. Backend sin modificaciones.

## Próxima acción
Publicar el ajuste de altura cuando el usuario lo solicite y comprobarlo visualmente. Cambio visual y memoria sin commit ni push.
