import { useNavigate } from "react-router-dom";
import "./styles/NotFoundPage.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__card">
        <p className="not-found__tag">Error 404</p>
        <h1 className="not-found__title">Página no encontrada</h1>
        <p className="not-found__text">
          No pudimos encontrar la página que buscas. Verifica el enlace o
          regresa al inicio.
        </p>
        <div className="not-found__actions">
          <button
            className="not-found__btn secondary"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
          <button
            className="not-found__btn primary"
            onClick={() => navigate("/")}
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
