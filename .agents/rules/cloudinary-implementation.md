---
trigger: manual
description: Aplicar esta regla cuando el proyecto necesite subida, almacenamiento, optimización o gestión de imágenes y videos usando Cloudinary.
---

# Guía de Integración Profesional de Cloudinary

Esta documentación contiene las reglas, buenas prácticas, estructura de archivos y configuraciones necesarias para implementar de forma segura y eficiente la carga de archivos multimedia con Cloudinary en un entorno Node.js / Express.

---

# 🔒 Reglas Importantes de Seguridad

- NUNCA expongas el `API_SECRET` en el frontend.
- Usa siempre variables de entorno (`.env`) para almacenar credenciales sensibles.
- Valida siempre los tipos y extensiones de archivos en el backend antes de procesar la subida.
- Establece un límite estricto para el tamaño de los archivos.
- Asegúrate de validar la autenticación del usuario mediante un middleware antes de permitir cualquier upload.

---

# 📂 Estructura de Proyecto Recomendada

```txt
src/
│
├── config/
│   └── cloudinary.js           # Configuración del cliente Cloudinary
│
├── middleware/
│   └── upload.js               # Middleware de Multer para procesamiento de archivos
│
├── controllers/
│   └── upload.controller.js    # Lógica de negocio para las respuestas de subida
│
├── routes/
│   └── upload.routes.js        # Definición de rutas y endpoints
│
├── services/
│   └── cloudinary.service.js   # Servicios de utilidad de Cloudinary
│
└── utils/
```

---

# ⚙️ Configuración y Middleware

## 1. Configuración de Cloudinary (`src/config/cloudinary.js`)

```js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

module.exports = cloudinary;
```

---

## 2. Middleware de Upload (`src/middleware/upload.js`)

```js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

module.exports = multer({ storage });
```

---

# 📁 Organización de Carpetas y Reglas de Upload

## Convención de Nombres (Carpetas en Cloudinary)

Estructura tus recursos en carpetas lógicas dentro de tu panel de Cloudinary:

```txt
users/
products/
posts/
avatars/
banners/
```

---

# 📌 Reglas Críticas para Subidas

- Siempre validar el formato del archivo.
- Siempre limitar el tamaño de subida.
- Siempre usar URLs seguras (`secure_url`).
- Siempre guardar el `public_id`.
- Siempre utilizar una estructura de carpetas organizada.

---

# 💾 Modelo de Base de Datos Recomendado

## Datos Obligatorios

```txt
secure_url
```

## Datos Recomendados

```txt
public_id
created_at
```

---

## Ejemplo de Schema (Mongoose / MongoDB)

```js
image: {
  url: { type: String, required: true },
  public_id: { type: String, required: true }
}
```

---

# 🔄 Transformaciones y Optimización

Cloudinary permite optimizar y transformar imágenes dinámicamente mediante la URL.

| Acción | Parámetro URL | Propósito |
|---|---|---|
| Resize | `w_300` | Limita el ancho a 300px |
| Crop | `c_fill` | Recorta inteligentemente |
| Optimización | `f_auto,q_auto` | Optimiza formato y calidad automáticamente |

---

## Ejemplo de URL Optimizada

```txt
https://res.cloudinary.com/demo/image/upload/w_300/f_auto/q_auto/test.jpg
```

---

# 👍 Buenas Prácticas

## ✅ Qué SÍ hacer

- Usar el CDN de Cloudinary.
- Optimizar imágenes con `f_auto,q_auto`.
- Usar siempre `secure_url`.
- Organizar uploads por carpetas.
- Eliminar imágenes viejas o sin uso.

---

## ❌ Qué NO hacer

- Guardar imágenes directamente en el backend local.
- Guardar archivos Base64 en bases de datos.
- Exponer `API_SECRET`.
- Permitir cualquier formato sin validación.

---

# 📶 Flujo de Trabajo y API

## Endpoint Recomendado

```http
POST /api/upload
```

---

## Respuesta Esperada

```json
{
  "url": "https://res.cloudinary.com/tu-cloud/image/upload/v123456/uploads/imagen.jpg",
  "public_id": "uploads/imagen_public_id"
}
```

---

# 🔁 Flujo Correcto de Subida

```txt
[ Usuario ]
      │
Selecciona imagen
      │
      ▼
[ Frontend ]
      │
Genera FormData
      │
      ▼
[ Backend (Express) ]
      │
Procesa con Multer
      │
Valida formato/tamaño
      │
      ▼
[ Cloudinary ]
      │
Guarda archivo
      │
Devuelve secure_url + public_id
      │
      ▼
[ Backend ]
      │
Guarda referencia en DB
      │
      ▼
[ Frontend ]
      │
Actualiza UI
```

---

# 📦 Librerías Necesarias

```bash
npm install cloudinary multer multer-storage-cloudinary
```

---

# 📂 Formatos Permitidos y Límites

| Tipo | Formatos Permitidos | Tamaño Máximo |
|---|---|---|
| Imágenes | jpg, jpeg, png, webp | 5 MB |
| Videos | mp4, mov, webm | 50 MB |

---

# 🗑️ Eliminación de Archivos

```js
await cloudinary.uploader.destroy(public_id);
```

---

# 🚀 Producción

Antes de lanzar a producción asegúrate de:

- Forzar HTTPS.
- Activar `q_auto` y `f_auto`.
- Organizar carpetas por entorno (`prod/`, `dev/`).
- Proteger uploads con JWT/Auth.
- Validar tipos MIME en backend.

---

# 🏗️ Arquitectura Recomendada

```txt
[ Cliente (React/Vue) ]
           │
           ▼
[ API Express ]
           │
           ├──► Cloudinary (CDN)
           │
           ▼
[ PostgreSQL / MongoDB ]
```

---

# 🎯 Objetivo Final

- Uploads seguros.
- Optimización automática de imágenes.
- Escalabilidad.
- Menor carga del servidor.
- CDN global rápida.
- Arquitectura modular y mantenible.
- Mejor rendimiento SEO y tiempos de carga.