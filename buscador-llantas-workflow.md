# Workflow: Buscador de Llantas por Dimensión

## Visión general

Selector en 3 pasos (ancho → perfil → rin) cargado desde un JSON local.
Al completar los 3 pasos, hace la consulta a la API y muestra las cards con resultados.

---

## Paso 1 — Crear el archivo de datos `tire-dimensions.json`

Crea el archivo en `src/data/tire-dimensions.json` con todas las medidas disponibles.

```json
{
  "anchos": [155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305],
  "perfiles": [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
  "rines": [13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
}
```

> Ajusta los valores según lo que realmente tengas en base de datos.
> Este JSON es solo el menú de opciones — no consulta la API.

---

## Paso 2 — Estructura del componente `TireSearcher`

Crea el componente en `src/components/TireSearcher/TireSearcher.jsx`.

### Estado interno

```js
const [step, setStep] = useState(1)        // 1 = ancho, 2 = perfil, 3 = rin
const [ancho, setAncho]     = useState(null)
const [perfil, setPerfil]   = useState(null)
const [rin, setRin]         = useState(null)
const [results, setResults] = useState([])
const [loading, setLoading] = useState(false)
const [searched, setSearched] = useState(false)
```

### Lógica de pasos

```
step 1 → usuario selecciona ancho   → setAncho(valor)   → setStep(2)
step 2 → usuario selecciona perfil  → setPerfil(valor)  → setStep(3)
step 3 → usuario selecciona rin     → setRin(valor)     → triggerSearch()
```

Al completar el step 3, se arma automáticamente la medida: `175/70R14`
y se dispara la consulta a la API.

---

## Paso 3 — Función de búsqueda

```js
const triggerSearch = async (rinValue) => {
  setLoading(true)
  setSearched(true)

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/llantas/buscar-medida?ancho=${ancho}&perfil=${perfil}&rin=${rinValue}`
    )
    const data = await res.json()
    setResults(data)
  } catch (err) {
    console.error('Error al buscar llantas:', err)
    setResults([])
  } finally {
    setLoading(false)
  }
}
```

> `API_BASE_URL` debe venir de una variable de entorno: `import.meta.env.VITE_API_URL`

---

## Paso 4 — UI del selector (3 pasos)

### Header del paso (reutilizable)

Muestra el título del paso actual:
- Step 1 → `SELECCIONE EL ANCHO`
- Step 2 → `SELECCIONE EL PERFIL`
- Step 3 → `SELECCIONE EL RIN`

### Imagen de la llanta

Muestra una imagen de llanta con la medida armada dinámicamente encima.
- Si no está completa: muestra `--- / -- R--`
- Si ancho seleccionado: muestra `175 / -- R--`
- Si ancho + perfil: muestra `175 / 70 R--`
- Si completa: muestra `175 / 70 R14`

### Grid de botones

```jsx
<div className="dimensions-grid">
  {dimensiones[stepActual].map((valor) => (
    <button
      key={valor}
      className={`dim-btn ${seleccionado === valor ? 'active' : ''}`}
      onClick={() => handleSelect(valor)}
    >
      {valor}
    </button>
  ))}
</div>
```

### Botón "VER TODOS LOS VALORES"

Despliega/colapsa el grid completo si hay más de 14 opciones.
Por defecto muestra solo las primeras 14.

```js
const [showAll, setShowAll] = useState(false)
const visible = showAll ? opciones : opciones.slice(0, 14)
```

### Breadcrumb de selección

Muestra debajo del header qué ya seleccionó el usuario:

```
[175] → [70] → [  ?  ]
```

Cada item es clickeable para volver a ese paso.

---

## Paso 5 — Cards de resultados (`TireCard`)

Crea `src/components/TireCard/TireCard.jsx`.

### Props que recibe

```js
{
  idLlanta,
  modelo,
  marca: { nombre, logoUrl },
  ancho, perfil, rin,
  precio,
  precioOferta,
  stock,
  procedencia,
  imagenes,   // array — usar la de tipo "PRINCIPAL"
  destacado
}
```

### Layout de la card

```
┌─────────────────────────────┐
│  [logo marca]               │
│                             │
│  [imagen principal llanta]  │
│                             │
│  Nombre del modelo          │
│  175/70R14                  │
│  Procedencia: China         │
│                             │
│  ~~$89.99~~  $74.99         │  ← si tiene precioOferta
│  $89.99                     │  ← si no tiene oferta
│                             │
│  Stock: 5 unidades          │
│                             │
│  [  VER DETALLE  ]          │
└─────────────────────────────┘
```

### Imagen principal

```js
const imgPrincipal = imagenes?.find(img => img.tipo === 'PRINCIPAL')?.url
  ?? '/placeholder-tire.png'
```

---

## Paso 6 — Estado de la búsqueda

Maneja estos 4 estados en la UI después de buscar:

| Estado | Qué mostrar |
|--------|-------------|
| `loading: true` | Skeleton cards o spinner |
| `loading: false, results.length > 0` | Grid de TireCards |
| `loading: false, results.length === 0, searched: true` | Mensaje "No encontramos llantas con esa medida" |
| `searched: false` | Nada (el selector ocupa toda la pantalla) |

---

## Paso 7 — Botón de reset

Siempre visible debajo del selector una vez que el usuario empezó.
Permite volver al paso 1.

```js
const handleReset = () => {
  setStep(1)
  setAncho(null)
  setPerfil(null)
  setRin(null)
  setResults([])
  setSearched(false)
}
```

---

## Estructura de archivos

```
src/
├── data/
│   └── tire-dimensions.json       ← opciones del menú
├── components/
│   ├── TireSearcher/
│   │   ├── TireSearcher.jsx       ← lógica de los 3 pasos
│   │   └── TireSearcher.css
│   └── TireCard/
│       ├── TireCard.jsx           ← card de resultado
│       └── TireCard.css
└── pages/
    └── Buscar.jsx                 ← página que usa TireSearcher
```

---

## Variables de entorno necesarias

En `.env`:
```
VITE_API_URL=https://ectyre-backend-qb25qfps9-paul-zarumas-projects.vercel.app
```

---

## Flujo completo resumido

```
Usuario abre la página
        ↓
[Step 1] Selecciona ANCHO (desde JSON)
        ↓
[Step 2] Selecciona PERFIL (desde JSON)
        ↓
[Step 3] Selecciona RIN (desde JSON)
        ↓
Se arma: 175/70R14
        ↓
GET /api/v1/llantas/buscar-medida?ancho=175&perfil=70&rin=14
        ↓
Se muestran TireCards con los resultados
```
