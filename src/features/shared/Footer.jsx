import './styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Contacto</h3>
          <p>Email: info@ectyre.com</p>
          <p>Teléfono: +52 123 456 7890</p>
        </div>
        <div className="footer-section">
          <h3>Ubicaciones</h3>
          <p>Tienda Principal</p>
          <p>Ciudad de México</p>
        </div>
        <div className="footer-section">
          <h3>Horarios</h3>
          <p>Lunes - Viernes: 9:00 - 18:00</p>
          <p>Sábado: 9:00 - 14:00</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Ectyre Llantas. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;

