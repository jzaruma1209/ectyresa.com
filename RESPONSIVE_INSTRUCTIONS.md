# 📱 INSTRUCCIONES: Hacer Ectyre Responsivo (Mobile-First)

## CONTEXTO DEL PROYECTO
- **Framework:** React 19 + Vite 7
- **Repo:** `jzaruma1209/ectyresa.com`
- **URL producción:** https://ectyresa-com.vercel.app
- **Stack CSS:** Tailwind CSS 3 (principal) + CSS Modules (para componentes complejos)
- **UI Library:** shadcn/ui (Radix-based)
- **Estado:** Redux Toolkit (7 slices)
- **Routing:** React Router v7

## REGLA ABSOLUTA
> ❌ NO cambiar colores, tipografías, íconos ni funcionalidad.  
> ❌ NO reestructurar la lógica de componentes.  
> ✅ SOLO agregar/modificar reglas CSS con `@media` queries y ajustes de layout.

---

## PASO 0 — INVESTIGAR ANTES DE TOCAR NADA

Antes de escribir una sola línea de CSS, el agente debe:

1. **Listar todos los archivos** del proyecto con `tree src/` o explorando manualmente.
2. **Identificar el approach de estilos**:
   - **Tailwind CSS** es el approach principal — la mayoría de estilos están en clases JSX
   - Archivos CSS existentes: `src/index.css` (global + variables shadcn), `src/App.css`, `src/responsive.css` (media queries globales), y CSS modules por componente en `src/pages/styles/`, `src/features/*/styles/`, `src/components/*/styles/`
   - NO hay CSS-in-JS ni styled-components
