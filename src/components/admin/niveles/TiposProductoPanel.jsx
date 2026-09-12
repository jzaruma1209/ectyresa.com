import { useState } from "react";
import { Ruler, Tag } from "lucide-react";
import nivelesService, { mensajeError } from "@/services/niveles.service";
import {
  AccionesTarjeta,
  Aviso,
  Campo,
  Codigo,
  EncabezadoSeccion,
  EstadoActivo,
  Interruptor,
  ModalNivel,
  Vacio,
  inputClass,
} from "./NivelesUI";

const VACIO = { nombre: "", descripcion: "", requiereModeloMedidas: false, activo: true };

export function TiposProductoPanel({ tipos, recargar, notificar }) {
  const [modal, setModal] = useState({ abierto: false, editando: null, form: VACIO });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const abrir = (tipo = null) => {
    setError(null);
    setModal({
      abierto: true,
      editando: tipo,
      form: tipo
        ? {
            nombre: tipo.nombre,
            descripcion: tipo.descripcion || "",
            requiereModeloMedidas: tipo.requiereModeloMedidas,
            activo: tipo.activo !== false,
          }
        : VACIO,
    });
  };
  const cambiar = (campo, valor) => setModal((m) => ({ ...m, form: { ...m.form, [campo]: valor } }));

  const guardar = async () => {
    if (!modal.form.nombre.trim()) return setError("Ingresa el nombre del tipo de producto");
    setGuardando(true);
    setError(null);
    try {
      const payload = { ...modal.form, nombre: modal.form.nombre.trim().toUpperCase() };
      if (modal.editando) await nivelesService.actualizarTipoProducto(modal.editando.idTipoProducto, payload);
      else await nivelesService.crearTipoProducto(payload);
      setModal((m) => ({ ...m, abierto: false }));
      notificar(modal.editando ? "Tipo de producto actualizado" : "Tipo de producto creado");
      await recargar();
    } catch (err) {
      setError(mensajeError(err, "No se pudo guardar el tipo de producto"));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (tipo) => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${tipo.nombre}"?`)) return;
    try {
      await nivelesService.eliminarTipoProducto(tipo.idTipoProducto);
      notificar(`${tipo.nombre} eliminado`);
      await recargar();
    } catch (err) {
      alert(mensajeError(err, "No se pudo eliminar"));
    }
  };

  const bloquearFlujo = modal.editando && Number(modal.editando.totalProductos) > 0;

  return (
    <div className="space-y-4">
      <EncabezadoSeccion
        titulo="Tipos de Producto"
        descripcion="Primer nivel: define si el producto usa el flujo con Modelo y Medidas (Llantas) o el flujo simple (Baterías, Accesorios…)"
        textoBoton="Agregar Tipo"
        onNuevo={() => abrir()}
      />

      {tipos.length === 0 ? (
        <Vacio>No hay tipos de producto registrados.</Vacio>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tipos.map((tipo) => (
            <div
              key={tipo.idTipoProducto}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-xs hover:border-border/80 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Codigo>{tipo.codigo}</Codigo>
                  <EstadoActivo activo={tipo.activo} />
                </div>
                <h4 className="font-bold text-foreground text-sm mt-2">{tipo.nombre}</h4>
                <div className="mt-2">
                  {tipo.requiereModeloMedidas ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                      <Ruler className="size-3" /> Marca → Modelo → Medidas
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
                      <Tag className="size-3" /> Solo Marca
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  {tipo.totalMarcas} marca(s) · {tipo.totalProductos} producto(s)
                </p>
              </div>
              <AccionesTarjeta onEditar={() => abrir(tipo)} onEliminar={() => eliminar(tipo)} />
            </div>
          ))}
        </div>
      )}

      <ModalNivel
        abierto={modal.abierto}
        titulo={modal.editando ? "Editar Tipo de Producto" : "Nuevo Tipo de Producto"}
        subtitulo="El código se genera automáticamente"
        error={error}
        guardando={guardando}
        onCerrar={() => setModal((m) => ({ ...m, abierto: false }))}
        onGuardar={guardar}
      >
        <Campo etiqueta="Nombre" requerido>
          <input
            type="text"
            value={modal.form.nombre}
            onChange={(e) => cambiar("nombre", e.target.value)}
            className={`${inputClass} font-bold uppercase`}
            placeholder="Ej: LLANTAS, BATERÍAS, ACCESORIOS"
          />
        </Campo>
        <Campo etiqueta="Descripción">
          <input
            type="text"
            value={modal.form.descripcion}
            onChange={(e) => cambiar("descripcion", e.target.value)}
            className={inputClass}
            placeholder="Opcional"
          />
        </Campo>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
          <Interruptor
            checked={modal.form.requiereModeloMedidas}
            onChange={(valor) => !bloquearFlujo && cambiar("requiereModeloMedidas", valor)}
          >
            <span className="font-semibold">¿Requiere Modelo y Medidas?</span>
          </Interruptor>
          <p className="text-[11px] text-muted-foreground">
            {modal.form.requiereModeloMedidas
              ? "Sí: al crear un producto se pedirá Marca → Modelo → Ancho / Alto / Aro, y sus marcas necesitan logo y banner."
              : "No: al crear un producto solo se pedirá la Marca."}
          </p>
          {bloquearFlujo && (
            <Aviso tipo="alerta">
              No se puede cambiar porque este tipo ya tiene {modal.editando.totalProductos} producto(s).
            </Aviso>
          )}
        </div>

        <Interruptor checked={modal.form.activo} onChange={(valor) => cambiar("activo", valor)}>
          Activo
        </Interruptor>
      </ModalNivel>
    </div>
  );
}
