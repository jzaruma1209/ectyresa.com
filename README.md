# Ectyre - Tienda Online de Llantas y Ruedas

Plataforma moderna de comercio electrónico especializada en venta de llantas y ruedas. Construida con React, Vite y Redux para una experiencia de usuario rápida y responsiva.

## 🚀 Tecnologías

- **Frontend**: React + Vite
- **State Management**: Redux Toolkit
- **Estilos**: CSS (Grid, Flexbox)
- **Build Tool**: Vite
- **Linting**: ESLint

## 📁 Estructura del Proyecto

```text
ectyrepage/
├── public/                 # Archivos estáticos públicos (imágenes, SVGs)
└── src/                    # Código fuente principal de la aplicación
    ├── assets/             # Recursos estáticos internos (imágenes, fuentes)
    ├── components/         # Componentes reutilizables de UI
    ├── constants/          # Archivos con valores constantes globales
    ├── data/               # Datos estáticos o de prueba (mocks)
    ├── features/           # Componentes o lógica agrupada por funcionalidades
    ├── hooks/              # Custom Hooks de React
    ├── lib/                # Configuraciones de librerías externas o utilidades
    ├── pages/              # Componentes de las vistas o páginas completas
    ├── router/             # Configuración de rutas (React Router)
    ├── services/           # Peticiones a APIs y comunicación externa
    └── store/              # Manejo del estado global (Redux)
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

## 🏛️ Arquitectura del Proyecto

El proyecto sigue una arquitectura modular y escalable basada en componentes y características funcionales (Feature-Sliced Design simplificado):

1. **Capa de Vistas (Pages)**: Ubicada en `src/pages`. Componen la estructura principal de cada ruta integrando múltiples componentes y "features".
2. **Capa de Funcionalidades (Features)**: Ubicada en `src/features`. Contiene lógica y componentes específicos de un dominio particular (ej. búsqueda de llantas, filtros avanzados).
3. **Capa de Componentes Compartidos**: Ubicada en `src/components`. Botones, modales, alertas y elementos de UI genéricos (Dumb components).
4. **Capa de Estado Global (Store)**: Ubicada en `src/store`. Utiliza **Redux Toolkit** con un enfoque de "slices" modulares (ej. `cart.slice.js`, `products.slice.js`) para manejar el estado de la aplicación.
5. **Capa de Servicios**: Ubicada en `src/services`. Abstrae todas las llamadas a APIs externas o bases de datos locales (mocks), aislando la lógica de negocio orientada a datos de los componentes visuales.

## 🔄 Flujo de Trabajo (Workflow)

Para mantener el código organizado, se recomienda el siguiente flujo al crear una nueva funcionalidad:

1. **Estado o Datos**: Si la funcionalidad requiere datos de un servidor, crear o actualizar el servicio en `src/services`.
2. **Estado Global**: Si los datos deben compartirse entre muchas vistas diferentes, crear un nuevo *slice* en `src/store/slices` y agregarlo al store principal.
3. **Lógica de Negocio / Hooks**: Crear un Custom Hook en `src/hooks` para encapsular la lógica de suscripción al Store o llamadas a servicios, manteniendo los componentes React limpios.
4. **UI Específica**: Crear los componentes visuales necesarios dentro de `src/features/NombreDeFuncionalidad` (si es compleja) o en `src/components` (si es un botón simple).
5. **Ensamblado**: Importar y renderizar los componentes creados en la página correspondiente dentro de `src/pages`.

## 🔌 Forma de Conexión y Datos (API / Mocks)

La aplicación está preparada tanto para consumir una API REST real como para funcionar de manera independiente con datos simulados (Mocks). 

### Cliente HTTP (Axios)
Todas las conexiones externas utilizan **Axios**, configurado a través de una instancia base (`api.js` o configuraciones en servicios) que permite interceptar peticiones fácilmente (para añadir tokens JWT en el futuro, por ejemplo).

### Entorno Mock Integrado
Para agilizar el desarrollo del Frontend sin depender del Backend, el proyecto incluye un robusto sistema de Mocks en `src/services/mock/`. 

- **Alternar Fuente de Datos**: Se utiliza la variable de entorno `VITE_USE_MOCK=true` en el archivo `.env` para que el proyecto obtenga información local (ideal para diseño y pruebas rápidas). Si es `false`, intentará conectar con el servidor backend real usando Axios.
- **Cart Persistente**: El carrito de compras tiene soporte para persistir la información usando `localStorage` a través de los servicios del carrito, para que los usuarios no pierdan los abonos al recargar.

## 🛣️ Enrutamiento
Implementado con **React Router v7**, permite una navegación limpia estilo Single Page Application (SPA). El mapeo de rutas (URLs a componentes de páginas) se administra centralizadamente en `src/router`.
