import { useMemo, useState } from "react";
import { Eye, EyeOff, Plus, Upload, X } from "lucide-react";
import nivelesService, { TIPOS_MEDIDA, mensajeError } from "@/services/niveles.service";
import { Aviso, EncabezadoSeccion, inputClass } from "./NivelesUI";

function ColumnaMedida({ config, medidas, recargar, notificar }) {
  const [valor, setValor] = useState("");
  const [guardando, setGuardando] = useState(false);

  const agregar = async (e) => {
    e.preventDefault();
    if (!valor.trim()) return;
    setGuardando(true);
    try {
      await nivelesService.crearMedida(config.clave, valor.trim().replace(",", "."));
      setValor("");
      notificar(`${config.singular[0].toUpperCase()}${config.singular.slice(1)} agregado`);
      await recargar();
    } catch (err) {
      alert(mensajeError(err, "No se pudo agregar la medida"));
    } finally {
      setGuardando(false);
    }
  };

  const alternar = async (medida) => {
    try {
      await nivelesService.actualizarMedida(config.clave, medida[config.pk], { activo: !medida.activo });
      await recargar();
    } catch (err) {
      alert(mensajeError(err, "No se pudo actualizar la medida"));
    }
  };

  const eliminar = async (medida) => {
    if (!window.confirm(`¿Eliminar el ${config.singular} ${medida.valor}?`)) return;
    try {
      await nivelesService.eliminarMedida(config.clave, medida[config.pk]);
      notificar("Medida eliminada");
      await recargar();
    } catch (err) {
      alert(mensajeError(err, "No se pudo eliminar la medida"));
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">{config.etiqueta}</h3>
        <span className="text-[11px] text-muted-foreground">{medidas.length} valores</span>
      </div>

      <form onSubmit={agregar} className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder={`Ej: ${config.ejemplo}`}
          className={`${inputClass} font-mono`}
        />
        <button
          type="submit"
          disabled={guardando}
          className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer disabled:opacity-60"
        >
          <Plus className="size-3.5" />
        </button>
      </form>

      <div className="flex flex-wrap gap-1.5">
        {medidas.map((medida) => (
          <span
            key={medida[config.pk]}
            title={`${medida.totalProductos} producto(s)`}
            className={`inline-flex items-center gap-1 rounded-md border pl-2 pr-1 py-0.5 text-xs font-mono font-bold ${
              medida.activo
                ? "border-border bg-muted/40 text-foreground"
                : "border-border/40 bg-transparent text-muted-foreground line-through"
            }`}
          >
            {medida.valor}
            {Number(medida.totalProductos) > 0 && (
              <span className="text-[9px] font-sans font-semibold text-primary">({medida.totalProductos})</span>
            )}
            <button
              type="button"
              onClick={() => alternar(medida)}
              className="rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
              title={medida.activo ? "Ocultar al crear productos" : "Mostrar al crear productos"}
            >
              {medida.activo ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
            </button>
            <button
              type="button"
              onClick={() => eliminar(medida)}
              className="rounded p-0.5 text-muted-foreground hover:text-destructive cursor-pointer"
              title="Eliminar"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export function MedidasPanel({ anchos, altos, aros, recargar, notificar }) {
  const listas = { anchos, altos, aros };
  const pendientes = useMemo(() => nivelesService.medidasLocalesPendientes({ anchos, altos, aros }), [anchos, altos, aros]);
  const totalPendientes = Object.values(pendientes).reduce((acc, v) => acc + v.length, 0);
  const [importando, setImportando] = useState(false);

  const importar = async () => {
    setImportando(true);
    try {
      const creadas = await nivelesService.importarMedidasLocales(pendientes);
      notificar(`${creadas} medida(s) importada(s) a la base de datos`);
      await recargar();
    } catch (err) {
      alert(mensajeError(err, "No se pudieron importar las medidas"));
    } finally {
      setImportando(false);
    }
  };

  return (
    <div className="space-y-4">
      <EncabezadoSeccion
        titulo="Medidas (Ancho / Alto / Aro)"
        descripcion="Tres listas independientes que no dependen de marca ni modelo. Al crear una llanta se combina un valor de cada una (ej: 225/75R15)."
      />

      {totalPendientes > 0 && (
        <Aviso tipo="alerta">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>
              Este navegador tiene {totalPendientes} medida(s) guardadas por la versión anterior del panel que aún no
              están en la base de datos.
            </span>
            <button
              type="button"
              onClick={importar}
              disabled={importando}
              className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 px-2 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/30 cursor-pointer disabled:opacity-60"
            >
              <Upload className="size-3" /> {importando ? "Importando…" : "Importar ahora"}
            </button>
          </div>
        </Aviso>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {TIPOS_MEDIDA.map((config) => (
          <ColumnaMedida
            key={config.clave}
            config={config}
            medidas={listas[config.clave] || []}
            recargar={recargar}
            notificar={notificar}
          />
        ))}
      </div>
    </div>
  );
}
