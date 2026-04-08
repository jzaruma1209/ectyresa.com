<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:F7DF1E,100:61DAFB&height=160&section=header&text=ectyresa.com&fontSize=45&fontColor=111111&fontAlignY=45&desc=Marketplace%20de%20Llantas%20·%20React%20·%20JavaScript&descAlignY=68&descSize=16&animation=fadeIn" alt="header"/>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
</p>

---

## 📖 Descripción

**Ectyre** es un marketplace moderno para la compra y venta de llantas y servicios automotrices en Ecuador. Esta aplicación web ofrece una experiencia de usuario fluida con búsqueda avanzada de productos, catálogo dinámico, carrito de compras y sección de servicios.

## ✨ Características principales

- 🔍 Búsqueda y filtros inteligentes de llantas por marca, tamaño y tipo
- 🛒 Carrito de compras con persistencia
- 🔐 Autenticación de usuarios (registro / login)
- 📱 Diseño totalmente responsive
- 💳 Flujo de checkout
- 🚗 Catálogo de servicios automotrices

## 🔌 Integraciones Actuales Disponibles

Actualmente, el frontend de Ectyre se encuentra **completamente integrado con el backend**, lo que te permite interactuar en tiempo real con las siguientes funcionalidades ya operativas y listas para usarse:

### 1. 🔐 Autenticación y Cuentas
- **Login con Google:** Integración activa con Google OAuth2 para acceso rápido.
- **Login / Registro Tradicional:** Creación y acceso a cuentas mediante correo y contraseña.
- **Sesión Global:** Manejo seguro de la sesión de usuario y control de accesos a rutas privadas.

### 2. 🛒 Carrito de Compras Avanzado
- **Sincronización con el Backend:** El estado del carrito se preserva en la sesión del servidor (se eliminó la dependencia exclusiva de localStorage).
- **Control de Inventario:** Validación de stock en tiempo real al agregar productos y durante el pago.

### 3. 💳 Pedidos (Orders) y Checkout
- **Proceso de Checkout Integral:** Recolección de información de envío, validación de la compra y creación de nuevas órdenes contra la API.
- **Historial de Órdenes:** Visualización de los pedidos realizados por el usuario en su perfil.

### 4. 🔍 Catálogo y Búsqueda Dinámica
- **Listado de Llantas:** Consumo dinámico de productos (paginación, detalles y más) en tiempo real desde la API central.
- **Búsqueda Inteligente por Vehículo:** Los filtros (Marca, Modelo, Año) obtienen metadatos reales y filtran compatibilidades directamente desde el backend.

## 🏗️ Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables de UI
├── pages/            # Páginas principales de la app
├── hooks/            # Custom hooks de React
├── services/         # Llamadas a la API
├── context/          # Context API (estado global)
├── utils/            # Funciones de utilidad
└── assets/           # Imágenes y recursos estáticos
```

## ⚙️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework UI | React 18 |
| Build tool | Vite |
| Lenguaje | JavaScript (ES2022+) |
| Estilos | CSS3 / Custom properties |
| HTTP Client | Axios |
| Routing | React Router v6 |

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
```

## 🔗 Repositorio relacionado

- **API Backend:** [ectyre-backend](https://github.com/jzaruma1209/ectyre-backend)

## 👤 Autor

**Jefferson Paul Zaruma Lopez** — [Portafolio](https://portafoliopz.vercel.app) · [GitHub](https://github.com/jzaruma1209)

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:61DAFB,100:F7DF1E&height=80&section=footer" alt="footer"/>
