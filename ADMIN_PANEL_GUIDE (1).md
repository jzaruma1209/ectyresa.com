# 🏛️ ARQUITECTURA Y GUÍA DE FLUJO — PANEL DE ADMINISTRACIÓN

> **Documento maestro para Agentes y Desarrolladores.**
> Este documento describe la arquitectura, diseño visual, contratos de datos y flujo funcional completo del Panel de Administración.
> Utiliza esta guía junto con el componente [`AdminPanelTemplate.tsx`](./AdminPanelTemplate.tsx) para replicar o migrar este panel a cualquier otro proyecto sin perder consistencia técnica ni visual.

---

## 1. RESUMEN EJECUTIVO Y PROPÓSITO

El Panel de Administración es una plataforma interna de gestión para e-commerce (enfocado en materiales de acabados de interiores y construcción ligera). Permite controlar en tiempo real:
1. **Métricas clave de negocio (KPIs)**: Ventas, pedidos, clientes y volumen de catálogo.
2. **Catálogo de Productos**: Precios normales, precios de oferta (`comparePrice`), inventario (`stock`), marcas y categorías.
3. **Clasificación Estructural**: Categorías y Marcas de proveedores.
4. **Ciclo de Vida de Órdenes**: De "Pendiente" hasta "Entregado" con detalle de despacho.
5. **Transacciones y Pagos**: Auditoría de métodos (tarjeta, transferencia, billetera).
6. **Gestión de Usuarios**: Roles de permisos (`ADMIN`, `CUSTOMER`) y estados de cuenta.
7. **Configuración Global**: Moneda, datos fiscales, zona horaria y contacto.

---

## 2. IDENTIDAD VISUAL Y DESIGN SYSTEM (REGLAS OBLIGATORIAS)

Para que el panel se vea profesional, técnico y coherente en cualquier proyecto, se siguen estrictamente estas reglas:

### 2.1 Paleta de Colores (Tokens)

| Token Semántico | Valor Hex / OKLCH | Uso en el Panel |
|---|---|---|
| **Naranja Marca** | `#F47B20` | Botón activo del sidebar, CTAs principales, badges de entregado, acentos |
| **Navy Marca** | `#0A3580` | Logo badge, headers de acento |
| **Fondo Dark Real** | `#121212` | Fondo principal de la aplicación (`bg-[#121212]`) — *NUNCA usar `#000000` puro* |
| **Superficie Card** | `#18181b` | Fondo de tarjetas, tablas, sidebar y modales (`bg-[#18181b]`) |
| **Bordes** | `#27272a` / `zinc-800` | Líneas divisorias de tarjetas y tablas (`border-zinc-800`) |
| **Texto Primario** | `#FFFFFF` / `zinc-100` | Títulos, valores clave y textos destacados |
| **Texto Secundario** | `#A1A1AA` / `zinc-400` | Subtítulos, labels y descripciones |

### 2.2 Iconografía (`lucide-react`)
* **Regla estricta:** CERO emojis nativos en la interfaz (❌ no usar 🧮 ✅ 📦).
* **Grosor fijo:** `strokeWidth={1.75}` en todos los iconos de la interfaz para máxima consistencia.
* **Escala de tamaños:** 
  * `16px` (`h-4 w-4`) para botones, inputs y navegación.
  * `20px` (`h-5 w-5`) para headers de modales y tarjetas.
  * `24px` (`h-6 w-6`) para alertas y estados destacados.

### 2.3 Tipografía
* **Display / Títulos:** Grotesk moderno / `Archivo` o semibold sin serifa.
* **Cuerpo / UI:** `Inter` o fuente sans neutra legible.
* **Datos, Precios, Cantidades y SKUs:** **Siempre usar `font-mono`** (`IBM Plex Mono`). Esto da la sensación de herramienta técnica y de precisión.

---

## 3. ARQUITECTURA DEL PROYECTO (NEXT.JS + PRISMA + ZUSTAND)

