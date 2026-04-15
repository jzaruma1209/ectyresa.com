import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import pedidosService from '../../services/pedidos.service';
import '../styles/OrdersPage.css';

const OrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await pedidosService.getPedidos();
        setPedidos(data || []);
      } catch (err) {
        setError('No se pudieron cargar los pedidos.');
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">Cargando tus pedidos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Mis Pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="orders-empty">
          <span className="orders-empty-icon">📦</span>
          <h2>No tienes pedidos aún</h2>
          <p>¡Explora nuestro catálogo y realiza tu primera compra!</p>
          <Link to="/" className="btn-red">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {pedidos.map((pedido) => (
            <div key={pedido.idPedido} className="order-card">
              <div className="order-card-info">
                <h3>Pedido #{pedido.codigoPedido || pedido.idPedido}</h3>
                <p>Fecha: {new Date(pedido.fechaPedido).toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <span className={`order-status-badge ${pedido.estado}`}>
                  {pedido.estado}
                </span>
              </div>
              <div className="order-card-actions">
                <span className="order-card-total">
                  ${(parseFloat(pedido.total) || 0).toFixed(2)}
                </span>
                <Link
                  to={`/mis-pedidos/${pedido.idPedido}`}
                  className="btn-outline-dark"
                >
                  Ver Detalle
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
