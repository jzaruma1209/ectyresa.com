# Guía de Implementación Frontend — Subida de Imágenes con Cloudinary
## Proyecto: Ectyre Frontend · Integración con el Backend API

> **⚠️ ESTADO ACTUAL:** Esta integración ya está implementada en el proyecto.
> - Componente `ImageDropzone.jsx` en `src/components/admin/`
> - Servicio `admin.service.js` en `src/services/`
> - Endpoints funcionando contra `VITE_API_URL/admin/llantas/:id/imagenes`
> - Ver `plan_cloudinary_ectyre_frontend.md` como documentación de referencia

---

## Contexto

El backend de Ectyre ya tiene Cloudinary completamente implementado.
El frontend **nunca habla directamente con Cloudinary**. Solo envía la imagen al backend
y este se encarga de subirla y devolver la URL de Cloudinary guardada en la base de datos.

```
Frontend envía imagen (multipart/form-data)
→ Backend (Multer + Cloudinary)
→ URL guardada en tabla imagenes_llantas
→ Backend responde con la URL pública
→ Frontend muestra la imagen
```

---

## 1. Variables de Entorno del Frontend

Crear un archivo `.env` (o `.env.local` si es Next.js/Vite) en la raíz del proyecto frontend:

```env
# URL base del backend de Ectyre
VITE_API_URL=http://localhost:8080/api/v1
# Si es Next.js usa NEXT_PUBLIC_ en lugar de VITE_
# NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# En producción cambiar a la URL del backend desplegado:
# VITE_API_URL=https://ectyre-backend.vercel.app/api/v1
```

> ⚠️ El frontend NO necesita variables de Cloudinary (CLOUDINARY_CLOUD_NAME, etc.).
> Esas solo van en el backend. Nunca expongas las credenciales de Cloudinary en el frontend.

---

## 2. Endpoints del Backend — Imágenes de Llantas

Todos los endpoints de imágenes requieren token JWT en el header Authorization.
Solo los admins pueden subir/eliminar imágenes.

### Base URL
```
http://localhost:8080/api/v1
```

### Tabla de rutas

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/admin/llantas/:id/imagenes` | 🔒 Admin JWT | Sube **1 imagen** a una llanta |
| `POST` | `/admin/llantas/:id/imagenes/multiple` | 🔒 Admin JWT | Sube hasta **5 imágenes** a la vez |
| `GET` | `/admin/llantas/:id/imagenes` | 🌍 Público | Obtiene todas las imágenes de una llanta |
| `PATCH` | `/admin/llantas/:id/imagenes/:idImagen/principal` | 🔒 Admin JWT | Marca una imagen como PRINCIPAL |
| `DELETE` | `/admin/imagenes/:idImagen` | 🔒 Admin JWT | Elimina una imagen (también en Cloudinary) |

---

## 3. Regla Crítica — Content-Type

> ❌ **NUNCA** uses `Content-Type: application/json` para subir imágenes.
> ✅ **SIEMPRE** usa `multipart/form-data` y deja que el navegador ponga el boundary automáticamente.

Si usas `fetch` o `axios`, **NO pongas** el header `Content-Type` manualmente cuando
envíes un `FormData`. El navegador lo agrega solo con el boundary correcto.

```javascript
// ❌ MAL — esto romperá la subida de imágenes
fetch(url, {
  headers: { 'Content-Type': 'multipart/form-data' }, // ← NUNCA hagas esto
  body: formData,
});

