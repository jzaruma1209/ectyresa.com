import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import ProductCard from "./ProductCard";

import { buildFeaturedGroups } from "../../utils/featuredGroups";

const INTERVAL_MS = 5000;

const HeroSearchOptions = ({ productsList, loading, error, onRetry }) => {
  const [groupIndex, setGroupIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const gridRef = useRef(null);
  const isAnimating = useRef(false);

  // El sorteo ocurre solo al cambiar el catálogo, no en cada render o transición.
  const groups = useMemo(() => buildFeaturedGroups(productsList), [productsList]);
  const totalSteps = groups.length;
  const visibleProducts = groups[groupIndex] || groups[0] || [];
  const animado = totalSteps > 1;

  // Transición suave GSAP (banner deslizante)
  const goToIndex = (nextIndex, direction = 1) => {
    if (isAnimating.current || !gridRef.current || !animado) return;
    isAnimating.current = true;

    const el = gridRef.current;
    const cards = Array.from(el.querySelectorAll(".tire-card"));

    // Nunca debe quedar trabado: si por lo que sea GSAP no llega a onComplete
    // (0 cards encontradas, tab en segundo plano, etc.), esto libera el
    // candado igual a los 1200ms como red de seguridad.
    const liberar = () => {
      isAnimating.current = false;
    };
    const seguro = setTimeout(liberar, 1200);

    // Sin cards que animar (layout aún no listo): cambia el grupo directo,
    // sin transición, y libera el candado de inmediato.
    if (cards.length === 0) {
      clearTimeout(seguro);
      setGroupIndex(nextIndex);
      liberar();
      return;
    }

    gsap.to(cards, {
      y: -15,
      rotation: direction > 0 ? 8 : -8,
      scale: 0.95,
      autoAlpha: 0,
      duration: 0.35,
      stagger: 0.04,
      ease: "power2.inOut",
      onComplete: () => {
        setGroupIndex(nextIndex);

        setTimeout(() => {
          const newCards = Array.from(gridRef.current?.querySelectorAll(".tire-card") || []);
          if (!newCards.length) {
            clearTimeout(seguro);
            liberar();
            return;
          }

          gsap.set(newCards, {
            y: 15,
            rotation: direction > 0 ? -8 : 8,
            scale: 0.95,
            autoAlpha: 0,
          });

          gsap.to(newCards, {
            y: 0,
            rotation: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.45,
            stagger: 0.04,
            ease: "back.out(1.2)",
            onComplete: () => {
              clearTimeout(seguro);
              liberar();
            },
          });
        }, 10);
      },
    });
  };

  // Auto-carrusel cíclico cada 5s — se pausa al pasar el mouse por encima
  useEffect(() => {
    if (!animado || paused) return;
    const timer = setInterval(() => {
      const next = (groupIndex + 1) % totalSteps;
      goToIndex(next, 1);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIndex, totalSteps, animado, paused]);

  return (
    <div
      className="hero-search-options relative rounded-none border border-white/10 overflow-hidden h-full flex flex-col p-3 font-sans"
      style={{ background: "rgba(17, 24, 39, 0.40)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── blobs decorativos ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 -z-0 blur-3xl opacity-40"
        style={{ clipPath: "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)" }}
      >
        <div className="aspect-[577/310] w-[22rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 -z-0 blur-3xl opacity-40"
        style={{ clipPath: "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)" }}
      >
        <div className="aspect-[577/310] w-[22rem] bg-gradient-to-r from-[#9089fc] to-[#ff80b5]" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10" />

      {/* ── Header + indicadores de carrusel ── */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest ml-1 font-display">
          PRODUCTOS DESTACADOS
        </span>

        {/* Indicadores lineales ras */}
        {animado && (
          <div className="flex items-center gap-1.5 mr-1 max-w-[120px] overflow-hidden">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToIndex(i, i > groupIndex ? 1 : -1)}
                aria-label={`Grupo de destacados ${i + 1}`}
                style={{
                  width: i === groupIndex ? "16px" : "6px",
                  height: "3px",
                  borderRadius: "0px",
                  backgroundColor: i === groupIndex ? "#E60000" : "rgba(255,255,255,0.35)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.3s ease, background-color 0.3s ease",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Grid con ventana deslizante ── */}
      <div style={{ flex: 1, perspective: "1200px" }}>
        {loading ? (
          <div className="grid grid-cols-2 gap-2 content-center h-full" role="status" aria-label="Cargando productos destacados">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="rounded-xl bg-white p-2 motion-safe:animate-pulse" aria-hidden="true">
                <div className="mx-auto mb-2 h-4 w-1/2 rounded bg-gray-200" />
                <div className="aspect-[2/1] rounded-lg bg-gray-100" />
                <div className="mt-3 h-5 w-1/2 rounded bg-gray-200" />
                <div className="mt-2 h-3 rounded bg-gray-100" />
                <div className="mt-1 h-3 w-3/4 rounded bg-gray-100" />
                <div className="mt-3 h-7 rounded-lg bg-gray-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center text-sm text-white" role="status">
            <p>No pudimos cargar los productos.</p>
            <button type="button" onClick={onRetry} className="rounded-lg bg-white px-4 py-2 font-semibold text-gray-900">
              Reintentar
            </button>
          </div>
        ) : totalSteps === 0 ? (
          <div className="flex h-full items-center justify-center py-10 text-center text-xs text-white/60">
            Pronto encontrarás productos destacados aquí.
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-2 content-center gap-2 h-full relative z-10 [&_.tire-card>a]:aspect-[2/1]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {visibleProducts.map((product, index) => (
              <ProductCard key={`${groupIndex}-${product.id}-${index}`} product={product} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSearchOptions;
