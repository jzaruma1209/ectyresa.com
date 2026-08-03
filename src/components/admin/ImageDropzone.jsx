import { useState, useRef } from 'react';

const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_MB = 5;

/**
 * Zona de drag & drop para subir imágenes de llantas.
 * El padre controla el archivo seleccionado via onFileChange(file | null).
 * La subida real al backend la maneja el padre (AdminProductos) al hacer submit.
 *
 * Props:
 *  - onFileChange(file): callback cuando el usuario selecciona/quita un archivo
 *  - previewUrl: URL string para mostrar imagen ya existente (modo editar)
 *  - disabled: deshabilita interacción durante el guardado
 */
export default function ImageDropzone({ onFileChange, previewUrl = null, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState(null); // blob URL del archivo nuevo
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    setError(null);

    if (!VALID_TYPES.includes(file.type)) {
      setError('Formato no permitido. Solo JPG, PNG o WEBP.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`La imagen supera los ${MAX_MB} MB.`);
      return;
    }

    // Liberar blob URL anterior si existía
    if (localPreview) URL.revokeObjectURL(localPreview);

    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);
    onFileChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    // Reset para permitir subir el mismo archivo de nuevo
    e.target.value = '';
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    setError(null);
    onFileChange(null);
  };

  // La imagen a mostrar: primero el archivo nuevo (localPreview), luego la URL existente
  const displayImage = localPreview || previewUrl;

  return (
    <div style={{ width: '100%' }}>
      <div
        id="imagen-dropzone"
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? '#E60000' : '#CCCCCC'}`,
          borderRadius: 8,
          padding: displayImage ? '0.5rem' : '1.5rem 1rem',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: isDragging
            ? 'rgba(230, 0, 0, 0.04)'
            : displayImage ? '#F5F5F5' : 'transparent',
          transition: 'border-color 0.2s, background 0.2s',
          minHeight: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          hidden
          onChange={handleInputChange}
          disabled={disabled}
        />

        {displayImage ? (
          /* Vista previa */
          <div style={{ position: 'relative', width: '100%' }}>
            <img
              src={displayImage}
              alt="Vista previa"
              style={{
                width: '100%',
                maxHeight: 160,
                objectFit: 'contain',
                borderRadius: 6,
                display: 'block',
              }}
            />
            {!disabled && (
              <button
                type="button"
                id="imagen-dropzone-remove"
                onClick={handleRemove}
                title="Quitar imagen"
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  background: 'rgba(0,0,0,0.65)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 26,
                  height: 26,
                  cursor: 'pointer',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            )}
            {localPreview && (
              <p style={{ fontSize: '0.7rem', color: '#808080', marginTop: 4, textAlign: 'center' }}>
                📎 Imagen lista para subir
              </p>
            )}
          </div>
        ) : (
          /* Estado vacío */
          <div style={{ pointerEvents: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: 6 }}>🖼️</div>
            <p style={{ margin: 0, fontWeight: 600, color: '#1A1A1A', fontSize: '0.85rem' }}>
              Arrastra la imagen aquí
            </p>
            <p style={{ margin: '4px 0 0', color: '#808080', fontSize: '0.75rem' }}>
              o haz clic para seleccionar
            </p>
            <p style={{ margin: '6px 0 0', color: '#CCCCCC', fontSize: '0.7rem' }}>
              JPG · PNG · WEBP &nbsp;·&nbsp; Máx. 5 MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p style={{ color: '#E60000', fontSize: '0.75rem', marginTop: 4, marginBottom: 0 }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