3. **Identificar los componentes** clave que necesitan arreglo (ver Sección 1 más abajo).
4. **Verificar si ya existe un `meta viewport`** en `index.html`:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```
   Si NO existe, agregarlo. Sin esto, nada de lo demás funcionará en celular.

5. **Verificar los breakpoints actuales** — buscar en todos los CSS si ya hay `@media` queries definidas. Si las hay, no duplicarlas, sino modificarlas o complementarlas.
6. **Preferir Tailwind primero** — antes de escribir CSS manual, verificar si se puede lograr con clases utilitarias de Tailwind (ej. `flex-wrap`, `w-full`, `hidden lg:flex`, `grid-cols-1 md:grid-cols-2`). Usar CSS solo cuando Tailwind no sea suficiente.

---

## PASO 1 — COMPONENTES A ARREGLAR (identificados visualmente)

Estos son los componentes que visualmente se ven rotos en móvil. El agente debe encontrar el archivo correspondiente en `src/components/` o `src/pages/` y aplicar los arreglos de CSS descritos:

---

### 1.1 — TOP BAR (barra superior con "Envío a todo el Ecuador | Instalamos tus llantas")
**Problema:** En móvil se corta o se apila mal.  
**Arreglo:**
- En pantallas `<= 480px`: ocultar completamente esta barra (`display: none`) o mostrar solo un texto corto.
- Si se decide mostrar: usar `flex-direction: column`, `font-size: 11px`, `text-align: center`.

---

### 1.2 — NAVBAR PRINCIPAL (logo + buscador + botón BUSCAR + íconos + carrito)
**Problema:** En móvil, todos los elementos se apilan o se salen del viewport. El buscador queda truncado. El botón "BUSCAR" queda pegado al borde.  
**Arreglo:**
- Contenedor principal del navbar: `display: flex; flex-wrap: wrap; align-items: center;`
- En `<= 768px`:
  - Logo: mantenerlo a la izquierda, reducir tamaño si es necesario (`max-height: 40px`).
  - Buscador + botón BUSCAR: ocupar `100%` del ancho en una segunda línea (`flex: 1 1 100%; margin-top: 8px`).
  - Íconos de la derecha (chat, cuenta, carrito): mantenerlos en la misma línea del logo, alineados a la derecha.
  - El ícono de hamburguesa (≡) ya existe en móvil — asegurarse de que esté visible y funcional.
- En `<= 480px`:
  - Reducir padding del navbar a `8px 12px`.
  - El buscador debe tener `font-size: 13px`.

---

### 1.3 — SECCIÓN HERO / CONTENIDO PRINCIPAL (3 columnas: Productos Destacados | Buscador por dimensión | Imagen + CTA)
**Problema:** En desktop es una fila de 3 columnas. En móvil se apilan pero con tamaños y proporciones incorrectas, el buscador por dimensión queda demasiado pequeño y la imagen del carro queda suelta debajo.  
**Arreglo:**
- El contenedor de las 3 columnas debe tener:
  ```
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  ```
- En `<= 1024px` (tablet): las columnas de "Productos Destacados" y "Buscador" deben tener `flex: 1 1 45%`. La columna de la imagen `flex: 1 1 100%`.
- En `<= 768px` (móvil): cada columna debe ser `flex: 1 1 100%` (apilarse verticalmente una por una).
- La imagen del auto con la familia: en móvil debe tener `max-width: 100%; height: auto`.
- El botón "¡DA CLICK AQUÍ!" debe tener `width: 100%` en móvil.

---

### 1.4 — TARJETAS DE PRODUCTOS DESTACADOS (grid 2x2 dentro del panel izquierdo)
**Problema:** En móvil las tarjetas se comprimen demasiado, el texto "AGREGAR AL CARRITO" se sale o se corta.  
**Arreglo:**
- El grid de 2 columnas puede mantenerse en móvil, pero reducir el padding interno de cada tarjeta a `8px`.
- El botón "AGREGAR AL CARRITO": `font-size: 10px; padding: 6px 4px; white-space: nowrap;` — o si se ve muy feo, cambiar a `font-size: 11px` y dejar que el texto haga wrap con `white-space: normal`.
- La imagen del producto: `max-width: 100%; height: auto`.
- El precio: `font-size: 13px`.

---

### 1.5 — PANEL BUSCADOR POR TIPO DE VEHÍCULO (AUTO / AGRÍCOLA / CAMIÓN / MAQUINARIA)
**Problema:** En móvil los botones de tipo de vehículo se salen del contenedor o se cortan.  
**Arreglo:**
- El grid de botones de tipo: usar `display: grid; grid-template-columns: 1fr 1fr; gap: 8px;` en lugar de fila fija.
- En `<= 480px`: `grid-template-columns: 1fr 1fr` (2 columnas) — ya tiene ese layout pero hay que asegurar que no haya `width` fijo que rompa el grid.
- Los botones de dimensión (155, 165, 175...): usar `display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;` en móvil para que no se salgan.
- El botón "VER TODOS LOS VALORES": `width: 100%` en móvil.

---

### 1.6 — SECCIÓN DE MARCAS CON PRODUCTOS (Nankang, Yeada, etc.)
**Problema:** En desktop son 4 tarjetas de producto en fila. En móvil se comprimen a 4 columnas muy angostas — ilegibles.  
**Arreglo:**
- Contenedor de tarjetas de marca: `display: grid;`
- En desktop: `grid-template-columns: repeat(4, 1fr)`
- En `<= 1024px`: `grid-template-columns: repeat(3, 1fr)`
- En `<= 768px`: `grid-template-columns: repeat(2, 1fr)` — 2 tarjetas por fila.
- En `<= 480px`: `grid-template-columns: 1fr 1fr` — mantener 2 columnas pero con más padding.
- Las tarjetas individuales de producto: asegurarse que tengan `overflow: hidden` y `min-width: 0` para que no rompan el grid.
- El texto del nombre del producto: `font-size: 12px` en móvil, con `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`.
- El bloque de "marca info" (logo de Nankang + descripción + botón "Ver todos →") que aparece a la izquierda: en móvil debe estar encima de las tarjetas con `width: 100%` y layout horizontal (`display: flex; align-items: center; gap: 12px`).

---

### 1.7 — TARJETAS INDIVIDUALES DE PRODUCTO (con precio, nombre, botón Comprar, cantidad)
**Problema:** En móvil muy comprimidas — el precio se corta, el botón "Comprar" queda muy pequeño.  
**Arreglo:**
- Precio principal (`$89.99`): `font-size: 14px; font-weight: bold`.
- Botón "Comprar": `padding: 8px 10px; font-size: 13px; width: 100%` en móvil.
- Control de cantidad (− 1 +): `display: flex; align-items: center; justify-content: center; gap: 8px`.
- El badge de tipo (AT/MT/LT): mantener tamaño pero asegurarse que no se salga con `overflow: hidden`.

---

## PASO 2 — BREAKPOINTS A USAR (estándar)

Usar estos breakpoints de forma consistente en todo el proyecto:

```css
/* Móvil pequeño */
@media (max-width: 480px) { ... }

