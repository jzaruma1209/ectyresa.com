import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import pedidosService from '../../services/pedidos.service';
import '../styles/OrderDetailPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const [detallesData, trackingData] = await Promise.all([
          pedidosService.getDetallePedido(id),
          pedidosService.getTracking(id).catch(() => []),
        ]);
        setPedido(detallesData);
        setTracking(trackingData || []);
      } catch (err) {
        setError('No se pudo cargar el detalle del pedido.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetalles();
  }, [id]);

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="order-detail-loading">Cargando detalle del pedido...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-page">
        <div className="order-detail-error">{error}</div>
      </div>
    );
  }

  if (!pedido) return null;

  return (
    <div className="order-detail-page">
      <Link to="/mis-pedidos" className="order-detail-back">
        ← Volver a Mis Pedidos
      </Link>

      <div className="order-detail-header">
        <h1>Pedido #{pedido.codigoPedido || pedido.idPedido}</h1>
        <span className={`order-detail-status ${pedido.estado}`}>
          {pedido.estado}
        </span>
      </div>

      <div className="order-detail-grid">
        {/* ── Productos ── */}
        <div className="order-items-card">
          <h3>Productos del pedido</h3>
          <hr className="order-items-divider" />
          {(pedido.detalles || []).map((detalle) => (
            <div key={detalle.idDetalle} className="order-detail-item">
              <div className="order-item-info">
                <h4>{detalle.llanta?.modelo || 'Llanta'}</h4>
                <p>
                  {detalle.llanta?.marca?.nombre && `${detalle.llanta.marca.nombre} · `}
                  Cantidad: {detalle.cantidad}
                  {detalle.llanta?.ancho && ` · ${detalle.llanta.ancho}/${detalle.llanta.perfil}R${detalle.llanta.rin}`}
                </p>
              </div>
              <span className="order-item-subtotal">
                ${(parseFloat(detalle.subtotal) || 0).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* ── Resumen del pago ── */}
        <div className="order-summary-card">
          <h3>Resumen del Pago</h3>
          <div className="order-summary-row">
            <span>Subtotal</span>
            <span>${(parseFloat(pedido.subtotal) || 0).toFixed(2)}</span>
          </div>
          <div className="order-summary-row">
            <span>IVA (15%)</span>
            <span>${(parseFloat(pedido.iva) || 0).toFixed(2)}</span>
          </div>
          <div className="order-summary-row total-row">
            <span>Total</span>
            <span>${(parseFloat(pedido.total) || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* ── Tracking ── */}
        {tracking.length > 0 && (
          <div className="order-tracking-section">
            <h3>Historial de Seguimiento</h3>
            <ul className="tracking-timeline">
              {tracking.map((t, idx) => (
                <li key={idx} className="tracking-timeline-item">
                  <p className="tracking-estado">{t.estado}</p>
                  <p className="tracking-fecha">
                    {new Date(t.fechaCreacion).toLocaleString('es-EC')}
                  </p>
                  {t.comentario && (
                    <p className="tracking-comentario">"{t.comentario}"</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
