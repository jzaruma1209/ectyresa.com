import { useState, useEffect } from "react";
import ButtonCom from "../ui/ButtonCom";
import StaggeredMenu from "../ui/StaggeredMenu";

const vehicleImages = {
  auto: { src: "/fondo_auto.png", alt: "Auto - Llanta para turismo y SUV" },
  agricola: { src: "/agricola.webp", alt: "Agrícola - Llanta para uso agrícola" },
  camion: { src: "/camiones.webp", alt: "Camión - Llanta para transporte pesado" },
  maquinaria: { src: "/maquinaria pesada.webp", alt: "Maquinaria Pesada - Llanta para construcción" },
};

const TIKTOK_URL = "https://www.tiktok.com/@ectyre.sa/photo/7566688674461617426";

const HeroRightColumn = ({ activeVehicle = "auto" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentImage = vehicleImages[activeVehicle] ?? vehicleImages.auto;

  // Cargar el script oficial de TikTok embed cuando el menú se abre
  useEffect(() => {
    if (!isMenuOpen) return;

    // Pequeño delay para que el DOM del blockquote ya esté renderizado
    const timer = setTimeout(() => {
      if (window.tiktokEmbed) {
        // Si ya existe, re-procesar los embeds
        window.tiktokEmbed.lib.render();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }, 300);

    return () => clearTimeout(timer);
  }, [isMenuOpen]);

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
        <ButtonCom size="lg" variant="dark" fullWidth onClick={() => setIsMenuOpen(true)}>
          ¡DA CLICK AQUÍ!
        </ButtonCom>
      </div>

      {/* Menú Overlay de ReactBits adaptado */}
      <StaggeredMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        position="right"
        colors={['#E60000', '#1A1A1A', '#FFFFFF']}
        accentColor="#E60000"
      >
        {/* Video de TikTok - Embed oficial */}
        <div style={{ 
          width: '100%', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <blockquote 
            className="tiktok-embed" 
            cite={TIKTOK_URL}
            data-video-id="7566688674461617426" 
            style={{ maxWidth: '380px', width: '100%' }}
          >
            <section></section>
          </blockquote>

          {/* Link directo por si el embed tarda */}
          <a 
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#1A1A1A',
              color: '#FFFFFF',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E60000'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A1A1A'}
          >
            ▶ Ver en TikTok
          </a>
        </div>

        {/* Descripción */}
        <p style={{
          marginTop: '16px',
          fontSize: '18px',
          fontWeight: '700',
          color: '#1A1A1A',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          🎬 Mira este video para aprender cómo comprar
        </p>
      </StaggeredMenu>
    </div>
  );
};

export default HeroRightColumn;

