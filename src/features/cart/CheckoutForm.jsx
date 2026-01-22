import { useForm } from 'react-hook-form';
import './styles/CheckoutForm.css';

const CheckoutForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitForm = (data) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <div className="checkout-form">
      <h2>Información de Envío</h2>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="form-group">
          <label htmlFor="name">Nombre Completo</label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'El nombre es requerido' })}
          />
          {errors.name && (
            <span className="error-message">{errors.name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            })}
          />
          {errors.email && (
            <span className="error-message">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Teléfono</label>
          <input
            type="tel"
            id="phone"
            {...register('phone', { required: 'El teléfono es requerido' })}
          />
          {errors.phone && (
            <span className="error-message">{errors.phone.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="address">Dirección</label>
          <input
            type="text"
            id="address"
            {...register('address', { required: 'La dirección es requerida' })}
          />
          {errors.address && (
            <span className="error-message">{errors.address.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="city">Ciudad</label>
          <input
            type="text"
            id="city"
            {...register('city', { required: 'La ciudad es requerida' })}
          />
          {errors.city && (
            <span className="error-message">{errors.city.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">Código Postal</label>
          <input
            type="text"
            id="zipCode"
            {...register('zipCode', {
              required: 'El código postal es requerido',
            })}
          />
          {errors.zipCode && (
            <span className="error-message">{errors.zipCode.message}</span>
          )}
        </div>

        <button type="submit" className="checkout-button">
          Proceder al Pago
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;

