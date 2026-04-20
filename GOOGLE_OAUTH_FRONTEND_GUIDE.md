# Google OAuth — Guía de Integración Frontend

> Documento para el agente del frontend de Ectyre. Describe cómo conectar el login con Google desde React.

---

## Cómo funciona el flujo (resumen rápido)

```
[Usuario hace clic en "Iniciar sesión con Google"]
         │
         ▼
[Frontend redirige el browser a: GET /api/v1/auth/google]
         │
         ▼  (el backend redirige a Google automáticamente)
[Google muestra pantalla de selección de cuenta]
         │
         ▼  (usuario elige cuenta)
[Google redirige al backend: GET /api/v1/auth/google/callback]
         │
         ▼  (backend genera JWT y redirige al frontend)
[Frontend recibe: http://localhost:3000/auth/callback?token=eyJ...]
         │
         ▼
[Frontend extrae el token de la URL, lo guarda, redirige al home]
```

No hay fetch ni axios involucrados en el inicio del login. Es una **redirección de browser**, no una llamada AJAX.

---

## Endpoints del backend

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| `GET` | `/api/v1/auth/google` | Inicia el flujo OAuth, redirige a Google | Público |
| `GET` | `/api/v1/auth/google/callback` | Google redirige aquí (no llamar directamente) | Interno |
| `GET` | `/api/v1/auth/failure` | Ruta de error si Google falla | Público |

**Base URL development:** `http://localhost:8080`  
**Base URL production:** la URL de Vercel del backend

---

## Variables de entorno del frontend

```env
VITE_API_URL=http://localhost:8080
```

---

## Paso 1 — Botón "Iniciar sesión con Google"

El botón NO hace un `fetch`. Redirige el browser directamente al backend:

```jsx
// components/GoogleLoginButton.jsx
const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirección directa — el backend maneja todo el flujo OAuth
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google`;
  };

  return (
    <button onClick={handleGoogleLogin} className="google-login-btn">
      <img src="/google-icon.svg" alt="Google" />
      Iniciar sesión con Google
    </button>
  );
};

export default GoogleLoginButton;
```

---

## Paso 2 — Página `/auth/callback` (captura el token)

El backend redirige al frontend a: `http://localhost:3000/auth/callback?token=eyJ...`

El frontend debe tener una ruta `/auth/callback` que:
1. Lea el token de la URL (`?token=...`)
2. Lo guarde en localStorage / Redux store
3. Redirija al usuario al home o a la página anterior

```jsx
// pages/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice"; // ajustar al slice existente

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Extraer el token de la URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // 2. Guardar en localStorage
      localStorage.setItem("token", token);

      // 3. (Opcional) Decodificar el JWT para obtener datos del usuario
      //    sin hacer una petición extra al backend
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // payload contiene: { id, role, iat, exp }

        // 4. Actualizar el estado global (Redux / Context)
        dispatch(loginSuccess({ token, user: payload }));
      } catch (e) {
        console.error("Token inválido:", e);
      }

      // 5. Redirigir al home
      navigate("/", { replace: true });
    } else {
      // No hay token — falló el login
      navigate("/login?error=google_failed", { replace: true });
    }
  }, []);

  return (
    <div className="auth-callback-loader">
      <p>Iniciando sesión con Google...</p>
    </div>
  );
};

export default AuthCallback;
```

---

## Paso 3 — Registrar la ruta en React Router

```jsx
// App.jsx o routes/index.jsx
import AuthCallback from "./pages/AuthCallback";

// Dentro del <Routes>:
<Route path="/auth/callback" element={<AuthCallback />} />
```

---

## Paso 4 — Usar el token guardado en peticiones autenticadas

El token de Google genera un JWT **idéntico** al del login normal. Se usa igual:

```js
// Ejemplo con fetch
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/clientes/perfil`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});
```

---

## Estructura del JWT devuelto

El backend genera un JWT con este payload:

```json
{
  "id": 42,           // idCliente en la base de datos
  "role": "cliente",  // siempre "cliente" para usuarios Google
  "iat": 1713400000,  // issued at (timestamp)
  "exp": 1713486400   // expira en 1 día
}
```

---

## Casos a manejar en el frontend

| Caso | Qué pasa | Cómo manejarlo |
|------|----------|----------------|
| Login exitoso | Redirige a `/auth/callback?token=eyJ...` | Guardar token y redirigir |
| Fallo de Google | Redirige a `/api/v1/auth/failure` | Mostrar mensaje de error |
| Usuario cancela en Google | Redirige a `/api/v1/auth/failure` | Mostrar mensaje de error |
| Email ya registrado (manual) | Backend vincula el `googleId` automáticamente y hace login normal | Transparente para el usuario |
| Token expirado (1 día) | Las peticiones devuelven 401 | Redirigir a `/login` |

---

## Consideraciones para producción

1. **Cambiar `CLIENT_URL`** en el `.env` del backend a la URL real del frontend (ej: `https://ectyre.com`)
2. **Agregar la URL del callback de producción** en Google Cloud Console:
   ```
   https://TU-BACKEND.vercel.app/api/v1/auth/google/callback
   ```
3. **HTTPS obligatorio** — Google OAuth no funciona con `http://` salvo `localhost`

---

## Checklist de integración frontend

- [ ] Botón Google en el componente de login (redirección con `window.location.href`)
- [ ] Ruta `/auth/callback` creada en React Router
- [ ] Componente `AuthCallback.jsx` que extrae el token de la URL
- [ ] Token guardado en localStorage y/o Redux store
- [ ] Redirección al home después del login exitoso
- [ ] Manejo de errores si el token no está en la URL

---

*Ectyre — Google OAuth Frontend Integration Guide v1.0*
