import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tireDimensions from '../../data/tire-dimensions.json';
import nivelesService from '../../services/niveles.service';
import ExpandableValuesButton from './ExpandableValuesButton';
import './TireSearcher.css';

const STEPS = ['ancho', 'perfil', 'rin'];
const STEP_LABELS = {
  ancho:  'SELECCIONE EL ANCHO',
  perfil: 'SELECCIONE EL PERFIL',
  rin:    'SELECCIONE EL RIN',
};
const MAX_VISIBLE = 14; // 2 filas × 7 columnas

/* ─── Componente principal ───────────────────────────────── */
const TireSearcher = () => {
  const navigate  = useNavigate();

  const [step,       setStep]       = useState(0);
  const [ancho,      setAncho]      = useState(null);
  const [perfil,     setPerfil]     = useState(null);
  const [rin,        setRin]        = useState(null);
  // Medidas creadas en Admin → Niveles de inventario (el JSON local solo se usa si la API falla)
  const [medidas, setMedidas] = useState({ anchos: [], altos: [], aros: [] });

  useEffect(() => {
    let activo = true;
    Promise.all(['anchos', 'altos', 'aros'].map((tipo) => nivelesService.listarValoresMedida(tipo)))
      .then(([anchos, altos, aros]) => {
        if (activo) setMedidas({ anchos, altos, aros });
      })
      .catch(() => {
        if (activo) {
          setMedidas({ anchos: tireDimensions.anchos, altos: tireDimensions.perfiles, aros: tireDimensions.rines });
        }
      });
    return () => {
      activo = false;
    };
  }, []);

  const measureLabel = `${ancho ?? '---'} / ${perfil ?? '--'} R${rin ?? '--'}`;

  const optionsByStep = [medidas.anchos, medidas.altos, medidas.aros];
  const currentOptions = optionsByStep[step] ?? [];
  const visibleOptions = currentOptions.slice(0, MAX_VISIBLE);

  const selectedByStep  = [ancho, perfil, rin];
  const currentSelected = selectedByStep[step];

  /* ── Selección de valor ── */
  const handleSelect = (valor) => {
    if (step === 0) {
      setAncho(valor);
      setStep(1);
    } else if (step === 1) {
      setPerfil(valor);
      setStep(2);
    } else {
      setRin(valor);
      triggerSearch(valor);
    }
  };

  /* ── Navegar a página de resultados ── */
  const triggerSearch = (rinValue) => {
    const searchQuery = `${ancho}/${perfil}R${rinValue}`;
    // Navegamos directamente a la página unificada de búsqueda
    navigate(`/busqueda?q=${encodeURIComponent(searchQuery)}`);
    // Opcional: reiniciar el componente tras buscar
    handleReset();
  };

  /* ── Reset ── */
  const handleReset = () => {
    setStep(0);
    setAncho(null);
    setPerfil(null);
    setRin(null);
  };

  /* ── Volver a step desde breadcrumb ── */
  const goToStep = (idx) => {
    if (idx < step) {
      setStep(idx);
      if (idx === 0) { setPerfil(null); setRin(null); }
      if (idx === 1) { setRin(null); }
    }
  };

  return (
    <>
      <div className="tire-searcher">

        {/* Breadcrumb */}
        <div className="ts-breadcrumb">
          {['Ancho', 'Perfil', 'Rin'].map((label, idx) => (
            <span key={label} className="ts-crumb-group">
              <button
                data-slot="crumb-btn"
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
              <text fill="#ffffff" fontSize="16" fontWeight="900" letterSpacing="0.1em" fontFamily="'Space Grotesk', sans-serif">
                <textPath href="#measureArc" startOffset="50%" textAnchor="middle">
                  <tspan dy="0">{measureLabel}</tspan>
                </textPath>
              </text>
            </svg>
          </div>
          <img src="/infollanta.webp" alt="Llanta" className="ts-tire-img" width="160" height="90" />
        </div>

        {/* Grid de opciones (solo MAX_VISIBLE) */}
        <div className="ts-grid">
          {visibleOptions.map((valor) => (
            <button
              data-slot="grid-btn"
              key={valor}
              className={`ts-btn ${currentSelected === valor ? 'ts-btn--active' : ''}`}
              onClick={() => handleSelect(valor)}
            >
              {valor}
            </button>
          ))}
        </div>

        {/* Botón "Ver todos" → se expande en el modal con todos los valores del paso */}
        {currentOptions.length > MAX_VISIBLE && (
          <ExpandableValuesButton prefix="ts" label="VER TODOS LOS VALORES ▼" title={STEP_LABELS[STEPS[step]]}>
            {(cerrar) => (
              <div className="ts-modal-grid">
                {currentOptions.map((valor) => (
                  <button
                    data-slot="grid-btn"
                    key={valor}
                    className={`ts-btn ${currentSelected === valor ? 'ts-btn--active' : ''}`}
                    onClick={() => {
                      cerrar();
                      handleSelect(valor);
                    }}
                  >
                    {valor}
                  </button>
                ))}
              </div>
            )}
          </ExpandableValuesButton>
        )}

      </div>
    </>
  );
};

export default TireSearcher;
