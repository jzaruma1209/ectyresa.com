# 🛞 GUÍA DE INTEGRACIÓN — ECTYRE Frontend + Backend

> **Propósito:** Unir el frontend React (Vite + Redux) con el backend Node.js (Express + PostgreSQL)
> que ya está desplegado en `http://localhost:8080/api/v1`
>
> Este documento NO es código. Es el mapa completo de qué construir, en qué orden,
> por qué razón y bajo qué reglas. Léelo de arriba a abajo antes de tocar una sola línea.

---

## 📌 DIAGNÓSTICO — Dónde estamos hoy

### Lo que el frontend YA tiene construido

- Redux store con slices: `products`, `cart`, `filters`, `ui`
- Hook `useCart` conectado a **localStorage** (no al backend)
- Hook `useProducts` llamando a endpoints inexistentes (`/products`)
- Componente `SearchByVehicle` con datos **hardcodeados** (marcas y modelos estáticos)
- Componente `CheckoutForm` que solo hace `console.log` al enviar
- Servicio `api.js` apuntando a `/api` en lugar de `http://localhost:8080/api/v1`
- Servicio `products.service.js` usando rutas incorrectas `/products`

### Lo que el backend YA tiene listo y funcionando

- `GET  /api/v1/llantas` — catálogo de llantas con filtros
- `GET  /api/v1/llantas/buscar-medida` — búsqueda por ancho/perfil/rin
- `GET  /api/v1/llantas/buscar-vehiculo` — búsqueda por marca/modelo/año
- `GET  /api/v1/llantas/:id` — detalle de una llanta
- `GET  /api/v1/vehiculos/marcas` — marcas de vehículos
- `GET  /api/v1/vehiculos/marcas/completo` — marcas con modelos anidados
- `GET  /api/v1/vehiculos/marcas/:idMarca/modelos` — modelos por marca
- `POST /api/v1/clientes/registro` — registro de usuario
- `POST /api/v1/clientes/login` — login, devuelve JWT
- `POST /api/v1/clientes/logout` — cierra sesión
- `GET  /api/v1/clientes/perfil` — perfil del usuario
- `PUT  /api/v1/clientes/perfil` — actualizar perfil
- `GET  /api/v1/carrito` — ver carrito (auth opcional)
- `POST /api/v1/carrito/agregar` — agregar item
- `PUT  /api/v1/carrito/actualizar/:id` — actualizar cantidad
- `DELETE /api/v1/carrito/eliminar/:id` — eliminar item
- `DELETE /api/v1/carrito/vaciar` — vaciar carrito
- `POST /api/v1/pedidos/checkout` — procesar compra
- `GET  /api/v1/pedidos` — historial de pedidos
- `GET  /api/v1/pedidos/:id` — detalle de pedido
- `GET  /api/v1/pedidos/:id/tracking` — tracking de pedido
- `GET  /api/v1/direcciones` — listar direcciones
- `POST /api/v1/direcciones` — crear dirección
- `PUT  /api/v1/direcciones/:id` — actualizar dirección
- `DELETE /api/v1/direcciones/:id` — eliminar dirección

### La brecha (qué falta conectar)

```
FRONTEND actual          BACKEND real
/products           ≠    /llantas
datos hardcoded     ≠    /vehiculos/marcas
localStorage solo   ≠    /carrito (backend sincronizado)
console.log         ≠    /pedidos/checkout
no existe           ≠    /clientes/login y /registro
no existe           ≠    /direcciones
no existe           ≠    /pedidos (historial)
```

---

## 🗺️ MAPA DE FASES — Orden de implementación

```
FASE 0  →  FASE 1  →  FASE 2  →  FASE 3  →  FASE 4  →  FASE 5
Config      Llantas    Auth       Vehículos  Carrito    Pedidos y
base        reales                reales     backend    Direcciones
```

Cada fase **depende de la anterior**. No saltar fases.

---

## FASE 0 — Configuración base de conexión

**Qué es:** Establecer el canal de comunicación entre el frontend y el backend.
Sin esto, ninguna petición llegará al servidor correcto.

### Reglas que debe cumplir esta fase

**Regla 0.1 — Variable de entorno de la URL base**
El frontend debe tener un archivo `.env` en su raíz con la variable `VITE_API_URL`
apuntando a la URL real del backend. El valor en desarrollo es `http://localhost:8080/api/v1`.
En producción será la URL de Vercel. Esta variable NUNCA se escribe directamente
en el código, siempre se lee del entorno.

