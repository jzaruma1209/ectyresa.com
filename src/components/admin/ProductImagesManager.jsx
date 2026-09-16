import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star, UploadCloud, X } from "lucide-react";

export const MAX_IMAGENES = 5;

let contador = 0;
const nuevaClave = () => `nueva-${Date.now()}-${contador++}`;

/**
 * Gestor de fotos del producto (máx 5, una principal).
 * imagenes: [{ clave, idImagen?, url, archivo? }]  — con archivo = foto nueva aún no subida
 * principal: clave de la foto principal (si es null, la primera se toma como principal)
 */
// Comprime y optimiza imágenes grandes en el navegador para evitar exceder el límite de Vercel (4.5MB)
const comprimirImagen = async (archivo, maxDim = 1600, calidad = 0.85) => {
  if (!archivo.type.startsWith("image/") || archivo.type === "image/svg+xml" || archivo.type === "image/gif") {
    return archivo;
  }
  // Si pesa menos de 800 KB no es necesario comprimir
  if (archivo.size <= 800 * 1024) {
    return archivo;
  }
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(archivo);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= archivo.size) {
            resolve(archivo);
          } else {
            const nuevoArchivo = new File([blob], archivo.name.replace(/\.[^.]+$/, ".webp"), {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(nuevoArchivo);
          }
        },
        "image/webp",
        calidad
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(archivo);
    };
    img.src = objectUrl;
  });
};

export default function ProductImagesManager({ imagenes, principal, onChange, disabled = false }) {
  const [arrastrando, setArrastrando] = useState(false);
  const [aviso, setAviso] = useState(null);
  const inputRef = useRef(null);
  const principalEfectiva = imagenes.some((img) => img.clave === principal) ? principal : imagenes[0]?.clave;
  const disponibles = MAX_IMAGENES - imagenes.length;

  const agregar = async (lista) => {
    const archivos = Array.from(lista || []).filter((f) => f.type.startsWith("image/"));
    if (archivos.length === 0) return;
    if (archivos.length > disponibles) {
      setAviso(`Máximo ${MAX_IMAGENES} fotos por producto. Solo se agregaron ${Math.max(0, disponibles)}.`);
    } else {
      setAviso(null);
    }
    const archivosSeleccionados = archivos.slice(0, Math.max(0, disponibles));
    const archivosOptimizados = await Promise.all(archivosSeleccionados.map((f) => comprimirImagen(f)));

    const nuevas = archivosOptimizados.map((archivo) => ({
      clave: nuevaClave(),
      url: URL.createObjectURL(archivo),
      archivo,
    }));
    if (nuevas.length) onChange([...imagenes, ...nuevas], principal ?? nuevas[0].clave);
    if (inputRef.current) inputRef.current.value = "";
  };

  const quitar = (clave) => {
    const restantes = imagenes.filter((img) => img.clave !== clave);
    setAviso(null);
    onChange(restantes, principal === clave ? restantes[0]?.clave ?? null : principal);
  };

  const mover = (indice, direccion) => {
    const destino = indice + direccion;
    if (destino < 0 || destino >= imagenes.length) return;
    const copia = [...imagenes];
    [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
    onChange(copia, principal);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {imagenes.map((img, indice) => {
          const esPrincipal = img.clave === principalEfectiva;
          return (
            <div
              key={img.clave}
              className={`group relative aspect-square overflow-hidden rounded-lg border bg-muted/30 ${
                esPrincipal ? "border-primary ring-1 ring-primary" : "border-border"
              }`}
            >
              <img src={img.url} alt={`Foto ${indice + 1}`} className="h-full w-full object-contain p-1" />
              {esPrincipal && (
                <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                  PRINCIPAL
                </span>
              )}
              {!disabled && (
                <>
                  <button
                    type="button"
                    onClick={() => quitar(img.clave)}
                    className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md cursor-pointer"
                    title="Quitar foto"
                  >
                    <X className="size-3" />
                  </button>
                  <div className="absolute inset-x-1 bottom-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => mover(indice, -1)}
                      disabled={indice === 0}
                      className="flex size-5 items-center justify-center rounded bg-background/90 text-foreground disabled:opacity-30 cursor-pointer"
                      title="Mover a la izquierda"
                    >
                      <ChevronLeft className="size-3" />
                    </button>
                    {!esPrincipal && (
                      <button
                        type="button"
                        onClick={() => onChange(imagenes, img.clave)}
                        className="flex items-center gap-0.5 rounded bg-background/90 px-1.5 py-0.5 text-[9px] font-semibold text-foreground cursor-pointer"
                        title="Marcar como principal"
                      >
                        <Star className="size-2.5" /> Principal
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => mover(indice, 1)}
                      disabled={indice === imagenes.length - 1}
                      className="flex size-5 items-center justify-center rounded bg-background/90 text-foreground disabled:opacity-30 cursor-pointer"
                      title="Mover a la derecha"
                    >
                      <ChevronRight className="size-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {disponibles > 0 && !disabled && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setArrastrando(true);
            }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={(e) => {
              e.preventDefault();
              setArrastrando(false);
              agregar(e.dataTransfer.files);
            }}
            className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-2 text-center transition-colors cursor-pointer ${
              arrastrando ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <UploadCloud className="size-5 text-muted-foreground" />
            <span className="text-[10px] font-medium text-foreground">Agregar fotos</span>
            <span className="text-[9px] text-muted-foreground">
              {imagenes.length}/{MAX_IMAGENES}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        multiple
        className="hidden"
        onChange={(e) => agregar(e.target.files)}
      />

      <p className="text-[10px] text-muted-foreground">
        Hasta {MAX_IMAGENES} fotos (PNG, JPG o WEBP, máx 5MB c/u). Si no marcas una principal, la primera será la
        principal. Pasa el cursor sobre una foto para ordenarla o marcarla como principal.
      </p>
      {aviso && <p className="text-[11px] font-medium text-amber-500">{aviso}</p>}
    </div>
  );
}
