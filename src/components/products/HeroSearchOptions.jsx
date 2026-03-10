import TyreCardCom from "./TyreCardCom";

const HeroSearchOptions = () => {
  return (
    <div className="hero-search-options relative rounded-2xl overflow-hidden h-full flex flex-col p-3" style={{ background: "rgba(17, 24, 39, 0.70)" }}>
      {/* Blob izquierdo de color */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 -z-0 blur-3xl opacity-40"
        style={{ clipPath: "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)" }}
      >
        <div className="aspect-[577/310] w-[22rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc]" />
      </div>

      {/* Blob derecho de color */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 -z-0 blur-3xl opacity-40"
        style={{ clipPath: "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)" }}
      >
        <div className="aspect-[577/310] w-[22rem] bg-gradient-to-r from-[#9089fc] to-[#ff80b5]" />
      </div>

      {/* Línea inferior sutil */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10" />

      <div className="flex items-center mb-3 relative z-10">
        <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider ml-1">
          OFERTAS DESTACADAS:
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 h-full relative z-10">
        <TyreCardCom
          className="max-w-full h-full"
          image="/llanta1.png"
          title="Llanta Todo Terreno 265/70R16"
          brandImage="/marca.svg"
          brandName="Trazano"
          model="SL369"
          measure="265/70R16"
          description="Camioneta y SUV. 50% asfalto - 50% mal camino. Banda ancha que mejora la tracción."
          price={89.99}
          originalPrice={179.98}
          badge="LIQUIDACIÓN"
        />
        <TyreCardCom
          className="max-w-full h-full"
          image="/llanta2.png"
          title="Llanta Deportiva 225/45R17"
          brandImage="/marca.svg"
          brandName="Trazano"
          model="RP28"
          measure="225/45R17"
          description="Turismo y sedán. Alto rendimiento en pavimento seco y mojado."
          price={69.99}
          originalPrice={139.98}
          badge="RENOVACIÓN"
        />
        <TyreCardCom
          className="max-w-full h-full"
          image="/llanta1.png"
          title="Llanta Radial 195/65R15"
          brandImage="/marca.svg"
          brandName="Trazano"
          model="SA37"
          measure="195/65R15"
          description="Uso urbano. Confort y durabilidad en asfalto."
          price={59.99}
          originalPrice={119.98}
          badge="OFERTA"
        />
        <TyreCardCom
          className="max-w-full h-full"
          image="/llanta2.png"
          title="Llanta 4x4 245/75R16"
          brandImage="/marca.svg"
          brandName="Trazano"
          model="AT771"
          measure="245/75R16"
          description="4x4 y pickup. Resistencia en todo tipo de terreno."
          price={99.99}
          originalPrice={199.98}
          badge="NUEVO"
        />
      </div>
    </div>
  );
};

export default HeroSearchOptions;
