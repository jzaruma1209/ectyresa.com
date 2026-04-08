# 🚀 Guía Rápida de Consumo de la API Ectyre

Este documento consolida y resume cómo consumir los endpoints de la API, qué se necesita enviar y las credenciales que ya vienen por defecto (desde los seeders) para poder probar todo.

---

## 🔑 1. Credenciales Preestablecidas (Seeders)

Para interactuar con los endpoints que requieren autenticación, puedes usar las siguientes cuentas que ya están creadas en la base de datos de pruebas (seeder 08):

### 👑 Administrador (Acceso Total)
- **Email:** `admin@ectyre.com`
- **Password:** `Admin2026#Ectyre`

### 👤 Usuario/Cliente Regular (Ejemplo 1)
- **Email:** `carlos.mendoza@test.com`
- **Password:** `Test1234!`

### 👤 Usuario/Cliente Regular (Ejemplo 2)
- **Email:** `maria.torres@test.com`
- **Password:** `Test1234!`

> **¿Cómo consigues el token?**
> Haces una petición `POST` al endpoint `/api/v1/clientes/login` con el `email` y `password` en formato JSON. En la respuesta recibirás un **token**. Ese token debes colocarlo en la cabecera (Header) de tus futuras peticiones protegido como:
> `Authorization: Bearer <TU_TOKEN_AQUI>`

---

## 📡 2. Endpoints Disponibles y Cómo Usarlos

**Base URL Local:** `http://localhost:8080/api/v1`

| Método | Endpoint | ¿Qué hace? | ¿Qué necesita? (Body/Params) | Auth |
|---|---|---|---|---|
| **GET** | `/health` o `/` | Health Check (ver si la API funciona). | Nada. | Público 🌍 |

### 👤 Módulo de Clientes (`/clientes`)
| Método | Endpoint | ¿Qué hace? | ¿Qué necesita? (Body/Params) | Auth |
|---|---|---|---|---|
| **POST** | `/registro` | Registra un nuevo cliente/usuario. | Body: Detalles del usuario (nombres, apellidos, email, password, etc.) en JSON. | Público 🌍 |
| **POST** | `/login` | Inicia sesión y te devuelve un token (JWT). | Body: `{ "email": "...", "password": "..." }` | Público 🌍 |
| **GET** | `/perfil` | Ver tus datos de perfil una vez registrado. | Header: Token `Authorization: Bearer <token>` | Token 🔒 |
| **PUT** | `/perfil` | Actualizar tus datos personales. | Body: Nuevos datos a actualizar. Token en Header. | Token 🔒 |
| **POST** | `/logout` | Cerrar la sesión. | Header: Token | Token 🔒 |

### 🛞 Módulo de Llantas (`/llantas`)
| Método | Endpoint | ¿Qué hace? | ¿Qué necesita? (Body/Params) | Auth |
|---|---|---|---|---|
| **GET** | `/` | Trae todas las llantas del catálogo. | Nada (puedes enviar query como `?idMarca=1`). | Público 🌍 |
| **GET** | `/buscar-medida` | Buscar llanta pasando ancho, perfil, rin. | Query Params: `?ancho=205&perfil=55&rin=16` | Público 🌍 |
| **GET** | `/buscar-vehiculo` | Buscar llantas aptas para un coche. | Query Params: `?marca=Toyota&modelo=Corolla&anio=2020` | Público 🌍 |
| **GET** | `/:id` | Ver una llanta en específico.Ej: `/llantas/5` | URL Param: `id` (El id de la llanta) | Público 🌍 |
| **POST** | `/` | Crear una nueva llanta. | Body: marca, modelo, ancho, perfil, rin, precio, etc. | Admin 👑 |
| **PUT** | `/:id` | Actualizar la información de una llanta. | URL Param: `id` y Body con la info a actualizar. | Admin 👑 |
| **DELETE**| `/:id` | Eliminar una llanta del sistema. | URL Param: `id` | Admin 👑 |

### 🚗 Módulo de Vehículos (`/vehiculos`)
| Método | Endpoint | ¿Qué hace? | ¿Qué necesita? (Body/Params) | Auth |
|---|---|---|---|---|
| **GET** | `/marcas` | Trae lista de marcas (Toyota, Kia, etc). | Nada. | Público 🌍 |
| **GET** | `/marcas/completo` | Marcas anidadas con sus modelos. | Nada. | Público 🌍 |
| **GET** | `/marcas/:idMarca/modelos`| Modelos de una marca específica. | URL Param: `idMarca` (ej: `/marcas/1/modelos`) | Público 🌍 |