**Regla 0.2 — El servicio api.js debe usar esa variable**
El `baseURL` de Axios debe leer `import.meta.env.VITE_API_URL`.
Si la variable no existe, el fallback es `http://localhost:8080/api/v1`.

**Regla 0.3 — El interceptor de requests debe inyectar el token**
Si existe un token en `localStorage` bajo la clave `ectyre_token`, el interceptor
de Axios debe agregarlo automáticamente como header `Authorization: Bearer <token>`
en cada petición. No se añade si no hay token (el backend acepta ambos casos).

**Regla 0.4 — El interceptor de responses debe manejar el 401**
Si el backend devuelve código 401 (no autorizado), el frontend debe limpiar el
token del localStorage, limpiar el estado de auth en Redux y redirigir al login.
Esto evita loops de sesiones expiradas.

**Regla 0.5 — Timeout configurado**
Axios debe tener un timeout de 10 segundos para no dejar peticiones colgadas indefinidamente.

**Resultado esperado de esta fase:**
El archivo `api.js` está conectado al backend real. Las peticiones llevan el token
cuando existe. Los errores de autenticación se manejan globalmente.

---

## FASE 1 — Productos reales (Llantas)

**Qué es:** Reemplazar los endpoints incorrectos de `products.service.js` con las
rutas reales del backend. El catálogo de llantas es lo más visible del sitio.

### Reglas que debe cumplir esta fase

**Regla 1.1 — El service debe mapear el vocabulario del backend**
El backend usa el término `llantas` y campos como `ancho`, `perfil`, `rin`, `precio`,
`precioOferta`, `idMarca`, `modelo`, `activo`, `destacado`.
El frontend puede seguir usando internamente el término `products` para no reescribir
toda la UI, pero el service debe traducir las rutas correctamente.

**Regla 1.2 — Rutas correctas del service**
- Obtener todos los productos → `GET /llantas` (con params opcionales)
- Obtener por ID → `GET /llantas/:id`
- Buscar por medida → `GET /llantas/buscar-medida?ancho=X&perfil=Y&rin=Z`
- Buscar por vehículo → `GET /llantas/buscar-vehiculo?marca=X&modelo=Y&anio=Z`

**Regla 1.3 — Los campos de respuesta deben mapearse a la UI**
El backend devuelve `precio` y `precioOferta`. La UI muestra `price` y `finalPrice`.
El service o el slice deben hacer esta traducción al recibir los datos para que
los componentes existentes sigan funcionando sin cambios.

El mapeo es:
- `llanta.precio` → `product.price`
- `llanta.precioOferta` → `product.finalPrice` (si existe) o igual a `price`
- `llanta.modelo` → `product.name`
- `llanta.marca.nombre` → `product.brand`
- `llanta.imagenes[0].urlImagen` → `product.image`
- `llanta.stock` → `product.stock`
- `llanta.stock > 0` → `product.inStock`
- `llanta.descripcion` → `product.description`

**Regla 1.4 — El filtro por medida usa los parámetros correctos**
`SearchByMeasure` actualmente despacha `width`, `height`, `rim` al store.
La búsqueda real usa `ancho`, `perfil`, `rin`. El service debe convertir estos
nombres al llamar al endpoint.

**Regla 1.5 — Manejo de carga y errores**
Mientras se espera la respuesta, el estado `loading` del slice debe ser `true`.
Si hay error, debe guardarse el mensaje en el estado `error` del slice.
La UI debe mostrar un indicador de carga y un mensaje de error cuando corresponda.

**Resultado esperado de esta fase:**
El catálogo muestra llantas reales de la base de datos. La búsqueda por medida
consulta el backend real. El detalle de producto muestra datos reales.

---

## FASE 2 — Autenticación (Login y Registro)

**Qué es:** Crear todo el flujo de identidad del usuario. Es necesario antes del
carrito sincronizado y del checkout porque ambos pueden requerir token.

### Reglas que debe cumplir esta fase

**Regla 2.1 — Crear el slice de autenticación en Redux**
Debe existir un slice llamado `auth` con el siguiente estado:
- `user` — objeto con los datos del cliente logueado (o `null`)
- `token` — el JWT (o `null`)
- `loading` — boolean para mostrar spinner durante la operación
- `error` — mensaje de error (o `null`)
- `isAuthenticated` — boolean derivado de si `token` no es null

