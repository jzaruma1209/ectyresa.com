<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:F7DF1E,100:61DAFB&height=160&section=header&text=ectyresa.com&fontSize=45&fontColor=111111&fontAlignY=45&desc=Marketplace%20de%20Llantas%20·%20React%20·%20JavaScript&descAlignY=68&descSize=16&animation=fadeIn" alt="header"/>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white"/>
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white"/>
  <img src="https://img.shields.io/badge/React_Router_v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white"/>
</p>

---

## 📖 Descripción

**Ectyre** es un marketplace moderno para la compra y venta de llantas y servicios automotrices en Ecuador. Esta aplicación web ofrece una experiencia de usuario fluida con búsqueda avanzada de productos, catálogo dinámico, carrito de compras, panel de administración y sección de servicios con mapa de distribuidores.

## ✨ Características principales

- 🔍 Búsqueda inteligente de llantas por vehículo (marca, modelo, año) y por dimensión (ancho, perfil, rin)
- 🛒 Carrito de compras sincronizado con el backend
- 🔐 Autenticación JWT + Google OAuth2
- 📱 Diseño totalmente responsive (mobile-first)
- 💳 Checkout completo con flujo de pedidos
- 👑 Panel de administración (dashboard, productos, pedidos, clientes, inventario, catálogos, reportes)
- 🗺️ Mapa interactivo de distribuidores (Leaflet)
- 🚗 Catálogo de servicios automotrices
- 🖼️ Subida de imágenes con Cloudinary (admin)
- 📦 Code splitting en 6 chunks para rendimiento óptimo

## 🔌 Integraciones con el Backend

El frontend está **completamente integrado con el backend API** (`https://ectyre-backend.vercel.app/api/v1`):

### 🔐 Autenticación y Cuentas
- **Login con Google:** Integración activa con Google OAuth2 (ruta `/auth/callback`)
- **Login / Registro Tradicional:** Creación y acceso a cuentas mediante correo y contraseña
- **Sesión Global:** Manejo seguro con JWT + interceptor Axios + logout automático en 401

### 🛒 Carrito de Compras
- **Sincronización con el Backend:** Estado del carrito preservado en sesión del servidor
- **Control de Inventario:** Validación de stock en tiempo real

### 💳 Pedidos (Orders) y Checkout
- **Checkout Integral:** Recolección de envío, validación y creación de órdenes contra la API
- **Historial de Órdenes:** Visualización en `/mis-pedidos` con detalle en `/mis-pedidos/:id`

### 🔍 Catálogo y Búsqueda Dinámica
- **Listado de Llantas:** Consumo dinámico con paginación desde la API
- **Búsqueda por Vehículo:** Filtros Marca/Modelo/Año con metadatos reales del backend
- **Búsqueda por Medida:** Filtro por ancho, perfil y rin

### 🖼️ Imágenes con Cloudinary
- Subida de imágenes vía backend (nunca directo a Cloudinary)
- Soporte para imágenes múltiples por producto
- Marcado de imagen principal

## 🏗️ Estructura del proyecto

```
src/
├── components/         # 61 componentes reutilizables
│   ├── admin/          #   AdminLayout, ImageDropzone
│   ├── Auth/           #   AuthModal, LoginForm, RegisterForm, GoogleLoginButton
│   ├── cart/           #   CartInitializer, CartItem, CartSummary, CheckoutForm
│   ├── layout/         #   Header, Footer
│   ├── products/       #   21 componentes de producto (HeroBanner, ProductCard, etc.)
│   ├── shared/         #   AdminRoute, ProtectedRoute, AppLoader, SkeletonCard
│   └── ui/             #   11 componentes shadcn/ui (button, input, sheet, sidebar, etc.)
├── pages/              # 31 archivos de páginas
│   ├── shop/           #   15 páginas públicas (Home, Cart, Checkout, Profile, etc.)
│   ├── admin/          #   7 páginas de administración
│   └── styles/         #   9 hojas de estilo de páginas
├── services/           # 9 servicios API (auth, cart, products, vehiculos, etc.)
├── store/              # Redux Toolkit (7 slices)
│   └── slices/         #   auth, cart, products, filters, ui, vehiculos, authModal
├── hooks/              # useAuth, useCart, useProducts, use-mobile
├── constants/          # Constantes globales
├── lib/                # api.js (Axios con interceptors), utils.js (cn)
└── features/           # Componentes feature-specific con estilos
```

## ⚙️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework UI | React 19 |
| Build tool | Vite 7 |
| Lenguaje | JavaScript (JSX) |
| Estilos | Tailwind CSS 3 + CSS Modules |
| Estado | Redux Toolkit (7 slices) |
| Routing | React Router v7 (17 rutas shop + 8 admin) |
| HTTP Client | Axios (JWT interceptor, 401 handling) |
| UI Components | shadcn/ui (Radix, estilo radix-nova) |
| Iconos | Lucide + Heroicons + React Icons |
| Mapas | Leaflet + react-leaflet |
| Animaciones | GSAP |
| Fuentes | Inter + Geist Variable |
| Minificación | Terser (drop console, target es2015) |
| Compresión | Gzip + Brotli (vite-plugin-compression) |
| Code Splitting | 6 chunks: react, redux, maps, gsap, axios, icons |

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/jzaruma1209/ectyresa.com.git
cd ectyresa.com

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Build para producción
npm run build

# Vista previa del build
npm run preview
```

## 🔗 Repositorio relacionado

- **API Backend:** [ectyre-backend](https://github.com/jzaruma1209/ectyre-backend)

## 👤 Autor

**Jefferson Paul Zaruma Lopez** — [Portafolio](https://portafoliopz.vercel.app) · [GitHub](https://github.com/jzaruma1209)

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:61DAFB,100:F7DF1E&height=80&section=footer" alt="footer"/>