El panel está estructurado bajo el siguiente patrón arquitectónico:

```
├── AdminPanelTemplate.tsx        # Componente maestro all-in-one autocontenido (Plantilla)
├── ADMIN_PANEL_GUIDE.md          # Este documento de arquitectura
├── src/
│   ├── app/
│   │   └── (admin-panel)/
│   │       └── admin/
│   │           ├── layout.tsx         # Layout base con Sidebar persistente
│   │           ├── page.tsx           # Vista 1: Dashboard
│   │           ├── products/          # Vista 2: Catálogo de productos
│   │           │   ├── page.tsx       # Tabla de productos
│   │           │   ├── new/page.tsx   # Formulario creación
│   │           │   └── [id]/edit/     # Formulario edición
│   │           ├── categories/page.tsx# Vista 3: Categorías
│   │           ├── brands/page.tsx    # Vista 4: Marcas
│   │           ├── orders/page.tsx    # Vista 5: Órdenes y despachos
│   │           ├── payments/page.tsx  # Vista 6: Pagos y transacciones
│   │           ├── users/page.tsx     # Vista 7: Usuarios y roles
│   │           └── settings/page.tsx  # Vista 8: Parámetros de la tienda
│   ├── components/admin/
│   │   ├── AdminSidebar.tsx           # Barra lateral fija de navegación
│   │   ├── StatsCard.tsx              # Tarjeta de KPI reutilizable
│   │   └── ImageUpload.tsx            # Widget de carga de imágenes (Cloudinary)
│   ├── stores/
│   │   └── admin-store.ts             # Estado global con Zustand (fetch y mutaciones)
│   └── prisma/
│       └── schema.prisma              # Modelo relacional de base de datos
```

---

## 4. FLUJO DETALLADO DE CADA MÓDULO

### 4.1 Dashboard (Vista Principal)
* **Objetivo:** Dar al administrador una visión panorámica inmediata de la salud del negocio.
* **Componentes clave:**
  1. **Grid de 4 KPIs:**
     - *Ingresos Totales:* Suma total de órdenes pagadas (`$ 0.00` con `font-mono`).
     - *Pedidos:* Conteo total de órdenes generadas.
     - *Clientes:* Conteo de usuarios registrados con rol `CUSTOMER`.
     - *Productos:* Total de ítems activos en catálogo.
  2. **Pedidos Recientes (Colspan 4):**
     - Muestra las últimas 5 órdenes con avatar del cliente, número de orden, badge de estado, monto y botón de acceso rápido `"Ver todos ↗"`.
  3. **Resumen de Pedidos por Estado (Colspan 3):**
     - Indicador por conteo de badges coloreados:
       - `Pendientes`: Badge gris / amber.
       - `Procesando`: Badge azul.
       - `Enviados`: Badge azul / morado.
       - `Entregados`: Badge naranja (`#F47B20`).
       - `Cancelados`: Badge rojo (`rose-500`).

---

### 4.2 Productos (Gestión de Catálogo)
* **Objetivo:** Control de precios, descuentos, stock e imágenes.
* **Campos del Modelo:**
  - `name`: Nombre descriptivo del producto.
  - `slug`: URL amigable (autogenerada a partir del nombre).
  - `price`: Precio de venta actual ($ USD).
  - `comparePrice`: Precio tachado anterior (opcional). Si está presente y es mayor a `price`, el frontend muestra badge de oferta.
  - `stock`: Cantidad disponible. Si es `<= 5`, se muestra alerta de stock bajo.
  - `categoryId` y `brandId`: Relaciones directas.
  - `isFeatured` y `isNew`: Banderas booleanas de visibilidad en home.
