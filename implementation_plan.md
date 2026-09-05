# Rediseño Visual del Sidebar Admin → Estilo shadcn/ui Original

El sidebar actual usa colores rojos/naranjas (#e31e24, #F47B20) que se ven anticuados. El objetivo es que se vea como el sidebar original de shadcn/ui: **fondo oscuro neutro, acentos sutiles, tipografía limpia**. Solo cambios visuales, sin tocar lógica interna.

> [!IMPORTANT]
> Existen **2 sidebars** en el proyecto:
> 1. [`AdminLayout.jsx`](file:///c:/Users/ectyre1/OneDrive/Desktop/ectyre/ectyre.com/frontend/ectyrepage/src/components/admin/AdminLayout.jsx) — Sidebar manual (hardcodeada con clases Tailwind). **Es la que se ve en la captura roja/naranja**.
> 2. [`AppSidebar.jsx`](file:///c:/Users/ectyre1/OneDrive/Desktop/ectyre/ectyre.com/frontend/ectyrepage/src/components/AppSidebar.jsx) — Sidebar shadcn real (usa `<Sidebar>` de `ui/sidebar.jsx`). **No se está usando activamente en el AdminLayout**.

## Open Questions

> [!WARNING]
> **¿Cuál sidebar querés que sea la definitiva?**
> - **Opción A**: Reskinnear la sidebar manual de `AdminLayout.jsx` (la actual) para que se vea como shadcn.
> - **Opción B**: Reemplazar la sidebar manual de `AdminLayout.jsx` con el `<AppSidebar>` real de shadcn (más limpio a futuro, pero puede romper cosas).
> - **Opción C**: Solo cambiar colores/tokens en ambas y listo.
>
> El plan asume **Opción A** (reskinnear la actual sin reemplazarla). Decime si preferís otra.

---

## Fase 1 — Tokens CSS: Eliminar rojo/naranja, aplicar paleta shadcn neutral

#### [MODIFY] [`index.css`](file:///c:/Users/ectyre1/OneDrive/Desktop/ectyre/ectyre.com/frontend/ectyrepage/src/index.css)

Cambiar la sección `.admin-panel` (líneas 170-185):

```diff
 .admin-panel {
-  --sidebar: #18181b;
-  --sidebar-foreground: #A1A1AA;
-  --sidebar-primary: #e31e24;
-  --sidebar-primary-foreground: #ffffff;
-  --sidebar-accent: rgba(227, 30, 36, 0.12);
-  --sidebar-accent-foreground: #e31e24;
-  --sidebar-border: #27272a;
-  --sidebar-ring: #e31e24;
+  --sidebar: #09090b;
+  --sidebar-foreground: #a1a1aa;
+  --sidebar-primary: #fafafa;
+  --sidebar-primary-foreground: #18181b;
+  --sidebar-accent: #27272a;
+  --sidebar-accent-foreground: #fafafa;
+  --sidebar-border: #27272a;
+  --sidebar-ring: #3f3f46;
 }
```

---

## Fase 2 — Reskinnear sidebar manual en AdminLayout.jsx

#### [MODIFY] [`AdminLayout.jsx`](file:///c:/Users/ectyre1/OneDrive/Desktop/ectyre/ectyre.com/frontend/ectyrepage/src/components/admin/AdminLayout.jsx)

Cambios puntuales en las clases Tailwind del `<aside>` (líneas ~672-730):

| Elemento | Antes | Después |
|---|---|---|
| `<aside>` fondo | `bg-[#18181b]` | `bg-[#09090b]` |
| Logo badge | `bg-[#0A3580]` | `bg-zinc-800 border border-zinc-700` |
| "ADMIN PANEL" color | `text-[#F47B20]` | `text-zinc-500` |
| Nav item activo | `bg-[#F47B20] text-white shadow-md shadow-[#F47B20]/20` | `bg-zinc-800 text-white` |
| Nav item hover | `hover:bg-zinc-800/60` | `hover:bg-zinc-800/80` |
| Toast border | `border-[#F47B20]/40` | `border-zinc-700` |
| Toast icon color | `text-[#F47B20]` | `text-emerald-400` |
| Header avatar gradient | `from-[#0A3580] to-[#F47B20]` | `from-zinc-600 to-zinc-800` |
| "MODO ADMIN" badge | Sin cambios | Sin cambios |

---

## Fase 3 — Actualizar AppSidebar.jsx (tokens visuales)

#### [MODIFY] [`AppSidebar.jsx`](file:///c:/Users/ectyre1/OneDrive/Desktop/ectyre/ectyre.com/frontend/ectyrepage/src/components/AppSidebar.jsx)

| Elemento | Antes | Después |
|---|---|---|
| "Admin Panel" texto | `color: '#e31e24'` | `color: '#71717a'` (zinc-500) |
| Badge pedidos | `background: '#e31e24'` | `background: '#fafafa', color: '#18181b'` |
| Popup logout hover | `background: 'rgba(227,30,36,0.15)', color: '#e31e24'` | `background: '#27272a', color: '#fafafa'` |

---

## Fase 4 — Actualizar dark mode tokens en index.css

#### [MODIFY] [`index.css`](file:///c:/Users/ectyre1/OneDrive/Desktop/ectyre/ectyre.com/frontend/ectyrepage/src/index.css)

Actualizar las variables `--sidebar-*` en el bloque `.dark` (líneas 144-151) para que coincidan con los tokens neutros de shadcn:

```diff
-    --sidebar-primary: oklch(0.488 0.243 264.376);
+    --sidebar-primary: oklch(0.985 0 0);
-    --sidebar-accent: oklch(0.269 0 0);
+    --sidebar-accent: oklch(0.216 0 0);
```

---

## Verification Plan

### Manual Verification
- Correr `npm run dev` y abrir `/admin/dashboard`
- Verificar que el sidebar se vea oscuro neutro sin colores rojos/naranjas
- Verificar que los items activos tengan fondo `zinc-800` sutil
- Verificar colapso a iconos funcione si se usa `AppSidebar`
- Yo (el usuario) revisaré problemas que surjan de uno en uno