**Regla 2.2 — El token persiste entre sesiones del navegador**
Al recibir el token del login, se guarda en `localStorage` con la clave `ectyre_token`.
Al iniciar la app (en el componente raíz), se lee ese token del localStorage y se
restaura en el store de Redux. Si el token no existe, el usuario está como invitado.

**Regla 2.3 — Crear el servicio auth.service.js**
Este servicio maneja tres operaciones contra el backend:
- Login → `POST /clientes/login` con `{ email, password }`
- Registro → `POST /clientes/registro` con todos los campos requeridos
- Logout → `POST /clientes/logout` con el token en el header

Los campos requeridos por el backend para el registro son:
`tipoIdentificacion`, `numeroIdentificacion`, `nombres`, `apellidos`,
`email`, `telefono`, `password`.

**Regla 2.4 — Crear los componentes de UI**
Deben existir al menos estos dos componentes nuevos:
- `LoginForm` — formulario con email y contraseña, link a registro
- `RegisterForm` — formulario con todos los campos del backend

Ambos deben mostrar los errores del backend de forma legible para el usuario.
Ej: "El email ya está registrado" en lugar de un error técnico.

**Regla 2.5 — El Header debe reflejar el estado de autenticación**
El Header actualmente muestra "Ingresar / registrarse" siempre.
Cuando el usuario está logueado debe mostrar su nombre y un botón de cerrar sesión.
Cuando no está logueado, el click en "Ingresar" abre el formulario de login.

**Regla 2.6 — Rutas protegidas**
Las páginas de perfil, pedidos y checkout requieren autenticación.
Si el usuario intenta acceder sin estar logueado, se redirige al login.
Debe existir un componente `ProtectedRoute` que envuelva esas rutas.

**Regla 2.7 — Crear la página de perfil básica**
Una página que llame a `GET /clientes/perfil` y muestre los datos del usuario.
El usuario puede editar su nombre y teléfono (llamando a `PUT /clientes/perfil`).

**Resultado esperado de esta fase:**
El usuario puede registrarse, iniciar sesión, ver su perfil y cerrar sesión.
El token se mantiene entre recargas de página.

---

## FASE 3 — Vehículos reales (eliminar hardcode)

**Qué es:** Reemplazar los datos de marcas y modelos que están hardcodeados en
`SearchByVehicle.jsx` por datos reales del backend.

### Reglas que debe cumplir esta fase

**Regla 3.1 — Crear vehiculos.service.js**
Este servicio tiene dos operaciones:
- Obtener marcas con modelos → `GET /vehiculos/marcas/completo`
- Obtener modelos de una marca → `GET /vehiculos/marcas/:idMarca/modelos`

**Regla 3.2 — Crear el slice de vehículos en Redux**
Estado mínimo:
- `marcas` — array de marcas con sus modelos anidados
- `modelos` — array de modelos de la marca seleccionada
- `loading` — boolean
- `error` — string o null

**Regla 3.3 — SearchByVehicle carga marcas al montarse**
Al montar el componente, debe disparar la carga de marcas desde el backend.
Mientras carga, los selectores muestran "Cargando..." o están deshabilitados.

**Regla 3.4 — Cascada de selectores**
Cuando el usuario selecciona una marca, se carga la lista de modelos de esa marca.
Cuando cambia la marca, los modelos y el año se resetean.
La lógica es igual que antes, pero los datos vienen del backend, no de un objeto estático.

**Regla 3.5 — El selector de año sigue siendo estático**
El año no viene del backend. Se genera un rango de años (por ejemplo 2000 al año actual).
Esto es correcto y no debe cambiarse.

**Regla 3.6 — La búsqueda llama al endpoint correcto**
Al hacer submit, se llama a `GET /llantas/buscar-vehiculo?marca=X&modelo=Y&anio=Z`
usando los valores de texto (nombres), no los IDs.

**Resultado esperado de esta fase:**
Los selectores de marca y modelo muestran datos reales. El usuario puede buscar
llantas compatibles con su vehículo real.

---

## FASE 4 — Carrito sincronizado con el backend

**Qué es:** El carrito actualmente vive solo en localStorage. Debe sincronizarse
con el backend para que la sesión sea consistente y el stock se valide en servidor.

### Reglas que debe cumplir esta fase

