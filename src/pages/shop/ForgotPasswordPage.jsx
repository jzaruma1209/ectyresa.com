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
          <div className="auth-form-header">
            <h2>Recuperar contraseña</h2>
            <p>Te enviaremos un enlace para crear una contraseña nueva</p>
          </div>

          {enviado ? (
            <div className="auth-form">
              <p>
                Si el correo está registrado, te enviamos un enlace que vence en 1 hora. Revisa
                también la carpeta de spam.
              </p>
              <div className="auth-footer">
                <Link to="/login" className="auth-link">Volver a iniciar sesión</Link>
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
                  <Link to="/login" className="auth-link">Volver a iniciar sesión</Link>
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
