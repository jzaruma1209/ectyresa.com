import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { usePageMeta } from '../../hooks/usePageMeta';
import '../../components/Auth/styles/AuthForms.css';
import '../styles/AuthPages.css';

const ResetPasswordPage = () => {
  usePageMeta({ title: 'Nueva contraseña', noindex: true });
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await authService.restablecerPassword(token, password);
      navigate('/login', { replace: true, state: { passwordRestablecida: true } });
    } catch (err) {
      const detalle = err.response?.data?.errors?.[0]?.msg;
      setError(detalle || err.response?.data?.message || 'No pudimos cambiar la contraseña. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <div className="auth-form-card">
          <div className="auth-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="30" height="30" aria-hidden="true">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </div>
          <div className="auth-form-header">
            <h2>Crea tu contraseña nueva</h2>
            <p>Mínimo 10 caracteres, con letras y números.</p>
          </div>

          {!token ? (
            <div className="auth-form">
              <p className="auth-lead">El enlace no es válido o ya venció.</p>
              <div className="auth-footer">
                <Link to="/olvide-contrasena" className="auth-btn-link">Solicitar un enlace nuevo</Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="auth-error">
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-field">
                  <label htmlFor="reset-password">Contraseña nueva</label>
                  <input
                    type="password"
                    id="reset-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={10}
                    maxLength={72}
                    autoComplete="new-password"
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="reset-confirmar">Repite la contraseña</label>
                  <input
                    type="password"
                    id="reset-confirmar"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? <span className="auth-spinner"></span> : 'Cambiar contraseña'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
