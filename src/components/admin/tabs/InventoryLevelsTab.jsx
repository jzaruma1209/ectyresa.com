import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, ChevronRight, FolderTree, Gauge, Layers, Ruler, RotateCw, Tag } from "lucide-react";
import nivelesService, { mensajeError } from "@/services/niveles.service";
import { TiposProductoPanel } from "../niveles/TiposProductoPanel";
import { MarcasPanel } from "../niveles/MarcasPanel";
import { ModelosPanel } from "../niveles/ModelosPanel";
import { MedidasPanel } from "../niveles/MedidasPanel";
import { EspecificacionesPanel } from "../niveles/EspecificacionesPanel";

const VACIO = {
  tiposProducto: [],
  marcas: [],
  modelos: [],
  tiposUso: [],
  anchos: [],
  altos: [],
  aros: [],
  especificaciones: [],
};

// Orden recomendado de carga: todo lo que se selecciona al crear un producto debe existir antes
const SECCIONES = [
  { id: "tipos", label: "Tipos de Producto", icon: FolderTree, contar: (d) => d.tiposProducto.length },
  { id: "marcas", label: "Marcas", icon: Tag, contar: (d) => d.marcas.length },
  { id: "modelos", label: "Modelos", icon: Layers, contar: (d) => d.modelos.length },
  { id: "medidas", label: "Medidas", icon: Ruler, contar: (d) => d.anchos.length + d.altos.length + d.aros.length },
  { id: "especificaciones", label: "Especificaciones", icon: Gauge, contar: (d) => d.especificaciones.length },
];

export function InventoryLevelsTab() {
  const [data, setData] = useState(VACIO);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("tipos");
  const [showNotification, setShowNotification] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const niveles = await nivelesService.getNiveles(true);
      setData({ ...VACIO, ...niveles });
    } catch (err) {
      setError(mensajeError(err, "No se pudieron cargar los niveles de inventario"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const notify = (msg) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const comunes = { recargar: fetchData, notificar: notify };

  return (
    <div className="space-y-6">
      {/* ── Encabezado Principal ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Niveles de Inventario</h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
              Mantenimiento
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configuración previa: todo lo que se selecciona al crear un producto se registra aquí primero
          </p>
        </div>

        <button
          type="button"
          onClick={async () => {
            await fetchData();
            notify("Datos recargados desde el servidor");
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
          title="Recargar datos del servidor"
        >
          <RotateCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Recargar</span>
        </button>
      </div>

      {/* Toast Notification Flotante */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/20 backdrop-blur-md px-4 py-2 text-xs font-medium text-primary shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="size-4 text-primary" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* ── Selector de secciones (en el orden del flujo) ── */}
      <div className="flex items-center gap-1 border-b border-border pb-2 overflow-x-auto">
        {SECCIONES.map((seccion, indice) => {
          const Icon = seccion.icon;
          return (
            <div key={seccion.id} className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setActiveSubTab(seccion.id)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeSubTab === seccion.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span className="font-mono opacity-70">{indice + 1}.</span>
                <Icon className="size-3.5" />
                <span>
                  {seccion.label} ({seccion.contar(data)})
                </span>
              </button>
              {indice < SECCIONES.length - 1 && <ChevronRight className="size-3.5 text-muted-foreground/50" />}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">{error}</div>
      )}

      {loading && data.tiposProducto.length === 0 ? (
        <div className="flex h-40 items-center justify-center gap-2 text-muted-foreground">
          <RotateCw className="size-5 animate-spin text-primary" />
          <span className="text-xs">Cargando niveles de inventario…</span>
        </div>
      ) : (
        <>
          {activeSubTab === "tipos" && <TiposProductoPanel tipos={data.tiposProducto} {...comunes} />}
          {activeSubTab === "marcas" && <MarcasPanel marcas={data.marcas} tipos={data.tiposProducto} {...comunes} />}
          {activeSubTab === "modelos" && (
            <ModelosPanel
              modelos={data.modelos}
              marcas={data.marcas}
              tipos={data.tiposProducto}
              tiposUso={data.tiposUso}
              {...comunes}
            />
          )}
          {activeSubTab === "medidas" && (
            <MedidasPanel anchos={data.anchos} altos={data.altos} aros={data.aros} {...comunes} />
          )}
          {activeSubTab === "especificaciones" && (
            <EspecificacionesPanel especificaciones={data.especificaciones} tipos={data.tiposProducto} {...comunes} />
          )}
        </>
      )}
    </div>
  );
}

export default InventoryLevelsTab;
