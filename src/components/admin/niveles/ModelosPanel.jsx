import { useMemo, useState } from "react";
import { Plus, Tag, X } from "lucide-react";
import nivelesService, { mensajeError } from "@/services/niveles.service";
import {
  AccionesTarjeta,
  Aviso,
  Campo,
  EncabezadoSeccion,
  EstadoActivo,
  Interruptor,
  ModalNivel,
  Vacio,
  inputClass,
} from "./NivelesUI";

const VACIO = { idMarca: "", nombre: "", idTipoUso: "", activo: true };

export function ModelosPanel({ modelos, marcas, tipos, tiposUso, recargar, notificar }) {
  const [filtroMarca, setFiltroMarca] = useState("TODAS");
  const [modal, setModal] = useState({ abierto: false, editando: null, form: VACIO });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [nuevoUso, setNuevoUso] = useState({ codigo: "", descripcion: "" });

  // Solo marcas cuyo tipo de producto usa modelos (ej: Llantas)
  const tiposConModelo = useMemo(
    () => new Set(tipos.filter((t) => t.requiereModeloMedidas).map((t) => t.idTipoProducto)),
    [tipos]
  );
  const marcasConModelo = marcas.filter((m) => tiposConModelo.has(m.idTipoProducto));
  const filtrados = filtroMarca === "TODAS" ? modelos : modelos.filter((m) => m.idMarca === Number(filtroMarca));

  const abrir = (modelo = null) => {
    setError(null);
    setModal({
      abierto: true,
      editando: modelo,
      form: modelo
        ? {
            idMarca: String(modelo.idMarca),
            nombre: modelo.nombre,
            idTipoUso: modelo.idTipoUso ? String(modelo.idTipoUso) : "",
            activo: modelo.activo !== false,
          }
        : { ...VACIO, idMarca: filtroMarca !== "TODAS" ? filtroMarca : "" },
    });
  };
  const cambiar = (campo, valor) => setModal((m) => ({ ...m, form: { ...m.form, [campo]: valor } }));

  const guardar = async () => {
    const { form, editando } = modal;
    if (!form.idMarca) return setError("Selecciona primero la marca del modelo");
    if (!form.nombre.trim()) return setError("Ingresa el nombre del modelo");
    setGuardando(true);
    setError(null);
    try {
      const payload = {
        idMarca: Number(form.idMarca),
        nombre: form.nombre.trim(),
        idTipoUso: form.idTipoUso ? Number(form.idTipoUso) : null,
        activo: form.activo,
      };
      if (editando) await nivelesService.actualizarModelo(editando.idModelo, payload);
      else await nivelesService.crearModelo(payload);
      setModal((m) => ({ ...m, abierto: false }));
      notificar(editando ? "Modelo actualizado" : "Modelo creado");
      await recargar();
    } catch (err) {
      setError(mensajeError(err, "No se pudo guardar el modelo"));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (modelo) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el modelo "${modelo.nombre}"?`)) return;
    try {
      await nivelesService.eliminarModelo(modelo.idModelo);
      notificar(`${modelo.nombre} eliminado`);
      await recargar();
    } catch (err) {
      alert(mensajeError(err, "No se pudo eliminar el modelo"));
    }
  };

  const crearTipoUso = async (e) => {
    e.preventDefault();
    if (!nuevoUso.codigo.trim() || !nuevoUso.descripcion.trim()) return;
    try {
      await nivelesService.crearTipoUso(nuevoUso);
      setNuevoUso({ codigo: "", descripcion: "" });
      notificar("Tipo de uso creado");
      await recargar();
    } catch (err) {
      alert(mensajeError(err, "No se pudo crear el tipo de uso"));
    }
  };

  const eliminarTipoUso = async (tipoUso) => {
    if (!window.confirm(`¿Eliminar el tipo de uso "${tipoUso.codigo} - ${tipoUso.descripcion}"?`)) return;
    try {
      await nivelesService.eliminarTipoUso(tipoUso.idTipoUso);
      notificar("Tipo de uso eliminado");
      await recargar();
    } catch (err) {
      alert(mensajeError(err, "No se pudo eliminar el tipo de uso"));
    }
  };

  return (
    <div className="space-y-4">
      <EncabezadoSeccion
        titulo="Modelos"
        descripcion="Un modelo siempre pertenece a una sola marca. Solo aplica a tipos de producto con Modelo y Medidas."
        textoBoton="Agregar Modelo"
        onNuevo={marcasConModelo.length > 0 ? () => abrir() : null}
      >
        <select
          value={filtroMarca}
          onChange={(e) => setFiltroMarca(e.target.value)}
          className="h-8 rounded-lg border border-border bg-background px-3 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          <option value="TODAS">Todas las marcas</option>
          {marcasConModelo.map((m) => (
            <option key={m.idMarca} value={m.idMarca}>
              {m.nombre}
            </option>
          ))}
        </select>
      </EncabezadoSeccion>

      {marcasConModelo.length === 0 && (
        <Aviso tipo="alerta">
          Primero crea una marca de un tipo de producto que requiera Modelo y Medidas (ej: Llantas).
        </Aviso>
      )}

      {/* Catálogo de tipos de uso (dato informativo del modelo) */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Tipos de uso del modelo</h3>
          <p className="text-[11px] text-muted-foreground">
            Dato informativo que se muestra como insignia en el card (ej: AT = Todo Terreno). No afecta la jerarquía.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tiposUso.map((t) => (
            <span
              key={t.idTipoUso}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 pl-2 pr-1 py-0.5 text-[11px] text-foreground"
            >
              <span className="font-mono font-bold text-primary">{t.codigo}</span>
              <span>{t.descripcion}</span>
              <button
                type="button"
                onClick={() => eliminarTipoUso(t)}
                className="rounded p-0.5 text-muted-foreground hover:text-destructive cursor-pointer"
                title="Eliminar"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
        <form onSubmit={crearTipoUso} className="flex flex-wrap items-center gap-2">
          <input
            value={nuevoUso.codigo}
            onChange={(e) => setNuevoUso({ ...nuevoUso, codigo: e.target.value.toUpperCase().slice(0, 5) })}
            placeholder="Código (AT)"
            className={`${inputClass} w-28 font-mono uppercase`}
          />
          <input
            value={nuevoUso.descripcion}
            onChange={(e) => setNuevoUso({ ...nuevoUso, descripcion: e.target.value })}
            placeholder="Descripción (Todo Terreno)"
            className={`${inputClass} flex-1 min-w-40`}
          />
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-3 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" /> Agregar
          </button>
        </form>
      </div>

      {filtrados.length === 0 ? (
        <Vacio>No hay modelos registrados para este filtro.</Vacio>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtrados.map((modelo) => (
            <div
              key={modelo.idModelo}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-xs hover:border-border/80 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                    <Tag className="size-2.5" /> {modelo.marca?.nombre}
                  </span>
                  <EstadoActivo activo={modelo.activo} />
                </div>
                <h4 className="font-bold text-foreground text-sm mt-2">{modelo.nombre}</h4>
                {modelo.tipoUso && (
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Uso: <span className="font-mono font-bold text-foreground">{modelo.tipoUso.codigo}</span>{" "}
                    {modelo.tipoUso.descripcion}
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground mt-1">{modelo.totalProductos} producto(s)</p>
              </div>
              <AccionesTarjeta onEditar={() => abrir(modelo)} onEliminar={() => eliminar(modelo)} />
            </div>
          ))}
        </div>
      )}

      <ModalNivel
        abierto={modal.abierto}
        titulo={modal.editando ? "Editar Modelo" : "Nuevo Modelo"}
        subtitulo="Selecciona primero la marca: el modelo quedará ligado a ella"
        error={error}
        guardando={guardando}
        onCerrar={() => setModal((m) => ({ ...m, abierto: false }))}
        onGuardar={guardar}
      >
        <Campo etiqueta="1. Marca" requerido>
          <select
            value={modal.form.idMarca}
            onChange={(e) => cambiar("idMarca", e.target.value)}
            disabled={Boolean(modal.editando && Number(modal.editando.totalProductos) > 0)}
            className={`${inputClass} font-semibold cursor-pointer disabled:opacity-60`}
          >
            <option value="">-- Selecciona una marca --</option>
            {marcasConModelo.map((m) => (
              <option key={m.idMarca} value={m.idMarca}>
                {m.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="2. Nombre del modelo" requerido>
          <input
            type="text"
            value={modal.form.nombre}
            onChange={(e) => cambiar("nombre", e.target.value)}
            disabled={!modal.form.idMarca}
            className={`${inputClass} disabled:opacity-60`}
            placeholder={modal.form.idMarca ? "Ej: NS-2, FT-7, Terracota AT" : "← Primero elige la marca"}
          />
        </Campo>
        <Campo etiqueta="Tipo de uso" ayuda="Opcional — informativo">
          <select
            value={modal.form.idTipoUso}
            onChange={(e) => cambiar("idTipoUso", e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Sin especificar</option>
            {tiposUso.map((t) => (
              <option key={t.idTipoUso} value={t.idTipoUso}>
                {t.codigo} — {t.descripcion}
              </option>
            ))}
          </select>
        </Campo>
        <Interruptor checked={modal.form.activo} onChange={(valor) => cambiar("activo", valor)}>
          Activo
        </Interruptor>
      </ModalNivel>
    </div>
  );
}