**Regla 4.1 — Estrategia de doble carrito (invitado y autenticado)**
El backend acepta carrito sin token (invitado con `sesionId`) y con token (usuario logueado).
La estrategia es:
- Si el usuario NO está logueado: las operaciones de carrito llevan el `sesionId`
  almacenado en localStorage como query param
- Si el usuario SÍ está logueado: las operaciones de carrito llevan el token JWT
  en el header y el backend asocia el carrito a su cuenta

**Regla 4.2 — El sesionId del invitado persiste**
Al primer uso del carrito sin login, generar un ID único (puede ser un UUID simple)
y guardarlo en localStorage como `ectyre_session_id`. Este ID se reutiliza en
todas las llamadas de carrito hasta que el usuario se loguee o limpie el navegador.

**Regla 4.3 — Crear carrito.service.js para el backend**
Este servicio reemplaza al actual que solo usaba localStorage.
Operaciones:
- Ver carrito → `GET /carrito`
- Agregar item → `POST /carrito/agregar` con `{ idLlanta, cantidad }`
- Actualizar cantidad → `PUT /carrito/actualizar/:id` con `{ cantidad }`
- Eliminar item → `DELETE /carrito/eliminar/:id`
- Vaciar → `DELETE /carrito/vaciar`

El campo que el backend espera es `idLlanta` (el ID de la llanta en la base de datos),
no `productId` como usa el frontend actualmente. El service debe hacer esa conversión.

**Regla 4.4 — El cart.slice.js debe actualizarse**
Las acciones del slice deben llamar al backend y actualizar el estado local
con la respuesta del servidor, no calcular el total en el frontend.
El backend devuelve el carrito completo con el resumen actualizado.

**Regla 4.5 — El carrito local sigue como fallback visual**
Si el usuario agrega algo al carrito y la red falla, mostrar un error pero no perder
el item visualmente. Al reconectar, sincronizar con el backend.

**Regla 4.6 — El total viene del backend**
No calcular subtotales ni IVA en el frontend. El backend devuelve:
`resumen.subtotal`, `resumen.iva`, `resumen.total`.
El `CartSummary` debe mostrar estos valores del servidor.

**Regla 4.7 — El IVA del backend es 15% (Ecuador)**
El `useCart.js` actualmente calcula el IVA al 16% (México). Debe corregirse a 15%
o mejor aún, usar el valor que devuelve el backend directamente.

**Resultado esperado de esta fase:**
El carrito se guarda en el servidor. Si el usuario abre otra pestaña o recarga,
el carrito persiste. El stock se valida en tiempo real.

---

## FASE 5 — Pedidos, Direcciones y Checkout real

**Qué es:** Conectar el checkout con el backend real para crear pedidos verdaderos.
También crear la gestión de direcciones de entrega.

### Reglas que debe cumplir esta fase

**Regla 5.1 — El checkout requiere autenticación obligatoria**
`POST /pedidos/checkout` requiere JWT. Si el usuario llega al checkout sin estar
logueado, se debe mostrar el login antes de continuar. El flujo es:
carrito → (si no está logueado → login) → direcciones → confirmar → pedido creado.

**Regla 5.2 — Crear addresses.service.js**
Operaciones:
- Listar → `GET /direcciones`
- Crear → `POST /direcciones` con los campos del backend
- Actualizar → `PUT /direcciones/:id`
- Eliminar → `DELETE /direcciones/:id`

**Regla 5.3 — El checkout necesita una dirección seleccionada**
Antes de confirmar el pedido, el usuario debe tener al menos una dirección guardada
y seleccionarla. El `CheckoutForm` debe:
1. Listar las direcciones existentes del usuario
2. Permitir crear una nueva dirección si no tiene ninguna
3. El campo `idDireccionEntrega` del body del checkout debe ser el ID de la seleccionada

**Regla 5.4 — Los campos del body del checkout son exactos**
El backend espera: `{ idDireccionEntrega: number, requiereInstalacion: boolean }`.
El `CheckoutForm` actual recolecta nombre, email, dirección como texto libre.
Debe adaptarse para recolectar primero la dirección real y guardarla vía el servicio
de direcciones, luego hacer el checkout con el ID devuelto.

