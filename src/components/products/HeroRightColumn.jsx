import ButtonCom from "../ui/ButtonCom";

const HeroRightColumn = () => {
  return (
    <div className="hero-right-column">
      <div className="zone-right">
        <img src="/fondo_auto.png" alt="Vehículo" className="zone-image" />
      </div>
      <div className="zone-info">
        <p className="zone-text">¿Tu primera vez comprando aquí?</p>
        <ButtonCom size="lg" variant="dark" fullWidth>
          ¡DA CLICK AQUÍ!
        </ButtonCom>
      </div>
    </div>
  );
};

export default HeroRightColumn;
