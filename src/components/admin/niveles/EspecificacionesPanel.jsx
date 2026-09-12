import { useState } from "react";
import { Gauge } from "lucide-react";
import nivelesService, { mensajeError } from "@/services/niveles.service";
import {
  AccionesTarjeta,
  Campo,
  CampoImagen,
  EncabezadoSeccion,
  EstadoActivo,
  Interruptor,
  ModalNivel,
  Vacio,
  inputClass,
} from "./NivelesUI";

const VACIO = { nombre: "", idsTipoProducto: [], activo: true };
const SIN_ICONO = { archivo: null, url: undefined, quitar: false };

export function EspecificacionesPanel({ especificaciones, tipos, recargar, notificar }) {
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [modal, setModal] = useState({ abierto: false, editando: null, form: VACIO });
  const [icono, setIcono] = useState(SIN_ICONO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const filtradas =
    filtroTipo === "TODOS"
      ? especificaciones
      : especificaciones.filter((e) => e.tiposProducto.some((t) => t.idTipoProducto === Number(filtroTipo)));

  const abrir = (especificacion = null) => {
    setError(null);
    setIcono(SIN_ICONO);
    setModal({
      abierto: true,
      editando: especificacion,
      form: especificacion
        ? {
            nombre: especificacion.nombre,
            idsTipoProducto: especificacion.tiposProducto.map((t) => t.idTipoProducto),
            activo: especificacion.activo !== false,
          }
        : { ...VACIO, idsTipoProducto: filtroTipo !== "TODOS" ? [Number(filtroTipo)] : [] },
    });
  };

  const alternarTipo = (idTipoProducto) =>
    setModal((m) => {
      const ids = m.form.idsTipoProducto.includes(idTipoProducto)
        ? m.form.idsTipoProducto.filter((id) => id !== idTipoProducto)
        : [...m.form.idsTipoProducto, idTipoProducto];
      return { ...m, form: { ...m.form, idsTipoProducto: ids } };
    });

  const guardar = async () => {
    const { form, editando } = modal;
    if (!form.nombre.trim()) return setError("Ingresa el nombre de la especificación");
    if (form.idsTipoProducto.length === 0) {
      return setError("Selecciona al menos un tipo de producto al que aplica");
    }
    setGuardando(true);
    setError(null);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        idsTipoProducto: form.idsTipoProducto,
        activo: form.activo,
        iconoUrl: icono.url,
        quitarIcono: icono.quitar || undefined,
      };
      if (editando) await nivelesService.actualizarEspecificacion(editando.idEspecificacion, payload, icono.archivo);
      else await nivelesService.crearEspecificacion(payload, icono.archivo);
      setModal((m) => ({ ...m, abierto: false }));
      notificar(editando ? "Especificación actualizada" : "Especificación creada");
      await recargar();
    } catch (err) {
      setError(mensajeError(err, "No se pudo guardar la especificación"));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (especificacion) => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${especificacion.nombre}"?`)) return;
    try {
      await nivelesService.eliminarEspecificacion(especificacion.idEspecificacion);
      notificar(`${especificacion.nombre} eliminada`);
      await recargar();
    } catch (err) {
      alert(mensajeError(err, "No se pudo eliminar la especificación"));
    }
  };

  return (
    <div className="space-y-4">
      <EncabezadoSeccion
        titulo="Especificaciones Técnicas"
        descripcion="Se crean una sola vez y al crear un producto solo se sugieren las que aplican a su tipo (ej: Tracción → Llantas, Voltaje → Baterías)."
        textoBoton="Agregar Especificación"
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
        <Vacio>No hay especificaciones técnicas para este filtro.</Vacio>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtradas.map((especificacion) => (
            <div
              key={especificacion.idEspecificacion}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-xs hover:border-border/80 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-white/5 border border-border/40 p-1">
                    {especificacion.iconoUrl ? (
                      <img src={especificacion.iconoUrl} alt="" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Gauge className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <EstadoActivo activo={especificacion.activo} />
                </div>
                <h4 className="font-bold text-foreground text-sm mt-2">{especificacion.nombre}</h4>
                <div className="mt-2 flex flex-wrap gap-1">
                  {especificacion.tiposProducto.map((t) => (
                    <span
                      key={t.idTipoProducto}
                      className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary border border-primary/20"
                    >
                      {t.nombre}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Usada en {especificacion.totalProductos} producto(s)
                </p>
              </div>
              <AccionesTarjeta onEditar={() => abrir(especificacion)} onEliminar={() => eliminar(especificacion)} />
            </div>
          ))}
        </div>
      )}

      <ModalNivel
        abierto={modal.abierto}
        titulo={modal.editando ? "Editar Especificación" : "Nueva Especificación Técnica"}
        subtitulo="El valor (ej: Tracción = A) se asigna luego en cada producto"
        error={error}
        guardando={guardando}
        onCerrar={() => setModal((m) => ({ ...m, abierto: false }))}
        onGuardar={guardar}
      >
        <Campo etiqueta="Nombre" requerido>
          <input
            type="text"
            value={modal.form.nombre}
            onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, nombre: e.target.value } }))}
            className={inputClass}
            placeholder="Ej: Tracción, Temperatura, Voltaje, Amperaje"
          />
        </Campo>

        <Campo etiqueta="Aplica a los tipos de producto" requerido>
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-background/50 p-3">
            {tipos.map((t) => (
              <Interruptor
                key={t.idTipoProducto}
                checked={modal.form.idsTipoProducto.includes(t.idTipoProducto)}
                onChange={() => alternarTipo(t.idTipoProducto)}
              >
                {t.nombre}
              </Interruptor>
            ))}
          </div>
        </Campo>

        <CampoImagen
          etiqueta="Ícono"
          ayuda="Imagen pequeña que acompaña al valor en el card (opcional)"
          urlActual={modal.editando?.iconoUrl}
          onChange={setIcono}
          alto="h-10"
        />

        <Interruptor
          checked={modal.form.activo}
          onChange={(valor) => setModal((m) => ({ ...m, form: { ...m.form, activo: valor } }))}
        >
          Activa (se sugiere al crear productos)
        </Interruptor>
      </ModalNivel>
    </div>
  );
}