* **Regla Zod v4:**
  ```ts
  const productSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    slug: z.string().min(1, "El slug es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    price: z.number({ error: "El precio es requerido" }).min(0, "Debe ser mayor a 0"),
    comparePrice: z.number().min(0, "Debe ser mayor o igual a 0").optional(),
    stock: z.number({ error: "El stock es requerido" }).min(0, "Debe ser mayor o igual a 0"),
    categoryId: z.string().min(1, "La categoría es requerida"),
    brandId: z.string().min(1, "La marca es requerida"),
    isNew: z.boolean(),
    isFeatured: z.boolean(),
  })
  ```
  *(Nota: En inputs numéricos opcionales de React Hook Form, usar `setValueAs: (v) => v === "" ? undefined : Number(v)` para evitar errores de `NaN`)*.

---

### 4.3 Categorías y Marcas
* **Objetivo:** Organizar el catálogo de forma jerárquica.
* **Flujo de Seguridad al Eliminar:**
  - Si una categoría o marca tiene productos asociados (`productCount > 0`), el modal de eliminación debe cargar y listar los productos que se verán afectados antes de permitir la confirmación.

---

### 4.4 Órdenes y Despacho
* **Objetivo:** Flujo operativo desde la compra hasta la entrega física.
* **Estados de la Orden:**
  `PENDING` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED` (o `CANCELLED`).
* **Acciones:**
  - Cambio de estado instantáneo desde el selector de la tabla.
  - Modal de "Detalle de Orden" que expone:
    - Nombre, teléfono y correo del comprador.
    - Dirección física de entrega y código postal.
    - Lista de materiales comprados con miniaturas, cantidad y total.
    - Desglose financiero: Subtotal + Envío = Total.

---

### 4.5 Pagos y Auditoría
* **Objetivo:** Trazabilidad de cobros vía Stripe, transferencia bancaria o contra entrega.
* **Estados del Pago:**
  - `COMPLETED`: Pago liquidado y confirmado.
  - `PENDING`: En espera de comprobante o webhook.
  - `FAILED`: Rechazado por el emisor.
  - `REFUNDED`: Reembolsado al cliente.

---

### 4.6 Usuarios
* **Roles:** `ADMIN` (acceso al panel), `MODERATOR` (gestión de catálogo y pedidos), `CUSTOMER` (comprador de tienda).
* **Métricas por usuario:** Conteo histórico de pedidos y total de dinero invertido (`totalSpent` en `font-mono`).

---

### 4.7 Configuración
* **Parámetros:**
  - Razón social y nombre comercial.
  - Correo de despacho y número de soporte WhatsApp.
  - Moneda (`USD`) y huso horario (`America/Guayaquil` GMT-5).
  - Llaves de pasarela de pago.

---

## 5. ESQUEMA DE BASE DE DATOS (MODELO PRISMA COMPLETO)

```prisma
enum UserRole {
  ADMIN
  MODERATOR
  CUSTOMER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentMethod {
  CARD
  TRANSFER
  WALLET
  CASH_ON_DELIVERY
}

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  name      String
  phone     String?
  avatar    String?
  role      UserRole   @default(CUSTOMER)
  status    UserStatus @default(ACTIVE)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  addresses Address[]
  orders    Order[]

  @@map("users")
}

model Category {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  icon      String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  products  Product[]

  @@map("categories")
}

model Brand {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  logo      String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  products  Product[]

  @@map("brands")
}

model Product {
  id           String      @id @default(cuid())
  name         String
  slug         String      @unique
  description  String?
  price        Decimal     @db.Decimal(10, 2)
  comparePrice Decimal?    @db.Decimal(10, 2)
  stock        Int         @default(0)
  images       String[]
  specs        Json?
  isNew        Boolean     @default(false)
  isFeatured   Boolean     @default(false)
  isActive     Boolean     @default(true)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  categoryId   String
  category     Category    @relation(fields: [categoryId], references: [id])

  brandId      String
  brand        Brand       @relation(fields: [brandId], references: [id])

  orderItems   OrderItem[]

  @@index([categoryId])
  @@index([brandId])
  @@index([slug])
  @@map("products")
}

