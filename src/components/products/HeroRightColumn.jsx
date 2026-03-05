import ButtonCom from "../ui/ButtonCom";

const vehicleImages = {
  auto: { src: "/fondo_auto.png", alt: "Auto - Llanta para turismo y SUV" },
  agricola: { src: "/agricola.svg", alt: "Agrícola - Llanta para uso agrícola" },
  camion: { src: "/camiones.svg", alt: "Camión - Llanta para transporte pesado" },
  maquinaria: { src: "/maquinaria pesada.svg", alt: "Maquinaria Pesada - Llanta para construcción" },
};

const HeroRightColumn = ({ activeVehicle = "auto" }) => {
  const currentImage = vehicleImages[activeVehicle] ?? vehicleImages.auto;

  return (
    <div className="hero-right-column">
      <div className="zone-right">
        <img
          key={currentImage.src}
          src={currentImage.src}
          alt={currentImage.alt}
          className="zone-image"
          style={{ transition: "opacity 0.35s ease" }}
        />
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

