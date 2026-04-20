/* ═══════════════════════════════════════════════════════════════
   AuthCallback.jsx — Página de callback de Google OAuth
   
   El backend redirige aquí después del login con Google:
   http://localhost:5173/auth/callback?token=eyJ...
   
   Esta página:
   1. Lee el token de la URL (?token=...)
   2. Lo guarda en localStorage y Redux
   3. Redirige al home (o a la acción pendiente del carrito)
   ═══════════════════════════════════════════════════════════════ */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/auth.slice';
import { STORAGE_KEYS } from '../../constants';

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('loading'); // 'loading' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    // Caso error explícito del backend
    if (error) {
      setStatus('error');
      setErrorMsg('No se pudo iniciar sesión con Google. Intenta de nuevo.');
      setTimeout(() => navigate('/login?error=google_failed', { replace: true }), 2500);
      return;
    }

    if (!token) {
      setStatus('error');
      setErrorMsg('No se recibió el token de autenticación.');
      setTimeout(() => navigate('/login?error=google_failed', { replace: true }), 2500);
      return;
    }

    try {
      // Decodificar el payload del JWT (sin librería extra)
      // El payload tiene: { id, role, iat, exp }
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));

      // Guardar token en localStorage con la misma clave que usa el resto de la app
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);

      // Actualizar el estado global (Redux)
      dispatch(setCredentials({
        token,
        user: {
          idCliente: payload.id,
          role: payload.role,
        },
      }));

      // Redirigir al home o a página anterior guardada
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectTo, { replace: true });

    } catch (e) {
      console.error('[AuthCallback] Token inválido:', e);
      setStatus('error');
      setErrorMsg('Token de autenticación inválido. Intenta de nuevo.');
      setTimeout(() => navigate('/login?error=google_failed', { replace: true }), 2500);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === 'loading' ? (
          <>
            <div style={styles.spinner} />
            <p style={styles.title}>Iniciando sesión con Google...</p>
            <p style={styles.subtitle}>Por favor espera un momento</p>
          </>
        ) : (
          <>
            <div style={styles.errorIcon}>✕</div>
            <p style={styles.titleError}>¡Algo salió mal!</p>
            <p style={styles.subtitle}>{errorMsg}</p>
            <p style={styles.redirect}>Redirigiendo al inicio de sesión...</p>
          </>
        )}
      </div>
    </div>
  );
};

/* Estilos inline mínimos para que la página funcione incluso si
   el CSS global aún no cargó (primera visita tras redirect) */
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)',
    background: '#F5F5F5',
    padding: '40px 16px',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '48px 40px',
    textAlign: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    maxWidth: '380px',
    width: '100%',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #F0F0F0',
    borderTop: '4px solid #E60000',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 24px',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1A1A1A',
    margin: '0 0 8px',
  },
  titleError: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#E60000',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#808080',
    margin: '0',
  },
  redirect: {
    fontSize: '0.82rem',
    color: '#BCBCBC',
    margin: '16px 0 0',
  },
  errorIcon: {
    width: '48px',
    height: '48px',
    background: '#FFF0F0',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    fontSize: '1.4rem',
    color: '#E60000',
    fontWeight: '700',
  },
};

/* Inyectar keyframe del spinner globalmente una sola vez */
if (typeof document !== 'undefined' && !document.getElementById('auth-callback-spin')) {
  const style = document.createElement('style');
  style.id = 'auth-callback-spin';
  style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
}

export default AuthCallback;
