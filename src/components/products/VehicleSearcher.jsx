import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import vehicleData from '../../data/vehicle-data.json';
import './VehicleSearcher.css';

const STEPS = ['marca', 'anio', 'modelo'];
const STEP_LABELS = {
  marca:  'SELECCIONE LA MARCA',
  anio:   'SELECCIONE EL AÑO',
  modelo: 'SELECCIONE EL MODELO',
};

// Cuántos botones mostrar visibles en la tarjeta (2 filas × 2 col = 4)
const MAX_VISIBLE = 4; // 2 filas × 2 col para marcas = 4 ítems

/* ─── Modal genérico ─────────────────────────────────────── */
const VsModal = ({ onClose, title, children }) =>
  createPortal(
    <div className="vs-modal-backdrop" onClick={onClose}>
      <div className="vs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="vs-modal-header">
          <span className="vs-modal-title">{title}</span>
          <button className="vs-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="vs-modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );

/* ─── Componente principal ───────────────────────────────── */
const VehicleSearcher = () => {
  const navigate = useNavigate();

  const [step,           setStep]           = useState(0);
  const [marca,          setMarca]          = useState(null);
  const [anio,           setAnio]           = useState(null);
  const [modelo,         setModelo]         = useState(null);
  const [results,        setResults]        = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [searched,       setSearched]       = useState(false);
  const [error,          setError]          = useState(null);
  const [showAllModal,    setShowAllModal]   = useState(false);
  const [showResultModal, setShowResultModal]= useState(false);

  const modelosDisponibles = marca
    ? (vehicleData.marcas.find((m) => m.nombre === marca)?.modelos ?? [])
    : [];

  const optionsByStep = [
    vehicleData.marcas.map((m) => m.nombre),
    vehicleData.anios,
    modelosDisponibles,
  ];

  const currentOptions  = optionsByStep[step] ?? [];
  const limit           = step === 0 ? 4 : 8; 
  const visibleOptions  = currentOptions.slice(0, limit);
  const selectedByStep  = [marca, anio, modelo];
  const currentSelected = selectedByStep[step];
  const vehicleLabel    = `${marca ?? '---'} ${anio ?? '----'} ${modelo ?? '---'}`;

  /* ── Selección ── */
  const handleSelect = async (valor) => {
    if (step === 0) {
      setMarca(valor);
      setModelo(null);
      setStep(1);
    } else if (step === 1) {
      setAnio(valor);
      setStep(2);
    } else {
      setModelo(valor);
      await triggerSearch(valor);
    }
  };

  /* ── Búsqueda ── */
  const triggerSearch = async (modeloValue) => {
    setLoading(true);
    setSearched(true);
    setError(null);
    setShowResultModal(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
      const res  = await fetch(
        `${baseUrl}/llantas/buscar-vehiculo?marca=${encodeURIComponent(marca)}&anio=${anio}&modelo=${encodeURIComponent(modeloValue)}`
      );
      const data = await res.json();
      setResults(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error('Error al buscar llantas por vehículo:', err);
      setError('No se pudo conectar con el servidor. Intenta de nuevo.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /* ── Reset ── */
  const handleReset = () => {
    setStep(0);
    setMarca(null);
    setAnio(null);
    setModelo(null);
    setResults([]);
    setSearched(false);
    setError(null);
    setShowAllModal(false);
    setShowResultModal(false);
  };

  /* ── Breadcrumb ── */
  const goToStep = (idx) => {
    if (idx < step) {
      setStep(idx);
      if (idx === 0) { setAnio(null); setModelo(null); }
      if (idx === 1) { setModelo(null); }
      setResults([]);
      setSearched(false);
      setShowAllModal(false);
      setShowResultModal(false);
    }
  };

  return (
    <>
      {/* ── Tarjeta fija ──────────────────────────── */}
      <div className="vehicle-searcher">

        {/* Breadcrumb */}
        <div className="vs-breadcrumb">
          {['Marca', 'Año', 'Modelo'].map((label, idx) => (
            <span key={label} className="vs-crumb-group">
              <button
                className={`vs-crumb ${idx < step ? 'done' : ''} ${idx === step ? 'active' : ''}`}
                onClick={() => goToStep(idx)}
                disabled={idx > step}
              >
                {selectedByStep[idx] ?? label}
              </button>
              {idx < 2 && <span className="vs-crumb-arrow">›</span>}
            </span>
          ))}
        </div>

        {/* Título del paso */}
        <h2 className="vs-step-title">
          {STEP_LABELS[STEPS[step]].split(/ (LA|EL) /).map((part, i, arr) => {
            if (part === 'LA' || part === 'EL') return <span key={i}> {part} </span>;
            if (i === arr.length - 1) return <span key={i} className="vs-accent">{part}</span>;
            return <span key={i}>{part}</span>;
          })}
        </h2>

        {/* Visual del vehículo */}
        <div className="vs-vehicle-visual">
          <div className="vs-vehicle-icon">🚗</div>
          {(marca || anio || modelo) && (
            <p className="vs-vehicle-label">
              {marca && <strong>{marca}</strong>}
              {anio  && <> {anio}</>}
              {modelo && <> — {modelo}</>}
            </p>
          )}
        </div>

        {/* Grid de botones (solo 2 filas = MAX_VISIBLE) */}
        <div className={`vs-grid ${step === 0 ? 'vs-grid--brands' : ''}`}>
          {visibleOptions.map((valor) => (
            <button
              key={valor}
              className={`vs-btn ${currentSelected === valor ? 'vs-btn--active' : ''}`}
              onClick={() => handleSelect(valor)}
              disabled={loading}
            >
              {valor}
            </button>
          ))}
        </div>

        {/* Botón VER TODOS — visible si hay más de 4 opciones */}
        {currentOptions.length > 4 && (
          <button className="vs-show-all" onClick={() => setShowAllModal(true)}>
            VER TODOS LOS VALORES ▼
          </button>
        )}


      </div>

      {/* ── Modal: VER TODOS ────────────────────────── */}
      {showAllModal && (
        <VsModal
          title={STEP_LABELS[STEPS[step]]}
          onClose={() => setShowAllModal(false)}
        >
          <div className="vs-modal-grid">
            {currentOptions.map((valor) => (
              <button
                key={valor}
                className={`vs-btn ${currentSelected === valor ? 'vs-btn--active' : ''}`}
                onClick={() => {
                  setShowAllModal(false);
                  handleSelect(valor);
                }}
              >
                {valor}
              </button>
            ))}
          </div>
        </VsModal>
      )}

      {/* ── Modal: Resultados ───────────────────────── */}
      {showResultModal && (
        <VsModal
          title={`Búsqueda: ${vehicleLabel}`}
          onClose={() => { setShowResultModal(false); handleReset(); }}
        >
          {loading && (
            <div className="vs-status">
              <div className="vs-spinner" />
              <p>Buscando llantas para tu vehículo…</p>
            </div>
          )}

          {error && !loading && (
            <div className="vs-status vs-status--error">⚠️ {error}</div>
          )}

          {!loading && searched && !error && results.length === 0 && (
            <div className="vs-status vs-status--empty">
              <span>🔍</span>
              <p>No encontramos llantas para <strong>{vehicleLabel}</strong>.</p>
              <p>Intenta con otro vehículo o busca por dimensión.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="vs-results">
              <h3 className="vs-results-title">
                {results.length} llanta{results.length !== 1 ? 's' : ''} para {vehicleLabel}
              </h3>
              <div className="vs-results-grid">
                {results.map((llanta) => {
                  const img = llanta.imagenes?.find((i) => i.tipo === 'PRINCIPAL')?.urlImagen
                    ?? '/placeholder-tire.png';
                  const precioFinal    = llanta.precioOferta || llanta.precio;
                  const precioOriginal = llanta.precioOferta ? llanta.precio : null;

                  return (
                    <div key={llanta.idLlanta} className="vs-result-card">
                      {llanta.marca?.logoUrl && (
                        <img src={llanta.marca.logoUrl} alt={llanta.marca.nombre} className="vs-card-logo" />
                      )}
                      <img
                        src={img}
                        alt={llanta.modelo}
                        className="vs-card-img"
                        onError={(e) => { e.target.src = '/placeholder-tire.png'; }}
                      />
                      <p className="vs-card-model">{llanta.modelo}</p>
                      <p className="vs-card-measure">{llanta.ancho}/{llanta.perfil}R{llanta.rin}</p>
                      {llanta.procedencia && (
                        <p className="vs-card-origin">Procedencia: {llanta.procedencia}</p>
                      )}
                      <div className="vs-card-price">
                        {precioOriginal && (
                          <span className="vs-card-original">${Number(precioOriginal).toFixed(2)}</span>
                        )}
                        <span className="vs-card-final">${Number(precioFinal).toFixed(2)}</span>
                      </div>
                      {llanta.stock > 0
                        ? <p className="vs-card-stock">✓ {llanta.stock} en stock</p>
                        : <p className="vs-card-stock vs-card-stock--out">Sin stock</p>
                      }
                      <button
                        className="vs-card-btn"
                        onClick={() => navigate(`/producto/${llanta.idLlanta}`)}
                      >
                        Ver Detalle
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </VsModal>
      )}
    </>
  );
};

export default VehicleSearcher;
