# Orden 04 — URLs SEO de productos: diseño y procedimiento de publicación

_Estado: implementado y probado en local el 2026-10-27. **Sin commit, sin push, sin despliegue.** Ramas de trabajo: `seo/orden-04-urls` (backend y frontend, creadas desde `main`). Las ramas `seo/urls-productos` y `seo/metadatos` se conservan intactas._

## Diseño
- **Formato:** `/product/{id}-{slug}`. El id numérico va primero: cualquier URL vieja, slug viejo o incorrecto se resuelve por el id.
- **Slug estable:** columna `productos.slug` (nullable). Se genera al crear el producto (o la primera vez que se edita si aún no tiene) y **no cambia** al editar el nombre.
- **Fuente única de verdad:** el backend. `GET /productos` devuelve `slug` y `ruta`; la tienda usa `ruta` tal cual (no recalcula). Sitemap, redirecciones, WhatsApp y MCP usan la misma `ruta`.
- **Datos contradictorios:** si el nombre trae una medida distinta a la registrada, no se genera slug (producto 3: nombre 185/60R14, medida 185/65R14). Queda en `/product/3` hasta que el propietario corrija el dato; no se modificó nada. Al corregirlo y guardar el producto en el panel, recibe slug automáticamente.
- **Redirección HTTP real (308):** función de Vercel `api/product.js`, enlazada por `vercel.json` (`/product/:p` → `/api/product`). Consulta `GET /api/v1/seo/producto/:parametro` del backend y responde:

| Caso | Código |
|---|---|
| `/product/5`, slug viejo/incorrecto, `/product/5/` | 308 → URL canónica (conserva `utm_*`, `fbclid`…) |
| URL canónica (incluye agotados) | 200 (sirve el index.html de la SPA) |
| id inexistente o parámetro inválido | 404 + `X-Robots-Tag: noindex` + meta noindex |
| producto desactivado | 410 + noindex |
| API del backend caída o lenta (>4 s) | 503 + `Retry-After: 120` |

- **Sitemap:** `/sitemap.xml` (backend dinámico, caché CDN 1 h): URLs canónicas de productos activos + marcas + inicio + ubicación; sin `priority` ni `changefreq`; `lastmod` = última modificación real; sin duplicados.
- **Metadatos:** título/descripción/canonical/H1 por producto con datos reales. Llantas mencionan "La Troncal, Cañar" de forma natural; otros productos no. Si el nombre y la medida se contradicen, no se usa ninguna medida adicional. Inexistente/desactivado: `noindex`. Fallo de red: mensaje con "Reintentar", sin `noindex`.
- **Cambios de `seo/metadatos` integrados:** título y descripción por defecto con La Troncal (commit 5c56dd7, aplicado con cherry-pick sin conflictos).

## Archivos modificados / nuevos
Backend (`backend/apiectyre`): `src/utils/slug.js` (nuevo), `src/migrations/20261028000001-add-slug-to-productos.js` (nuevo), `src/services/seoProducto.services.js` (nuevo), `scripts/generar-slugs.js` (nuevo), `scripts/seo-replica-local.js` (nuevo, solo pruebas), `src/tests/seo-producto.test.js` (nuevo), `src/models/producto.js`, `src/services/producto.services.js`, `src/utils/productoHelpers.js`, `src/routes/producto.router.js`, `src/routes/seo.router.js`, `src/controllers/seo.controllers.js`, `src/tests/testMigrate.js` (aislado), `mcp/src/format.js`.
Frontend (`frontend/ectyrepage`): `api/product.js` (nuevo), `vercel.json`, `src/utils/productSlug.js` (nuevo), `src/services/products.service.js`, `src/hooks/useProducts.js`, `src/pages/shop/ProductDetailsPage.jsx`, `src/components/products/TireCard.jsx`, `src/components/products/VehicleSearcher.jsx`, `src/utils/whatsapp.js`, `index.html` y `src/hooks/usePageMeta.js` (cherry-pick de metadatos).

## Procedimiento de publicación (cuando el propietario lo autorice)
Orden obligatorio: **respaldo → migración → backend → slugs → verificar API → frontend → verificar → Search Console**. El backend nuevo es compatible con el frontend viejo (solo agrega campos), por eso va primero.