// ✅ BIEN — el navegador agrega el Content-Type automáticamente
fetch(url, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }, // solo el auth header
  body: formData,
});
```

---

## 4. Nombres de Campos (Field Names) — Obligatorios

El backend espera exactamente estos nombres en el `FormData`:

| Endpoint | Field name | Tipo |
|----------|-----------|------|
| Subir 1 imagen de llanta | `imagen` | File (1 archivo) |
| Subir múltiples imágenes | `imagenes` | File (hasta 5 archivos) |
| Tipo de imagen (opcional) | `tipoImagen` | Text: `"PRINCIPAL"`, `"LATERAL"`, `"DETALLE"` |
| Orden (opcional) | `orden` | Text: número (ej: `"0"`, `"1"`) |

> Si no se manda `tipoImagen`, el backend asigna `"DETALLE"` por defecto.

---

## 5. Formatos y Límites Aceptados

| Atributo | Valor |
|----------|-------|
| Formatos permitidos | `jpg`, `jpeg`, `png`, `webp` |
| Tamaño máximo por imagen | **5 MB** |
| Máximo de imágenes por subida múltiple | **5** |

Si el archivo excede el límite o tiene formato no permitido, el backend responde con `400 Bad Request`.

---

## 6. Ejemplos de Código

### 6.1 — Subir 1 imagen (fetch)

```javascript
/**
 * Sube una imagen a una llanta específica
 * @param {number} idLlanta - ID de la llanta
 * @param {File} archivo - El archivo de imagen
 * @param {string} token - JWT del admin
 * @param {string} tipoImagen - "PRINCIPAL" | "LATERAL" | "DETALLE"
 */
async function subirImagenLlanta(idLlanta, archivo, token, tipoImagen = 'DETALLE') {
  const formData = new FormData();
  formData.append('imagen', archivo);           // field name exacto: "imagen"
  formData.append('tipoImagen', tipoImagen);    // opcional

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/llantas/${idLlanta}/imagenes`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // ⚠️ NO agregues Content-Type aquí
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al subir imagen');
  }

  const data = await response.json();
  // data.data.urlImagen → URL pública de Cloudinary
  return data.data;
}
```

### 6.2 — Subir múltiples imágenes (fetch)

```javascript
/**
 * Sube hasta 5 imágenes a una llanta
 * @param {number} idLlanta
 * @param {FileList | File[]} archivos - Lista de archivos
 * @param {string} token
 */
async function subirImagenesMultiples(idLlanta, archivos, token) {
  const formData = new FormData();

  // field name exacto: "imagenes" (plural)
  Array.from(archivos).forEach((archivo) => {
    formData.append('imagenes', archivo);
  });

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/llantas/${idLlanta}/imagenes/multiple`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al subir imágenes');
  }

  const data = await response.json();
  // data.data → array de imágenes subidas
  return data.data;
}
```

### 6.3 — Subir imagen con axios

```javascript
import axios from 'axios';

async function subirImagenAxios(idLlanta, archivo, token) {
  const formData = new FormData();
  formData.append('imagen', archivo);

  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/admin/llantas/${idLlanta}/imagenes`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        // axios detecta FormData y pone el Content-Type automáticamente
      },
    }
  );

  return data.data; // { idImagen, urlImagen, tipoImagen, orden }
}
```

### 6.4 — Obtener imágenes de una llanta (público)

```javascript
async function getImagenesLlanta(idLlanta) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/llantas/${idLlanta}/imagenes`
  );
  const data = await response.json();
  return data.data; // array de imágenes ordenadas por campo "orden"
}
```

### 6.5 — Marcar imagen como PRINCIPAL

```javascript
async function setImagenPrincipal(idLlanta, idImagen, token) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/llantas/${idLlanta}/imagenes/${idImagen}/principal`,
    {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );
  const data = await response.json();
  return data.data;
}
```

### 6.6 — Eliminar imagen