**Regla 5.5 — Crear pedidos.service.js**
Operaciones:
- Hacer checkout → `POST /pedidos/checkout`
- Listar mis pedidos → `GET /pedidos`
- Ver detalle → `GET /pedidos/:id`
- Ver tracking → `GET /pedidos/:id/tracking`

**Regla 5.6 — Crear la página de historial de pedidos**
Una página nueva en la ruta `/mis-pedidos` (protegida) que:
- Liste todos los pedidos del usuario usando `GET /pedidos`
- Muestre estado, número de pedido, fecha y total
- Tenga link al detalle de cada pedido

**Regla 5.7 — Crear la página de detalle de pedido**
Ruta `/mis-pedidos/:id` (protegida) que:
- Muestre los items del pedido, los precios y el total
- Muestre el estado actual del pedido
- Muestre el historial de estados (tracking) si está disponible

**Regla 5.8 — Después del checkout exitoso, limpiar el carrito**
Al recibir respuesta 201 del checkout, el frontend debe vaciar el carrito
en el store de Redux. No llamar manualmente al endpoint de vaciar, el backend
ya marca el carrito como "CONVERTIDO" automáticamente.

**Regla 5.9 — Mostrar confirmación con número de pedido**
Después del checkout exitoso, redirigir a una página de confirmación que muestre
el número de pedido generado por el backend (formato `P-YYYY-XXXXX`).

**Resultado esperado de esta fase:**
El usuario puede completar una compra real. El pedido queda guardado en la base
de datos. El usuario puede ver su historial de compras.

---

## 📋 REGLAS GLOBALES — Aplican a todas las fases

Estas reglas NO son opcionales. Aplican a todo el código de integración.

**RG-1 — Nunca hardcodear la URL del backend**
La URL base solo existe en el `.env`. Cualquier otra aparición en el código es un error.

**RG-2 — La estructura de respuesta del backend siempre es `{ success, message, data }`**
Al extraer datos de la respuesta, siempre acceder a `response.data.data` (el primero
es Axios, el segundo es el campo `data` del JSON del backend).

**RG-3 — Los errores del backend tienen estructura conocida**
Los errores del backend devuelven `{ success: false, message: "...", errors: [...] }`.
Al mostrar errores al usuario, usar `error.response.data.message` cuando existe.

**RG-4 — El token JWT vive en localStorage con la clave `ectyre_token`**
No usar cookies, no usar sessionStorage, no usar otra clave. Un solo lugar, una sola clave.

**RG-5 — Los campos del backend son en español**
El backend usa `nombres`, `apellidos`, `telefono`, `provincia`, `ciudad`, `idLlanta`.
El frontend puede mantener sus nombres en inglés internamente pero debe traducir
al enviar y recibir datos del backend.

**RG-6 — El carrito del backend usa `idLlanta` como identificador**
El frontend usa `productId`. Al agregar al carrito, el valor de `productId`
que guarda el frontend ES el `idLlanta` del backend. Verificar que ambos sean iguales.

**RG-7 — Toda petición asíncrona tiene tres estados: loading, success, error**
Ninguna llamada al backend puede estar sin manejar los tres casos. El usuario siempre
debe saber si está esperando, si tuvo éxito o si falló.

**RG-8 — El backend corre en el puerto 8080**
El frontend corre en el puerto 5173 (Vite por defecto). Son dos procesos distintos.
Ambos deben estar corriendo al mismo tiempo para que la integración funcione.

---

## 🔗 TABLA DE MAPEO COMPLETO Frontend ↔ Backend

