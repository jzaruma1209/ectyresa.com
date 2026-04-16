import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMeasureFilter } from '../../store/slices/filters.slice';
import tireDimensions from '../../data/tire-dimensions.json';
import './TireSearcher.css';

const STEPS = ['ancho', 'perfil', 'rin'];
const STEP_LABELS = {
  ancho:  'SELECCIONE EL ANCHO',
  perfil: 'SELECCIONE EL PERFIL',
  rin:    'SELECCIONE EL RIN',
};
const MAX_VISIBLE = 14; // 2 filas × 7 columnas

/* ─── Modal genérico ─────────────────────────────────────── */
const TireModal = ({ onClose, title, children }) =>
  createPortal(
    <div className="ts-modal-backdrop" onClick={onClose}>
      <div className="ts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ts-modal-header">
          <span className="ts-modal-title">{title}</span>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ts-modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );

/* ─── Componente principal ───────────────────────────────── */
const TireSearcher = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const [step,       setStep]       = useState(0);
  const [ancho,      setAncho]      = useState(null);
  const [perfil,     setPerfil]     = useState(null);
  const [rin,        setRin]        = useState(null);
  const [results,    setResults]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [searched,   setSearched]   = useState(false);
  const [error,      setError]      = useState(null);
  const [showAllModal,    setShowAllModal]    = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const measureLabel = `${ancho ?? '---'} / ${perfil ?? '--'} R${rin ?? '--'}`;

  const optionsByStep = [
    tireDimensions.anchos,
    tireDimensions.perfiles,
    tireDimensions.rines,
  ];
  const currentOptions = optionsByStep[step] ?? [];
  const visibleOptions = currentOptions.slice(0, MAX_VISIBLE);

  const selectedByStep  = [ancho, perfil, rin];
  const currentSelected = selectedByStep[step];

  /* ── Selección de valor ── */
  const handleSelect = async (valor) => {
    if (step === 0) {
      setAncho(valor);
      setStep(1);
    } else if (step === 1) {
      setPerfil(valor);
      setStep(2);
    } else {
      setRin(valor);
      await triggerSearch(valor);
    }
  };

  /* ── Búsqueda en API ── */
  const triggerSearch = async (rinValue) => {
    setLoading(true);
    setSearched(true);
    setError(null);
    setShowResultModal(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
      const res  = await fetch(
        `${baseUrl}/llantas/buscar-medida?ancho=${ancho}&perfil=${perfil}&rin=${rinValue}`
      );
      const data = await res.json();
      setResults(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error('Error al buscar llantas:', err);
      setError('No se pudo conectar con el servidor. Intenta de nuevo.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /* ── Reset ── */
  const handleReset = () => {
    setStep(0);
    setAncho(null);
    setPerfil(null);
    setRin(null);
    setResults([]);
    setSearched(false);
    setError(null);
    setShowAllModal(false);
    setShowResultModal(false);
  };

  /* ── Volver a step desde breadcrumb ── */
  const goToStep = (idx) => {
    if (idx < step) {
      setStep(idx);
      if (idx === 0) { setPerfil(null); setRin(null); }
      if (idx === 1) { setRin(null); }
      setResults([]);
      setSearched(false);
      setShowAllModal(false);
      setShowResultModal(false);
    }
  };

  return (
    <>
      {/* ────────────────────────────────────────────────
          TARJETA FIJA — nunca cambia de tamaño
      ──────────────────────────────────────────────── */}
      <div className="tire-searcher">

        {/* Breadcrumb */}
        <div className="ts-breadcrumb">
          {['Ancho', 'Perfil', 'Rin'].map((label, idx) => (
            <span key={label} className="ts-crumb-group">
              <button
                className={`ts-crumb ${idx < step ? 'done' : ''} ${idx === step ? 'active' : ''}`}
                onClick={() => goToStep(idx)}
                disabled={idx > step}
              >
                {selectedByStep[idx] ?? label}
              </button>
              {idx < 2 && <span className="ts-crumb-arrow">›</span>}
            </span>
          ))}
        </div>

        {/* Título del paso */}
        <h2 className="ts-step-title">
          {STEP_LABELS[STEPS[step]].split(' EL ').map((part, i) =>
            i === 0
              ? <span key={i}>{part} EL </span>
              : <span key={i} className="ts-accent">{part}</span>
          )}
        </h2>

        {/* Imagen de llanta + arco de medida */}
        <div className="ts-tire-visual">
          <div className="ts-measure-arc-wrapper">
            <svg viewBox="0 0 160 100" width="180" height="100">
              <defs>
                <path id="measureArc" d="M 30,73 A 58,58 0 0,1 130,73" />
              </defs>
              <text fill="#ffffff" fontSize="16" fontWeight="900" letterSpacing="0.1em" fontFamily="monospace">
                <textPath href="#measureArc" startOffset="50%" textAnchor="middle">
                  <tspan dy="0">{measureLabel}</tspan>
                </textPath>
              </text>
            </svg>
          </div>
          <img src="/infollanta.png" alt="Llanta" className="ts-tire-img" />
        </div>

        {/* Grid de opciones (solo MAX_VISIBLE) */}
        <div className="ts-grid">
          {visibleOptions.map((valor) => (
            <button
              key={valor}
              className={`ts-btn ${currentSelected === valor ? 'ts-btn--active' : ''}`}
              onClick={() => handleSelect(valor)}
              disabled={loading}
            >
              {valor}
            </button>
          ))}
        </div>

        {/* Botón "Ver todos" → abre modal */}
        {currentOptions.length > MAX_VISIBLE && (
          <button className="ts-show-all" onClick={() => setShowAllModal(true)}>
            VER TODOS LOS VALORES ▼
          </button>
        )}


      </div>

      {/* ────────────────────────────────────────────────
          MODAL — Todos los valores del paso actual
      ──────────────────────────────────────────────── */}
      {showAllModal && (
        <TireModal
          title={STEP_LABELS[STEPS[step]]}
          onClose={() => setShowAllModal(false)}
        >
          <div className="ts-modal-grid">
            {currentOptions.map((valor) => (
              <button
                key={valor}
                className={`ts-btn ${currentSelected === valor ? 'ts-btn--active' : ''}`}
                onClick={() => {
                  setShowAllModal(false);
                  handleSelect(valor);
                }}
              >
                {valor}
              </button>
            ))}
          </div>
        </TireModal>
      )}

      {/* ────────────────────────────────────────────────
          MODAL — Resultados de búsqueda
      ──────────────────────────────────────────────── */}
      {showResultModal && (
        <TireModal
          title={`Búsqueda: ${measureLabel}`}
          onClose={() => { setShowResultModal(false); handleReset(); }}
        >
          {loading && (
            <div className="ts-status">
              <div className="ts-spinner" />
              <p>Buscando llantas…</p>
            </div>
          )}

          {error && !loading && (
            <div className="ts-status ts-status--error">⚠️ {error}</div>
          )}

          {!loading && searched && !error && results.length === 0 && (
            <div className="ts-status ts-status--empty">
              <span>🔍</span>
              <p>No encontramos llantas con la medida <strong>{measureLabel}</strong>.</p>
              <p>Intenta con otra combinación.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="ts-results">
              <h3 className="ts-results-title">
                {results.length} llanta{results.length !== 1 ? 's' : ''} encontrada{results.length !== 1 ? 's' : ''} — {measureLabel}
              </h3>
              <div className="ts-results-grid">
                {results.map((llanta) => {
                  const img = llanta.imagenes?.find((i) => i.tipo === 'PRINCIPAL')?.urlImagen
                    ?? '/placeholder-tire.png';
                  const precioFinal    = llanta.precioOferta || llanta.precio;
                  const precioOriginal = llanta.precioOferta ? llanta.precio : null;

                  return (
                    <div key={llanta.idLlanta} className="ts-result-card">
                      {llanta.marca?.logoUrl && (
                        <img src={llanta.marca.logoUrl} alt={llanta.marca.nombre} className="ts-card-logo" />
                      )}
                      <img
                        src={img}
                        alt={llanta.modelo}
                        className="ts-card-img"
                        onError={(e) => { e.target.src = '/placeholder-tire.png'; }}
                      />
                      <p className="ts-card-model">{llanta.modelo}</p>
                      <p className="ts-card-measure">{llanta.ancho}/{llanta.perfil}R{llanta.rin}</p>
                      {llanta.procedencia && (
                        <p className="ts-card-origin">Procedencia: {llanta.procedencia}</p>
                      )}
                      <div className="ts-card-price">
                        {precioOriginal && (
                          <span className="ts-card-original">${Number(precioOriginal).toFixed(2)}</span>
                        )}
                        <span className="ts-card-final">${Number(precioFinal).toFixed(2)}</span>
                      </div>
                      {llanta.stock > 0
                        ? <p className="ts-card-stock">✓ {llanta.stock} en stock</p>
                        : <p className="ts-card-stock ts-card-stock--out">Sin stock</p>
                      }
                      <button
                        className="ts-card-btn"
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
        </TireModal>
      )}
    </>
  );
};

export default TireSearcher;
