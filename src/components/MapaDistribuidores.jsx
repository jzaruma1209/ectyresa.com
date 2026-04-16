import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { distribuidores } from '../data/distribuidores';

const ECUADOR_CENTER = [-1.8312, -78.1834];
const ZOOM_INICIAL = 6;

const ectyreIcon = new L.divIcon({
  className: 'custom-ectyre-pin',
  html: `<div style="transform: translate(0px, 0px);">
          <svg viewBox="0 0 24 24" fill="#E60000" stroke="#900000" stroke-width="1" width="36" height="36" style="filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.3));">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="3.5" fill="#fff" stroke="none" />
          </svg>
         </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

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
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', height: '600px', border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden' }} className="map-grid">

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRight: '1px solid #e0e0e0', overflowY: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1a1a1a' }}>Distribuidores autorizados</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Encuentra el punto más cercano</p>
        </div>

        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
          <input
            type="text"
            placeholder="Buscar ciudad o distribuidor..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid #e0e0e0' }}>
          {ciudades.map(ciudad => (
            <button
              key={ciudad}
              onClick={() => setCiudadFiltro(ciudad)}
              style={{
                fontSize: '12px', padding: '6px 14px', borderRadius: '99px', cursor: 'pointer',
                border: '1px solid #ddd',
                background: ciudadFiltro === ciudad ? '#1a1a1a' : '#f5f5f5',
                color: ciudadFiltro === ciudad ? '#fff' : '#555',
                fontWeight: ciudadFiltro === ciudad ? '600' : 'normal',
                transition: 'all 0.2s ease'
              }}
            >
              {ciudad}
            </button>
          ))}
        </div>

        <p style={{ padding: '12px 16px 4px', fontSize: '12px', color: '#a0a0a0', margin: 0, fontWeight: 'bold' }}>
          {filtrados.length} distribuidores encontrados
        </p>

        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
          {filtrados.map(d => (
            <div
              key={d.id}
              onClick={() => setSeleccionado(d)}
              style={{
                padding: '16px 20px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer',
                background: seleccionado?.id === d.id ? '#fff0f0' : 'transparent',
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                transition: 'background 0.2s ease'
              }}
            >
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', marginTop: '4px', flexShrink: 0, background: seleccionado?.id === d.id ? '#E60000' : '#d0d0d0', boxShadow: seleccionado?.id === d.id ? '0 0 0 3px rgba(230,0,0,0.2)' : 'none' }} />
              <div>
                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>{d.nombre}</p>
                <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#666', lineHeight: '1.4' }}>{d.direccion}</p>
                <span style={{ fontSize: '10px', padding: '3px 8px', background: '#f5f5f5', borderRadius: '4px', color: '#555', fontWeight: 'bold' }}>{d.ciudad}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mapa */}
      <MapContainer
        center={seleccionado ? [seleccionado.lat, seleccionado.lng] : ECUADOR_CENTER}
        zoom={seleccionado ? 15 : ZOOM_INICIAL}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
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
            icon={ectyreIcon}
            eventHandlers={{ click: () => setSeleccionado(d) }}
          >
            <Popup>
              <strong style={{ fontSize: '14px', color: '#1a1a1a' }}>{d.nombre}</strong><br />
              <span style={{ fontSize: '12px', color: '#666' }}>{d.direccion}</span><br />
              {d.horario && <span style={{ fontSize: '11px', color: '#888', display: 'block', marginTop: '4px' }}>🕒 {d.horario}</span>}
              {d.telefono && <span style={{ fontSize: '11px', color: '#888', display: 'block' }}>📞 {d.telefono}</span>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

    </div>
  );
}