model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique
  status          OrderStatus   @default(PENDING)
  subtotal        Decimal       @db.Decimal(10, 2)
  shipping        Decimal       @db.Decimal(10, 2)
  total           Decimal       @db.Decimal(10, 2)
  paymentMethod   PaymentMethod
  stripeSessionId String?
  notes           String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  userId          String
  user            User          @relation(fields: [userId], references: [id])

  addressId       String
  address         Address       @relation(fields: [addressId], references: [id])

  items           OrderItem[]

  @@index([userId])
  @@index([orderNumber])
  @@map("orders")
}

model OrderItem {
  id        String   @id @default(cuid())
  name      String
  price     Decimal  @db.Decimal(10, 2)
  quantity  Int
  total     Decimal  @db.Decimal(10, 2)

  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)

  productId String
  product   Product  @relation(fields: [productId], references: [id])

  @@index([orderId])
  @@map("order_items")
}

model Address {
  id        String   @id @default(cuid())
  label     String
  name      String
  phone     String
  address   String
  city      String
  state     String
  zipCode   String
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  orders    Order[]

  @@index([userId])
  @@map("addresses")
}
```

---

## 6. CONTRATOS DE API (ENDPOINTS REQUERIDOS)

Cualquier backend que alimente este panel debe implementar estos endpoints REST:

| Método | Endpoint | Descripción | Body / Query |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Retorna KPIs, conteo de órdenes por estado y órdenes recientes | — |
| `GET` | `/api/products` | Lista de productos con filtrado | `?category=slug&search=texto&limit=50` |
| `POST` | `/api/products` | Crea un nuevo producto | `{ name, slug, price, comparePrice, stock, categoryId, brandId, images, description, isNew, isFeatured }` |
| `PUT` | `/api/products/[id]` | Actualiza un producto existente | Mismo formato que `POST` |
| `DELETE` | `/api/products/[id]` | Elimina un producto | — |
| `GET` | `/api/categories` | Lista de categorías con `productCount` | — |
| `POST` | `/api/categories` | Crea una categoría | `{ name, slug, icon }` |
| `DELETE` | `/api/categories/[id]` | Elimina una categoría | — |
| `GET` | `/api/brands` | Lista de marcas con `productCount` | — |
| `POST` | `/api/brands` | Crea una marca | `{ name, slug, logo }` |
| `GET` | `/api/admin/orders` | Lista de órdenes con paginación | `?status=pending&limit=20&offset=0` |
| `PUT` | `/api/orders/[id]` | Cambia el estado de una orden | `{ status: "delivered" }` |
| `GET` | `/api/users` | Lista de usuarios con pedidos y gasto | `?role=CUSTOMER&status=ACTIVE` |

---

## 7. CÓMO USAR LA PLANTILLA EN OTRO PROYECTO (GUÍA DE MIGRACIÓN)

Si otro agente de IA o desarrollador va a implementar este panel en otro proyecto, debe seguir estos pasos:

1. **Instalar dependencias necesarias:**
   ```bash
   npm install lucide-react zustand
   ```
2. **Copiar [`AdminPanelTemplate.tsx`](./AdminPanelTemplate.tsx):**
   - Es un componente único de React con TypeScript (`"use client"`) que ya contiene todas las 8 vistas interactivas, tablas, filtros, modales y lógica de estado.
3. **Renderizar el componente:**
   - Puede ser montado directamente en una ruta de Next.js como `src/app/admin/page.tsx`:
     ```tsx
     import AdminPanelTemplate from "@/AdminPanelTemplate"

     export default function AdminPage() {
       return <AdminPanelTemplate />
     }
     ```
4. **Conectar a Base de Datos Real:**
   - Reemplazar las funciones de mutación en `AdminPanelTemplate.tsx` (`setProducts`, `setOrders`, etc.) por llamadas `fetch("/api/...")` siguiendo los contratos de la Sección 6.
