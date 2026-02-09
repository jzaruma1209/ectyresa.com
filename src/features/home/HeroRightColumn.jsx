const HeroRightColumn = () => {
  return (
    <div className="hero-right-column">
      <div className="zone-right">
        <img src="/fondo_auto.png" alt="Vehículo" className="zone-image" />
      </div>
      <div className="zone-overlay">
        <p className="zone-text">¿Es tu primera vez?</p>
        <button className="zone-btn">¡Te ayudaremos! →</button>
      </div>
    </div>
  );
};

export default HeroRightColumn;
