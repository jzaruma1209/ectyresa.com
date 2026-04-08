import { useEffect, useState } from "react";

import HeroBanner from "../../components/products/HeroBanner";
import HeroSearchOptions from "../../components/products/HeroSearchOptions";
import MainSearchBox from "../../components/products/MainSearchBox";
import HeroRightColumn from "../../components/products/HeroRightColumn";
import BrandSection from "../../components/products/BrandSection";
import { BRAND_SECTIONS } from "../../data/brandsMockData";
import "../styles/HomePage.css";

const heroBgColors = {
  auto: "#FFFFFF",
  agricola: "#67F876",
  camion: "#4A77FF",
  maquinaria: "#FFD33F",
};

const heroAccentColors = {
  auto: "#E60000", // Rojo Ectyre original
  agricola: "#1B5E20", // Verde oscuro
  camion: "#0D47A1", // Azul oscuro
  maquinaria: "#E60000", // Regresamos al rojo original para maquinaria
};

const HomePage = () => {
  const [activeVehicle, setActiveVehicle] = useState("auto");

  const heroBg = heroBgColors[activeVehicle] ?? "#FFFFFF";
  const heroAccent = heroAccentColors[activeVehicle] ?? "#E60000";

  // Sync hero background color to body so it extends behind the header
  useEffect(() => {
    document.body.style.transition = "background-color 0.4s ease";
    document.body.style.backgroundColor = heroBg;
    return () => {
      document.body.style.backgroundColor = "#FFFFFF";
    };
  }, [heroBg]);

  return (
    <div className="home-page">
      {/* Hero Section with Banner */}

      <section
        className="hero-section"
        style={{
          backgroundColor: heroBg,
          "--hero-bg": heroBg,
          "--hero-accent": heroAccent,
          transition: "background-color 0.4s ease"
        }}
      >
        <div className="hero-container">
          <div className="hero-left-column">
            {/* esta es la parte del banner que se va a usar para mostrar las imagenes de promocion y tambien se puede usar para mostrar promociones especiales o algo asi 
          <div className="hero-banner">
              <HeroBanner />
            </div>
          */}

            <HeroSearchOptions />

            {/* Main Search Box */}
            <MainSearchBox activeVehicle={activeVehicle} onVehicleChange={setActiveVehicle} />


          </div>
          <HeroRightColumn activeVehicle={activeVehicle} />
        </div>
      </section>

      {/* ── SECCIONES POR MARCA ── */}
      <div className="brands-sections-wrapper">
        {BRAND_SECTIONS.map((section, idx) => (
          <BrandSection
            key={idx}
            brand={section.brand}
            products={section.products}
          />
        ))}
      </div>



    </div>
  );
};

export default HomePage;
