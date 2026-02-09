import TyreCardCom from "../../components/TyreCardCom";

const HeroSearchOptions = () => {
  return (
    <div className="hero-search-options">
      <div className="grid grid-cols-2 gap-3">
        <TyreCardCom
          className="max-w-full"
          image="/llanta1.png"
          title="Llanta Todo Terreno 265/70R16"
          brandImage="/marca.svg"
          brandName="Trazano"
          model=".SL369"
          measure="265/70R16"
          description="Camioneta y SUV. 50% asfalto - 50% mal camino. Banda ancha que mejora la tracción."
          price={89.99}
          originalPrice={179.98}
          badge="LIQUIDACIÓN"
        />
        <TyreCardCom
          className="max-w-full"
          image="/llanta2.png"
          title="Llanta Deportiva 225/45R17"
          brandImage="/marca.svg"
          brandName="Trazano"
          model=".RP28"
          measure="225/45R17"
          description="Turismo y sedán. Alto rendimiento en pavimento seco y mojado."
          price={69.99}
          originalPrice={139.98}
          badge="Renovacion"
        />
        <TyreCardCom
          className="max-w-full"
          image="/llanta1.png"
          title="Llanta Radial 195/65R15"
          brandImage="/marca.svg"
          brandName="Trazano"
          model=".SA37"
          measure="195/65R15"
          description="Uso urbano. Confort y durabilidad en asfalto."
          price={59.99}
          originalPrice={119.98}
          badge="OFERTA"
        />
        <TyreCardCom
          className="max-w-full"
          image="/llanta2.png"
          title="Llanta 4x4 245/75R16"
          brandImage="/marca.svg"
          brandName="Trazano"
          model=".AT771"
          measure="245/75R16"
          description="4x4 y pickup. Resistencia en todo tipo de terreno."
          price={99.99}
          originalPrice={199.98}
        />
      </div>
    </div>
  );
};

export default HeroSearchOptions;
