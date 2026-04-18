import { Link } from 'react-router-dom';
import '../../features/shared/styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Contacto</h3>
          <p>Email: info@ectyre.com</p>
          <p>Teléfono: +593 999601748</p>
        </div>
        <div className="footer-section">
          <h3>Ubicaciones</h3>
          <a href="/ubicacion" className="footer-link-text" style={{ textDecoration: 'none', display: 'block' }} title="Ver en mapa">
            Tienda Principal
          </a>
          <a href="/ubicacion" className="footer-link-text" style={{ textDecoration: 'none', display: 'block' }} title="Ver en mapa">
            Ecuador <span style={{ fontSize: '12px' }}>📍</span>
          </a>
        </div>
        <div className="footer-section">
          <h3>Horarios</h3>
          <p>Lunes - Viernes: 9:00 - 18:00</p>
          <p>Sábado: 9:00 - 14:00</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Ectyre Llantas. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
