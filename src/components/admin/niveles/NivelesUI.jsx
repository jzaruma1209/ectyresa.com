import { useEffect, useRef, useState } from "react";
import { X, Plus, Pencil, Trash2, Upload, ImageIcon, AlertTriangle } from "lucide-react";

/* Piezas visuales compartidas por las secciones de Niveles de Inventario.
   Usan las mismas clases (colores, tipografía, bordes) del resto del panel admin. */

export const inputClass =
  "w-full h-9 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

export function EncabezadoSeccion({ titulo, descripcion, textoBoton, onNuevo, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">{titulo}</h2>
        <p className="text-[11px] text-muted-foreground">{descripcion}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        {onNuevo && (
          <button
            type="button"
            onClick={onNuevo}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>{textoBoton}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function EstadoActivo({ activo }) {
  return activo !== false ? (
    <span className="text-[10px] font-medium text-emerald-400">Activo</span>
  ) : (
    <span className="text-[10px] font-medium text-rose-400">Inactivo</span>
  );
}

export function Codigo({ children }) {
  return (
    <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-mono font-bold text-primary border border-primary/20">
      {children}
    </span>
  );
}

export function AccionesTarjeta({ onEditar, onEliminar }) {
  return (
    <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-border/50 pt-2.5">
      <button
        type="button"
        onClick={onEditar}
        className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-[11px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
      >
        <Pencil className="size-3 text-primary" />
        <span>Editar</span>
      </button>
      <button
        type="button"
        onClick={onEliminar}
        className="inline-flex items-center gap-1 rounded-md border border-destructive/20 bg-destructive/10 px-2 py-1 text-[11px] font-medium text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"
      >
        <Trash2 className="size-3" />
        <span>Eliminar</span>
      </button>
    </div>
  );
}

export function Vacio({ children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-10 text-center text-xs text-muted-foreground">
      {children}
    </div>
  );
}

export function Aviso({ children, tipo = "info" }) {
  const estilos =
    tipo === "alerta"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
      : "border-primary/30 bg-primary/5 text-muted-foreground";
  return (
    <div className={`flex items-start gap-2 rounded-lg border p-3 text-[11px] ${estilos}`}>
      {tipo === "alerta" && <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />}
      <div>{children}</div>
    </div>
  );
}

export function Campo({ etiqueta, ayuda, requerido, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground block mb-1">
        {etiqueta} {requerido && <span className="text-primary">*</span>}
      </label>
      {children}
      {ayuda && <span className="text-[10px] text-muted-foreground mt-1 block">{ayuda}</span>}
    </div>
  );
}

export function Interruptor({ checked, onChange, children }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-border accent-emerald-500 cursor-pointer"
      />
      <span>{children}</span>
    </label>
  );
}

/** Modal con el mismo estilo que los demás del panel */
export function ModalNivel({ abierto, titulo, subtitulo, error, guardando, onCerrar, onGuardar, children }) {
  if (!abierto) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground">{titulo}</h3>
            {subtitulo && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitulo}</p>}
          </div>
          <button type="button" onClick={onCerrar} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onGuardar();
          }}
          className="mt-4 space-y-4"
        >
          {children}
          <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onCerrar}
              className="h-9 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-muted cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="h-9 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer disabled:opacity-60"
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Campo de imagen: archivo desde el equipo (se sube a Cloudinary al guardar) o URL.
 * onChange recibe { archivo, url, quitar } — url undefined = conservar la actual.
 */
export function CampoImagen({ etiqueta, requerido, ayuda, urlActual, onChange, alto = "h-14" }) {
  const [preview, setPreview] = useState(urlActual || null);
  const [nombreArchivo, setNombreArchivo] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setPreview(urlActual || null);
    setNombreArchivo("");
  }, [urlActual]);

  const elegirArchivo = (archivo) => {
    if (!archivo || !archivo.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(archivo));
    setNombreArchivo(archivo.name);
    onChange({ archivo, url: undefined, quitar: false });
  };

  const quitar = () => {
    setPreview(null);
    setNombreArchivo("");
    if (inputRef.current) inputRef.current.value = "";
    onChange({ archivo: null, url: undefined, quitar: true });
  };

  return (
    <Campo etiqueta={etiqueta} requerido={requerido} ayuda={ayuda}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 rounded-lg cursor-pointer transition-colors text-xs font-medium text-primary">
            <Upload className="size-4" />
            <span className="truncate">{nombreArchivo || "Subir imagen desde tu equipo"}</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
              className="hidden"
              onChange={(e) => elegirArchivo(e.target.files?.[0])}
            />
          </label>
          {preview && (
            <button type="button" onClick={quitar} className="text-xs text-destructive hover:underline cursor-pointer">
              Quitar
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="O pega una URL: https://…"
            onChange={(e) => {
              const url = e.target.value.trim();
              setPreview(url || urlActual || null);
              setNombreArchivo("");
              onChange({ archivo: null, url: url || undefined, quitar: false });
            }}
            className={inputClass}
          />
          <div
            className={`${alto} w-20 shrink-0 rounded-lg border border-border bg-white/5 p-1 flex items-center justify-center overflow-hidden`}
          >
            {preview ? (
              <img
                src={preview}
                alt="Vista previa"
                className="max-h-full max-w-full object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <ImageIcon className="size-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
    </Campo>
  );
}