```javascript
async function eliminarImagen(idImagen, token) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/imagenes/${idImagen}`,
    {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );
  const data = await response.json();
  return data; // { success: true, message: "Imagen eliminada correctamente" }
}
```

---

## 7. Respuestas del Backend

### Subir imagen exitosa (201)
```json
{
  "success": true,
  "message": "Imagen subida correctamente",
  "data": {
    "idImagen": 12,
    "idLlanta": 5,
    "urlImagen": "https://res.cloudinary.com/dybk0xyr7/image/upload/v1234/ectyre/llantas/abc123.webp",
    "tipoImagen": "PRINCIPAL",
    "orden": 0,
    "createdAt": "2026-05-05T22:00:00.000Z",
    "updatedAt": "2026-05-05T22:00:00.000Z"
  }
}
```

### Error de validación (400)
```json
{
  "success": false,
  "message": "Tipo de archivo no permitido. Solo se aceptan: jpg, jpeg, png, webp, svg"
}
```

### Sin imagen enviada (400)
```json
{
  "success": false,
  "message": "No se envió ninguna imagen"
}
```

### Sin autorización (401 / 403)
```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

---

## 8. Componente de Drag & Drop — Implementación

### Estructura HTML básica

```html
<div id="drop-zone" class="drop-zone">
  <input type="file" id="file-input" accept=".jpg,.jpeg,.png,.webp" multiple hidden />
  <div class="drop-zone__content">
    <p>Arrastra tus imágenes aquí</p>
    <p>o</p>
    <button type="button" onclick="document.getElementById('file-input').click()">
      Seleccionar archivos
    </button>
    <p class="drop-zone__hint">JPG, PNG, WEBP · Máx. 5MB por imagen</p>
  </div>
</div>

<div id="preview-container" class="preview-grid"></div>
```

### CSS básico para la zona de drop

```css
.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.drop-zone.drag-over {
  border-color: #4f46e5;
  background-color: rgba(79, 70, 229, 0.05);
}

.drop-zone__hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.preview-item {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  aspect-ratio: 1;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-item__remove {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### JavaScript — Lógica completa del componente

```javascript
class ImageUploader {
  constructor({ idLlanta, token, onUploadSuccess, onError }) {
    this.idLlanta = idLlanta;
    this.token = token;
    this.onUploadSuccess = onUploadSuccess;
    this.onError = onError;
    this.pendingFiles = []; // archivos seleccionados aún no subidos
    this.apiBase = import.meta.env.VITE_API_URL; // ajustar si es Next.js

    this._init();
  }

  _init() {
    this.dropZone = document.getElementById('drop-zone');
    this.fileInput = document.getElementById('file-input');
    this.previewContainer = document.getElementById('preview-container');

    // Clic en la zona dispara el input file
    this.dropZone.addEventListener('click', () => this.fileInput.click());

    // Input file seleccionado manualmente
    this.fileInput.addEventListener('change', (e) => {
      this._handleFiles(Array.from(e.target.files));
      this.fileInput.value = ''; // reset para permitir subir el mismo archivo de nuevo
    });

    // Drag & Drop events
    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropZone.classList.add('drag-over');
    });

    this.dropZone.addEventListener('dragleave', () => {
      this.dropZone.classList.remove('drag-over');
    });

    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropZone.classList.remove('drag-over');
      const files = Array.from(e.dataTransfer.files);
      this._handleFiles(files);
    });
  }

  _handleFiles(files) {
    const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const MAX_SIZE_MB = 5;

    files.forEach((file) => {
      // Validación de tipo
      if (!VALID_TYPES.includes(file.type)) {
        this.onError?.(`Archivo "${file.name}" no permitido. Solo JPG, PNG, WEBP.`);
        return;
      }

      // Validación de tamaño
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        this.onError?.(`"${file.name}" supera los ${MAX_SIZE_MB}MB.`);
        return;
      }

      this.pendingFiles.push(file);
      this._addPreview(file);
    });
  }

  _addPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const item = document.createElement('div');
      item.className = 'preview-item';
      item.dataset.fileName = file.name;

      item.innerHTML = `
        <img src="${e.target.result}" alt="${file.name}" />
        <button class="preview-item__remove" title="Quitar">✕</button>
      `;

      item.querySelector('.preview-item__remove').addEventListener('click', (ev) => {
        ev.stopPropagation();
        this.pendingFiles = this.pendingFiles.filter(f => f.name !== file.name);
        item.remove();
      });

      this.previewContainer.appendChild(item);
    };
    reader.readAsDataURL(file);
  }

  // Llama a este método desde el botón de "Guardar" del formulario
  async uploadAll(tipoImagen = 'DETALLE') {
    if (this.pendingFiles.length === 0) return [];

    const results = [];

    for (const file of this.pendingFiles) {
      try {
        const result = await this._uploadOne(file, tipoImagen);
        results.push(result);
        this.onUploadSuccess?.(result);
      } catch (err) {
        this.onError?.(err.message);
      }
    }

    this.pendingFiles = [];
    return results;
  }

  async _uploadOne(file, tipoImagen) {
    const formData = new FormData();
    formData.append('imagen', file);
    formData.append('tipoImagen', tipoImagen);

    const response = await fetch(
      `${this.apiBase}/admin/llantas/${this.idLlanta}/imagenes`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.token}` },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Error subiendo ${file.name}`);
    }

    const data = await response.json();
    return data.data;
  }
}