### 🛒 Módulo de Carrito (`/carrito`)
*(El carrito soporta clientes anónimos sin token, o puedes pasar el token si ya estás logueado)*
| Método | Endpoint | ¿Qué hace? | ¿Qué necesita? (Body/Params) | Auth |
|---|---|---|---|---|
| **GET** | `/` | Traer todo lo que está en tu carrito. | Header (opcional) o `?sesionId=...` | Público/Token |
| **POST** | `/agregar` | Agregar llanta al carrito. | Body: `{ "idLlanta": 1, "cantidad": 2 }` | Público/Token |
| **PUT** | `/actualizar/:id`| Modificar la cantidad de una llanta. | URL Param `id` (del ítem en el carrito) y Body `{ "cantidad": 4 }` | Público/Token |
| **DELETE**| `/eliminar/:id` | Eliminar SOLO una llanta del carrito. | URL Param `id` (del ítem en el carrito) | Público/Token |
| **DELETE**| `/vaciar` | Limpia completamente el carrito. | Nada. | Público/Token |

### 🏠 Módulo de Direcciones (`/direcciones`)
| Método | Endpoint | ¿Qué hace? | ¿Qué necesita? (Body/Params) | Auth |
|---|---|---|---|---|
| **GET** | `/` | Ver todas tus direcciones guardadas. | Token en Header | Token 🔒 |
| **POST** | `/` | Crear u agregar dirección predeterminada.| Body: provincia, ciudad, direccionCompleta. + Token| Token 🔒 |
| **PUT** | `/:id` | Editar una de tus direcciones | URL Param: `id` + Body: datos a cambiar. + Token | Token 🔒 |
| **DELETE**| `/:id` | Borrar una dirección guardada. | URL Param: `id` + Token | Token 🔒 |

### 📦 Módulo de Pedidos (`/pedidos`)
| Método | Endpoint | ¿Qué hace? | ¿Qué necesita? (Body/Params) | Auth |
|---|---|---|---|---|
| **POST** | `/checkout` | Convierte todo lo de tu carrito en Pedido.| Body: `{ "idDireccionEntrega": 1, "requiereInstalacion": true }` + Token | Token 🔒 |
| **GET** | `/` | Ver tu historial de compras/pedidos. | Token en Header | Token 🔒 |
| **GET** | `/:id` | Ver el detalle de una compra específica. | URL Param: `id` + Token | Token 🔒 |
| **GET** | `/:id/tracking` | Ver cuál es el estado de la compra | URL Param: `id` + Token | Token 🔒 |

### 👑 Módulo de Administrador (`/admin`)
*(Se necesita token de rol Administrador para todas estas rutas)*
| Método | Endpoint | ¿Qué hace? | ¿Qué necesita? (Body/Params) | Auth |
|---|---|---|---|---|
| **GET** | `/dashboard` | Resumen total de ganancias, clientes, etc.| Token Admin 👑 | Admin 👑 |
| **GET** | `/clientes` | Listar a todos los clientes del sistema. | `?page=1&limit=10` + Token Admin 👑 | Admin 👑 |
| **GET** | `/clientes/:id` | Ver información detallada de 1 cliente. | URL Param: `id` + Token Admin | Admin 👑 |
| **PATCH** | `/clientes/:id/toggle` | Activa o inactiva (prohíbe) a un cliente.| URL Param: `id` + Token Admin | Admin 👑 |
| **GET** | `/pedidos` | Ver absolutamente todos los pedidos | `?page=1&estado=PENDIENTE` + Token | Admin 👑 |
| **PATCH** | `/pedidos/:id/estado` | Cambia el estado (ej: de PENDIENTE a ENVIADO)| URL Param: `id` y Body `{ "estado": "ENVIADO" }`| Admin 👑 |

---

### Resumen Rápido: ¿Cómo se consumen?
1. Vas a `/api/v1/clientes/login` o te registras.
2. Inicias sesión usando el Body raw `JSON` y copias el Token que te responde.
3. Para cualquier ruta donde veas "Token 🔒" o "Admin 👑", pasas este Token en la herramienta que uses (Frontend o Postman) asignándolo al Header de la petición como: `Authorization: Bearer <TUTOKEN>`.
4. El Frontend debe rellenar el body (payload de Axios/Fetch) en formato `application/json` con los datos esperados y los manda.
