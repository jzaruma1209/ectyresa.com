# Mapa de distribuidores con Leaflet + OpenStreetMap en React

> **Sin costo. Sin API key. Sin cuenta.** Leaflet + OpenStreetMap es 100% gratuito y de código abierto.

---

## Lo que tú debes hacer (solo una vez)

### 1. Recolectar las coordenadas de tus distribuidores

Para cada distribuidor necesitas:
- Nombre y dirección
- Latitud y longitud (coordenadas GPS)

Para obtener las coordenadas de cada dirección, entra a [maps.google.com](https://maps.google.com), busca la dirección, haz clic derecho sobre el punto exacto y copia las coordenadas que aparecen arriba del menú.

Ejemplo del formato que necesitas preparar:

```js
// src/data/distribuidores.js
export const distribuidores = [
  {
    id: 1,
    nombre: "Grupo Tire Experts - Olmedo",
    direccion: "Olmedo y 10 de Agosto",
    ciudad: "Guayaquil",
    lat: -2.1962,
    lng: -79.8862,
    telefono: "04-000-0000",      // opcional
    horario: "Lun–Sáb 8:00–18:00" // opcional
  },
  {
    id: 2,
    nombre: "Anglo Ecuatoriana - Matriz",
    direccion: "Av. España 768 y Armenillas",
    ciudad: "Quito",
    lat: -0.2295,
    lng: -78.5243,
    telefono: "02-000-0000",
    horario: "Lun–Vie 8:00–17:00"
  },
  // ... agregar todos los distribuidores
];
```

---

## Lo que hace tu agente (instrucciones completas)

### Paso 1 — Instalar dependencias

```bash
npm install leaflet react-leaflet
```

### Paso 2 — Importar el CSS de Leaflet

En el archivo de entrada principal del proyecto (`main.jsx`, `index.jsx` o `App.jsx`), agregar esta línea al inicio, antes de cualquier otro import de estilos:

```js
import 'leaflet/dist/leaflet.css';
```

### Paso 3 — Corregir el ícono del pin (bug conocido de Leaflet con Webpack/Vite)

Crear el archivo `src/utils/leafletIconFix.js` con este contenido exacto:

```js
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});
```

Luego importarlo en `main.jsx` o `App.jsx`:

```js
import './utils/leafletIconFix';
```

### Paso 4 — Crear el componente del mapa

Crear el archivo `src/components/MapaDistribuidores.jsx`:

```jsx
import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { distribuidores } from '../data/distribuidores';

const ECUADOR_CENTER = [-1.8312, -78.1834];
const ZOOM_INICIAL = 7;

export default function MapaDistribuidores() {
  const [busqueda, setBusqueda] = useState('');
  const [ciudadFiltro, setCiudadFiltro] = useState('Todos');
  const [seleccionado, setSeleccionado] = useState(null);

  const ciudades = useMemo(() => {
    const unicas = [...new Set(distribuidores.map(d => d.ciudad))];
    return ['Todos', ...unicas.sort()];
  }, []);

  const filtrados = useMemo(() => {
    return distribuidores.filter(d => {
      const matchBusqueda =
        d.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        d.ciudad.toLowerCase().includes(busqueda.toLowerCase()) ||
        d.direccion.toLowerCase().includes(busqueda.toLowerCase());
      const matchCiudad = ciudadFiltro === 'Todos' || d.ciudad === ciudadFiltro;
      return matchBusqueda && matchCiudad;
    });
  }, [busqueda, ciudadFiltro]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: '600px', border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden' }}>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRight: '1px solid #e0e0e0' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '15px' }}>Distribuidores autorizados</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Encuentra el punto más cercano</p>
        </div>

        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
          <input
            type="text"
            placeholder="Buscar ciudad o distribuidor..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ padding: '8px 16px', display: 'flex', gap: '6px', flexWrap: 'wrap', borderBottom: '1px solid #e0e0e0' }}>
          {ciudades.map(ciudad => (
            <button
              key={ciudad}
              onClick={() => setCiudadFiltro(ciudad)}
              style={{
                fontSize: '11px', padding: '4px 10px', borderRadius: '99px', cursor: 'pointer',
                border: '1px solid #ddd',
                background: ciudadFiltro === ciudad ? '#1a1a1a' : '#f5f5f5',
                color: ciudadFiltro === ciudad ? '#fff' : '#555',
              }}
            >
              {ciudad}
            </button>
          ))}
        </div>

        <p style={{ padding: '8px 16px 4px', fontSize: '11px', color: '#aaa', margin: 0 }}>
          {filtrados.length} distribuidores
        </p>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {filtrados.map(d => (
            <div
              key={d.id}
              onClick={() => setSeleccionado(d)}
              style={{
                padding: '12px 16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer',
                background: seleccionado?.id === d.id ? '#EEF4FF' : 'transparent',
                display: 'flex', gap: '10px', alignItems: 'flex-start'
              }}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', marginTop: '4px', flexShrink: 0, background: seleccionado?.id === d.id ? '#1565C0' : '#E53935' }} />
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 500 }}>{d.nombre}</p>
                <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#666' }}>{d.direccion}</p>
                <span style={{ fontSize: '10px', padding: '2px 7px', background: '#f0f0f0', borderRadius: '99px', color: '#555' }}>{d.ciudad}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mapa */}
      <MapContainer
        center={seleccionado ? [seleccionado.lat, seleccionado.lng] : ECUADOR_CENTER}
        zoom={seleccionado ? 14 : ZOOM_INICIAL}
        style={{ height: '100%', width: '100%' }}
        key={seleccionado?.id ?? 'default'}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filtrados.map(d => (
          <Marker
            key={d.id}
            position={[d.lat, d.lng]}
            eventHandlers={{ click: () => setSeleccionado(d) }}
          >
            <Popup>
              <strong style={{ fontSize: '13px' }}>{d.nombre}</strong><br />
              <span style={{ fontSize: '11px', color: '#666' }}>{d.direccion}</span><br />
              {d.telefono && <span style={{ fontSize: '11px' }}>{d.telefono}</span>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

    </div>
  );
}
```

### Paso 5 — Usar el componente en tu página

En la página donde quieras mostrar el mapa (por ejemplo `src/pages/Distribuidores.jsx`):

```jsx
import MapaDistribuidores from '../components/MapaDistribuidores';

export default function PaginaDistribuidores() {
  return (
    <div style={{ padding: '40px 24px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1>Compra online y recíbela en tu distribuidor más cercano</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>Encuentra nuestro distribuidor autorizado más cercano.</p>
      <MapaDistribuidores />
    </div>
  );
}
```

---

## Estructura final de archivos creados

```
src/
├── data/
│   └── distribuidores.js        ← tú completas esto con tus datos
├── utils/
│   └── leafletIconFix.js        ← fix del ícono (el agente lo crea)
├── components/
│   └── MapaDistribuidores.jsx   ← componente principal (el agente lo crea)
└── pages/
    └── Distribuidores.jsx       ← página que usa el componente
```

---

## Notas importantes

- **Coordenadas de Ecuador**: la latitud va de `-0.2` (norte, Quito) a `-4.0` (sur, Loja). La longitud va de `-75.2` (este) a `-80.9` (oeste, Galápagos). Si un pin aparece en el océano, las coordenadas están invertidas.
- **OpenStreetMap no requiere cuenta ni API key**, pero pide respetar su política de uso: no hacer miles de peticiones automáticas por segundo.
- **El componente es responsive**: en pantallas pequeñas puedes cambiar `gridTemplateColumns: '300px 1fr'` a `grid-template-rows` para que el sidebar quede arriba del mapa.
- **Para personalizar el color del pin** puedes usar `L.divIcon` con un SVG personalizado en lugar del marcador por defecto de Leaflet.