// Uso:
const uploader = new ImageUploader({
  idLlanta: 5,
  token: localStorage.getItem('token'),
  onUploadSuccess: (imagen) => {
    console.log('Imagen subida:', imagen.urlImagen);
  },
  onError: (msg) => {
    alert(msg); // o mostrar un toast
  },
});

// En el submit del formulario admin:
document.getElementById('form-llanta').addEventListener('submit', async (e) => {
  e.preventDefault();
  const imagenes = await uploader.uploadAll('PRINCIPAL');
  console.log('Imágenes subidas:', imagenes);
});
```

---

## 9. Integración en React (ejemplo con hooks)

```jsx
import { useState, useRef } from 'react';

function ImageUploaderReact({ idLlanta, token, onUploadDone }) {
  const [previews, setPreviews] = useState([]); // { file, previewUrl }
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_MB = 5;

  const validateAndAdd = (files) => {
    const valid = Array.from(files).filter((f) => {
      if (!VALID_TYPES.includes(f.type)) {
        setError(`Formato no permitido: ${f.name}`);
        return false;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        setError(`${f.name} supera los ${MAX_MB}MB`);
        return false;
      }
      return true;
    });

    const newPreviews = valid.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndAdd(e.dataTransfer.files);
  };

  const removePreview = (index) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl); // liberar memoria
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (!previews.length) return;
    setUploading(true);
    setError(null);

    const apiBase = import.meta.env.VITE_API_URL;
    const uploaded = [];

    for (const { file } of previews) {
      const formData = new FormData();
      formData.append('imagen', file);

      try {
        const res = await fetch(`${apiBase}/admin/llantas/${idLlanta}/imagenes`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) throw new Error((await res.json()).message);
        const data = await res.json();
        uploaded.push(data.data);
      } catch (err) {
        setError(err.message);
      }
    }

    setUploading(false);
    setPreviews([]);
    onUploadDone?.(uploaded);
  };

  return (
    <div>
      {/* Zona de drop */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? '#4f46e5' : '#ccc'}`,
          background: isDragging ? 'rgba(79,70,229,0.05)' : 'transparent',
          borderRadius: 8,
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          hidden
          onChange={(e) => validateAndAdd(e.target.files)}
        />
        <p>Arrastra imágenes aquí o haz clic para seleccionar</p>
        <small style={{ color: '#6b7280' }}>JPG, PNG, WEBP · Máx. 5MB</small>
      </div>

      {/* Error */}
      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}

      {/* Previews */}
      {previews.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {previews.map(({ previewUrl }, i) => (
            <div key={i} style={{ position: 'relative', width: 100, height: 100 }}>
              <img
                src={previewUrl}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }}
              />
              <button
                onClick={(e) => { e.stopPropagation(); removePreview(i); }}
                style={{
                  position: 'absolute', top: 2, right: 2,
                  background: 'rgba(0,0,0,0.6)', color: 'white',
                  border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botón subir */}
      {previews.length > 0 && (
        <button onClick={handleUpload} disabled={uploading} style={{ marginTop: 12 }}>
          {uploading ? 'Subiendo...' : `Subir ${previews.length} imagen(es)`}
        </button>
      )}
    </div>
  );
}

export default ImageUploaderReact;
```

---

## 10. Mostrar la imagen principal de una llanta en el catálogo

Cuando el backend devuelve una llanta con sus imágenes incluidas, la estructura es:

```json
{
  "idLlanta": 5,
  "modelo": "Primacy 4",
  "imagenes": [
    {
      "idImagen": 1,
      "urlImagen": "https://res.cloudinary.com/dybk0xyr7/image/upload/v123/ectyre/llantas/img.webp",
      "tipoImagen": "PRINCIPAL",
      "orden": 0
    },
    {
      "idImagen": 2,
      "urlImagen": "https://res.cloudinary.com/dybk0xyr7/image/upload/v123/ectyre/llantas/img2.webp",
      "tipoImagen": "DETALLE",
      "orden": 1
    }
  ]
}
```

### Helper para obtener la imagen principal

```javascript
/**
 * Obtiene la URL de la imagen principal de una llanta.
 * Si no tiene PRINCIPAL, toma la primera disponible.
 * Si no tiene ninguna, devuelve un placeholder.
 */
function getImagenPrincipal(llanta, placeholder = '/images/llanta-placeholder.png') {
  if (!llanta.imagenes || llanta.imagenes.length === 0) {
    return placeholder;
  }
  const principal = llanta.imagenes.find((img) => img.tipoImagen === 'PRINCIPAL');
  return (principal || llanta.imagenes[0]).urlImagen;
}

// Uso en JSX:
// <img src={getImagenPrincipal(llanta)} alt={llanta.modelo} />
```

---

## 11. Checklist de Implementación

Antes de dar como terminada la integración, verifica los siguientes puntos:

- [ ] Variable `VITE_API_URL` (o `NEXT_PUBLIC_API_URL`) configurada en `.env`
- [ ] El `FormData` usa el field name exacto: `imagen` (singular) o `imagenes` (plural)
- [ ] **NO** se está poniendo `Content-Type: multipart/form-data` manualmente
- [ ] El header `Authorization: Bearer <token>` se incluye en todas las peticiones de subida/eliminación
- [ ] La validación de tipo y tamaño se hace en el frontend ANTES de enviar (UX)
- [ ] Se muestra un estado de carga (spinner / "Subiendo...") mientras se procesa
- [ ] Se maneja el error si el backend responde con 400 o 401
- [ ] La función `getImagenPrincipal()` está implementada para el catálogo
- [ ] Las URLs de Cloudinary se muestran directamente en los `<img src="...">` sin modificación

---

## 12. Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|---------|
| `400 - No se envió ninguna imagen` | El field name del FormData no coincide | Usar exactamente `imagen` o `imagenes` |
| `400 - Tipo de archivo no permitido` | Se envió un PDF, GIF u otro formato | Aceptar solo `.jpg,.jpeg,.png,.webp` |
| `401 - Token inválido` | No se envió el header Authorization | Agregar `Authorization: Bearer <token>` |
| `403 - Acceso prohibido` | El usuario no es admin | Verificar que el rol sea `ADMIN` |
| `Network Error` / CORS | El backend no está corriendo o CORS mal configurado | Verificar que la URL del backend sea la correcta y el servidor esté activo |
| Imagen no se muestra tras subir | Se está usando la URL local y no la de Cloudinary | Usar `data.data.urlImagen` de la respuesta del backend |
| `Boundary missing` / `Unexpected end of form` | Se puso `Content-Type: multipart/form-data` manualmente | Eliminar ese header, dejar que el navegador lo ponga |

---

*Ectyre Frontend — Guía de integración Cloudinary v1.0 · 2026*