| Componente/Hook Frontend | Endpoint Backend | Estado actual |
|--------------------------|------------------|---------------|
| `useProducts.loadProducts()` | `GET /llantas` | ❌ Ruta incorrecta |
| `useProducts.loadProductById()` | `GET /llantas/:id` | ❌ Ruta incorrecta |
| `useProducts.searchProducts()` | `GET /llantas/buscar-medida` | ❌ Ruta incorrecta |
| `SearchByMeasure` submit | `GET /llantas/buscar-medida` | ❌ Params incorrectos |
| `SearchByVehicle` marcas | `GET /vehiculos/marcas/completo` | ❌ Datos hardcodeados |
| `SearchByVehicle` submit | `GET /llantas/buscar-vehiculo` | ❌ No llama al backend |
| `useCart.addToCart()` | `POST /carrito/agregar` | ❌ Solo localStorage |
| `useCart.removeFromCart()` | `DELETE /carrito/eliminar/:id` | ❌ Solo localStorage |
| `useCart.updateQuantity()` | `PUT /carrito/actualizar/:id` | ❌ Solo localStorage |
| `useCart.clearCart()` | `DELETE /carrito/vaciar` | ❌ Solo localStorage |
| `CartSummary` totales | Respuesta de `GET /carrito` | ❌ Calculado en frontend |
| `CheckoutForm` submit | `POST /pedidos/checkout` | ❌ Solo console.log |
| Header "Ingresar" | `POST /clientes/login` | ❌ No existe |
| Header "registrarse" | `POST /clientes/registro` | ❌ No existe |
| — (no existe) | `GET /clientes/perfil` | ❌ No existe página |
| — (no existe) | `GET /pedidos` | ❌ No existe página |
| — (no existe) | `GET /pedidos/:id` | ❌ No existe página |
| — (no existe) | `GET /direcciones` | ❌ No existe gestión |
| `api.js` baseURL | `http://localhost:8080/api/v1` | ❌ URL incorrecta |

---

## 📁 ARCHIVOS QUE DEBEN CREARSE (nuevos)

```
src/
├── .env                           ← VITE_API_URL=http://localhost:8080/api/v1
├── services/
│   ├── auth.service.js            ← login, registro, logout
│   ├── vehiculos.service.js       ← marcas, modelos
│   ├── carrito.service.js         ← REEMPLAZA el actual (que era solo localStorage)
│   ├── pedidos.service.js         ← checkout, historial, detalle
│   └── direcciones.service.js     ← CRUD de direcciones
├── store/slices/
│   ├── auth.slice.js              ← user, token, isAuthenticated
│   └── vehiculos.slice.js         ← marcas, modelos
├── hooks/
│   └── useAuth.js                 ← hook para acceder al estado de auth
├── components/
│   ├── Auth/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── shared/
│   │   └── ProtectedRoute.jsx     ← redirige si no está autenticado
│   └── Orders/
│       ├── OrderList.jsx
│       ├── OrderDetail.jsx
│       └── OrderTracking.jsx
└── pages/
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    ├── ProfilePage.jsx
    ├── OrdersPage.jsx
    └── OrderDetailPage.jsx
```

## 📁 ARCHIVOS QUE DEBEN MODIFICARSE (existentes)

```
src/
├── .env                           ← Crear con VITE_API_URL
├── services/
│   ├── api.js                     ← Cambiar baseURL + interceptores de token
│   └── products.service.js        ← Cambiar rutas a /llantas + mapeo de campos
├── store/
│   └── index.js                   ← Agregar reducers auth y vehiculos
├── store/slices/
│   └── cart.slice.js              ← Adaptar para trabajar con respuesta del backend
├── hooks/
│   ├── useCart.js                 ← Llamar al backend en vez de localStorage
│   └── useProducts.js             ← Asegurar que usa las rutas corregidas
├── components/
│   ├── Home/SearchByVehicle.jsx   ← Eliminar hardcode, usar vehiculos.service
│   ├── Cart/CartSummary.jsx       ← Mostrar totales del backend
│   ├── Cart/CheckoutForm.jsx      ← Conectar a POST /pedidos/checkout
│   └── shared/Header.jsx          ← Mostrar estado de auth
└── App.jsx                        ← Agregar rutas nuevas + ProtectedRoute
```

---

## ✅ CRITERIO DE ÉXITO — Cómo saber que todo funciona

Al terminar todas las fases, un usuario real debe poder hacer esto sin errores:

1. Abrir el sitio → ver llantas reales cargadas desde la base de datos
2. Buscar por medida (ej: 205/55R16) → ver resultados reales
3. Buscar por vehículo (ej: Toyota Corolla 2020) → ver llantas compatibles reales
4. Agregar una llanta al carrito → el carrito se guarda en el servidor
5. Registrarse con email y contraseña → recibir confirmación
6. Iniciar sesión → el carrito del invitado se asocia a la cuenta
7. Ir al checkout → ver sus direcciones o crear una nueva
8. Confirmar compra → ver el número de pedido real (P-2025-XXXXX)
9. Ir a "Mis Pedidos" → ver el pedido recién creado con estado PENDIENTE
10. Cerrar sesión → el token se limpia, el carrito vuelve a modo invitado

---

*Guía creada para el proyecto Ectyre · Versión 1.0 · Revisar antes de cada fase*
