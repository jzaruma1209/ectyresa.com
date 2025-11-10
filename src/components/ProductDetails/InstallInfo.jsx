import './styles/InstallInfo.css';

const InstallInfo = () => {
  return (
    <div className="install-info">
      <h2>Información de Instalación</h2>
      <div className="install-info-content">
        <div className="install-info-item">
          <h3>📍 Ubicaciones</h3>
          <p>Contamos con múltiples ubicaciones para la instalación de tus llantas.</p>
          <ul>
            <li>Ciudad de México - Sucursal Centro</li>
            <li>Guadalajara - Sucursal Norte</li>
            <li>Monterrey - Sucursal Sur</li>
          </ul>
        </div>
        <div className="install-info-item">
          <h3>🛠️ Servicio de Instalación</h3>
          <p>Nuestro servicio de instalación incluye:</p>
          <ul>
            <li>Montaje y balanceo</li>
            <li>Rotación de llantas</li>
            <li>Inspección de presión</li>
            <li>Garantía de trabajo</li>
          </ul>
        </div>
        <div className="install-info-item">
          <h3>⏰ Horarios</h3>
          <p>Lunes - Viernes: 9:00 - 18:00</p>
          <p>Sábado: 9:00 - 14:00</p>
          <p>Domingo: Cerrado</p>
        </div>
      </div>
    </div>
  );
};

export default InstallInfo;

