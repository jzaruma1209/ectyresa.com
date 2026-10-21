# Tareas del proyecto

_Última actualización: 2026-10-21_

Releer antes de numerar. No reutilizar IDs ni borrar historial.

## En curso
- **T-03** · Conectar productos destacados del inicio — criterio actualizado por el usuario el 2026-10-21: incluir productos activos en oferta o marcados como destacados, grupos de cuatro con relleno aleatorio real, tarjeta compartida compacta y animación conservada. Versión anterior b0c7251 subida; corrección local de selección validada con pruebas Node, ESLint y build; pendiente de publicación y comprobación visual.

## Pendientes
- **T-04** · Porcentaje dinámico en la banda promocional de las tarjetas — prioridad: media · registrada el 2026-10-21 a pedido del usuario. Hoy la banda superior de las tarjetas (logo de marca con el descuento) es una imagen estática (`imagenPromocion` → `sash` en TireCard.jsx) con el porcentaje dibujado, que no coincide con el descuento real: Nankang muestra "-15%" en la imagen y -7% real ($75 → $70). Criterio de finalización: la banda muestra el porcentaje calculado del descuento real del producto (descuentoPorcentaje, o precio anterior frente a precio) y cambia al editarlo en el panel; sin descuento no muestra porcentaje; conserva el logo de marca y el diseño en tarjetas compactas y normales; ESLint y build correctos; verificado en el navegador.

Los pendientes del historial de septiembre necesitan revisión antes de incorporarse.

## Bloqueadas
Ninguna.

## Mejoras (ideas, no aprobadas)
Ninguna registrada.

## Hechas
- **2026-10-16** · T-02 Habilitar logo y banner para todas las marcas — MarcasPanel.jsx muestra y envía imágenes al crear/editar cualquier tipo; mantiene obligatoriedad de llantas. Evidencia: npm run build y ESLint del componente sin errores; publicado en www.ectyre.com (Vercel dpl_B6L4C7Zsvd7et1mhaDXhEpErbw8L, READY), HTTP 200 y bundle verificado; no se verificó subida real a Cloudinary.
- **2026-10-16** · T-01 Inicializar memoria compartida ECTYRE — documentación e historial conservados, archivos de memoria y punteros creados. Evidencia: verificar-memoria.mjs terminó con código 0 en raíz, frontend y backend.

## Descartadas
Ninguna.

