import ProductCard from "./ProductCard";

const HeroSearchOptions = () => {
  return (
    <div className="hero-search-options relative rounded-2xl overflow-hidden h-full flex flex-col p-3" style={{ background: "rgba(17, 24, 39, 0.40)" }}>
      {/* ... (blobs conservados) ... */}
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

      <div className="flex items-center mb-3 relative z-10">
        <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider ml-1">
          PRODUCTOS DESTACADOS:
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 h-full relative z-10">
        <ProductCard
          product={{
            id: "hero-1",
            name: "Llanta Todo Terreno 265/70R16",
            brand: "Trazano",
            measure: "265/70R16",
            price: 179.98,
            finalPrice: 89.99,
            discount: 50,
            image: "/llanta1.png"
          }}
        />
        <ProductCard
          product={{
            id: "hero-2",
            name: "Llanta Deportiva 225/45R17",
            brand: "Trazano",
            measure: "225/45R17",
            price: 139.98,
            finalPrice: 69.99,
            discount: 50,
            image: "/llanta2.png"
          }}
        />
        <ProductCard
          product={{
            id: "hero-3",
            name: "Llanta Radial 195/65R15",
            brand: "Trazano",
            measure: "195/65R15",
            price: 119.98,
            finalPrice: 59.99,
            discount: 50,
            image: "/llanta1.png"
          }}
        />
        <ProductCard
          product={{
            id: "hero-4",
            name: "Llanta 4x4 245/75R16",
            brand: "Trazano",
            measure: "245/75R16",
            price: 199.98,
            finalPrice: 99.99,
            discount: 50,
            image: "/llanta2.png"
          }}
        />
      </div>
    </div>
  );
};

export default HeroSearchOptions;
