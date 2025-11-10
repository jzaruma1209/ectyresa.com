# 🚗 Proyecto E-commerce de Llantas - Estructura Propuesta

## 📋 Análisis de la Página de Referencia (llantas247.com)

### Funcionalidades Principales:

1. **Búsqueda Multi-criterio**

   - Por medida (Ancho/Alto/Rin)
   - Por marca, modelo y año de vehículo
   - Por categoría (Autos, Motos, Camiones)

2. **Catálogo de Productos**

   - Tarjetas de productos con imagen, nombre, precio
   - Descuentos y ofertas destacadas
   - Filtros avanzados

3. **Carrito de Compras**

   - Agregar/eliminar productos
   - Calcular total con IVA
   - Proceso de checkout

4. **Detalles de Producto**

   - Especificaciones técnicas
   - Información de instalación
   - Reseñas de clientes

5. **Información Adicional**
   - Ubicaciones de tiendas físicas
   - Sistema de instalación
   - Blog/noticias

## 🛠️ Stack Tecnológico Recomendado

### Ya Tienes (Perfecto para este proyecto):

- ✅ **React 19** - Framework principal
- ✅ **Vite** - Build tool rápido
- ✅ **Redux Toolkit** - Manejo de estado global
- ✅ **React Router** - Navegación
- ✅ **React Hook Form** - Formularios
- ✅ **Axios** - Peticiones HTTP

### Opcional (Puedes agregar si lo necesitas):

- 📦 **React Icons** o **FontAwesome** (ya lo tienes) - Iconos
- 📦 **React Slick** o **Swiper** - Sliders/carruseles
- 📦 **React Toastify** - Notificaciones
- 📦 **LocalStorage** - Persistencia del carrito

## 📁 Estructura de Carpetas Propuesta

```
src/
├── components/
│   ├── shared/
│   │   ├── Header.jsx          (Navegación + Carrito icon)
│   │   ├── Footer.jsx          (Info de contacto, ubicaciones)
│   │   ├── CartIcon.jsx        (Icono del carrito con contador)
│   │   └── styles/
│   │
│   ├── Home/
│   │   ├── SearchByMeasure.jsx (Búsqueda por medida: ancho/alto/rin)
│   │   ├── SearchByVehicle.jsx (Búsqueda por marca/modelo/año)
│   │   ├── FilterByCategory.jsx (Autos, Motos, Camiones)
│   │   ├── FilterByTerrain.jsx  (Asfalto, Todo terreno, etc.)
│   │   ├── ProductCard.jsx      (Tarjeta de producto)
│   │   ├── ProductGrid.jsx      (Grid de productos)
│   │   └── styles/
│   │
│   ├── ProductDetails/
│   │   ├── ProductInfo.jsx      (Información principal)
│   │   ├── ProductSpecs.jsx     (Especificaciones técnicas)
│   │   ├── ProductGallery.jsx   (Galería de imágenes)
│   │   ├── ProductReviews.jsx   (Reseñas)
│   │   ├── InstallInfo.jsx      (Info de instalación)
│   │   └── styles/
│   │
│   └── Cart/
│       ├── CartItem.jsx         (Item individual del carrito)
│       ├── CartSummary.jsx      (Resumen y total)
│       ├── CheckoutForm.jsx     (Formulario de compra)
│       └── styles/
│
├── pages/
│   ├── HomePage.jsx             (Página principal con búsqueda y productos)
│   ├── ProductDetailsPage.jsx   (Detalle de producto)
│   ├── CartPage.jsx             (Página del carrito)
│   ├── SearchResultsPage.jsx    (Resultados de búsqueda)
│   └── styles/
│
├── store/
│   ├── slices/
│   │   ├── products.slice.js    (Estado de productos)
│   │   ├── cart.slice.js        (Estado del carrito) ⭐ NUEVO
│   │   ├── filters.slice.js     (Estado de filtros) ⭐ NUEVO
│   │   └── ui.slice.js          (Estado de UI: modales, loading)
│   │
│   └── index.js                 (Store de Redux)
│
├── hooks/
│   ├── useFetch.js              (Ya existe)
│   ├── useCart.js               (Hook personalizado para carrito)
│   └── useProducts.js           (Hook para productos)
│
└── services/
    ├── api.js                   (Configuración de Axios)
    ├── products.service.js      (Servicios de productos)
    └── cart.service.js          (Servicios del carrito - localStorage)
```

## 🎨 Componentes Clave a Implementar

### 1. **SearchByMeasure** (Búsqueda por Medida)

```jsx
// Filtros: Ancho (155-325), Alto (30-75), Rin (13-22)
// Similar a FilterByCity pero con 3 selectores
```

### 2. **SearchByVehicle** (Búsqueda por Vehículo)

```jsx
// Selectores: Marca → Año → Modelo
// Cascada de selectores dependientes
```

### 3. **ProductCard**

```jsx
// Muestra: Imagen, Nombre, Precio, Descuento, Botón "Comprar"
// Similar a HotelCard pero para productos
```

### 4. **Cart Slice** (Redux)

```jsx
// Acciones: addToCart, removeFromCart, updateQuantity, clearCart
// Estado: items[], total, itemCount
```

## 📊 Modelo de Datos Propuesto

### Producto (Llanta):

```javascript
{
  id: 1,
  name: "VANSMART MCV5",
  brand: "MAXXIS",
  category: "camioneta", // autos, motos, camiones
  measure: "225/70R15",
  width: 225,
  height: 70,
  rim: 15,
  terrain: "carga", // asfalto, todo-terreno, carga
  price: 278.32,
  discount: 40,
  finalPrice: 166.99,
  image: "url",
  images: ["url1", "url2"],
  description: "...",
  specs: {
    loadIndex: "...",
    speedIndex: "...",
    // ... más especificaciones
  },
  inStock: true,
  stock: 10
}
```

### Carrito Item:

```javascript
{
  productId: 1,
  quantity: 4, // 4 llantas
  product: { ...productData }
}
```

## 🚀 Flujo de Usuario Propuesto

1. **HomePage**

   - Búsqueda rápida por medida o vehículo
   - Productos destacados/ofertas
   - Categorías principales

2. **Búsqueda/Filtros**

   - Aplicar filtros múltiples
   - Mostrar resultados en grid
   - Ordenar por precio, nombre, etc.

3. **Detalle de Producto**

   - Ver todas las especificaciones
   - Agregar al carrito (cantidad)
   - Ver productos relacionados

4. **Carrito**
   - Ver items agregados
   - Modificar cantidades
   - Calcular total + IVA
   - Proceder al checkout

## 🎯 Próximos Pasos

1. ✅ Crear estructura de carpetas
2. ✅ Configurar Redux slices (cart, filters)
3. ✅ Crear componentes principales
4. ✅ Implementar búsqueda y filtros
5. ✅ Integrar carrito de compras
6. ✅ Agregar persistencia (localStorage)
7. ✅ Implementar página de detalle
8. ✅ Agregar funcionalidad de checkout

## 💡 Ventajas de usar React para este proyecto:

✅ **Componentes Reutilizables** - ProductCard, Filters, etc.
✅ **Estado Global** - Redux para carrito y productos
✅ **Rutas Dinámicas** - React Router para navegación
✅ **Rendimiento** - React 19 con mejoras de rendimiento
✅ **Ecosistema** - Muchas librerías disponibles
✅ **Mantenibilidad** - Código organizado y escalable

---

**¿Quieres que empiece a crear la estructura base del proyecto?** 🚀
