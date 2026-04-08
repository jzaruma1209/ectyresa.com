import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import pedidosService from '../../services/pedidos.service';

const OrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await pedidosService.getPedidos();
        setPedidos(data);
      } catch (err) {
        setError('No se pudieron cargar los pedidos.');
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Cargando pedidos...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;

  return (
    <div className="orders-page" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Mis Pedidos</h1>
      
      {pedidos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h2>No tienes pedidos aún.</h2>
          <p>¡Explora nuestro catálogo y realiza tu primera compra!</p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Ir a inicio
          </Link>
        </div>
      ) : (
        <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pedidos.map((pedido) => (
            <div key={pedido.idPedido} style={{ border: '1px solid #e0e0e0', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Pedido #{pedido.codigoPedido || pedido.idPedido}</h3>
                <p style={{ margin: '0 0 0.2rem 0', color: '#666' }}>
                  Fecha: {new Date(pedido.fechaPedido).toLocaleDateString()}
                </p>
                <p style={{ margin: '0', fontWeight: 'bold' }}>
                  Estado: <span style={{ color: pedido.estado === 'PENDIENTE' ? '#e67e22' : '#27ae60' }}>{pedido.estado}</span>
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>
                  Total: ${(parseFloat(pedido.total) || 0).toFixed(2)}
                </p>
                <Link to={`/mis-pedidos/${pedido.idPedido}`} className="btn-secondary" style={{ textDecoration: 'none' }}>
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
