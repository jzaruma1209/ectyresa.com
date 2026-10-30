import { useEffect, useMemo, useState } from "react";
import { X, Save, RotateCw, Ruler, Tag, Gauge, AlertTriangle, Sparkles, Plus } from "lucide-react";
import adminService from "@/services/admin.service";
import nivelesService, { mensajeError } from "@/services/niveles.service";
import ProductImagesManager, { MAX_IMAGENES } from "../ProductImagesManager";

const FORM_INICIAL = {
  idTipoProducto: "",
  idMarca: "",
  idModelo: "",
  idAncho: "",
  idAlto: "",
  idAro: "",
  nombre: "",
  descripcion: "",
  precio: "",
  precioAnterior: "",
  stock: "0",
  esNuevo: false,
  enOferta: false,
  envioGratis: false,
  aplicaDevoluciones: false,
  aplicaGarantia: false,
  destacado: false,
  activo: true,
};

const NIVELES_VACIOS = { tiposProducto: [], marcas: [], modelos: [], anchos: [], altos: [], aros: [], especificaciones: [] };

const OPCIONES = [
  { campo: "esNuevo", label: "Es Nuevo" },
  { campo: "enOferta", label: "En Oferta" },
  { campo: "envioGratis", label: "Aplica Envío Gratis" },
  { campo: "aplicaDevoluciones", label: "Aplica Devoluciones" },
  { campo: "aplicaGarantia", label: "Aplica Garantía" },
  { campo: "destacado", label: "Mostrar en productos destacados" },
];

const inputClass =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed";
const numeroClass = `${inputClass} font-mono`;

const aNumero = (valor) => (valor === "" || valor === null || valor === undefined ? null : Number(String(valor).replace(",", ".")));
// Muestra en la lista activos + el que ya está seleccionado (aunque se haya desactivado)
const visibles = (lista, idSeleccionado, pk) =>
  lista.filter((item) => item.activo !== false || String(item[pk]) === String(idSeleccionado));

function Paso({ numero, titulo, children, destacado = false }) {
  return (
    <section
      className={`rounded-xl border p-4 space-y-3 ${destacado ? "border-primary/40 bg-primary/5" : "border-border bg-muted/10"}`}
    >
      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-foreground">
        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
          {numero}
        </span>
        {titulo}
      </h4>
      {children}
    </section>
  );
}

function Etiqueta({ children, requerido }) {
  return (
    <label className="block text-xs font-semibold text-foreground mb-1">
      {children} {requerido && <span className="text-primary">*</span>}
    </label>
  );
}

