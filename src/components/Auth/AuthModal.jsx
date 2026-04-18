/* ═══════════════════════════════════════════════════════════════
   AuthModal.jsx — Modal flotante de login
   Se abre cuando el usuario intenta una acción que requiere auth
   (agregar al carrito, proceder al checkout).
   Incluye formulario de login inline + link a registro.
   Después de login exitoso ejecuta la pendingAction guardada.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { closeAuthModal } from '../../store/slices/authModal.slice';
import './styles/AuthModal.css';

const AuthModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, pendingAction } = useSelector((state) => state.authModal);
  const { login, loading, error, clearError } = useAuth();
  const { addToCart } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const overlayRef = useRef(null);
  const emailRef = useRef(null);

  // Focus email input on open
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setSuccessMsg('');
      clearError();
      setTimeout(() => emailRef.current?.focus(), 100);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = () => {
    dispatch(closeAuthModal());
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    const result = await login(email, password);

    if (result.success) {
      // Mostrar mensaje de éxito brevemente
      setSuccessMsg('¡Sesión iniciada!');

      // Ejecutar la acción pendiente
      if (pendingAction) {
        if (pendingAction.type === 'ADD_TO_CART' && pendingAction.payload) {
          await addToCart(pendingAction.payload, pendingAction.quantity || 1);
        }
        if (pendingAction.type === 'CHECKOUT') {
          navigate('/checkout');
        }
      }

      // Cerrar el modal después de un breve delay
      setTimeout(() => {
        dispatch(closeAuthModal());
        setSuccessMsg('');
      }, 800);
    }
  };

  const handleGoToRegister = () => {
    dispatch(closeAuthModal());
    navigate('/registro');
  };

  if (!isOpen) return null;

  return (
    <div
      className="auth-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Iniciar sesión"
    >
      <div className="auth-modal">
        {/* Close button */}
        <button className="auth-modal-close" onClick={handleClose} aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-modal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#E60000" strokeWidth="2" width="32" height="32">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2>Iniciar Sesión</h2>
          <p>Inicia sesión para continuar con tu compra</p>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="auth-modal-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error */}
        {error && !successMsg && (
          <div className="auth-modal-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        {!successMsg && (
          <form onSubmit={handleSubmit} className="auth-modal-form">
            <div className="auth-modal-field">
              <label htmlFor="modal-email">Correo electrónico</label>
              <input
                ref={emailRef}
                type="text"
                id="modal-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-modal-field">
              <label htmlFor="modal-password">Contraseña</label>
              <div className="auth-modal-password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="modal-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-modal-pwd-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-modal-submit" disabled={loading}>
              {loading ? (
                <span className="auth-modal-spinner" />
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        {!successMsg && (
          <div className="auth-modal-footer">
            <p>
              ¿No tienes cuenta?{' '}
              <button type="button" className="auth-modal-link" onClick={handleGoToRegister}>
                Regístrate aquí
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
