import { useState, useEffect, useCallback, useRef } from "react";
import {
  Image as ImageIcon,
  UploadCloud,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  RotateCw,
  X,
  AlertCircle,
  Eye,
} from "lucide-react";
import mediaService from "@/services/media.service";

export function MediaTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  // Cargar medios desde la API
  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const res = await mediaService.getMedia({ search: searchTerm.trim() });
      const list = res?.data || [];
      setItems(list);
    } catch (err) {
      console.error("Error al cargar medios:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedia();
    }, searchTerm ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchMedia, searchTerm]);

  // Manejador de subida de archivos
  const handleUploadFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );

    if (files.length === 0) {
      alert("Por favor selecciona archivos de imagen válidos (JPG, PNG, WebP, GIF, SVG).");
      return;
    }

    try {
      setUploading(true);
      setUploadProgressText(
        files.length === 1
          ? `Subiendo "${files[0].name}" a Cloudinary...`
          : `Subiendo ${files.length} imágenes a Cloudinary...`
      );

      if (files.length === 1) {
        await mediaService.uploadSingle(files[0]);
      } else {
        await mediaService.uploadMultiple(files);
      }

      await fetchMedia();
    } catch (err) {
      console.error("Error al subir archivo(s):", err);
      alert(err.response?.data?.message || err.message || "Error al subir a Cloudinary");
    } finally {
      setUploading(false);
      setUploadProgressText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  // Copiar URL al portapapeles
  const handleCopyUrl = async (url, id) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const tempInput = document.createElement("textarea");
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2200);
    } catch (err) {
      console.error("No se pudo copiar URL:", err);
    }
  };

  // Eliminar imagen de Cloudinary y BD
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeleting(true);
      await mediaService.deleteMedia(itemToDelete.id);
      setItemToDelete(null);
      await fetchMedia();
    } catch (err) {
      console.error("Error al eliminar medio:", err);
      alert("Error al eliminar la imagen: " + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(false);
    }
  };

  // Formateador de bytes
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* ── Encabezado Principal ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Media</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sube y administra las imágenes del sitio (banners, secciones, promociones). Cada imagen tiene una URL que puedes copiar y usar donde la necesites.
        </p>
      </div>

      {/* ── Dropzone para Arrastrar y Subir ── */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-10 border-2 border-dashed rounded-2xl transition-all cursor-pointer select-none ${
          dragActive
            ? "border-primary bg-primary/10 scale-[1.005]"
            : "border-border/70 hover:border-primary/60 bg-card/60 hover:bg-card/90"
        } ${uploading ? "opacity-75 cursor-not-allowed pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
          className="hidden"
          onChange={(e) => handleUploadFiles(e.target.files)}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <RotateCw className="size-10 text-primary animate-spin" />
            <p className="text-sm font-semibold text-foreground">{uploadProgressText}</p>
            <span className="text-xs text-muted-foreground">Procesando y almacenando en Cloudinary...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="size-14 rounded-2xl bg-muted/60 border border-border/80 flex items-center justify-center text-muted-foreground shadow-inner">
              <UploadCloud className="size-7 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Arrastra imágenes aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                JPG, PNG, WebP o GIF (máx. 10MB por imagen)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Barra de Búsqueda y Herramientas ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-muted-foreground font-medium">
          <button
            type="button"
            onClick={fetchMedia}
            disabled={loading}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Recargar medios"
          >
            <RotateCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <span className="rounded-md bg-muted px-2.5 py-1 text-foreground font-mono">
            {items.length} {items.length === 1 ? "imagen" : "imágenes"}
          </span>
        </div>
      </div>

      {/* ── Cuadrícula de Tarjetas de Imágenes (Diseño según Mockup) ── */}
      {loading && items.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <RotateCw className="size-6 animate-spin mx-auto text-primary mb-2" />
          <p className="text-sm">Cargando biblioteca de imágenes...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center text-muted-foreground">
          <ImageIcon className="size-12 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-semibold text-foreground">No se encontraron imágenes</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {searchTerm
              ? "No hay resultados para la búsqueda ingresada."
              : "Aún no has subido imágenes generales. Arrastra una imagen arriba para empezar."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className="group relative flex flex-col rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-primary/50 transition-all"
              >
                {/* Contenedor de la Imagen */}
                <div className="relative aspect-square w-full bg-black/40 overflow-hidden flex items-center justify-center border-b border-border/40">
                  <img
                    src={item.urlImagen}
                    alt={item.nombre}
                    loading="lazy"
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Acciones flotantes en hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPreview(item)}
                      className="size-8 rounded-lg bg-background/90 text-foreground flex items-center justify-center hover:bg-background transition-colors cursor-pointer shadow-md"
                      title="Ver en grande"
                    >
                      <Eye className="size-4" />
                    </button>
                    <a
                      href={item.urlImagen}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="size-8 rounded-lg bg-background/90 text-foreground flex items-center justify-center hover:bg-background transition-colors shadow-md"
                      title="Abrir en pestaña nueva"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      className="size-8 rounded-lg bg-rose-500/90 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer shadow-md"
                      title="Eliminar de Cloudinary"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Información y Botón Copiar */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <p
                      className="text-xs font-semibold text-foreground truncate"
                      title={item.nombre}
                    >
                      {item.nombre}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      {item.dimensiones ? `${item.dimensiones} · ` : ""}
                      {formatBytes(item.bytes)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.urlImagen, item.id)}
                    className={`w-full h-8 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      isCopied
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "border border-border/80 bg-muted/40 hover:bg-muted text-foreground"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="size-3.5" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5 text-muted-foreground" />
                        <span>Copiar URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal para Vista Previa en Grande ── */}
      {selectedPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedPreview(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-card rounded-2xl border border-border p-4 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h4 className="text-sm font-bold text-foreground truncate max-w-md">
                  {selectedPreview.nombre}
                </h4>
                <p className="text-xs text-muted-foreground font-mono">
                  {formatBytes(selectedPreview.bytes)} · {selectedPreview.formato || "IMG"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="size-8 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[70vh] flex items-center justify-center p-2 bg-black/30 rounded-xl my-3 overflow-hidden">
              <img
                src={selectedPreview.urlImagen}
                alt={selectedPreview.nombre}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
              <span className="text-[11px] font-mono text-muted-foreground truncate max-w-md">
                {selectedPreview.urlImagen}
              </span>
              <button
                type="button"
                onClick={() => handleCopyUrl(selectedPreview.urlImagen, selectedPreview.id)}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer"
              >
                {copiedId === selectedPreview.id ? (
                  <>
                    <Check className="size-4" />
                    <span>¡URL Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    <span>Copiar URL de Cloudinary</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Confirmar Eliminación ── */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-xl border border-destructive/30 bg-card p-5 text-card-foreground shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive shrink-0">
                <AlertCircle className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">¿Eliminar imagen?</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Esta acción eliminará el archivo tanto de la base de datos como de tu almacenamiento en Cloudinary.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-muted/50 p-2.5 flex items-center gap-2.5 border border-border">
              <img
                src={itemToDelete.urlImagen}
                alt=""
                className="size-10 rounded-md object-cover border border-border shrink-0"
              />
              <span className="text-xs font-medium text-foreground truncate block">
                {itemToDelete.nombre}
              </span>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={deleting}
                className="h-8 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="h-8 rounded-lg bg-destructive px-3 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 cursor-pointer flex items-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <RotateCw className="size-3.5 animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <span>Eliminar definitivamente</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default MediaTab;
