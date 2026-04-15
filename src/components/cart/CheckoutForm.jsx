import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import direccionesService from '../../services/direcciones.service';
import pedidosService from '../../services/pedidos.service';
import '../../features/cart/styles/CheckoutForm.css';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { clearCartLocal } = useCart();
  
  const [direcciones, setDirecciones] = useState([]);
  const [selectedDireccionId, setSelectedDireccionId] = useState('');
  const [requiereInstalacion, setRequiereInstalacion] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Cargar direcciones al montar
  useEffect(() => {
    const fetchDirecciones = async () => {
      try {
        const data = await direccionesService.getDirecciones();
        setDirecciones(data);
        if (data.length > 0) {
          setSelectedDireccionId(data[0].idDireccion);
        } else {
          setShowNewAddressForm(true);
        }
      } catch (err) {
        setError('No se pudieron cargar las direcciones.');
      }
    };
    fetchDirecciones();
  }, []);

  const handleCreateAddress = async (data) => {
    try {
      setLoading(true);
      setError(null);
      // El backend espera: callePrincipal, calleSecundaria, ciudad, provincia, codigoPostal, referencia, telefono
      const nuevaDir = await direccionesService.crearDireccion(data);
      setDirecciones([...direcciones, nuevaDir]);
      setSelectedDireccionId(nuevaDir.idDireccion);
      setShowNewAddressForm(false);
      reset(); // limpia formulario
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la dirección');
    } finally {
      setLoading(false);
    }
  };

  const processCheckout = async () => {
    if (!selectedDireccionId) {
      setError('Debes seleccionar una dirección de entrega.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const pedido = await pedidosService.checkout({
        idDireccionEntrega: parseInt(selectedDireccionId),
        requiereInstalacion
      });

      // Vaciar el carrito en el frontend (el backend ya lo convirtió)
      clearCartLocal();

      // Redirigir a confirmación / detalle
      navigate(`/mis-pedidos/${pedido.idPedido || pedido.id}`);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar el pedido');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-form">
      <h2>Información de Envío</h2>
      
      {error && <div className="error-message checkout-error">{error}</div>}

      <div className="direcciones-list">
        {direcciones.length > 0 && (
          <div className="form-group">
            <label htmlFor="direccionSelect">Selecciona una dirección:</label>
            <select
              id="direccionSelect"
              value={selectedDireccionId}
              onChange={(e) => setSelectedDireccionId(e.target.value)}
              disabled={showNewAddressForm || loading}
            >
              {direcciones.map((d) => (
                <option key={d.idDireccion} value={d.idDireccion}>
                  {d.callePrincipal} - {d.ciudad}, {d.provincia}
                </option>
              ))}
            </select>
          </div>
        )}

        {!showNewAddressForm && (
          <button 
            type="button" 
            className="btn-link"
            onClick={() => setShowNewAddressForm(true)}
            disabled={loading}
          >
            + Agregar nueva dirección
          </button>
        )}
      </div>

      {showNewAddressForm && (
        <form onSubmit={handleSubmit(handleCreateAddress)} className="new-address-form">
          <h3>Nueva Dirección</h3>
          
          <div className="form-group">
            <label htmlFor="callePrincipal">Calle Principal</label>
            <input type="text" id="callePrincipal" {...register('callePrincipal', { required: 'Calle principal requerida' })} />
            {errors.callePrincipal && <span className="error-message">{errors.callePrincipal.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="calleSecundaria">Calle Secundaria (Opcional)</label>
            <input type="text" id="calleSecundaria" {...register('calleSecundaria')} />
          </div>

          <div className="form-group">
            <label htmlFor="ciudad">Ciudad</label>
            <input type="text" id="ciudad" {...register('ciudad', { required: 'Ciudad requerida' })} />
            {errors.ciudad && <span className="error-message">{errors.ciudad.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="provincia">Provincia</label>
            <input type="text" id="provincia" {...register('provincia', { required: 'Provincia requerida' })} />
            {errors.provincia && <span className="error-message">{errors.provincia.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="codigoPostal">Código Postal</label>
            <input type="text" id="codigoPostal" {...register('codigoPostal', { required: 'Código postal requerido' })} />
            {errors.codigoPostal && <span className="error-message">{errors.codigoPostal.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono de Contacto</label>
            <input type="tel" id="telefono" {...register('telefono', { required: 'Teléfono requerido' })} />
            {errors.telefono && <span className="error-message">{errors.telefono.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="referencia">Referencia</label>
            <textarea id="referencia" {...register('referencia', { required: 'Referencia requerida' })}></textarea>
            {errors.referencia && <span className="error-message">{errors.referencia.message}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>Guardar Dirección</button>
            {direcciones.length > 0 && (
              <button type="button" className="btn-secondary-outline" onClick={() => setShowNewAddressForm(false)} disabled={loading}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      <hr className="checkout-divider" />

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={requiereInstalacion} 
            onChange={(e) => setRequiereInstalacion(e.target.checked)} 
            disabled={loading}
          />
          Deseo que se instale en una sucursal Ectyre (Gratis)
        </label>
      </div>

      <button 
        type="button" 
        className="checkout-button"
        onClick={processCheckout}
        disabled={loading || showNewAddressForm || !selectedDireccionId}
      >
        {loading ? 'Procesando...' : 'Confirmar Pedido y Pagar'}
      </button>
    </div>
  );
};

export default CheckoutForm;
