import { useMemo, useState } from "react";
import { AlertTriangle, Globe, Layers, Copy, Check, ExternalLink, X } from "lucide-react";
import nivelesService, { mensajeError } from "@/services/niveles.service";
import {
  AccionesTarjeta,
  Aviso,
  Campo,
  CampoImagen,
  EncabezadoSeccion,
  EstadoActivo,
  Interruptor,
  ModalNivel,
  Vacio,
  inputClass,
} from "./NivelesUI";

const VACIO = { idTipoProducto: "", nombre: "", paisOrigen: "", descripcion: "", activo: true };
const SIN_IMAGEN = { archivo: null, url: undefined, quitar: false };

export function MarcasPanel({ marcas, tipos, recargar, notificar }) {
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [modal, setModal] = useState({ abierto: false, editando: null, form: VACIO });
  const [logo, setLogo] = useState(SIN_IMAGEN);
  const [banner, setBanner] = useState(SIN_IMAGEN);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [verMarca, setVerMarca] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopiar = async (url, key) => {
    if (!url) return;
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
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Error copiando URL:", err);
    }
  };

  const tipoPorId = useMemo(() => new Map(tipos.map((t) => [t.idTipoProducto, t])), [tipos]);
  const filtradas = filtroTipo === "TODOS" ? marcas : marcas.filter((m) => m.idTipoProducto === Number(filtroTipo));
  const tipoSeleccionado = tipoPorId.get(Number(modal.form.idTipoProducto));
  const requiereImagenes = Boolean(tipoSeleccionado?.requiereModeloMedidas);

  const abrir = (marca = null) => {
    setError(null);
    setLogo(SIN_IMAGEN);
    setBanner(SIN_IMAGEN);
    setModal({
      abierto: true,
      editando: marca,
      form: marca
        ? {
            idTipoProducto: String(marca.idTipoProducto),
            nombre: marca.nombre,
            paisOrigen: marca.paisOrigen || "",
            descripcion: marca.descripcion || "",
            activo: marca.activo !== false,
          }
        : { ...VACIO, idTipoProducto: filtroTipo !== "TODOS" ? filtroTipo : "" },
    });
  };
  const cambiar = (campo, valor) => setModal((m) => ({ ...m, form: { ...m.form, [campo]: valor } }));

  const tieneImagen = (imagen, actual) => Boolean(imagen.archivo || imagen.url || (actual && !imagen.quitar));

  const guardar = async () => {
    const { form, editando } = modal;
    if (!form.idTipoProducto) return setError("Selecciona primero el tipo de producto de la marca");
    if (!form.nombre.trim()) return setError("Ingresa el nombre de la marca");
    if (requiereImagenes) {
      const faltan = [];
      if (!tieneImagen(logo, editando?.logoUrl)) faltan.push("logo");
      if (!tieneImagen(banner, editando?.bannerUrl)) faltan.push("banner");
      if (faltan.length) return setError(`El ${faltan.join(" y el ")} ${faltan.length > 1 ? "son obligatorios" : "es obligatorio"} para marcas de ${tipoSeleccionado.nombre}`);
    }

    setGuardando(true);
    setError(null);
    try {
      const payload = {
        ...form,
        idTipoProducto: Number(form.idTipoProducto),
        nombre: form.nombre.trim(),
        ...(requiereImagenes && {
          logoUrl: logo.url,
          bannerUrl: banner.url,
          quitarLogo: logo.quitar || undefined,
          quitarBanner: banner.quitar || undefined,
        }),
      };
      const archivos = requiereImagenes ? { logo: logo.archivo, banner: banner.archivo } : {};
      if (editando) await nivelesService.actualizarMarca(editando.idMarca, payload, archivos);
      else await nivelesService.crearMarca(payload, archivos);
      setModal((m) => ({ ...m, abierto: false }));
      notificar(editando ? "Marca actualizada" : "Marca creada");
      await recargar();
    } catch (err) {
      setError(mensajeError(err, "No se pudo guardar la marca"));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (marca) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la marca "${marca.nombre}"?`)) return;
    try {
      await nivelesService.eliminarMarca(marca.idMarca);
      notificar(`${marca.nombre} eliminada`);
      await recargar();
    } catch (err) {
      alert(mensajeError(err, "No se pudo eliminar la marca"));
    }
  };

  return (
    <div className="space-y-4">
      <EncabezadoSeccion
        titulo="Marcas"
        descripcion="Cada marca pertenece a un tipo de producto. En Llantas el logo y el banner son obligatorios (se muestran en el card)."
        textoBoton="Agregar Marca"
        onNuevo={() => abrir()}
      >
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="h-8 rounded-lg border border-border bg-background px-3 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          <option value="TODOS">Todos los tipos</option>
          {tipos.map((t) => (
            <option key={t.idTipoProducto} value={t.idTipoProducto}>
              {t.nombre}
            </option>
          ))}
        </select>
      </EncabezadoSeccion>

      {filtradas.length === 0 ? (
        <Vacio>No hay marcas registradas para este filtro.</Vacio>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtradas.map((marca) => {
            const tipo = tipoPorId.get(marca.idTipoProducto);
            const incompleta = tipo?.requiereModeloMedidas && (!marca.logoUrl || !marca.bannerUrl);
            return (
              <div
                key={marca.idMarca}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-xs hover:border-border/80 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                      <Layers className="size-2.5" />
                      {tipo?.nombre || "Sin tipo"}
                    </span>
                    <EstadoActivo activo={marca.activo} />
                  </div>

                  {marca.bannerUrl && (
                    <div className="mt-2.5 h-10 w-full overflow-hidden rounded-md border border-border/40">
                      <img src={marca.bannerUrl} alt={`Banner ${marca.nombre}`} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="mt-2.5 flex items-center gap-3">
                    {marca.logoUrl ? (
                      <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg bg-white/5 p-1 border border-border/40">
                        <img
                          src={marca.logoUrl}
                          alt={marca.nombre}
                          className="max-h-9 max-w-full object-contain"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      </div>
                    ) : (
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold text-sm uppercase">
                        {marca.nombre.slice(0, 2)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-foreground text-sm truncate">{marca.nombre}</h4>
                      {marca.paisOrigen && (
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Globe className="size-3" /> {marca.paisOrigen}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground mt-2">
                    {marca.totalModelos} modelo(s) · {marca.totalProductos} producto(s)
                  </p>
                  {incompleta && (
                    <p className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                      <AlertTriangle className="size-3" /> Falta {!marca.logoUrl ? "logo" : ""}
                      {!marca.logoUrl && !marca.bannerUrl ? " y " : ""}
                      {!marca.bannerUrl ? "banner" : ""}
                    </p>
                  )}
                </div>
                <AccionesTarjeta onVer={() => setVerMarca(marca)} onEditar={() => abrir(marca)} onEliminar={() => eliminar(marca)} />
              </div>
            );
          })}
        </div>
      )}

      <ModalNivel
        abierto={modal.abierto}
        titulo={modal.editando ? "Editar Marca" : "Nueva Marca"}
        subtitulo="Selecciona primero el tipo de producto al que pertenece"
        error={error}
        guardando={guardando}
        onCerrar={() => setModal((m) => ({ ...m, abierto: false }))}
        onGuardar={guardar}
      >
        <Campo etiqueta="1. Tipo de producto" requerido>
          <select
            value={modal.form.idTipoProducto}
            onChange={(e) => cambiar("idTipoProducto", e.target.value)}
            disabled={Boolean(modal.editando && Number(modal.editando.totalProductos) + Number(modal.editando.totalModelos) > 0)}
            className={`${inputClass} font-semibold cursor-pointer disabled:opacity-60`}
          >
            <option value="">-- Selecciona un tipo de producto --</option>
            {tipos.map((t) => (
              <option key={t.idTipoProducto} value={t.idTipoProducto}>
                {t.nombre}
              </option>
            ))}
          </select>
        </Campo>

        <Campo etiqueta="2. Nombre de la marca" requerido>
          <input
            type="text"
            value={modal.form.nombre}
            onChange={(e) => cambiar("nombre", e.target.value)}
            className={inputClass}
            placeholder="Ej: Nankang, Davanti, Bosch"
          />
        </Campo>

        {requiereImagenes ? (
          <>
            <CampoImagen
              etiqueta="Logo de la marca"
              requerido
              ayuda="Se muestra en la parte superior del card del producto"
              urlActual={modal.editando?.logoUrl}
              onChange={setLogo}
            />
            <CampoImagen
              etiqueta="Banner de la marca"
              requerido
              ayuda="Imagen ancha para la sección de la marca (ej: 1200×300)"
              urlActual={modal.editando?.bannerUrl}
              onChange={setBanner}
              alto="h-10"
            />
          </>
        ) : (
          modal.form.idTipoProducto && (
            <Aviso>Para {tipoSeleccionado?.nombre} la marca se crea solo con el nombre (logo y banner no aplican).</Aviso>
          )
        )}

        <Campo etiqueta="País de origen">
          <input
            type="text"
            value={modal.form.paisOrigen}
            onChange={(e) => cambiar("paisOrigen", e.target.value)}
            className={inputClass}
            placeholder="Opcional"
          />
        </Campo>

        <Interruptor checked={modal.form.activo} onChange={(valor) => cambiar("activo", valor)}>
          Activa (disponible al crear productos)
        </Interruptor>
      </ModalNivel>

      {/* ── Modal Ver Imágenes y Copiar URLs ── */}
      {verMarca && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setVerMarca(null)}
        >
          <div
            className="relative w-full max-w-xl bg-card rounded-2xl border border-border p-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold text-xs uppercase">
                  {verMarca.nombre.slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Imágenes de {verMarca.nombre}</h3>
                  <p className="text-xs text-muted-foreground">Visualiza y copia las URLs de los recursos multimedia de la marca</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVerMarca(null)}
                className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                title="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Contenido de imágenes */}
            <div className="mt-5 space-y-5">
              {/* 1. LOGO */}
              <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wide">Logo de la marca</span>
                  {verMarca.logoUrl && (
                    <a
                      href={verMarca.logoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400 hover:underline"
                    >
                      <ExternalLink className="size-3" />
                      <span>Abrir original</span>
                    </a>
                  )}
                </div>

                {verMarca.logoUrl ? (
                  <>
                    <div className="flex h-20 w-full items-center justify-center rounded-lg bg-black/30 p-2 border border-border/40 mb-3">
                      <img
                        src={verMarca.logoUrl}
                        alt={`Logo ${verMarca.nombre}`}
                        className="max-h-16 max-w-full object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={verMarca.logoUrl}
                        className="h-8 flex-1 rounded-lg border border-border bg-background px-2.5 text-[11px] font-mono text-muted-foreground select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopiar(verMarca.logoUrl, "logo")}
                        className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                          copiedKey === "logo"
                            ? "bg-emerald-500 text-white shadow-xs"
                            : "border border-border bg-muted/60 hover:bg-muted text-foreground"
                        }`}
                      >
                        {copiedKey === "logo" ? (
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
                  </>
                ) : (
                  <p className="text-xs text-amber-400/90 italic flex items-center gap-1.5 py-2">
                    <AlertTriangle className="size-3.5" /> Esta marca no tiene logo asignado.
                  </p>
                )}
              </div>

              {/* 2. BANNER */}
              <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wide">Banner de la marca</span>
                  {verMarca.bannerUrl && (
                    <a
                      href={verMarca.bannerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400 hover:underline"
                    >
                      <ExternalLink className="size-3" />
                      <span>Abrir original</span>
                    </a>
                  )}
                </div>

                {verMarca.bannerUrl ? (
                  <>
                    <div className="h-16 w-full overflow-hidden rounded-lg border border-border/40 mb-3 bg-black/30 flex items-center justify-center">
                      <img
                        src={verMarca.bannerUrl}
                        alt={`Banner ${verMarca.nombre}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={verMarca.bannerUrl}
                        className="h-8 flex-1 rounded-lg border border-border bg-background px-2.5 text-[11px] font-mono text-muted-foreground select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopiar(verMarca.bannerUrl, "banner")}
                        className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                          copiedKey === "banner"
                            ? "bg-emerald-500 text-white shadow-xs"
                            : "border border-border bg-muted/60 hover:bg-muted text-foreground"
                        }`}
                      >
                        {copiedKey === "banner" ? (
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
                  </>
                ) : (
                  <p className="text-xs text-amber-400/90 italic flex items-center gap-1.5 py-2">
                    <AlertTriangle className="size-3.5" /> Esta marca no tiene banner asignado.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setVerMarca(null)}
                className="h-9 px-4 rounded-lg bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
