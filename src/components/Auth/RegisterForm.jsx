import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GoogleLoginButton from './GoogleLoginButton';
import './styles/AuthForms.css';
import './styles/GoogleLoginButton.css';

const RegisterForm = ({ onSuccess }) => {
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    tipoIdentificacion: 'CEDULA',
    numeroIdentificacion: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    // Validaciones locales
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Enviar al backend (sin confirmPassword)
    const { confirmPassword, ...dataToSend } = formData;
    const result = await register(dataToSend);

    if (result.success && onSuccess) {
      onSuccess(result);
    }
  };

  const displayError = localError || error;

  return (
    <div className="auth-form-container">
      <div className="auth-form-card auth-form-card--register">
        <div className="auth-form-header">
          <h2>Crear Cuenta</h2>
          <p>Regístrate en Ectyre para comprar llantas</p>
        </div>

        {displayError && (
          <div className="auth-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field-row">
            <div className="auth-field">
              <label htmlFor="reg-nombres">Nombres *</label>
              <input
                type="text"
                id="reg-nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                placeholder="Ej: Juan Carlos"
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="reg-apellidos">Apellidos *</label>
              <input
                type="text"
                id="reg-apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Ej: Pérez López"
                required
              />
            </div>
          </div>

          <div className="auth-field-row">
            <div className="auth-field auth-field--small">
              <label htmlFor="reg-tipoId">Tipo ID *</label>
              <select
                id="reg-tipoId"
                name="tipoIdentificacion"
                value={formData.tipoIdentificacion}
                onChange={handleChange}
                required
              >
                <option value="CEDULA">Cédula</option>
                <option value="RUC">RUC</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>
            <div className="auth-field">
              <label htmlFor="reg-numId">Número de identificación *</label>
              <input
                type="text"
                id="reg-numId"
                name="numeroIdentificacion"
                value={formData.numeroIdentificacion}
                onChange={handleChange}
                placeholder="Ej: 1234567890"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email">Correo electrónico *</label>
            <input
              type="email"
              id="reg-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-telefono">Teléfono *</label>
            <input
              type="tel"
              id="reg-telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 0991234567"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-password">Contraseña *</label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                id="reg-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-confirm-password">Confirmar contraseña *</label>
            <input
              type="password"
              id="reg-confirm-password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="auth-spinner"></span>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* ── Divisor Google ── */}
        <div className="auth-divider">
          <span>o regístrate con</span>
        </div>

        <GoogleLoginButton label="Registro con Google" />

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="auth-link">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
