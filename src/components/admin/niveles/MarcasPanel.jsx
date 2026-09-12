import { useMemo, useState } from "react";
import { AlertTriangle, Globe, Layers } from "lucide-react";
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
                <AccionesTarjeta onEditar={() => abrir(marca)} onEliminar={() => eliminar(marca)} />
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
    </div>
  );
}
