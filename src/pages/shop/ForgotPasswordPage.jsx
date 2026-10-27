import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { usePageMeta } from '../../hooks/usePageMeta';
import '../../components/Auth/styles/AuthForms.css';
import '../styles/AuthPages.css';

const ForgotPasswordPage = () => {
  usePageMeta({ title: 'Recuperar contraseña', noindex: true });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.olvidePassword(email.trim());
      setEnviado(true);
    } catch (err) {
      setError(err.response?.data?.message || 'No pudimos procesar la solicitud. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <div className="auth-form-card">
          {enviado ? (
            <>
              <div className="auth-icon auth-icon--ok">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="30" height="30" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </div>
              <div className="auth-form-header">
                <h2>Revisa tu correo</h2>
              </div>
              <p className="auth-lead">
                Si <strong>{email.trim()}</strong> está registrado, te enviamos un enlace para
                crear una contraseña nueva.
              </p>
              <ul className="auth-tips">
                <li>• El enlace vence en 1 hora y solo se puede usar una vez.</li>
                <li>• Si no lo ves, revisa la carpeta de spam o correo no deseado.</li>
              </ul>
              <Link to="/login" className="auth-btn-link">Volver a iniciar sesión</Link>
              <button type="button" className="auth-btn-text" onClick={() => setEnviado(false)}>
                Usar otro correo
              </button>
            </>
          ) : (
            <>
              <div className="auth-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="30" height="30" aria-hidden="true">
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
              </div>
              <div className="auth-form-header">
                <h2>¿Olvidaste tu contraseña?</h2>
                <p>Escribe tu correo y te enviaremos un enlace para crear una nueva.</p>
              </div>

              {error && (
                <div className="auth-error">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-field">
                  <label htmlFor="forgot-email">Correo electrónico</label>
                  <input
                    type="email"
                    id="forgot-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    autoComplete="email"
                  />
                </div>
                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? <span className="auth-spinner"></span> : 'Enviar enlace'}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  ¿Ya la recordaste? <Link to="/login" className="auth-link">Inicia sesión</Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