export function ProductModal({ isOpen, onClose, onSaved, productToEdit }) {
  const [niveles, setNiveles] = useState(NIVELES_VACIOS);
  const [form, setForm] = useState(FORM_INICIAL);
  const [valoresEspec, setValoresEspec] = useState({}); // { idEspecificacion: valor }
  const [imagenes, setImagenes] = useState([]);
  const [principal, setPrincipal] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errores, setErrores] = useState([]);
  const [nuevaEspec, setNuevaEspec] = useState(null); // { nombre, creando, error } mientras se crea una especificación

  const idEdicion = productToEdit?.idProducto ?? null;

  // ─── Carga de niveles de inventario y del producto a editar ─────────────
  useEffect(() => {
    if (!isOpen) return;
    let cancelado = false;
    setErrores([]);
    setCargando(true);

    const cargar = async () => {
      try {
        const [datosNiveles, respuestaProducto] = await Promise.all([
          nivelesService.getNiveles(true),
          idEdicion ? adminService.getProducto(idEdicion) : Promise.resolve(null),
        ]);
        if (cancelado) return;
        setNiveles({ ...NIVELES_VACIOS, ...datosNiveles });

        const p = respuestaProducto?.data;
        if (p) {
          setForm({
            idTipoProducto: String(p.tipoProducto?.idTipoProducto ?? ""),
            idMarca: String(p.marca?.idMarca ?? ""),
            idModelo: p.modelo ? String(p.modelo.idModelo) : "",
            idAncho: p.medidas ? String(p.medidas.idAncho) : "",
            idAlto: p.medidas ? String(p.medidas.idAlto) : "",
            idAro: p.medidas ? String(p.medidas.idAro) : "",
            nombre: p.nombre || "",
            descripcion: p.descripcion || "",
            precio: p.precio != null ? String(p.precio) : "",
            precioAnterior: p.precioAnterior != null ? String(p.precioAnterior) : "",
            stock: String(p.stock ?? 0),
            esNuevo: p.esNuevo,
            enOferta: p.enOferta,
            envioGratis: p.envioGratis,
            aplicaDevoluciones: p.aplicaDevoluciones,
            aplicaGarantia: p.aplicaGarantia,
            destacado: p.destacado,
            activo: p.activo,
          });
          setValoresEspec(Object.fromEntries(p.especificaciones.map((e) => [e.idEspecificacion, e.valor])));
          const existentes = p.imagenes.map((img) => ({ clave: `existente-${img.idImagen}`, idImagen: img.idImagen, url: img.urlImagen }));
          setImagenes(existentes);
          setPrincipal(existentes.find((_, i) => p.imagenes[i].esPrincipal)?.clave ?? existentes[0]?.clave ?? null);
        } else {
          setForm(FORM_INICIAL);
          setValoresEspec({});
          setImagenes([]);
          setPrincipal(null);
        }
      } catch (err) {
        if (!cancelado) setErrores([mensajeError(err, "No se pudo cargar la información del formulario")]);
      } finally {
        if (!cancelado) setCargando(false);
      }
    };
    cargar();
    return () => {
      cancelado = true;
    };
  }, [isOpen, idEdicion]);

  // ─── Datos derivados del flujo ──────────────────────────────────────────
  const tipo = niveles.tiposProducto.find((t) => String(t.idTipoProducto) === form.idTipoProducto);
  const requiereModeloMedidas = Boolean(tipo?.requiereModeloMedidas);
  const marcasDelTipo = visibles(
    niveles.marcas.filter((m) => String(m.idTipoProducto) === form.idTipoProducto),
    form.idMarca,
    "idMarca"
  );
  const modelosDeLaMarca = visibles(
    niveles.modelos.filter((m) => String(m.idMarca) === form.idMarca),
    form.idModelo,
    "idModelo"
  );
  const especificacionesDelTipo = niveles.especificaciones.filter(
    (e) =>
      e.tiposProducto.some((t) => String(t.idTipoProducto) === form.idTipoProducto) &&
      (e.activo !== false || valoresEspec[e.idEspecificacion])
  );
  // Crea la especificación ya enlazada al tipo elegido y la deja lista para llenar su valor
  const crearEspecificacion = async () => {
    const nombre = nuevaEspec?.nombre.trim();
    if (!nombre) return setNuevaEspec((s) => ({ ...s, error: "Escribe el nombre de la especificación" }));
    setNuevaEspec((s) => ({ ...s, creando: true, error: null }));
    try {
      const creada = await nivelesService.crearEspecificacion(
        { nombre, idsTipoProducto: [Number(form.idTipoProducto)], activo: true },
        null
      );
      setNiveles((n) => ({ ...n, especificaciones: [...n.especificaciones, creada] }));
      setNuevaEspec(null);
    } catch (err) {
      setNuevaEspec((s) => ({ ...s, creando: false, error: mensajeError(err, "No se pudo crear la especificación") }));
    }
  };

  const marca = niveles.marcas.find((m) => String(m.idMarca) === form.idMarca);
  const modelo = niveles.modelos.find((m) => String(m.idModelo) === form.idModelo);
  const valorMedida = (lista, pk, id) => lista.find((m) => String(m[pk]) === id)?.valor;
  const medidaTexto =
    form.idAncho && form.idAlto && form.idAro
      ? `${valorMedida(niveles.anchos, "idAncho", form.idAncho)}/${valorMedida(niveles.altos, "idAlto", form.idAlto)}R${valorMedida(niveles.aros, "idAro", form.idAro)}`
      : "";
  const nombreSugerido = [medidaTexto, marca?.nombre, requiereModeloMedidas ? modelo?.nombre : null].filter(Boolean).join(" ");

  const precio = aNumero(form.precio);
  const precioAnterior = aNumero(form.precioAnterior);
  const descuento = precio > 0 && precioAnterior > precio ? Math.round(((precioAnterior - precio) / precioAnterior) * 100) : null;

  // ─── Validación en el formulario (primera barrera; el backend vuelve a validar) ─
  const validacion = useMemo(() => {
    const lista = [];
    if (!form.idTipoProducto) lista.push("Selecciona el tipo de producto");
    if (!form.idMarca) lista.push("Selecciona la marca");
    if (requiereModeloMedidas) {
      if (!form.idModelo) lista.push(`El modelo es obligatorio para ${tipo.nombre}`);
      if (!form.idAncho || !form.idAlto || !form.idAro) lista.push("Selecciona ancho, alto y aro");
    }
    if (form.nombre.trim().length < 2) lista.push("Ingresa el nombre del producto");
    if (precio === null || Number.isNaN(precio) || precio <= 0) lista.push("El precio debe ser mayor a 0");
    if (precioAnterior !== null && (Number.isNaN(precioAnterior) || precioAnterior <= (precio || 0))) {
      lista.push("El precio anterior debe ser mayor al precio actual");
    }
    if (form.enOferta && precioAnterior === null) lista.push('Para marcar "En Oferta" ingresa el precio anterior');
    const stock = aNumero(form.stock);
    if (stock === null || !Number.isInteger(stock) || stock < 0) lista.push("El stock debe ser un entero mayor o igual a 0");
    if (imagenes.length === 0) lista.push("Agrega al menos una foto del producto");
    if (imagenes.length > MAX_IMAGENES) lista.push(`Máximo ${MAX_IMAGENES} fotos por producto`);
    return lista;
  }, [form, requiereModeloMedidas, tipo, precio, precioAnterior, imagenes.length]);

  if (!isOpen) return null;

  const cambiar = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }));

  const cambiarTipo = (idTipoProducto) => {
    // Al cambiar de tipo se reinicia la jerarquía y se quitan especificaciones que ya no aplican
    setForm((prev) => ({ ...prev, idTipoProducto, idMarca: "", idModelo: "", idAncho: "", idAlto: "", idAro: "" }));
    const aplican = new Set(
      niveles.especificaciones
        .filter((e) => e.tiposProducto.some((t) => String(t.idTipoProducto) === idTipoProducto))
        .map((e) => String(e.idEspecificacion))
    );
    setValoresEspec((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => aplican.has(id))));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validacion.length > 0) {
      setErrores(validacion);
      return;
    }
    setSaving(true);
    setErrores([]);

    const nuevas = imagenes.filter((img) => img.archivo);
    const conservadas = imagenes.filter((img) => img.idImagen);
    const imagenPrincipal = imagenes.find((img) => img.clave === principal) || imagenes[0];

    const datos = {
      idTipoProducto: Number(form.idTipoProducto),
      idMarca: Number(form.idMarca),
      ...(requiereModeloMedidas && {
        idModelo: Number(form.idModelo),
        idAncho: Number(form.idAncho),
        idAlto: Number(form.idAlto),
        idAro: Number(form.idAro),
      }),
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio,
      precioAnterior,
      stock: aNumero(form.stock),
      esNuevo: form.esNuevo,
      enOferta: form.enOferta,
      envioGratis: form.envioGratis,
      aplicaDevoluciones: form.aplicaDevoluciones,
      aplicaGarantia: form.aplicaGarantia,
      destacado: form.destacado,
      activo: form.activo,
      especificaciones: especificacionesDelTipo
        .filter((esp) => String(valoresEspec[esp.idEspecificacion] ?? "").trim())
        .map((esp) => ({ idEspecificacion: esp.idEspecificacion, valor: String(valoresEspec[esp.idEspecificacion]).trim() })),
      imagenesConservar: conservadas.map((img) => img.idImagen),
      ...(imagenPrincipal?.idImagen
        ? { principalExistente: imagenPrincipal.idImagen }
        : { principalNueva: Math.max(0, nuevas.findIndex((img) => img.clave === imagenPrincipal?.clave)) }),
    };

    try {
      await adminService.guardarProducto(idEdicion, datos, nuevas.map((img) => img.archivo));
      onSaved?.();
      onClose();
    } catch (err) {
      const lista = err.response?.data?.errors;
      setErrores(Array.isArray(lista) && lista.length ? lista : [mensajeError(err, "No se pudo guardar el producto")]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[95vh] w-full max-w-3xl flex-col rounded-xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {productToEdit ? "Editar Producto" : "Registrar Nuevo Producto"}
            </h3>
            <p className="text-xs text-muted-foreground">
              Todo lo que se selecciona aquí se configura antes en Niveles de Inventario.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {errores.length > 0 && (
          <div className="mt-3 max-h-32 shrink-0 overflow-y-auto rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
            <div className="flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="size-3.5" /> Revisa lo siguiente antes de guardar:
            </div>
            <ul className="mt-1 list-disc pl-5 space-y-0.5">
              {errores.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {cargando ? (
          <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
            <RotateCw className="size-5 animate-spin text-primary" />
            <span className="text-xs">Cargando niveles de inventario…</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
            {/* ── Paso 1: Tipo de producto ── */}
            <Paso numero={1} titulo="Tipo de producto" destacado>
              <select
                value={form.idTipoProducto}
                onChange={(e) => cambiarTipo(e.target.value)}
                className={`${inputClass} font-semibold cursor-pointer`}
              >
                <option value="">Seleccionar tipo de producto…</option>
                {visibles(niveles.tiposProducto, form.idTipoProducto, "idTipoProducto").map((t) => (
                  <option key={t.idTipoProducto} value={t.idTipoProducto}>
                    {t.nombre}
                  </option>
                ))}
              </select>
              {tipo && (
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  {requiereModeloMedidas ? <Ruler className="size-3.5 text-primary" /> : <Tag className="size-3.5 text-primary" />}
                  {requiereModeloMedidas
                    ? "Este tipo usa Marca → Modelo → Ancho / Alto / Aro."
                    : "Este tipo solo requiere la Marca."}
                </p>
              )}
            </Paso>

            {/* ── Paso 2: Marca (+ Modelo y Medidas si aplica) ── */}
            {tipo && (
              <Paso numero={2} titulo={requiereModeloMedidas ? "Marca, modelo y medidas" : "Marca"}>
                <div className={`grid gap-4 ${requiereModeloMedidas ? "sm:grid-cols-2" : ""}`}>
                  <div>
                    <Etiqueta requerido>Marca</Etiqueta>
                    <select
                      value={form.idMarca}
                      onChange={(e) => setForm((prev) => ({ ...prev, idMarca: e.target.value, idModelo: "" }))}
                      disabled={marcasDelTipo.length === 0}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">
                        {marcasDelTipo.length === 0 ? "No hay marcas para este tipo" : "Seleccionar marca…"}
                      </option>
                      {marcasDelTipo.map((m) => (
                        <option key={m.idMarca} value={m.idMarca}>
                          {m.nombre}
                        </option>
                      ))}
                    </select>
                    {marcasDelTipo.length === 0 && (
                      <span className="text-[10px] text-amber-500 font-medium mt-1 block">
                        ⚠️ Crea primero una marca para {tipo.nombre} en Niveles de Inventario → Marcas.
                      </span>
                    )}
                  </div>

                  {requiereModeloMedidas && (
                    <div>
                      <Etiqueta requerido>Modelo</Etiqueta>
                      <select
                        value={form.idModelo}
                        onChange={(e) => cambiar("idModelo", e.target.value)}
                        disabled={!form.idMarca || modelosDeLaMarca.length === 0}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="">
                          {!form.idMarca
                            ? "← Primero selecciona la marca"
                            : modelosDeLaMarca.length === 0
                              ? "Esta marca no tiene modelos"
                              : "Seleccionar modelo…"}
                        </option>
                        {modelosDeLaMarca.map((m) => (
                          <option key={m.idModelo} value={m.idModelo}>
                            {m.nombre}
                            {m.tipoUso ? ` (${m.tipoUso.codigo})` : ""}
                          </option>
                        ))}
                      </select>
                      {form.idMarca && modelosDeLaMarca.length === 0 && (
                        <span className="text-[10px] text-amber-500 font-medium mt-1 block">
                          ⚠️ Crea un modelo para {marca?.nombre} en Niveles de Inventario → Modelos.
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {requiereModeloMedidas && (
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { campo: "idAncho", etiqueta: "Ancho", lista: niveles.anchos, pk: "idAncho", sufijo: "" },
                      { campo: "idAlto", etiqueta: "Alto", lista: niveles.altos, pk: "idAlto", sufijo: "" },
                      { campo: "idAro", etiqueta: "Aro", lista: niveles.aros, pk: "idAro", sufijo: "R" },
                    ].map(({ campo, etiqueta, lista, pk, sufijo }) => (
                      <div key={campo}>
                        <Etiqueta requerido>{etiqueta}</Etiqueta>
                        <select
                          value={form[campo]}
                          onChange={(e) => cambiar(campo, e.target.value)}
                          className={`${numeroClass} cursor-pointer`}
                        >
                          <option value="">Seleccionar…</option>
                          {visibles(lista, form[campo], pk).map((m) => (
                            <option key={m[pk]} value={m[pk]}>
                              {sufijo}
                              {m.valor}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
                {medidaTexto && (
                  <p className="text-[11px] text-muted-foreground">
                    Medida: <span className="rounded bg-muted px-2 py-0.5 font-mono font-semibold text-foreground">{medidaTexto}</span>
                  </p>
                )}
              </Paso>
            )}

            {/* ── Paso 3: Datos comunes ── */}
            <Paso numero={3} titulo="Datos del producto">
              <div>
                <Etiqueta requerido>Nombre del producto</Etiqueta>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => cambiar("nombre", e.target.value)}
                    placeholder={nombreSugerido || "Ej. Batería Bosch S4 12V"}
                    className={inputClass}
                  />
                  {nombreSugerido && nombreSugerido !== form.nombre && (
                    <button
                      type="button"
                      onClick={() => cambiar("nombre", nombreSugerido)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                      title={`Usar "${nombreSugerido}"`}
                    >
                      <Sparkles className="size-3.5" /> Sugerir
                    </button>
                  )}
                </div>
              </div>

              <div>
                <Etiqueta>Descripción</Etiqueta>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => cambiar("descripcion", e.target.value)}
                  rows={12}
                  placeholder="Características destacadas del producto…"
                  className="min-h-64 w-full resize-y rounded-md border border-input bg-background p-2.5 text-xs leading-relaxed text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring [field-sizing:content] max-h-[70vh]"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Formato: <code>**negrita**</code>, <code>## Título</code>, <code>- viñeta</code>. Una línea en blanco separa los párrafos.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Etiqueta requerido>Precio ($ USD)</Etiqueta>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.precio}
                    onChange={(e) => cambiar("precio", e.target.value)}
                    placeholder="Ej. 85.00"
                    className={numeroClass}
                  />
                </div>
                <div>
                  <Etiqueta requerido={form.enOferta}>Precio anterior ($ USD)</Etiqueta>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.precioAnterior}
                    onChange={(e) => cambiar("precioAnterior", e.target.value)}
                    placeholder="Solo si hay oferta"
                    className={numeroClass}
                  />
                  {descuento && (
                    <span className="text-[10px] font-semibold text-emerald-400 mt-1 block">Descuento en el card: -{descuento}%</span>
                  )}
                </div>
                <div>
                  <Etiqueta requerido>Stock (unidades)</Etiqueta>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) => cambiar("stock", e.target.value)}
                    className={numeroClass}
                  />
                  {aNumero(form.stock) === 0 && (
                    <span className="text-[10px] text-amber-500 font-medium mt-1 block">Se mostrará como "Agotado"</span>
                  )}
                </div>
              </div>
            </Paso>

            {/* ── Paso 4: Especificaciones técnicas del tipo ── */}
            <Paso numero={4} titulo="Especificaciones técnicas">
              {!tipo ? (
                <p className="text-[11px] text-muted-foreground">Selecciona el tipo de producto para ver sus especificaciones.</p>
              ) : (
                <>
                  <p className="text-[11px] text-muted-foreground">
                    {especificacionesDelTipo.length === 0
                      ? `${tipo.nombre} aún no tiene especificaciones. Crea la primera aquí.`
                      : `Solo se muestran las que aplican a ${tipo.nombre}. Deja vacío lo que no uses.`}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {especificacionesDelTipo.map((esp) => (
                      <div key={esp.idEspecificacion} className="flex items-center gap-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-white/5 p-1">
                          {esp.iconoUrl ? (
                            <img src={esp.iconoUrl} alt="" className="max-h-full max-w-full object-contain" />
                          ) : (
                            <Gauge className="size-4 text-muted-foreground" />
                          )}
                        </div>
                        <label className="w-28 shrink-0 text-[11px] font-medium text-muted-foreground">{esp.nombre}</label>
                        <input
                          type="text"
                          maxLength={100}
                          value={valoresEspec[esp.idEspecificacion] ?? ""}
                          onChange={(e) => setValoresEspec((prev) => ({ ...prev, [esp.idEspecificacion]: e.target.value }))}
                          placeholder="Valor"
                          className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Crear una especificación nueva sin salir del producto */}
                  {nuevaEspec === null ? (
                    <button
                      type="button"
                      onClick={() => setNuevaEspec({ nombre: "", creando: false, error: null })}
                      className="inline-flex items-center gap-1 rounded-lg border border-dashed border-primary/40 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <Plus className="size-3.5" /> Nueva especificación
                    </button>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          autoFocus
                          maxLength={100}
                          value={nuevaEspec.nombre}
                          onChange={(e) => setNuevaEspec((s) => ({ ...s, nombre: e.target.value, error: null }))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              crearEspecificacion();
                            }
                          }}
                          placeholder={`Nombre (ej. Peso, Garantía…) · aplica a ${tipo.nombre}`}
                          className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        <button
                          type="button"
                          disabled={nuevaEspec.creando}
                          onClick={crearEspecificacion}
                          className="shrink-0 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground disabled:opacity-60 cursor-pointer"
                        >
                          {nuevaEspec.creando ? "Creando…" : "Crear"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setNuevaEspec(null)}
                          className="shrink-0 rounded-md border border-border px-3 text-xs text-muted-foreground cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                      {nuevaEspec.error && <p className="text-[11px] text-red-400">{nuevaEspec.error}</p>}
                    </div>
                  )}
                </>
              )}
            </Paso>

            {/* ── Paso 5: Fotos ── */}
            <Paso numero={5} titulo={`Fotos del producto (máx. ${MAX_IMAGENES})`}>
              <ProductImagesManager
                imagenes={imagenes}
                principal={principal}
                disabled={saving}
                onChange={(lista, clavePrincipal) => {
                  setImagenes(lista);
                  setPrincipal(clavePrincipal);
                }}
              />
            </Paso>

            {/* ── Paso 6: Opciones ── */}
            <Paso numero={6} titulo="Opciones">
              <div className="grid gap-2 sm:grid-cols-3">
                {OPCIONES.map(({ campo, label }) => (
                  <label key={campo} className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[campo]}
                      onChange={(e) => cambiar(campo, e.target.checked)}
                      className="size-4 rounded border-border accent-emerald-500 cursor-pointer"
                    />
                    {label}
                  </label>
                ))}
                <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={(e) => cambiar("activo", e.target.checked)}
                    className="size-4 rounded border-border accent-emerald-500 cursor-pointer"
                  />
                  Activo (visible en la tienda)
                </label>
              </div>
            </Paso>

            <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <RotateCw className="size-4 animate-spin" />
                    <span>Guardando…</span>
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    <span>{productToEdit ? "Actualizar Producto" : "Crear Producto"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