1. **Respaldo de producción** (con la `DATABASE_URL` de producción, desde una terminal segura; no guardar la URL en archivos):
   `pg_dump "$DATABASE_URL" -Fc -f respaldo_prod_antes_slug.dump` y comprobar con `pg_restore --list respaldo_prod_antes_slug.dump`. Guardar copia fuera de la PC.
2. **Migración** (agrega columna nullable e índice, no borra nada; el código actual de producción la ignora): `NODE_ENV=production npx sequelize-cli db:migrate` con la `DATABASE_URL` de producción. Verificar: `select column_name from information_schema.columns where table_name='productos' and column_name='slug';`
3. **Backend: merge de `seo/orden-04-urls`** a `main` del backend y push (Vercel despliega solo). Migrar ANTES de este push: el código nuevo consulta la columna.
4. **Generar slugs:** primero simulación `node scripts/generar-slugs.js` (con DATABASE_URL de producción) y revisar el listado: se esperan 8 productos con slug (el 3 ya fue corregido a 185/65R14 el 2026-10-27 y verificado por GET en producción: nombre, descripción y medida coinciden). Si aparece alguno "EXCLUIDO", detenerse y revisar el dato. Luego `node scripts/generar-slugs.js --aplicar`. Es idempotente y no modifica `updated_at` (el `lastmod` no cambia).
5. **Verificar backend:** `GET /api/v1/productos/5` → `ruta` = `/product/5-nankang-ultra-sport-ns-2-175-50-r13-72v`; `GET /api/v1/seo/producto/5` → `estado: redirect`; `GET /api/v1/seo/sitemap.xml` con slugs.
6. **Frontend: merge de `seo/orden-04-urls`** a `main` del frontend y push. Incluye `vercel.json` y `api/product.js`. En Vercel (proyecto de la tienda) definir, si se desea, la variable `API_BASE_URL` (por defecto usa `https://ectyre-backend.vercel.app/api/v1`).
7. **Verificaciones posteriores** (`curl -I`): `/product/5` → 308 al canónico; `/product/5?utm_source=whatsapp` conserva el parámetro; `/product/99999` → 404; `/product/3` → 200; canónico → 200 sin redirección; `/sitemap.xml` → 200 con 16 URLs canónicas. Abrir en navegador una ficha, el catálogo, la búsqueda por medida y por vehículo, el botón de WhatsApp y un pedido de prueba.
8. **Caché del sitemap:** dura 1 h en el CDN; esperar o forzar redeploy del backend. Reenviar el sitemap en Search Console y pedir inspección de 2–3 fichas.
9. **Pendiente del propietario:** confirmar la medida real del producto 3 (185/60R14 vs 185/65R14), corregirla en el panel y guardar el producto: obtiene su slug y `/product/3` redirigirá a la nueva URL.

## Reversión (sin destruir URLs ya publicadas)
- **Frontend:** revertir el merge (o redeploy del commit anterior en Vercel). Quita la función y vuelven los rewrites previos. Las URLs `/product/{id}-{slug}` ya indexadas **siguen funcionando** porque la SPA acepta `id-slug` (parseProductId) y el backend acepta `id-slug`.
- **Backend:** revertir el merge. La columna `slug` puede quedarse (es inocua). No ejecutar `db:migrate:undo` salvo necesidad real: elimina la columna y los slugs (se regeneran con `generar-slugs.js`).
- **Datos:** restaurar `respaldo_prod_antes_slug.dump` solo en caso extremo; la migración no altera datos existentes.
- Si la función de Vercel diera problemas, basta quitar la regla `/product/:p` de `vercel.json`: la SPA mantiene el redireccionamiento en el navegador como respaldo.

## Limitaciones conocidas
- La función de Vercel se probó en un **emulador local** de las reglas de `vercel.json`, no en Vercel (no se desplegó nada). Hay que verificar tras publicar: que `req.query.p` llegue con el parámetro de ruta y la barra final `/product/5/`.
- Las rutas desconocidas (p. ej. `/foo`) siguen respondiendo 200 con la página 404 de la SPA (soft 404 fuera del alcance de esta orden).
- Los metadatos de producto se inyectan al renderizar la SPA (Google los ve; WhatsApp/Facebook solo leen los de `index.html`).
- Un slug largo se corta a 70 caracteres en el límite de palabra (p. ej. producto 8 termina en `...gl-4-1-4`); es cosmético y se puede editar en la BD antes de indexarse.
- `npm test` (pretest) ya no deshace migraciones; 2 pruebas de carrito fallan igual en `main` (anteriores a esta orden).
