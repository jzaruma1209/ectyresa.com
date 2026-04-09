import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setCredentials,
  setUser,
  logout as logoutAction,
  setAuthLoading,
  setAuthError,
  clearAuthError,
} from '../store/slices/auth.slice';
import authService from '../services/auth.service';

/**
 * Hook de autenticación.
 * Expone el estado de auth y funciones para login, registro, logout y perfil.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  /**
   * Iniciar sesión
   */
  const login = useCallback(async (email, password) => {
    try {
      dispatch(setAuthLoading(true));
      dispatch(clearAuthError());

      // ─── LOGIN TEMPORAL ADMIN ───
      // Credenciales: admin / admin
      // TODO: Eliminar cuando el backend real tenga autenticación admin
      if (email === 'admin' && password === 'admin') {
        dispatch(setCredentials({
          user: { id: 0, nombre: 'Administrador', email: 'admin@ectyre.com', role: 'admin' },
          token: 'dev-admin-token',
        }));
        return { success: true, isAdmin: true };
      }
      // ─── FIN LOGIN TEMPORAL ───

      const response = await authService.login(email, password);
      const { token: newToken, cliente } = response.data || response;

      dispatch(setCredentials({
        user: cliente,
        token: newToken,
      }));

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al iniciar sesión';
      dispatch(setAuthError(message));
      return { success: false, message };
    }
  }, [dispatch]);

  /**
   * Registrar nuevo usuario
   */
  const register = useCallback(async (userData) => {
    try {
      dispatch(setAuthLoading(true));
      dispatch(clearAuthError());

      const response = await authService.register(userData);
      const { token: newToken, cliente } = response.data || response;

      // Si el backend devuelve token al registrar, logueamos automáticamente
      if (newToken) {
        dispatch(setCredentials({
          user: cliente,
          token: newToken,
        }));
      }

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al registrarse';
      dispatch(setAuthError(message));
      return { success: false, message };
    }
  }, [dispatch]);

  /**
   * Cerrar sesión
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      dispatch(logoutAction());
    }
  }, [dispatch]);

  /**
   * Cargar perfil del usuario autenticado
   */
  const loadProfile = useCallback(async () => {
    try {
      dispatch(setAuthLoading(true));
      const response = await authService.getProfile();
      const cliente = response.data || response;
      dispatch(setUser(cliente));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al cargar perfil';
      dispatch(setAuthError(message));
      return { success: false, message };
    } finally {
      dispatch(setAuthLoading(false));
    }
  }, [dispatch]);

  /**
   * Actualizar perfil
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      dispatch(setAuthLoading(true));
      const response = await authService.updateProfile(profileData);
      const cliente = response.data || response;
      dispatch(setUser(cliente));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al actualizar perfil';
      dispatch(setAuthError(message));
      return { success: false, message };
    } finally {
      dispatch(setAuthLoading(false));
    }
  }, [dispatch]);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    loadProfile,
    updateProfile,
    clearError: () => dispatch(clearAuthError()),
  };
};

export default useAuth;
