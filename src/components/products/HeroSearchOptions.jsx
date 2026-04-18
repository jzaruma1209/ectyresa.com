import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ProductCard from "./ProductCard";

// ── 12 productos destacados — edita estos datos cuando quieras ──
const FEATURED_PRODUCTS = [
  { id: "h1",  name: "Llanta Todo Terreno 265/70R16",   brand: "Trazano", measure: "265/70R16", price: 179.98, finalPrice:  89.99, discount: 50, image: "/llanta1.png" },
  { id: "h2",  name: "Llanta Deportiva 225/45R17",       brand: "Trazano", measure: "225/45R17", price: 139.98, finalPrice:  69.99, discount: 50, image: "/llanta2.png" },
  { id: "h3",  name: "Llanta Radial 195/65R15",          brand: "Trazano", measure: "195/65R15", price: 119.98, finalPrice:  59.99, discount: 50, image: "/llanta1.png" },
  { id: "h4",  name: "Llanta 4x4 245/75R16",             brand: "Trazano", measure: "245/75R16", price: 199.98, finalPrice:  99.99, discount: 50, image: "/llanta2.png" },
  { id: "h5",  name: "Llanta Nankang NS-20 205/55R16",   brand: "Nankang", measure: "205/55R16", price: 145.00, finalPrice:  89.99, discount: 38, image: "/llanta1.png" },
  { id: "h6",  name: "Llanta Sportiva 235/40R18",        brand: "Nankang", measure: "235/40R18", price: 215.00, finalPrice: 115.00, discount: 47, image: "/llanta2.png" },
  { id: "h7",  name: "Llanta Econex 175/70R13",          brand: "Nankang", measure: "175/70R13", price:  74.50, finalPrice:  49.99, discount: 33, image: "/llanta1.png" },
  { id: "h8",  name: "Llanta Mudstar 285/75R16",         brand: "Nankang", measure: "285/75R16", price: 195.00, finalPrice: 145.00, discount: 26, image: "/llanta2.png" },
  { id: "h9",  name: "Moqueta Delantera Universal",      brand: "Ectyre",  measure: "Universal", price:  39.99, finalPrice:  24.99, discount: 38, image: "/llanta1.png" },
  { id: "h10", name: "Cono de Seguridad Naranja 75cm",   brand: "Ectyre",  measure: "75cm",      price:  18.50, finalPrice:  12.99, discount: 30, image: "/llanta2.png" },
  { id: "h11", name: "Llanta Aro 13 Radial 155/80R13",   brand: "Trazano", measure: "155/80R13", price:  89.98, finalPrice:  49.99, discount: 44, image: "/llanta1.png" },
  { id: "h12", name: "Llanta Aro 14 Touring 185/70R14",  brand: "Trazano", measure: "185/70R14", price: 109.98, finalPrice:  64.99, discount: 41, image: "/llanta2.png" },
];

const CARDS_PER_PAGE = 4;
const INTERVAL_MS    = 5000;
const TOTAL_PAGES    = Math.ceil(FEATURED_PRODUCTS.length / CARDS_PER_PAGE);

const HeroSearchOptions = () => {
  const [page, setPage]  = useState(0);
  const gridRef          = useRef(null);
  const isAnimating      = useRef(false);

  const currentProducts = FEATURED_PRODUCTS.slice(
    page * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE + CARDS_PER_PAGE
  );

  const goToPage = (nextPage, direction = 1) => {
    if (isAnimating.current || !gridRef.current) return;
    isAnimating.current = true;

    const el = gridRef.current;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll(".product-card"));

    // Opcion C: Fade + Rotate leve (El viento se las lleva suavemente)
    gsap.to(cards, {
      y: -15,                           // Vuelan un poquitito hacia arriba
      rotation: direction > 0 ? 8 : -8, // Giran levemente (2D, nada de 3D)
      scale: 0.95,
      autoAlpha: 0,
      duration: 0.4,
      stagger: 0.05,                    // Vuelan casi al mismo tiempo, muy sutil
      ease: "power2.inOut",
      onComplete: () => {
        setPage(nextPage);

        setTimeout(() => {
          const newCards = Array.from(gridRef.current?.querySelectorAll(".product-card") || []);
          if (!newCards.length) return;

          // Vienen desde el ángulo opuesto giradas hacia el otro lado
          gsap.set(newCards, {
            y: 15,
            rotation: direction > 0 ? -8 : 8,
            scale: 0.95,
            autoAlpha: 0,
          });

          // Se acomodan suavemente a su posición recta original
          gsap.to(newCards, {
            y: 0,
            rotation: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "back.out(1.2)", // Acomodo muy suave y balanceado
            onComplete: () => { isAnimating.current = false; },
          });
        }, 10);
      },
    });

  };

  // Auto-avance cada 5 s
  useEffect(() => {
    const id = setInterval(() => {
      const next = (page + 1) % TOTAL_PAGES;
      goToPage(next, 1);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="hero-search-options relative rounded-2xl overflow-hidden h-full flex flex-col p-3"
      style={{ background: "rgba(17, 24, 39, 0.40)" }}
    >
      {/* ── blobs decorativos (sin cambios) ── */}
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

      {/* ── Header + indicadores de página ── */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider ml-1">
          PRODUCTOS DESTACADOS:
        </span>

        {/* Dots de navegación — rojo activo, semitransparente inactivo */}
        <div className="flex gap-1.5 mr-1">
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i, i > page ? 1 : -1)}
              aria-label={`Grupo ${i + 1}`}
              style={{
                width:           i === page ? "18px" : "7px",
                height:          "7px",
                borderRadius:    "9999px",
                backgroundColor: i === page ? "#E60000" : "rgba(255,255,255,0.35)",
                border:          "none",
                cursor:          "pointer",
                padding:         0,
                transition:      "width 0.3s ease, background-color 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Grid animado: Wave Flip ── */}
      <div style={{ flex: 1, perspective: "1200px" }}>
        <div ref={gridRef} className="grid grid-cols-2 gap-2 h-full relative z-10" style={{ transformStyle: "preserve-3d" }}>
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSearchOptions;
