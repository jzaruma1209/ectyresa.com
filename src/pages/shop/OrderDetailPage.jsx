import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import pedidosService from '../../services/pedidos.service';

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
          pedidosService.getTracking(id).catch(() => []) // Tracking podría fallar o estar vacío, lo capturamos
        ]);
        setPedido(detallesData);
        setTracking(trackingData);
      } catch (err) {
        setError('No se pudo cargar el detalle del pedido.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetalles();
  }, [id]);

  if (loading) return <div style={{ padding: '2rem' }}>Cargando detalle del pedido...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  if (!pedido) return null;

  return (
    <div className="order-detail-page" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/mis-pedidos" style={{ display: 'inline-block', marginBottom: '1rem', color: '#666', textDecoration: 'none' }}>
        &larr; Volver a Mis Pedidos
      </Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Pedido #{pedido.codigoPedido || pedido.idPedido}</h1>
        <div style={{ padding: '0.5rem 1rem', backgroundColor: '#f0f0f0', borderRadius: '4px', fontWeight: 'bold' }}>
          Estado: {pedido.estado}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="order-items" style={{ border: '1px solid #e0e0e0', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>Productos</h3>
          <hr style={{ borderTop: '1px solid #eee', borderBottom: 'none', margin: '1rem 0' }} />
          {(pedido.detalles || []).map((detalle) => (
            <div key={detalle.idDetalle} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <p style={{ margin: '0 0 0.2rem 0', fontWeight: 'bold' }}>{detalle.llanta?.modelo || 'Llanta'}</p>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Cantidad: {detalle.cantidad}</p>
              </div>
              <div style={{ fontWeight: 'bold' }}>
                ${(parseFloat(detalle.subtotal) || 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary" style={{ border: '1px solid #e0e0e0', padding: '1.5rem', borderRadius: '8px', height: 'fit-content' }}>
          <h3>Resumen del Pago</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Subtotal:</span>
            <span>${(parseFloat(pedido.subtotal) || 0).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>IVA (15%):</span>
            <span>${(parseFloat(pedido.iva) || 0).toFixed(2)}</span>
          </div>
          <hr style={{ borderTop: '1px solid #eee', borderBottom: 'none', margin: '1rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>Total:</span>
            <span>${(parseFloat(pedido.total) || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {tracking.length > 0 && (
        <div className="order-tracking" style={{ marginTop: '2rem', border: '1px solid #e0e0e0', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>Historial de Seguimiento</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tracking.map((t, idx) => (
              <li key={idx} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed #eee' }}>
                <p style={{ margin: '0 0 0.2rem 0', fontWeight: 'bold' }}>{t.estado}</p>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                  {new Date(t.fechaCreacion).toLocaleString()}
                </p>
                {t.comentario && <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic' }}>"{t.comentario}"</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
