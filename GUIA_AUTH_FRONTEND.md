# 🔐 Guía de Integración Frontend: Módulo de Autenticación (Login/Registro)

Este manual está diseñado para enseñar a los **Agentes Frontend** cómo conectar específicamente los formularios de Registro, Login de Usuario, Login de Admin y Perfil de Usuario con el backend usando los endpoints del módulo "Clientes".

---

## 📌 1. Registro de Nuevos Clientes (`POST /api/v1/clientes/registro`)

Este endpoint se utiliza en la página de creación de cuentas (Sign Up).

- **URL:** `POST http://localhost:8080/api/v1/clientes/registro`
- **Autenticación:** 🌍 Pública (No requiere token)
- **Headers:** `Content-Type: application/json`

**Datos exactos que debe enviar el formulario (Body):**
```json
{
  "tipoIdentificacion": "CEDULA", // Puede ser CEDULA, RUC o PASAPORTE
  "numeroIdentificacion": "0959401332",
  "nombres": "Juan",
  "apellidos": "Pérez",
  "email": "juanperez@example.com",
  "telefono": "0991234567",
  "password": "MiPassword123" // Mínimo 6 caracteres
}
```

**Manejo en el Frontend:** 
Si es `success: true`, redirige al usuario a la vista de `/login`.
Si el correo ya existe, el backend devolverá un error (ej. status 400). Muestra un *Toast* en la interfaz.

---

## 📌 2. Login de Usuario y Administrador (`POST /api/v1/clientes/login`)

En este sistema, **tanto los clientes normales como los administradores usan el mismo endpoint para iniciar sesión**. El backend internamente verifica el rol asociado al correo y devuelve un `token` con los permisos correspondientes.

- **URL:** `POST http://localhost:8080/api/v1/clientes/login`
- **Autenticación:** 🌍 Pública
- **Headers:** `Content-Type: application/json`

**Datos exactos que debe enviar el formulario (Body):**
```json
{
  "email": "juanperez@example.com",
  "password": "MiPassword123"
}
```

**Respuesta Exitosa (Auth):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

**Flujo en el Frontend:**
1. Extrae `response.data.token`.
2. Guarda el token en el **LocalStorage** o en el gestor de estado (ej. Zustand).
3. Configura `axios` para enviar este token en el header `Authorization: Bearer <TOKEN>` en todas las rutas privadas de ahora en adelante.

---

## 📌 3. Visualizar Perfil (`GET /api/v1/clientes/perfil`)

Inmediatamente después de hacer Login, es una buena práctica solicitar este endpoint para poder renderizar el nombre del usuario (Ej. "Bienvenido, Juan") en el navegador o en la barra de navegación.

- **URL:** `GET http://localhost:8080/api/v1/clientes/perfil`
- **Autenticación:** 🔒 Privada (Requiere enviar el Token)
- **Headers:** `Authorization: Bearer <TU_TOKEN_GUARDADO>`

**Respuesta recibida:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombres": "Juan",
    "email": "juanperez@example.com",
    "telefono": "0991234567",
    "activo": true
  }
}
```

---

## 📌 4. Actualizar Perfil (`PUT /api/v1/clientes/perfil`)

Lo utilizarás para la vista de "Mi Cuenta" o "Ajustes de Perfil".

- **URL:** `PUT http://localhost:8080/api/v1/clientes/perfil`
- **Autenticación:** 🔒 Privada
- **Headers:** `Authorization: Bearer <TU_TOKEN>`, `Content-Type: application/json`

**Datos que el formulario puede mandar (Opcionales):**
```json
{
  "nombres": "Juan Actualizado",
  "telefono": "0997654321"
}
```

---

## 📌 5. Cerrar Sesión / Logout (`POST /api/v1/clientes/logout`)

- **URL:** `POST http://localhost:8080/api/v1/clientes/logout`
- **Autenticación:** 🔒 Privada
- **Headers:** `Authorization: Bearer <TU_TOKEN>`

**Instrucciones UI:** 
1. Haz la petición al servidor.
2. Independientemente de la respuesta, **borra el token** de LocalStorage/Zustand.
3. Redirige al usuario al `/` (Home) o a `/login`.
