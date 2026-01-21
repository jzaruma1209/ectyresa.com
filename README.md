# Ectyre - Tienda Online de Llantas y Ruedas

Plataforma moderna de comercio electrónico especializada en venta de llantas y ruedas. Construida con React, Vite y Redux para una experiencia de usuario rápida y responsiva.

## 🚀 Tecnologías

- **Frontend**: React + Vite
- **State Management**: Redux Toolkit
- **Estilos**: CSS (Grid, Flexbox)
- **Build Tool**: Vite
- **Linting**: ESLint

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Cart/           # Componentes del carrito
│   ├── Home/           # Componentes de la página principal
│   ├── ProductDetails/ # Detalles del producto
│   └── shared/         # Componentes compartidos
├── hooks/              # Custom hooks (useCart, useProducts)
├── pages/              # Páginas principales
├── services/           # Servicios (API, cart, productos)
├── store/              # Redux store y slices
│   └── slices/         # Redux slices (cart, filters, products, ui)
└── assets/             # Recursos estáticos
```

## 🎨 Componentes Principales

- **HomePage**: Página de inicio con hero section, búsqueda y filtros
- **ProductGrid**: Grid responsivo de productos
- **Cart**: Gestión del carrito de compras
- **ProductDetails**: Página de detalles del producto
- **SearchByVehicle/Measure**: Búsqueda por vehículo o medidas

## 📦 Instalación

```bash
npm install
npm run dev
```

## 🏗️ Estructura del Grid Principal

### Hero Section

- **Layout**: `1.5fr 1fr` (60% / 40%)
- **Left Column (60%)**:
  - Banner superior
  - Wrapper con búsqueda (2 columnas en desktop, 1 en móvil)
- **Right Column (40%)**: Zona B con CTA

### Responsividad

- **Desktop (1200px+)**: 2 columnas activas
- **Tablet (1024px)**: Adapta a 1 columna
- **Mobile (768px)**: Layout mobile-friendly

## 🔧 Configuración

- **Vite Config**: Optimizado para HMR
- **ESLint**: Configuración para buenas prácticas
- **Redux**: Gestión centralizada de estado

## 📱 Breakpoints de Responsividad

- `1200px`: Ajustes de pantalla grande
- `1024px`: Transición a tablet
- `768px`: Transición a móvil

## 🗒️ Registro de avances (21-01-2026)

- Se creó el componente `HeroBanner` en `src/components/Home/` y se integra en `HomePage` manteniendo las clases existentes.
- Se limpiaron clases CSS no usadas en `HomePage.css` para mantener estilos alineados con el JSX actual.
- Se aclaró el uso opcional de `prop-types`; se removió del banner para evitar dependencias innecesarias.