/* Móvil grande / tablet pequeña */
@media (max-width: 768px) { ... }

/* Tablet */
@media (max-width: 1024px) { ... }
```

---

## PASO 3 — DÓNDE ESCRIBIR LOS CAMBIOS

El agente debe determinar dónde están los estilos **antes** de escribir. Opciones (en orden de preferencia):

### Opción A — Clases utilitarias de Tailwind (PREFERIDA)
Agregar clases responsive directamente en el JSX: `className="w-full md:w-1/2 lg:w-1/3"`. Esto es lo más limpio y consistente con el resto del proyecto.

### Opción B — `responsive.css` (YA EXISTE)
El archivo `src/responsive.css` ya existe y está importado en `main.jsx`. Es el lugar designado para media queries CSS globales. Simplemente agregar bloques `@media` nuevos al final.

### Opción C — CSS Modules (`.css` en `src/pages/styles/` o `src/features/*/styles/`)
Si un componente ya tiene su propio archivo CSS (ej. `ProductCard.css`), agregar `@media` queries al final de ese archivo.

### Opción D — CSS Global (`index.css` o `App.css`)
Solo si el estilo aplica globalmente. `index.css` ya tiene las variables shadcn y Tailwind directives. Agregar al final de `App.css` si es necesario.

### ⚠️ Evitar inline styles
El proyecto casi no usa `style={{}}` en JSX. NO convertir estilos existentes a inline. Si encuentras inline styles, lo mejor es moverlos a una clase en `responsive.css`.

---

## PASO 4 — VERIFICACIÓN FINAL

Después de aplicar los cambios, verificar en estos tamaños de pantalla con las DevTools del navegador (Chrome → F12 → ícono de móvil):

| Dispositivo | Ancho |
|---|---|
| iPhone SE | 375px |
| iPhone 12/13 | 390px |
| Samsung Galaxy S | 360px |
| Tablet genérica | 768px |

**Checklist visual por pantalla:**
- [ ] El navbar cabe completo — logo, buscador, carrito visibles sin scroll horizontal.
- [ ] No hay scroll horizontal en ninguna sección.
- [ ] Los botones son tocables (mínimo 44px de alto).
- [ ] El texto no se corta ni se sale del contenedor.
- [ ] Las tarjetas de producto muestran imagen + nombre + precio + botón completos.
- [ ] El buscador por dimensión (ancho/perfil/rin) funciona y se ve correctamente.
- [ ] La imagen del auto se ve completa, no recortada.
- [ ] Los botones de tipo de vehículo (AUTO/AGRÍCOLA/etc.) no se salen del panel.

---

## NOTAS IMPORTANTES

- **No usar `!important`** a menos que sea absolutamente necesario para sobreescribir un estilo inline.
- **No cambiar ningún valor de color** (el rojo `#E30613`, el gris oscuro `#3D3D3D`, el negro de fondo de botones).
- **No mover ni eliminar componentes** — solo ajustar su layout con CSS.
- Si algo tiene `width: 1200px` fijo → cambiarlo a `max-width: 1200px; width: 100%`.
- Si algo tiene `height: 500px` fijo → evaluar si se puede cambiar a `min-height: 500px` o `height: auto`.
- Cualquier elemento con `position: absolute` que se salga en móvil → revisar su `top/left/right/bottom` y agregar `@media` para reposicionarlo.
- **Tailwind tiene sus propios breakpoints:** `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`. Puedes usarlos directamente en lugar de CSS `@media`.
- **Ejemplo Tailwind:** `className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"` equivale a escribir 3 media queries.
