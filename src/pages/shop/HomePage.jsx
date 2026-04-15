import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const [activeVehicle, setActiveVehicle] = useState("auto");
  const [welcomeToast, setWelcomeToast] = useState(
    location.state?.welcomeMessage || null
  );

  const heroBg = heroBgColors[activeVehicle] ?? "#FFFFFF";
  const heroAccent = heroAccentColors[activeVehicle] ?? "#E60000";

  // Auto-ocultar el toast de bienvenida después de 4 segundos
  useEffect(() => {
    if (!welcomeToast) return;
    const timer = setTimeout(() => setWelcomeToast(null), 4000);
    return () => clearTimeout(timer);
  }, [welcomeToast]);

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
      {/* Toast de bienvenida tras registro exitoso */}
      {welcomeToast && (
        <div
          className="welcome-toast"
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#1A1A1A",
            color: "#FFFFFF",
            padding: "14px 28px",
            borderRadius: "8px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "15px",
            fontWeight: "500",
            animation: "fadeInDown 0.35s ease",
          }}
        >
          <span style={{ color: "#E60000", fontSize: "18px" }}>✓</span>
          {welcomeToast}
        </div>
      )}

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
