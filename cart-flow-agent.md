# 🛒 Ectyre – Flujo del Carrito de Compras

## Contexto del proyecto
- **Frontend:** React + Redux + React Router
- **Backend:** Node.js / Express / Sequelize / PostgreSQL
- **Auth:** El usuario puede o no estar logueado
- **Estado del carrito:** Manejado en Redux

---

## Flujo general esperado

```
[ProductCard]
    │
    ▼
[Botón "Agregar al carrito"]
    │
    ▼
¿Usuario logueado?
    ├── SÍ → Agregar producto al carrito (Redux) → mostrar feedback (toast/badge)
    └── NO → Mostrar modal flotante de login
                  │
                  ▼
            Login exitoso → Agregar producto al carrito → feedback
                  │
            Cerrar modal (sin login) → No se agrega nada

[Icono del carrito en navbar]
    │
    ▼
Abre CartSidebar o navega a /cart (según diseño)
    │
    ▼
[Botón "Proceder al pago"]
    │
    ▼
¿Usuario logueado?
    ├── SÍ → Navegar a /checkout
    └── NO → Mostrar modal flotante de login → login → /checkout
```

---

## Archivos a crear / modificar

### 1. `components/AuthModal.jsx`
Modal flotante de login reutilizable.

**Comportamiento:**
- Se puede abrir desde cualquier parte de la app
- Contiene formulario de login (email + password)
- Al login exitoso: cierra el modal y ejecuta un callback (`onSuccess`)
- Tiene opción de ir a `/register` si no tiene cuenta
- Se maneja con estado global (Redux) o context: `authModalOpen: true/false`

**Props esperadas:**
```js
<AuthModal
  isOpen={bool}
  onClose={() => {}}
  onSuccess={() => {}} // callback post-login
/>
```

---

### 2. Redux slice: `authModalSlice.js` (o agregar a slice existente)

```js
// Estado a manejar
{
  authModal: {
    isOpen: false,
    pendingAction: null // ej: { type: 'ADD_TO_CART', payload: product }
  }
}

// Actions necesarias
openAuthModal(pendingAction)
closeAuthModal()
```

**`pendingAction`** guarda lo que el usuario quería hacer antes de loguearse (ej: agregar un producto). Después del login se ejecuta automáticamente.

---

### 3. `components/ProductCard.jsx` – modificar botón

```jsx
const handleAddToCart = (product) => {
  if (!isLoggedIn) {
    dispatch(openAuthModal({ type: 'ADD_TO_CART', payload: product }))
    return
  }
  dispatch(addToCart(product))
  // mostrar toast de confirmación
}
```

---

### 4. `components/CartSidebar.jsx` o página `/cart`

**Contenido:**
- Lista de productos agregados (imagen, nombre, precio, cantidad)
- Controles de cantidad (+ / -)
- Botón eliminar por producto
- Subtotal
- Botón **"Proceder al pago"**

**Botón de checkout:**
```jsx
const handleCheckout = () => {
  if (!isLoggedIn) {
    dispatch(openAuthModal({ type: 'CHECKOUT' }))
    return
  }
  navigate('/checkout')
}
```

---

### 5. Ruta `/checkout` – estructura básica

Crear página `CheckoutPage.jsx` con estructura mínima lista para después enchufar el botón de pago.

**Secciones:**
```
/checkout
├── Resumen del pedido (productos, cantidades, subtotal)
├── Formulario de datos de envío
│     ├── Nombre completo
│     ├── Dirección
│     ├── Ciudad / País
│     └── Teléfono
├── Método de pago (placeholder por ahora)
│     └── [Botón de pago – integrar después]
└── Botón "Confirmar pedido" (deshabilitado hasta que haya método de pago)
```

**Proteger la ruta:**
```jsx
// En el router
<Route
  path="/checkout"
  element={isLoggedIn ? <CheckoutPage /> : <Navigate to="/" />}
/>
```

---

### 6. Lógica post-login: ejecutar `pendingAction`

Después de un login exitoso, revisar si hay una `pendingAction` guardada y ejecutarla:

```js
// En el thunk o handler de login exitoso
const { pendingAction } = store.getState().authModal

if (pendingAction?.type === 'ADD_TO_CART') {
  dispatch(addToCart(pendingAction.payload))
}
if (pendingAction?.type === 'CHECKOUT') {
  navigate('/checkout')
}

dispatch(closeAuthModal())
```

---

## Estructura de archivos sugerida

```
src/
├── components/
│   ├── AuthModal.jsx          ← CREAR
│   ├── CartSidebar.jsx        ← CREAR o ya existe, modificar
│   └── ProductCard.jsx        ← MODIFICAR botón
├── pages/
│   └── CheckoutPage.jsx       ← CREAR (estructura básica)
├── redux/
│   ├── slices/
│   │   ├── cartSlice.js       ← ya existe, verificar actions
│   │   └── authModalSlice.js  ← CREAR
│   └── store.js               ← agregar authModalSlice
└── router/
    └── index.jsx              ← proteger /checkout
```

---

## API endpoints necesarios (backend ya existente)

| Acción | Método | Ruta |
|---|---|---|
| Login | POST | `/api/v1/auth/login` |
| Obtener carrito | GET | `/api/v1/cart` |
| Agregar al carrito | POST | `/api/v1/cart` |
| Actualizar cantidad | PUT | `/api/v1/cart/:itemId` |
| Eliminar del carrito | DELETE | `/api/v1/cart/:itemId` |
| Crear orden | POST | `/api/v1/orders` |

> Si alguno de estos endpoints no existe aún en el backend, créalos antes de conectarlos al frontend.

---

## Notas importantes

- El carrito en Redux es el **carrito temporal** (cliente). Al hacer checkout se sincroniza con el backend.
- Si el usuario no está logueado y agrega cosas, esas cosas se guardan en Redux hasta que haga login.
- El modal de login **no redirige a otra página**, es flotante sobre la vista actual para no perder el contexto.
- La página `/checkout` queda funcional visualmente pero el **botón de pago se integra después** (Stripe, PayPal, etc.).
